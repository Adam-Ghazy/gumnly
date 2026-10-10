import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { LoginForm } from '../components/admin/LoginForm.tsx';
import { Dashboard } from '../components/admin/Dashboard.tsx';

test('dashboard renders persisted company, nullable product names and honest enquiry counts', () => {
  const html = renderToStaticMarkup(createElement(Dashboard, {
    session: { csrfToken: 'test-csrf', expiresAt: Date.now() + 60000 },
    initialData: {
      company: { name: 'Perusahaan uji', descriptor: 'Deskripsi singkat', headline: 'Judul asli', description: 'Deskripsi asli', about: 'Tentang asli', services: 'Layanan asli', privacy: 'Privasi asli' },
      products: [{ id: 'p1', name: null, description: 'Deskripsi produk asli', status: 'in-development' }],
      enquiries: [],
    },
  }));
  assert.match(html, /Perusahaan uji/);
  assert.match(html, /Nama belum ditetapkan/);
  assert.match(html, /Belum ada pertanyaan masuk/);
  assert.match(html, /1 produk/);
  assert.match(html, /0 pertanyaan ditampilkan/);
  for (const field of ['name', 'descriptor', 'headline', 'description', 'about', 'services', 'privacy']) {
    assert.match(html, new RegExp(`name="${field}"`));
  }
  assert.match(html, /href="#company"/);
  assert.match(html, /href="#products"/);
  assert.match(html, /href="#enquiries"/);
  assert.doesNotMatch(html, /test-csrf/);
});

test('admin login explains missing configuration and disables credential submission', () => {
  const html = renderToStaticMarkup(createElement(LoginForm, { configured: false }));
  assert.match(html, /Login belum dikonfigurasi/);
  assert.match(html, /<fieldset disabled=""/);
  assert.match(html, /autoComplete="username"/);
  assert.match(html, /autoComplete="current-password"/);
  assert.doesNotMatch(html, /value="admin"/);
});
