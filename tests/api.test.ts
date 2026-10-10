import test from 'node:test';
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { Store } from '../src/server/store.ts';
import { hashPassword } from '../src/server/auth.ts';
import { Backend } from '../src/server/backend.ts';

const origin = 'https://gumnly.test';
export function request(path: string, method = 'GET', body?: unknown, headers: Record<string, string> = {}) {
  return new Request(origin + path, { method, headers: { origin, ...(body === undefined ? {} : { 'content-type': 'application/json' }), ...headers }, body: body === undefined ? undefined : JSON.stringify(body) });
}

test('admin APIs reject unauthenticated writes and support same-origin CSRF-protected editing with login/logout', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'gumnly-api-'));
  const store = new Store(join(dir, 'site.sqlite'));
  const password = randomBytes(24).toString('base64url');
  const credentials = { username: 'operator', passwordHash: await hashPassword(password) };
  const api = new Backend(store, { origin, credentials, production: true });
  try {
    for (const [path, method] of [['/api/admin/company', 'PUT'], ['/api/admin/products', 'POST'], ['/api/admin/products/first-product', 'DELETE'], ['/api/admin/enquiries/x', 'PATCH'], ['/api/admin/enquiries/x', 'DELETE'], ['/api/admin/enquiries', 'GET']]) {
      assert.equal((await api.handle(request(path, method, method === 'GET' ? undefined : {}))).status, 401);
    }
    assert.equal((await new Backend(store, { origin, production: true }).handle(request('/api/auth/login', 'POST', { username: 'operator', password }))).status, 503);
    assert.equal((await api.handle(request('/api/auth/login', 'POST', { username: 'operator', password: 'wrong' }))).status, 401);
    const login = await api.handle(request('/api/auth/login', 'POST', { username: 'operator', password }));
    assert.equal(login.status, 200);
    const cookie = login.headers.get('set-cookie')!;
    assert.match(cookie, /^__Host-gumnly_session=/);
    assert.match(cookie, /HttpOnly/); assert.match(cookie, /SameSite=Strict/); assert.match(cookie, /Secure/);
    const { csrfToken } = await login.json();
    const headers = { cookie: cookie.split(';')[0], 'x-csrf-token': csrfToken };
    assert.equal((await api.handle(request('/api/auth/session', 'GET', undefined, headers))).status, 200);
    const edited = { ...store.company(), headline: 'Konten diperbarui admin' };
    assert.equal((await api.handle(request('/api/admin/company', 'PUT', edited, { cookie: headers.cookie }))).status, 403);
    assert.equal((await api.handle(request('/api/admin/company', 'PUT', edited, { ...headers, origin: 'https://attacker.test' }))).status, 403);
    assert.equal((await api.handle(request('/api/admin/company', 'PUT', { ...edited, unexpected: true }, headers))).status, 400);
    assert.equal((await api.handle(request('/api/admin/company', 'PUT', edited, headers))).status, 200);
    const publicCompany = await api.handle(request('/api/company'));
    assert.equal((await publicCompany.json()).headline, edited.headline);
    assert.equal(publicCompany.headers.get('cache-control'), 'no-store');
    const product = { name: null, description: 'Lingkup masih ditinjau.', status: 'in-development' };
    assert.equal((await api.handle(request('/api/admin/products', 'POST', { ...product, status: 'launched' }, headers))).status, 400);
    const created = await api.handle(request('/api/admin/products', 'POST', product, headers));
    assert.equal(created.status, 201);
    const { id } = await created.json();
    assert.equal((await api.handle(request('/api/admin/products/' + id, 'PUT', { ...product, description: 'Deskripsi baru' }, headers))).status, 200);
    assert.equal((await api.handle(request('/api/admin/products/' + id, 'DELETE', undefined, headers))).status, 200);
    assert.equal((await api.handle(request('/api/admin/products/missing', 'PUT', product, headers))).status, 404);
    const logout = await api.handle(request('/api/auth/logout', 'POST', undefined, headers));
    assert.equal(logout.status, 200); assert.match(logout.headers.get('set-cookie')!, /Max-Age=0/);
    assert.equal((await api.handle(request('/api/auth/session', 'GET', undefined, headers))).status, 401);
    assert.equal((await api.handle(request('/api/admin/company', 'PUT', edited, headers))).status, 401);
  } finally { store.close(); rmSync(dir, { recursive: true, force: true }); }
});

test('writes reject missing origins, cross-site context, non-JSON, malformed and oversized streamed bodies', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'gumnly-body-'));
  const store = new Store(join(dir, 'site.sqlite'));
  const api = new Backend(store, { origin, production: false, credentials: { username: 'operator', passwordHash: await hashPassword(randomBytes(24).toString('base64url')) } });
  try {
    const login = { username: 'operator', password: 'wrong' };
    assert.equal((await api.handle(request('/api/auth/login', 'POST', login, { origin: '' }))).status, 403);
    assert.equal((await api.handle(request('/api/auth/login', 'POST', login, { 'sec-fetch-site': 'cross-site' }))).status, 403);
    assert.equal((await api.handle(request('/api/auth/login', 'POST', login, { 'content-type': 'text/plain' }))).status, 415);
    assert.equal((await api.handle(new Request(origin + '/api/auth/login', { method: 'POST', headers: { origin, 'content-type': 'application/json' }, body: '{' }))).status, 400);
    assert.equal((await api.handle(request('/api/auth/login', 'POST', login, { 'content-length': '99999' }))).status, 413);
    const stream = new ReadableStream({ start(controller) { controller.enqueue(new TextEncoder().encode(JSON.stringify({ username: 'operator', password: 'x'.repeat(40000) }))); controller.close(); } });
    const streamed = new Request(origin + '/api/auth/login', { method: 'POST', headers: { origin, 'content-type': 'application/json', 'content-length': '1' }, body: stream, duplex: 'half' } as RequestInit);
    assert.equal((await api.handle(streamed)).status, 413);
  } finally { store.close(); rmSync(dir, { recursive: true, force: true }); }
});

