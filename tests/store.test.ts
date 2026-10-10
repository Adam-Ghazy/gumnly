import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { Store } from '../src/server/store.ts';

test('company edits survive reopening; first product remains provisional and no enquiries are seeded', () => {
  const dir = mkdtempSync(join(tmpdir(), 'gumnly-store-'));
  const path = join(dir, 'site.sqlite');
  try {
    let store = new Store(path);
    assert.equal(store.company().name, 'GUMNLY Tech');
    const company = { ...store.company(), headline: 'Software untuk proses kerja' };
    store.saveCompany(company);
    store.close();
    store = new Store(path);
    assert.deepEqual(store.company(), company);
    assert.equal(store.products()[0].status, 'in-development');
    assert.equal(store.products()[0].name, null);
    assert.deepEqual(store.enquiries(), []);
    store.close();
  } finally { rmSync(dir, {recursive:true, force:true}); }
});

test('product management and enquiry review/delete persist across restarts without reseeding', () => {
  const dir = mkdtempSync(join(tmpdir(), 'gumnly-records-'));
  const path = join(dir, 'site.sqlite');
  try {
    let store = new Store(path);
    store.saveProduct({ id: 'first-product', name: null, description: 'Lingkup sedang ditinjau.', status: 'in-development' });
    store.addEnquiry({ id: 'enquiry-1', kind: 'project', name: 'Pengunjung', email: 'visitor@example.test', message: 'Diskusi integrasi sistem.', status: 'new', delivery: 'stored', createdAt: 100 });
    store.updateEnquiry('enquiry-1', { status: 'reviewed', delivery: 'failed' });
    store.close();
    store = new Store(path);
    assert.equal(store.products()[0].description, 'Lingkup sedang ditinjau.');
    assert.equal(store.enquiries()[0].status, 'reviewed');
    assert.equal(store.enquiries()[0].delivery, 'failed');
    assert.equal(store.updateEnquiry('missing', { status: 'closed' }), false);
    assert.equal(store.deleteEnquiry('enquiry-1'), true);
    assert.equal(store.deleteProduct('first-product'), true);
    store.close();
    store = new Store(path);
    assert.deepEqual(store.products(), []);
    assert.deepEqual(store.enquiries(), []);
    store.close();
  } finally { rmSync(dir, {recursive:true, force:true}); }
});
