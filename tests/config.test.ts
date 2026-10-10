import test from 'node:test';
import assert from 'node:assert/strict';
import { loadConfig } from '../src/server/config.ts';

test('configuration requires explicit canonical origin, private storage, secure production origin and complete mail settings', () => {
  assert.throws(() => loadConfig({}), /origin/i);
  for (const APP_ORIGIN of ['https://site.test/path', 'https://user:pass@site.test', 'null', 'https://site.test?x=1', 'https://site.test/']) assert.throws(() => loadConfig({ APP_ORIGIN }));
  assert.throws(() => loadConfig({ APP_ORIGIN: 'http://site.test', NODE_ENV: 'production' }));
  loadConfig({ APP_ORIGIN: 'http://127.0.0.1:3210', NODE_ENV: 'production' }); // loopback smoke test stays allowed
  assert.throws(() => loadConfig({ APP_ORIGIN: 'https://site.test', DATABASE_PATH: 'public/data.sqlite' }));
  assert.throws(() => loadConfig({ APP_ORIGIN: 'https://site.test', ADMIN_USERNAME: 'operator' }));
  assert.throws(() => loadConfig({ APP_ORIGIN: 'https://site.test', MAIL_PROVIDER: 'resend' }));
  assert.throws(() => loadConfig({ APP_ORIGIN: 'https://site.test', TRUST_PROXY: 'true' }));
  const local = loadConfig({ APP_ORIGIN: 'http://localhost:3000' });
  assert.equal(local.credentials, undefined); assert.equal(local.mail, undefined);
  const configured = loadConfig({ APP_ORIGIN: 'https://site.test', NODE_ENV: 'production', MAIL_PROVIDER: 'resend', RESEND_API_KEY: 'private-test-value', MAIL_FROM: 'website@example.test', MAIL_TO: 'operator@example.test' });
  assert.equal(configured.mail?.to, 'operator@example.test');
  assert.equal(configured.mail?.timeoutMs, 5000);
  assert.equal(configured.production, true);
});
