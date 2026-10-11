import assert from 'node:assert/strict';
import test from 'node:test';
import { contactPayload, contactResult } from '../components/contact-logic';

test('contact payload preserves the selected enquiry and honeypot without inventing consent', () => {
  const form = new FormData();
  form.set('kind', 'project');
  form.set('name', '  Ayu  ');
  form.set('email', '  ayu@example.com  ');
  form.set('message', '  System integration untuk usaha kami.  ');
  form.set('website', 'spam.example');
  assert.deepEqual(contactPayload(form), {
    kind: 'project', name: 'Ayu', email: 'ayu@example.com',
    message: 'System integration untuk usaha kami.', consent: false, website: 'spam.example',
  });
  form.set('consent', 'on');
  assert.equal(contactPayload(form).consent, true);
  form.set('kind', 'product');
  assert.equal(contactPayload(form).kind, 'product');
});

test('contact feedback distinguishes persistence from email acceptance and keeps failures actionable', () => {
  assert.deepEqual(contactResult(true, { delivery: 'stored' }), {
    ok: true, message: 'Your enquiry is saved on the GUMNLY server. No email has been sent.',
  });
  assert.deepEqual(contactResult(true, { delivery: 'accepted' }), {
    ok: true, message: 'Your enquiry is saved. The email provider accepted the message; inbox delivery is not confirmed.',
  });
  for (const delivery of ['pending', 'failed']) {
    assert.deepEqual(contactResult(true, { delivery }), {
      ok: true, message: 'Your enquiry is saved. Email delivery is not confirmed; there is no need to submit again.',
    });
  }
  assert.deepEqual(contactResult(false, { error: 'Terlalu banyak percobaan. Coba lagi nanti.' }), {
    ok: false, message: 'Terlalu banyak percobaan. Coba lagi nanti.',
  });
  assert.equal(contactResult(true, {}).ok, false);
  assert.equal(contactResult(false, null).ok, false);
});
