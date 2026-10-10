import type { Metadata } from 'next';
import Link from 'next/link';
import { getBackend } from '../../src/server/runtime.ts';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Produk' };

export default function ProductsPage() {
  const products = getBackend().products();
  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow">Produk</p>
          <h1>Produk yang sedang kami kembangkan</h1>
          <p className="lede">Kami membangun produk SaaS secara bertahap. Semua yang tampil di halaman ini masih dalam pengembangan dan belum tersedia untuk publik.</p>
        </div>
        {products.length === 0 ? (
          <p>Belum ada produk yang dapat ditampilkan.</p>
        ) : (
          <div className="grid grid-2">
            {products.map(product => (
              <article key={product.id} className="card">
                <h2>{product.name ?? 'Nama produk menyusul'}</h2>
                <p>{product.description}</p>
                <p className="status-badge">Sedang dikembangkan</p>
              </article>
            ))}
          </div>
        )}
        <p style={{ marginTop: '3rem' }}>Ingin tahu lebih jauh atau menyarankan kebutuhan Anda? <Link href="/contact">Sampaikan minat Anda</Link> — kami akan mengabari saat ada kabar perkembangan.</p>
      </div>
    </section>
  );
}
