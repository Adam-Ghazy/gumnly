import assert from 'node:assert/strict';
import test from 'node:test';
import { contactPayload, contactResult } from '../components/contact-logic';

test('contact payload preserves the selected enquiry and honeypot without inventing consent', () => {
  const form = new FormData();
  form.set('kind', 'project');
  form.set('name', '  Ayu  ');
  form.set('email', '  ayu@example.com  ');
  form.set('message', '  Integrasi sistem untuk usaha kami.  ');
  form.set('website', 'spam.example');
  assert.deepEqual(contactPayload(form), {
    kind: 'project', name: 'Ayu', email: 'ayu@example.com',
    message: 'Integrasi sistem untuk usaha kami.', consent: false, website: 'spam.example',
  });
  form.set('consent', 'on');
  assert.equal(contactPayload(form).consent, true);
  form.set('kind', 'product');
  assert.equal(contactPayload(form).kind, 'product');
});

test('contact feedback distinguishes persistence from email acceptance and keeps failures actionable', () => {
  assert.deepEqual(contactResult(true, { delivery: 'stored' }), {
    ok: true, message: 'Pertanyaan tersimpan secara lokal di server GUMNLY. Email belum dikirim.',
  });
  assert.deepEqual(contactResult(true, { delivery: 'accepted' }), {
    ok: true, message: 'Pertanyaan tersimpan. Penyedia email menerima pesan; ini bukan jaminan pesan masuk ke kotak masuk.',
  });
  for (const delivery of ['pending', 'failed']) {
    assert.deepEqual(contactResult(true, { delivery }), {
      ok: true, message: 'Pertanyaan tersimpan. Penerimaan email belum dikonfirmasi; Anda tidak perlu mengirim ulang.',
    });
  }
  assert.deepEqual(contactResult(false, { error: 'Terlalu banyak percobaan. Coba lagi nanti.' }), {
    ok: false, message: 'Terlalu banyak percobaan. Coba lagi nanti.',
  });
  assert.equal(contactResult(true, {}).ok, false);
  assert.equal(contactResult(false, null).ok, false);
});
