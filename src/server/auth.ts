import { createHash, randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import type { Store } from './store.ts';
const derive = promisify(scrypt);
export type Credentials = { username: string; passwordHash: string };
export const SESSION_SECONDS = 8 * 60 * 60;
export async function hashPassword(password: string): Promise<string> {
  if (password.length < 16 || Buffer.byteLength(password) > 1024) throw new Error('Password must be 16–1024 bytes');
  const salt = randomBytes(16).toString('hex');
  const key = await derive(password, salt, 64) as Buffer;
  return `scrypt:${salt}:${key.toString('hex')}`;
}
export function validCredentials(value: Credentials | undefined): value is Credentials {
  return !!value && /^[a-zA-Z0-9._@-]{3,100}$/.test(value.username) && /^scrypt:[a-f0-9]{32}:[a-f0-9]{128}$/.test(value.passwordHash);
}
export class Auth {
  constructor(private store: Store, private credentials?: Credentials, private clock: () => number = Date.now) {}
  async login(username: string, password: string) {
    if (!validCredentials(this.credentials) || Buffer.byteLength(password) > 1024) return null;
    const [, salt, expected] = this.credentials.passwordHash.split(':');
    const key = await derive(password, salt, 64) as Buffer;
    const passwordMatches = timingSafeEqual(key, Buffer.from(expected, 'hex'));
    const usernameMatches = timingSafeEqual(createHash('sha256').update(username).digest(), createHash('sha256').update(this.credentials.username).digest());
    if (!passwordMatches || !usernameMatches) return null;
    const token = randomBytes(32).toString('base64url');
    const csrfToken = randomBytes(32).toString('base64url');
    const expiresAt = this.clock() + SESSION_SECONDS * 1000;
    this.store.saveSession(createHash('sha256').update(token).digest('hex'), csrfToken, expiresAt, createHash('sha256').update(JSON.stringify(this.credentials)).digest('hex'), this.clock());
    return { token, csrfToken, expiresAt };
  }
  session(token: string) {
    if (!validCredentials(this.credentials) || !/^[A-Za-z0-9_-]{43}$/.test(token)) return null;
    return this.store.session(createHash('sha256').update(token).digest('hex'), createHash('sha256').update(JSON.stringify(this.credentials)).digest('hex'), this.clock());
  }
  logout(token: string) { this.store.deleteSession(createHash('sha256').update(token).digest('hex')); }
}
