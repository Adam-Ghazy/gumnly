import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { randomBytes } from 'node:crypto';
import { Store } from '../src/server/store.ts';
import { Auth, hashPassword } from '../src/server/auth.ts';

test('authentication fails closed; opaque sessions persist, expire, revoke and invalidate on credential rotation', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'gumnly-auth-'));
  const path = join(dir, 'site.sqlite');
  const password = randomBytes(24).toString('base64url');
  const credentials = { username: 'private-admin', passwordHash: await hashPassword(password) };
  let now = 1000;
  let store = new Store(path);
  try {
    assert.equal(await new Auth(store, undefined).login('private-admin', password), null);
    let auth = new Auth(store, credentials, () => now);
    assert.equal(await auth.login('private-admin', 'incorrect'), null);
    assert.equal(await auth.login('unknown', password), null);
    const session = (await auth.login('private-admin', password))!;
    assert.match(session.token, /^[A-Za-z0-9_-]{43}$/);
    assert.notEqual(session.csrfToken, session.token);
    store.close(); store = new Store(path); auth = new Auth(store, credentials, () => now);
    assert.equal(auth.session(session.token)?.csrfToken, session.csrfToken);
    assert.equal(auth.session('forged'), null);
    assert.equal(new Auth(store, { ...credentials, passwordHash: await hashPassword(password) }).session(session.token), null);
    now = session.expiresAt;
    assert.equal(auth.session(session.token), null);
    now = 1000;
    const second = (await auth.login('private-admin', password))!;
    auth.logout(second.token);
    assert.equal(auth.session(second.token), null);
  } finally { store.close(); rmSync(dir, {recursive:true, force:true}); }
});
