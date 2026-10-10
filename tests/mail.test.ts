import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { Store } from '../src/server/store.ts';
import { Backend } from '../src/server/backend.ts';

const origin = 'https://gumnly.test';
const mail = { apiKey: 'test-key-not-a-real-secret', from: 'website@example.test', to: 'operator@example.test', timeoutMs: 20 };
const contact = { kind: 'project', name: 'Pengunjung', email: 'visitor@example.test', message: 'Mohon diskusi integrasi sistem.', consent: true };

test('email uses fixed operator recipient; persistence precedes transport and reports acceptance, failure and timeout honestly', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'gumnly-mail-'));
  const store = new Store(join(dir, 'site.sqlite'));
  const payloads: Record<string, unknown>[] = [];
  const transport: typeof fetch = async (url, init) => {
    assert.equal(String(url), 'https://api.resend.com/emails');
    assert.equal(init?.redirect, 'error');
    const payload = JSON.parse(init!.body as string);
    payloads.push(payload);
    assert.equal(store.enquiries().find(row => row.message === contact.message)?.delivery, 'pending');
    return Response.json({ id: 'provider-message-id' }, { status: 200 });
  };
  try {
    for (const [kind, send, expected] of [
      ['accepted', transport, 'accepted'],
      ['rejected', async () => Response.json({ error: 'provider secret detail' }, { status: 500 }), 'failed'],
      ['invalid-response', async () => Response.json({}), 'failed'],
      ['network-error', async () => { throw new Error('private network detail'); }, 'failed'],
      ['timeout', async () => new Promise<Response>(() => {}), 'failed'],
    ] as const) {
      const api = new Backend(store, { origin, production: false, mail }, Date.now, send);
      const response = await api.handle(new Request(origin + '/api/contact', { method: 'POST', headers: { origin, 'content-type': 'application/json' }, body: JSON.stringify(contact) }));
      assert.equal(response.status, 201, kind);
      const result = await response.json();
      assert.equal(result.delivery, expected, kind);
      assert.equal(store.enquiries().find(row => row.id === result.id)?.delivery, expected, kind);
      assert.equal(JSON.stringify(result).includes('private'), false);
      assert.equal(JSON.stringify(result).includes('provider secret'), false);
      if (expected === 'accepted') assert.match(result.message, /bukan jaminan/);
      else assert.match(result.message, /belum dikonfirmasi/);
    }
    assert.deepEqual(payloads[0].to, ['operator@example.test']);
    assert.equal(payloads[0].from, 'website@example.test');
    assert.equal(payloads[0].reply_to, contact.email);
    assert.equal('html' in payloads[0], false);
    assert.match(payloads[0].text as string, /Mohon diskusi integrasi sistem/);
  } finally { store.close(); rmSync(dir, { recursive: true, force: true }); }
});
