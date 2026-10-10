import assert from 'node:assert/strict';
import test from 'node:test';
import { randomBytes } from 'node:crypto';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { Store } from '../src/server/store.ts';
import { hashPassword } from '../src/server/auth.ts';
import { Backend } from '../src/server/backend.ts';

const origin = 'https://gumnly.test';

test('backend exposes login configuration state and resolves sessions from a cookie header', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'gumnly-session-'));
  const store = new Store(join(dir, 'site.sqlite'));
  const password = randomBytes(24).toString('base64url');
  const credentials = { username: 'operator', passwordHash: await hashPassword(password) };
  const dev = new Backend(store, { origin, production: false, credentials });
  const prod = new Backend(store, { origin, production: true, credentials });
  try {
    assert.equal(new Backend(store, { origin, production: false }).loginConfigured(), false);
    assert.equal(dev.loginConfigured(), true);

    assert.equal(dev.sessionFromCookieHeader(null), null);
    assert.equal(dev.sessionFromCookieHeader('other=1'), null);

    const login = await dev.handle(new Request(origin + '/api/auth/login', { method: 'POST', headers: { origin, 'content-type': 'application/json' }, body: JSON.stringify({ username: 'operator', password }) }));
    const setCookie = login.headers.get('set-cookie')!;
    const token = setCookie.split(';')[0].split('=')[1];

    assert.equal(dev.sessionFromCookieHeader(setCookie.split(';')[0])?.csrfToken, (await login.json()).csrfToken);
    // Production uses the __Host- cookie name: a dev cookie name must not authenticate there.
    assert.equal(prod.sessionFromCookieHeader('gumnly_session=' + token), null);
    assert.notEqual(prod.sessionFromCookieHeader('__Host-gumnly_session=' + token), null);
  } finally { store.close(); rmSync(dir, { recursive: true, force: true }); }
});
