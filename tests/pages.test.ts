import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { HomeNavigation, PageFooter } from '../components/home-motion.tsx';
import { ProductGallery } from '../components/product-gallery.tsx';

const read = (path: string) => readFileSync(new URL(path, import.meta.url), 'utf8');
const pages = {
  about: read('../app/about/page.tsx'),
  products: read('../app/products/page.tsx'),
  services: read('../app/services/page.tsx'),
  contact: read('../app/contact/page.tsx'),
};

test('public pages reuse the homepage design language and hide the global chrome', () => {
  for (const [name, source] of Object.entries(pages)) {
    assert.match(source, /gumnly-home/, `${name} harus pakai wrapper desain homepage`);
    assert.match(source, /HomeNavigation/, `${name} harus pakai navigasi pill homepage`);
    assert.match(source, /PageFooter/, `${name} harus pakai footer homepage`);
    assert.match(source, /force-dynamic/, `${name} harus force-dynamic`);
    assert.doesNotMatch(source, /className="(page-head|rule-list|cta-band|col-rule)"/, `${name} tidak boleh pakai kelas gaya lama`);
  }
});

test('each page marks its own nav item as the active page', () => {
  assert.match(renderToStaticMarkup(createElement(HomeNavigation, { active: '/about' })), /aria-current="page"[^>]*>Tentang</);
  assert.match(renderToStaticMarkup(createElement(HomeNavigation, { active: '/products' })), /aria-current="page"[^>]*>Produk</);
  assert.match(renderToStaticMarkup(createElement(HomeNavigation, { active: '/services' })), /aria-current="page"[^>]*>Layanan</);
  assert.match(renderToStaticMarkup(createElement(HomeNavigation, { active: '/contact' })), /aria-current="page"[^>]*>Kontak</);
  assert.doesNotMatch(renderToStaticMarkup(createElement(HomeNavigation, { active: '/about' })), /aria-current="page"[^>]*>Produk</);
});

test('page copy stays Indonesian GUMNLY branding without template names', () => {
  assert.match(pages.about, /Tentang kami/);
  assert.match(pages.about, /getBackend\(\)\.company\(\)/);
  assert.match(pages.products, /getBackend\(\)\.products\(\)/);
  assert.match(read('../components/product-gallery.tsx'), /Belum ada produk yang dapat ditampilkan/);
  assert.match(pages.services, /Software khusus|Otomasi alur kerja|Integrasi sistem/);
  assert.match(pages.contact, /ContactForm/);
  for (const source of Object.values(pages)) {
    for (const banned of ['Sevora', 'Stylokit', 'Good design starts', 'Selected work', "Let's talk about your next project", 'Jane Smith', 'jane@framer', 'Happy clients', 'Years of experience']) {
      assert.doesNotMatch(source, new RegExp(banned.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `copy terlarang muncul: ${banned}`);
    }
  }
});

test('product gallery renders db-driven cards with in-development status', () => {
  const markup = renderToStaticMarkup(createElement(ProductGallery, { products: [{ id: 'first-product', name: null, description: 'Deskripsi produk.', status: 'in-development' }] }));
  assert.match(markup, /page-product-card/);
  assert.match(markup, /Nama produk menyusul/);
  assert.match(markup, /Sedang dikembangkan/);
  assert.match(markup, /aria-pressed="true"[^>]*>Semua</);
  assert.match(renderToStaticMarkup(createElement(ProductGallery, { products: [] })), /Belum ada produk/);
});

test('page footer carries truthful GUMNLY branding only', () => {
  const markup = renderToStaticMarkup(createElement(PageFooter, { companyName: 'GUMNLY Tech' }));
  assert.match(markup, /GUMNLY Tech\. Semua hak dilindungi/);
  assert.match(markup, /href="\/privacy"/);
});
