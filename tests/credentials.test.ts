import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, statSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { Auth } from '../src/server/auth.ts';
import { Store } from '../src/server/store.ts';

test('credential generator writes private files exclusively, never prints secrets, and creates working credentials', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'gumnly-credentials-'));
  try {
    const run = () => spawnSync(process.execPath, ['--import', 'tsx', 'scripts/admin-generate.ts', '--username', 'site-operator', '--directory', join(dir, 'credentials')], { encoding: 'utf8' });
    const result = run();
    assert.equal(result.status, 0, result.stderr);
    const env = readFileSync(join(dir, 'credentials/admin.env'), 'utf8');
    const password = readFileSync(join(dir, 'credentials/password.txt'), 'utf8').trim();
    assert.equal(statSync(join(dir, 'credentials/password.txt')).mode & 0o777, 0o600);
    assert.equal(statSync(join(dir, 'credentials')).mode & 0o777, 0o700);
    assert.equal((result.stdout + result.stderr).includes(password), false);
    const values = Object.fromEntries(env.trim().split('\n').map(line => line.split('=')));
    assert.equal((result.stdout + result.stderr).includes(values.ADMIN_PASSWORD_HASH), false);
    const store = new Store(join(dir, 'site.sqlite'));
    try { assert.ok(await new Auth(store, { username: values.ADMIN_USERNAME, passwordHash: values.ADMIN_PASSWORD_HASH }).login('site-operator', password)); }
    finally { store.close(); }
    assert.notEqual(run().status, 0);
    assert.equal(readFileSync(join(dir, 'credentials/password.txt'), 'utf8').trim(), password);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
