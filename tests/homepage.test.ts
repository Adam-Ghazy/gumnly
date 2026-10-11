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
 assert.match(renderToStaticMarkup(createElement(HomeNavigation)), /aria-label="Open menu"/);
 assert.equal(renderToStaticMarkup(createElement(Count, { value: 0 })), '<span>0</span>');
});

test('homepage copy uses English GUMNLY branding', () => {
 const source = readFileSync(new URL('../app/page.tsx', import.meta.url), 'utf8');
 assert.match(source, /Available for projects/);
 assert.match(source, /Design studies/);
 assert.match(source, /All rights reserved/);
 for (const leftover of ['Terima proyek baru', 'Lihat karya', 'Hubungi kami', 'Kenapa kami berbeda', 'Jelajahi FAQ']) {
  assert.doesNotMatch(source, new RegExp(leftover.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
 }
});
