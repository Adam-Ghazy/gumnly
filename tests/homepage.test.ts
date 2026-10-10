import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { HomeFAQ, ServiceTabs, HomeNavigation, Count } from '../components/home-motion.tsx';

test('homepage uses the reference workspace photo rather than the old illustration', () => {
 const source = readFileSync(new URL('../app/page.tsx', import.meta.url), 'utf8');
 assert.match(source, /\/reference\/workspace\.jpg/);
 assert.doesNotMatch(source, /\/brand\/hero\.png/);
 assert.match(source, /getBackend\(\)\.company\(\)/);
 assert.match(source, /getBackend\(\)\.products\(\)/);
});

test('homepage interactive controls render accessible relationships and truthful counts', () => {
 const faq = renderToStaticMarkup(createElement(HomeFAQ, { items: [{ q: 'Question?', a: 'Answer.' }] }));
 assert.match(faq, /aria-expanded="false"/);
 assert.match(faq, /aria-controls="faq-answer-0"/);
 assert.match(faq, /id="faq-answer-0"/);
 const tabs = renderToStaticMarkup(createElement(ServiceTabs));
 assert.equal((tabs.match(/role="tab"/g) ?? []).length, 3);
 assert.match(tabs, /aria-selected="true"/);
 assert.match(tabs, /development.png/);
 assert.match(renderToStaticMarkup(createElement(HomeNavigation)), /aria-label="Buka menu"/);
 assert.equal(renderToStaticMarkup(createElement(Count, { value: 0 })), '<span>0</span>');
});

test('homepage copy stays Indonesian GUMNLY branding', () => {
 const source = readFileSync(new URL('../app/page.tsx', import.meta.url), 'utf8');
 assert.match(source, /Terima proyek baru/);
 assert.match(source, /Studi desain/);
 assert.match(source, /Semua hak dilindungi/);
 for (const leftover of ['Available for projects', 'View projects', 'Get in touch', 'Discover why we stand out', 'Explore our FAQs']) {
  assert.doesNotMatch(source, new RegExp(leftover.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
 }
});
