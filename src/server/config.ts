import { resolve, sep } from 'node:path';
import { z } from 'zod';
import { validCredentials } from './auth.ts';
import type { BackendConfig } from './backend.ts';
export type RuntimeConfig = BackendConfig & { databasePath: string };

export function loadConfig(env: Partial<NodeJS.ProcessEnv>): RuntimeConfig {
  let origin: URL;
  try { origin = new URL(env.APP_ORIGIN ?? ''); } catch { throw new Error('APP_ORIGIN must be explicitly configured'); }
  const production = env.NODE_ENV === 'production';
  // Local production smoke tests over loopback HTTP are permitted; public origins require HTTPS.
  const loopbackHttp = production && origin.protocol === 'http:' && (origin.hostname === 'localhost' || origin.hostname === '127.0.0.1' || origin.hostname === '[::1]');
  if (origin.origin !== env.APP_ORIGIN || !['http:', 'https:'].includes(origin.protocol) || (production && origin.protocol !== 'https:' && !loopbackHttp)) throw new Error('APP_ORIGIN must be a canonical origin; production requires HTTPS');
  if (env.TRUST_PROXY && env.TRUST_PROXY !== 'false') throw new Error('Proxy identity trust is not supported');
  const databasePath = resolve(env.DATABASE_PATH || 'data/gumnly.sqlite');
  const publicPath = resolve('public');
  if (databasePath === publicPath || databasePath.startsWith(publicPath + sep)) throw new Error('Storage must be outside public');
  const config: RuntimeConfig = { origin: origin.origin, production, databasePath };
  if (env.ADMIN_USERNAME || env.ADMIN_PASSWORD_HASH) {
    const credentials = { username: env.ADMIN_USERNAME ?? '', passwordHash: env.ADMIN_PASSWORD_HASH ?? '' };
    if (!validCredentials(credentials)) throw new Error('Admin credentials are incomplete or invalid');
    config.credentials = credentials;
  }
  const provider = env.MAIL_PROVIDER || 'disabled';
  if (provider === 'resend') {
    const parsed = z.strictObject({ apiKey: z.string().min(1).max(1000).regex(/^[^\s]+$/), from: z.email(), to: z.email(), timeoutMs: z.coerce.number().int().min(100).max(10000) }).safeParse({ apiKey: env.RESEND_API_KEY, from: env.MAIL_FROM, to: env.MAIL_TO, timeoutMs: env.MAIL_TIMEOUT_MS || '5000' });
    if (!parsed.success) throw new Error('Mail configuration is incomplete or invalid');
    config.mail = parsed.data;
  } else if (provider !== 'disabled') throw new Error('Unsupported mail provider');
  return config;
}
