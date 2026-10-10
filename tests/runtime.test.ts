import assert from 'node:assert/strict';
import test from 'node:test';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { getBackend, resetBackendForTests } from '../src/server/runtime.ts';

function withEnv(env: Record<string, string>) {
  const saved = { ...process.env };
  for (const key of ['APP_ORIGIN', 'DATABASE_PATH', 'NODE_ENV']) delete process.env[key];
  Object.assign(process.env, env);
  return () => { for (const key of Object.keys(env)) delete process.env[key]; Object.assign(process.env, saved); };
}

test('runtime builds one backend from environment and reuses it', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'gumnly-runtime-'));
  const restore = withEnv({ APP_ORIGIN: 'https://gumnly.test', DATABASE_PATH: join(dir, 'site.sqlite') });
  try {
    resetBackendForTests();
    const first = getBackend();
    assert.equal(getBackend(), first, 'same instance is reused');
    assert.equal((await first.handle(new Request('https://gumnly.test/api/company'))).status, 200);
  } finally { restore(); resetBackendForTests(); rmSync(dir, { recursive: true, force: true }); }
});

test('runtime fails closed when APP_ORIGIN is not configured', () => {
  const dir = mkdtempSync(join(tmpdir(), 'gumnly-runtime-2-'));
  const restore = withEnv({ DATABASE_PATH: join(dir, 'site.sqlite') });
  try {
    resetBackendForTests();
    assert.throws(() => getBackend(), /APP_ORIGIN/);
  } finally { restore(); resetBackendForTests(); rmSync(dir, { recursive: true, force: true }); }
});
