import type { Metadata } from 'next';
import Link from 'next/link';
import { getBackend } from '../../src/server/runtime.ts';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Produk' };

export default function ProductsPage() {
  const products = getBackend().products();
  return (
    <>
      <section className="page-head">
        <div className="container">
          <h1 style={{ maxWidth: '20ch' }}>Produk yang sedang kami kembangkan</h1>
          <p className="lede">Kami membangun produk SaaS secara bertahap. Semua yang tampil di halaman ini masih dalam pengembangan dan belum tersedia untuk publik.</p>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 'clamp(2.5rem, 6vw, 4rem)' }}>
        <div className="container">
          {products.length === 0 ? (
            <p>Belum ada produk yang dapat ditampilkan.</p>
          ) : (
            <ul className="rule-list" style={{ ['--rule-invert' as string]: 'rgba(11, 47, 43, 0.28)' }}>
              {products.map(product => (
                <li key={product.id}>
                  <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' }}>{product.name ?? 'Nama produk menyusul'}</h2>
                  <p className="lede">{product.description}</p>
                  <p className="status-badge" style={{ marginTop: '1.1rem', marginBottom: 0 }}>Sedang dikembangkan</p>
                </li>
              ))}
            </ul>
          )}
          <p style={{ marginTop: '3rem', marginBottom: 0 }}>Ingin tahu lebih jauh atau menyarankan kebutuhan Anda? <Link href="/contact">Sampaikan minat Anda</Link>, kami akan mengabari saat ada kabar perkembangan.</p>
        </div>
      </section>
    </>
  );
}
