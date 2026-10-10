import { randomUUID, timingSafeEqual } from 'node:crypto';
import { z } from 'zod';
import { Auth, SESSION_SECONDS, validCredentials, type Credentials } from './auth.ts';
import { Store, type Enquiry } from './store.ts';
import { deliver, type MailConfig } from './mail.ts';

const text = z.string().trim().min(1);
const companySchema = z.strictObject({ name: text.max(100), descriptor: text.max(200), headline: text.max(300), description: text.max(4000), about: text.max(8000), services: text.max(8000), privacy: text.max(8000) });
const productSchema = z.strictObject({ name: text.max(100).nullable(), description: text.max(4000), status: z.literal('in-development') });
const loginSchema = z.strictObject({ username: text.max(100), password: z.string().min(1).max(1024) });
const contactSchema = z.strictObject({ kind: z.enum(['product', 'project']), name: text.max(100), email: z.email().max(254), message: text.min(10).max(5000), consent: z.literal(true), website: z.literal('').optional() });
export type BackendConfig = { origin: string; credentials?: Credentials; production: boolean; mail?: MailConfig };
class HttpError extends Error {
  constructor(public status: number, message: string, public headers: Record<string, string> = {}) { super(message); }
}

async function readBody(request: Request): Promise<unknown> {
  if (request.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !== 'application/json') throw new HttpError(415, 'Gunakan application/json.');
  const limit = 32 * 1024;
  if (Number(request.headers.get('content-length')) > limit) throw new HttpError(413, 'Data terlalu besar.');
  if (!request.body) throw new HttpError(400, 'Data diperlukan.');
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const deadline = new Promise<never>((_, reject) => {
    timer = setTimeout(() => { void reader.cancel().catch(() => {}); reject(new HttpError(408, 'Batas waktu unggah terlampaui.')); }, 5000);
  });
  try {
    while (true) {
      const { done, value } = await Promise.race([reader.read(), deadline]);
      if (done) break;
      size += value.byteLength;
      if (size > limit) { void reader.cancel().catch(() => {}); throw new HttpError(413, 'Data terlalu besar.'); }
      chunks.push(value);
    }
    return JSON.parse(Buffer.concat(chunks, size).toString('utf8'));
  } finally { clearTimeout(timer); reader.releaseLock(); }
}
export class Backend {
  readonly auth: Auth;
  constructor(private store: Store, private config: BackendConfig, private clock: () => number = Date.now, private transport: typeof fetch = fetch) {
    this.auth = new Auth(store, config.credentials, clock);
  }
  private response(body: unknown, status = 200, headers: Record<string, string> = {}) {
    return Response.json(body, { status, headers: { 'cache-control': 'no-store', 'x-content-type-options': 'nosniff', ...headers } });
  }
  private cookie(token: string, age: number) {
    return `${this.config.production ? '__Host-gumnly_session' : 'gumnly_session'}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${age}${this.config.production ? '; Secure' : ''}`;
  }
  private cookieName() { return this.config.production ? '__Host-gumnly_session' : 'gumnly_session'; }
  loginConfigured(): boolean { return validCredentials(this.config.credentials); }
  company() { return this.store.company(); }
  products() { return this.store.products(); }
  enquiries() { return this.store.enquiries(); }
  sessionFromCookieHeader(cookieHeader: string | null) {
    if (!cookieHeader) return null;
    const name = this.cookieName();
    const token = cookieHeader.split(';').map(value => value.trim()).find(value => value.startsWith(name + '='))?.slice(name.length + 1) ?? '';
    return this.auth.session(token);
  }
  async handle(request: Request): Promise<Response> {
    try {
      const path = new URL(request.url).pathname;
      const method = request.method;
      const mutation = !['GET', 'HEAD', 'OPTIONS'].includes(method);
      if (mutation && (request.headers.get('origin') !== this.config.origin || request.headers.get('sec-fetch-site') === 'cross-site')) throw new HttpError(403, 'Origin tidak diizinkan.');
      if ((path === '/api/auth/login' || path === '/api/contact') && method === 'POST') {
        // Request headers are not trusted as client identity. This bucket is shared by all clients.
        const retry = this.store.consumeLimit(path === '/api/contact' ? 'contact:global' : 'login:global', path === '/api/contact' ? 20 : 10, 900000, this.clock());
        if (retry) throw new HttpError(429, 'Terlalu banyak percobaan. Coba lagi nanti.', { 'retry-after': String(retry) });
      }
      const cookieName = this.config.production ? '__Host-gumnly_session' : 'gumnly_session';
      const token = request.headers.get('cookie')?.split(';').map(value => value.trim()).find(value => value.startsWith(cookieName + '='))?.slice(cookieName.length + 1) ?? '';
      const protectedPath = path.startsWith('/api/admin/') || path === '/api/auth/session' || path === '/api/auth/logout';
      if (protectedPath) {
        const session = this.auth.session(token);
        if (!session) throw new HttpError(401, 'Autentikasi diperlukan.');
        if (mutation) {
          const csrf = request.headers.get('x-csrf-token') ?? '';
          if (Buffer.byteLength(csrf) !== Buffer.byteLength(session.csrfToken) || !timingSafeEqual(Buffer.from(csrf), Buffer.from(session.csrfToken))) throw new HttpError(403, 'Token CSRF tidak valid.');
        }
        if (path === '/api/auth/session' && method === 'GET') return this.response(session);
      }
      if (path === '/api/auth/login' && method === 'POST') {
        if (!validCredentials(this.config.credentials)) throw new HttpError(503, 'Login belum dikonfigurasi.');
        const body = loginSchema.parse(await readBody(request));
        const session = await this.auth.login(body.username, body.password);
        if (!session) throw new HttpError(401, 'Kredensial tidak valid.');
        return this.response({ csrfToken: session.csrfToken, expiresAt: session.expiresAt }, 200, { 'set-cookie': this.cookie(session.token, SESSION_SECONDS) });
      }
      if (path === '/api/auth/logout' && method === 'POST') {
        this.auth.logout(token);
        return this.response({ ok: true }, 200, { 'set-cookie': this.cookie('', 0) });
      }
      if (path === '/api/contact' && method === 'POST') {
        const body = contactSchema.parse(await readBody(request));
        const id = randomUUID();
        const enquiry: Enquiry = { id, kind: body.kind, name: body.name, email: body.email, message: body.message, status: 'new', delivery: this.config.mail ? 'pending' : 'stored', createdAt: this.clock() };
        this.store.addEnquiry(enquiry);
        if (!this.config.mail) return this.response({ id, delivery: 'stored', message: 'Pertanyaan tersimpan secara lokal; email belum dikirim.' }, 201);
        const delivery = await deliver(enquiry, this.config.mail, this.transport);
        this.store.updateEnquiry(id, { delivery });
        return this.response({ id, delivery, message: delivery === 'accepted' ? 'Pertanyaan tersimpan; penyedia email menerima pesan, bukan jaminan pesan telah diterima di kotak masuk.' : 'Pertanyaan tersimpan; penerimaan email belum dikonfirmasi.' }, 201);
      }
      if ((path === '/api/company' || path === '/api/admin/company') && method === 'GET') return this.response(this.store.company());
      if (path === '/api/admin/company' && method === 'PUT') {
        const company = companySchema.parse(await readBody(request));
        this.store.saveCompany(company);
        return this.response(company);
      }
      if ((path === '/api/products' || path === '/api/admin/products') && method === 'GET') return this.response(this.store.products());
      if (path === '/api/admin/products' && method === 'POST') {
        const product = { ...productSchema.parse(await readBody(request)), id: randomUUID() };
        this.store.saveProduct(product);
        return this.response(product, 201);
      }
      const productId = path.match(/^\/api\/admin\/products\/([a-zA-Z0-9-]{1,100})$/)?.[1];
      if (productId && (method === 'PUT' || method === 'DELETE')) {
        if (!this.store.products().some(product => product.id === productId)) throw new HttpError(404, 'Produk tidak ditemukan.');
        if (method === 'DELETE') { this.store.deleteProduct(productId); return this.response({ ok: true }); }
        const product = { ...productSchema.parse(await readBody(request)), id: productId };
        this.store.saveProduct(product);
        return this.response(product);
      }
      if (path === '/api/admin/enquiries' && method === 'GET') return this.response(this.store.enquiries());
      const enquiryId = path.match(/^\/api\/admin\/enquiries\/([a-zA-Z0-9-]{1,100})$/)?.[1];
      if (enquiryId && (method === 'PATCH' || method === 'DELETE')) {
        const changed = method === 'DELETE' ? this.store.deleteEnquiry(enquiryId) : this.store.updateEnquiry(enquiryId, z.strictObject({ status: z.enum(['new', 'reviewed', 'closed']) }).parse(await readBody(request)));
        if (!changed) throw new HttpError(404, 'Pertanyaan tidak ditemukan.');
        return this.response({ ok: true });
      }
      throw new HttpError(404, 'Endpoint tidak ditemukan.');
    } catch (error) {
      if (error instanceof HttpError) return this.response({ error: error.message }, error.status, error.headers);
      if (error instanceof z.ZodError || error instanceof SyntaxError) return this.response({ error: 'Data tidak valid.' }, 400);
      return this.response({ error: 'Layanan tidak tersedia.' }, 503);
    }
  }
}
