import test from 'node:test';
import assert from 'node:assert/strict';
import { publicCopy } from '../src/public-copy.ts';
test('known seed copy is presented in English without hiding administrator edits', () => {
 assert.equal(publicCopy('Membangun software yang membuat pekerjaan lebih sederhana.'), 'SaaS products. Services that deliver.');
 assert.equal(publicCopy('A custom administrator headline'), 'A custom administrator headline');
 assert.equal(publicCopy('Produk SaaS pertama sedang dikembangkan. Nama dan lingkup produk belum final.'), 'Our first SaaS product is in development. Its name and scope are not final.');
});
