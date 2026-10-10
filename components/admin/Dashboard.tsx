'use client';

import { useState } from 'react';
import type { Company, Enquiry, Product } from '../../src/server/store.ts';

export type DashboardData = { company: Company; products: Product[]; enquiries: Enquiry[] };

const COMPANY_FIELDS: { key: keyof Company; label: string; textarea?: boolean }[] = [
  { key: 'name', label: 'Nama perusahaan' },
  { key: 'descriptor', label: 'Deskripsi singkat' },
  { key: 'headline', label: 'Judul utama beranda' },
  { key: 'description', label: 'Paragraf pendukung beranda', textarea: true },
  { key: 'about', label: 'Narasi Tentang', textarea: true },
  { key: 'services', label: 'Ringkasan Layanan', textarea: true },
  { key: 'privacy', label: 'Teks Privasi', textarea: true },
];

const STATUS_LABEL: Record<Enquiry['status'], string> = { new: 'Baru', reviewed: 'Ditinjau', closed: 'Selesai' };
const KIND_LABEL: Record<Enquiry['kind'], string> = { product: 'Produk', project: 'Proyek' };
const DELIVERY_LABEL: Record<Enquiry['delivery'], string> = { stored: 'Tersimpan lokal', pending: 'Email tertunda', accepted: 'Email diterima provider', failed: 'Email gagal' };