test('login throttling persists across restart and cannot be bypassed with spoofed forwarding headers', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'gumnly-rate-'));
  const path = join(dir, 'site.sqlite');
  let store = new Store(path);
  const credentials = { username: 'operator', passwordHash: await hashPassword(randomBytes(24).toString('base64url')) };
  let now = 1000;
  let api = new Backend(store, { origin, production: false, credentials }, () => now);
  try {
    for (let i = 0; i < 10; i++) assert.equal((await api.handle(request('/api/auth/login', 'POST', { username: 'different-' + i, password: 'wrong' }, { 'x-forwarded-for': '192.0.2.' + i, 'x-real-ip': '192.0.2.' + i }))).status, 401);
    store.close(); store = new Store(path);
    api = new Backend(store, { origin, production: false, credentials }, () => now);
    const blocked = await api.handle(request('/api/auth/login', 'POST', { username: 'operator', password: 'wrong' }, { 'x-forwarded-for': '198.51.100.1' }));
    assert.equal(blocked.status, 429);
    assert.equal(blocked.headers.get('retry-after'), '900');
    now += 900000;
    assert.equal((await api.handle(request('/api/auth/login', 'POST', { username: 'operator', password: 'wrong' }))).status, 401);
  } finally { store.close(); rmSync(dir, { recursive: true, force: true }); }
});

test('validated contact persists honestly without email; private review/status/delete require the admin session', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'gumnly-contact-'));
  const path = join(dir, 'site.sqlite');
  let store = new Store(path);
  const password = randomBytes(24).toString('base64url');
  const credentials = { username: 'operator', passwordHash: await hashPassword(password) };
  let api = new Backend(store, { origin, production: false, credentials });
  const contact = { kind: 'product', name: 'Pengunjung', email: 'visitor@example.test', message: 'Saya ingin berdiskusi mengenai produk.', consent: true, website: '' };
  try {
    for (const invalid of [{ ...contact, email: 'bad' }, { ...contact, consent: false }, { ...contact, website: 'spam.test' }, { ...contact, kind: 'other' }, { ...contact, to: 'attacker@example.test' }]) {
      assert.equal((await api.handle(request('/api/contact', 'POST', invalid))).status, 400);
    }
    assert.deepEqual(store.enquiries(), []);
    const response = await api.handle(request('/api/contact', 'POST', contact));
    assert.equal(response.status, 201);
    const result = await response.json();
    assert.equal(result.delivery, 'stored');
    assert.equal(result.message.includes('belum dikirim'), true);
    assert.equal('email' in result, false);
    store.close(); store = new Store(path); api = new Backend(store, { origin, production: false, credentials });
    assert.equal((await api.handle(request('/api/enquiries'))).status, 404);
    assert.equal((await api.handle(request('/api/admin/enquiries'))).status, 401);
    const login = await api.handle(request('/api/auth/login', 'POST', { username: 'operator', password }));
    const headers = { cookie: login.headers.get('set-cookie')!.split(';')[0], 'x-csrf-token': (await login.json()).csrfToken };
    const enquiries = await (await api.handle(request('/api/admin/enquiries', 'GET', undefined, headers))).json();
    assert.equal(enquiries[0].email, contact.email);
    assert.equal(enquiries[0].kind, 'product');
    const id = enquiries[0].id;
    assert.equal((await api.handle(request('/api/admin/enquiries/' + id, 'PATCH', { status: 'reviewed' }, headers))).status, 200);
    assert.equal(store.enquiries()[0].status, 'reviewed');
    assert.equal((await api.handle(request('/api/admin/enquiries/' + id, 'DELETE', undefined, headers))).status, 200);
    assert.deepEqual(store.enquiries(), []);
  } finally { store.close(); rmSync(dir, { recursive: true, force: true }); }
});

test('contact throttling survives restart, counts invalid attempts, ignores forwarding headers and resets after its window', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'gumnly-contact-rate-'));
  const path = join(dir, 'site.sqlite');
  let store = new Store(path);
  let now = 1000;
  let api = new Backend(store, { origin, production: false }, () => now);
  try {
    for (let i = 0; i < 20; i++) assert.equal((await api.handle(request('/api/contact', 'POST', {}, { 'x-forwarded-for': '192.0.2.' + i }))).status, 400);
    store.close(); store = new Store(path); api = new Backend(store, { origin, production: false }, () => now);
    const blocked = await api.handle(request('/api/contact', 'POST', {}, { 'x-forwarded-for': '198.51.100.1' }));
    assert.equal(blocked.status, 429); assert.equal(blocked.headers.get('retry-after'), '900');
    assert.deepEqual(store.enquiries(), []);
    now += 900000;
    assert.equal((await api.handle(request('/api/contact', 'POST', {}))).status, 400);
  } finally { store.close(); rmSync(dir, { recursive: true, force: true }); }
});
