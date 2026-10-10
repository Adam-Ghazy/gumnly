import { DatabaseSync } from 'node:sqlite';
import { mkdirSync, chmodSync } from 'node:fs';
import { dirname, resolve, sep } from 'node:path';

export type Company = {
  name: string; descriptor: string; headline: string; description: string;
  about: string; services: string; privacy: string;
};
export type Product = { id: string; name: string | null; description: string; status: 'in-development' };
export type Enquiry = { id: string; kind: 'product' | 'project'; name: string; email: string; message: string; status: 'new' | 'reviewed' | 'closed'; delivery: 'stored' | 'pending' | 'accepted' | 'failed'; createdAt: number };
const initialCompany: Company = {
  name: 'GUMNLY Tech', descriptor: 'SaaS Products & Software Engineering',
  headline: 'Membangun software yang membuat pekerjaan lebih sederhana.',
  description: 'GUMNLY mengembangkan produk SaaS dan solusi software khusus untuk membantu bisnis mengelola proses kerja dengan lebih terstruktur.',
  about: 'GUMNLY adalah startup teknologi SaaS-first yang mengembangkan produk digital sendiri.',
  services: 'Pengembangan software khusus, otomasi alur kerja, dan integrasi sistem untuk proyek terpilih.',
  privacy: 'Nama, email, jenis minat, dan pesan disimpan secara lokal untuk menindaklanjuti pertanyaan. Jika email dikonfigurasi, data juga dikirim ke penyedia email dan penerima yang ditentukan pengelola. Penghapusan dilakukan oleh admin. Kebijakan retensi dan kontak privasi harus disetujui sebelum peluncuran publik.',
};
export class Store {
  private db: DatabaseSync;
  constructor(path: string) {
    const absolute = resolve(path);
    const publicPath = resolve('public');
    if (absolute === publicPath || absolute.startsWith(publicPath + sep)) throw new Error('Database must be outside public');
    mkdirSync(dirname(absolute), { recursive: true, mode: 0o700 });
    this.db = new DatabaseSync(absolute);
    chmodSync(absolute, 0o600);
    this.db.exec(`PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000; PRAGMA foreign_keys=ON;
      CREATE TABLE IF NOT EXISTS company (id INTEGER PRIMARY KEY CHECK(id=1), data TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS products (id TEXT PRIMARY KEY, data TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS enquiries (id TEXT PRIMARY KEY, data TEXT NOT NULL, created_at INTEGER NOT NULL);
      CREATE TABLE IF NOT EXISTS sessions (hash TEXT PRIMARY KEY, csrf TEXT NOT NULL, expires INTEGER NOT NULL, credential TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS rate_limits (key TEXT PRIMARY KEY, count INTEGER NOT NULL, reset INTEGER NOT NULL);
    `);
    this.db.prepare('INSERT OR IGNORE INTO company VALUES (1, ?)').run(JSON.stringify(initialCompany));
    // Seed only on first initialization, never recreate products deleted by an admin.
    this.db.exec('CREATE TABLE IF NOT EXISTS metadata (key TEXT PRIMARY KEY)');
    this.db.exec('BEGIN IMMEDIATE');
    try {
      if (!this.db.prepare("SELECT key FROM metadata WHERE key='initialized'").get()) {
        const product: Product = { id: 'first-product', name: null, description: 'Produk SaaS pertama sedang dikembangkan. Nama dan lingkup produk belum final.', status: 'in-development' };
        this.db.prepare('INSERT INTO products VALUES (?, ?)').run(product.id, JSON.stringify(product));
        this.db.prepare('INSERT INTO metadata VALUES (?)').run('initialized');
      }
      this.db.exec('COMMIT');
    } catch (error) { this.db.exec('ROLLBACK'); this.db.close(); throw error; }
  }
  company(): Company { return JSON.parse(this.db.prepare('SELECT data FROM company WHERE id=1').get()!.data as string); }
  saveCompany(company: Company) { this.db.prepare('UPDATE company SET data=? WHERE id=1').run(JSON.stringify(company)); }
  products(): Product[] { return this.db.prepare('SELECT data FROM products ORDER BY id').all().map(row => JSON.parse(row.data as string)); }
  enquiries(): Enquiry[] { return this.db.prepare('SELECT data FROM enquiries ORDER BY created_at DESC, id LIMIT 50').all().map(row => JSON.parse(row.data as string)); }
  saveProduct(product: Product) {
    this.db.prepare('INSERT INTO products VALUES (?, ?) ON CONFLICT(id) DO UPDATE SET data=excluded.data').run(product.id, JSON.stringify(product));
  }
  deleteProduct(id: string): boolean { return this.db.prepare('DELETE FROM products WHERE id=?').run(id).changes > 0; }
  addEnquiry(enquiry: Enquiry) {
    this.db.prepare('INSERT INTO enquiries VALUES (?, ?, ?)').run(enquiry.id, JSON.stringify(enquiry), enquiry.createdAt);
  }
  updateEnquiry(id: string, patch: Partial<Pick<Enquiry, 'status' | 'delivery'>>): boolean {
    return this.db.prepare('UPDATE enquiries SET data=json_patch(data, ?) WHERE id=?').run(JSON.stringify(patch), id).changes > 0;
  }
  deleteEnquiry(id: string): boolean { return this.db.prepare('DELETE FROM enquiries WHERE id=?').run(id).changes > 0; }
  saveSession(hash: string, csrf: string, expires: number, credential: string, now: number) {
    this.db.prepare('DELETE FROM sessions WHERE expires<=? OR credential<>?').run(now, credential);
    this.db.prepare('INSERT INTO sessions VALUES (?, ?, ?, ?)').run(hash, csrf, expires, credential);
  }
  session(hash: string, credential: string, now: number): { csrfToken: string; expiresAt: number } | null {
    const row = this.db.prepare('SELECT csrf, expires FROM sessions WHERE hash=? AND credential=? AND expires>?').get(hash, credential, now);
    return row ? { csrfToken: row.csrf as string, expiresAt: row.expires as number } : null;
  }
  deleteSession(hash: string) { this.db.prepare('DELETE FROM sessions WHERE hash=?').run(hash); }
  consumeLimit(key: string, limit: number, windowMs: number, now: number): number {
    const row = this.db.prepare(`INSERT INTO rate_limits VALUES (?, 1, ?)
      ON CONFLICT(key) DO UPDATE SET
        count=CASE WHEN reset<=? THEN 1 ELSE MIN(count+1, ?) END,
        reset=CASE WHEN reset<=? THEN excluded.reset ELSE reset END
      RETURNING count, reset`).get(key, now + windowMs, now, limit + 1, now)!;
    return (row.count as number) > limit ? Math.max(1, Math.ceil(((row.reset as number) - now) / 1000)) : 0;
  }
  close() { this.db.close(); }
}