export function Dashboard({ session, initialData }: { session: { csrfToken: string; expiresAt: number }; initialData: DashboardData }) {
  const [company, setCompany] = useState(initialData.company);
  const [products, setProducts] = useState(initialData.products);
  const [enquiries, setEnquiries] = useState(initialData.enquiries);
  const [notice, setNotice] = useState('');

  async function call(path: string, method: string, body?: unknown) {
    const response = await fetch(path, {
      method, credentials: 'same-origin',
      headers: { 'content-type': 'application/json', 'x-csrf-token': session.csrfToken },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const data: unknown = await response.json().catch(() => null);
    if (!response.ok) throw new Error((data as { error?: string } | null)?.error ?? 'Permintaan gagal.');
    return data;
  }

  async function saveCompany(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const next = Object.fromEntries(COMPANY_FIELDS.map(f => [f.key as string, String(form.get(f.key) ?? '').trim()])) as unknown as Company;
    try { setCompany(await call('/api/admin/company', 'PUT', next) as Company); setNotice('Konten perusahaan tersimpan.'); }
    catch (failure) { setNotice(failure instanceof Error ? failure.message : 'Gagal menyimpan.'); }
  }

  async function addProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const description = String(new FormData(form).get('description') ?? '').trim();
    try {
      const created = await call('/api/admin/products', 'POST', { name: null, description, status: 'in-development' }) as Product;
      setProducts(previous => [...previous, created]);
      form.reset();
      setNotice('Produk ditambahkan.');
    } catch (failure) { setNotice(failure instanceof Error ? failure.message : 'Gagal menambah produk.'); }
  }

  async function saveProduct(product: Product, description: string) {
    try { const updated = await call('/api/admin/products/' + product.id, 'PUT', { name: product.name, description, status: product.status }) as Product; setProducts(previous => previous.map(p => p.id === product.id ? updated : p)); setNotice('Perubahan produk tersimpan.'); }
    catch (failure) { setNotice(failure instanceof Error ? failure.message : 'Gagal menyimpan produk.'); }
  }

  async function removeProduct(product: Product) {
    try { await call('/api/admin/products/' + product.id, 'DELETE'); setProducts(previous => previous.filter(p => p.id !== product.id)); setNotice('Produk dihapus.'); }
    catch (failure) { setNotice(failure instanceof Error ? failure.message : 'Gagal menghapus produk.'); }
  }

  async function setEnquiryStatus(enquiry: Enquiry, status: Enquiry['status']) {
    try { await call('/api/admin/enquiries/' + enquiry.id, 'PATCH', { status }); setEnquiries(previous => previous.map(e => e.id === enquiry.id ? { ...e, status } : e)); }
    catch (failure) { setNotice(failure instanceof Error ? failure.message : 'Gagal memperbarui status.'); }
  }

  async function removeEnquiry(enquiry: Enquiry) {
    try { await call('/api/admin/enquiries/' + enquiry.id, 'DELETE'); setEnquiries(previous => previous.filter(e => e.id !== enquiry.id)); }
    catch (failure) { setNotice(failure instanceof Error ? failure.message : 'Gagal menghapus pertanyaan.'); }
  }

  async function logout() {
    try { await call('/api/auth/logout', 'POST'); } finally { window.location.assign('/admin/login'); }
  }

  return (
    <div className="admin-shell">
      <aside className="admin-side section-dark" style={{ minHeight: '100vh' }}>
        <nav aria-label="Navigasi admin">
          <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '0.75rem' }}>
            <li><a href="#company">Konten perusahaan</a></li>
            <li><a href="#products">Produk</a></li>
            <li><a href="#enquiries">Pertanyaan masuk</a></li>
          </ul>
        </nav>
        <p style={{ marginTop: 'auto' }}><button className="button button-secondary" onClick={logout}>Keluar</button></p>
      </aside>
      <div className="admin-main">
        <h1>Dasbor konten GUMNLY</h1>
        <p className="count">{products.length} produk · {enquiries.length} pertanyaan ditampilkan</p>
        {notice && <p className="notice" role="status">{notice}</p>}

        <section id="company" className="admin-section">
          <h2>Konten perusahaan</h2>
          <form className="form-stack" onSubmit={saveCompany}>
            {COMPANY_FIELDS.map(field => (
              <label key={field.key as string} className="field" htmlFor={'company-' + field.key as string}>{field.label}
                {field.textarea
                  ? <textarea id={'company-' + field.key} name={field.key} defaultValue={company[field.key]} maxLength={8000} />
                  : <input id={'company-' + field.key} name={field.key} defaultValue={company[field.key]} maxLength={300} />}
              </label>
            ))}
            <button className="button" type="submit">Simpan konten</button>
          </form>
        </section>

        <section id="products" className="admin-section">
          <h2>Produk</h2>
          {products.length === 0 ? <p>Belum ada produk.</p> : (
            <div className="table-wrap"><table>
              <thead><tr><th scope="col">Nama</th><th scope="col">Deskripsi</th><th scope="col">Status</th><th scope="col">Aksi</th></tr></thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id}>
                    <td>{product.name ?? 'Nama belum ditetapkan'}</td>
                    <td>
                      <form style={{ display: 'grid', gap: '0.5rem' }} onSubmit={event => { event.preventDefault(); const value = String(new FormData(event.currentTarget).get('description') ?? ''); void saveProduct(product, value); }}>
                        <textarea name="description" defaultValue={product.description} maxLength={4000} style={{ minWidth: '18rem' }} />
                        <button type="submit" className="button button-secondary" style={{ justifySelf: 'start', padding: '0.4rem 0.9rem', fontSize: '0.9rem' }}>Simpan</button>
                      </form>
                    </td>
                    <td>Sedang dikembangkan</td>
                    <td>
                      <button className="button button-secondary" style={{ padding: '0.4rem 0.9rem', fontSize: '0.9rem' }} onClick={() => void removeProduct(product)}>Hapus</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table></div>
          )}
          <form className="form-stack" onSubmit={addProduct} style={{ marginTop: '1.5rem', maxWidth: '34rem' }}>
            <legend>Tambah produk (tetap berstatus sedang dikembangkan)</legend>
            <label className="field" htmlFor="new-description">Deskripsi produk baru
              <textarea id="new-description" name="description" required maxLength={4000} />
            </label>
            <button className="button" type="submit">Tambah produk</button>
          </form>
        </section>

        <section id="enquiries" className="admin-section">
          <h2>Pertanyaan masuk</h2>
          {enquiries.length === 0 ? <p>Belum ada pertanyaan masuk.</p> : (
            <div className="table-wrap"><table>
              <thead><tr><th scope="col">Jenis</th><th scope="col">Nama</th><th scope="col">Email</th><th scope="col">Pesan</th><th scope="col">Pengiriman</th><th scope="col">Status</th><th scope="col">Aksi</th></tr></thead>
              <tbody>
                {enquiries.map(enquiry => (
                  <tr key={enquiry.id}>
                    <td>{KIND_LABEL[enquiry.kind]}</td>
                    <td>{enquiry.name}</td>
                    <td>{enquiry.email}</td>
                    <td style={{ maxWidth: '22rem' }}>{enquiry.message}</td>
                    <td>{DELIVERY_LABEL[enquiry.delivery]}</td>
                    <td>
                      <label className="field">
                        <span className="visually-hidden">Status</span>
                        <select value={enquiry.status} onChange={event => void setEnquiryStatus(enquiry, event.target.value as Enquiry['status'])}>
                          {(['new', 'reviewed', 'closed'] as const).map(status => <option key={status} value={status}>{STATUS_LABEL[status]}</option>)}
                        </select>
                      </label>
                    </td>
                    <td><button className="button button-secondary" style={{ padding: '0.4rem 0.9rem', fontSize: '0.9rem' }} onClick={() => void removeEnquiry(enquiry)}>Hapus</button></td>
                  </tr>
                ))}
              </tbody>
            </table></div>
          )}
        </section>
      </div>
    </div>
  );
}
