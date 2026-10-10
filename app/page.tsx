import Link from 'next/link';
import { getBackend } from '../src/server/runtime.ts';
import { Wordmark } from '@/components/site';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const company = getBackend().company();
  const products = getBackend().products();
  return (
    <>
      <section className="section">
        <div className="container hero">
          <div>
            <p className="eyebrow">{company.descriptor}</p>
            <h1>{company.headline}</h1>
            <p className="lede">{company.description}</p>
            <div className="hero-actions">
              <Link className="button" href="/products">Jelajahi produk</Link>
              <Link className="button button-secondary" href="/contact">Diskusikan proyek</Link>
            </div>
          </div>
          <figure className="hero-visual">
            <img src="/brand/hero.png" alt="Ilustrasi konseptual produk SaaS yang terhubung dengan otomasi dan integrasi." width={1000} height={900} />
          </figure>
        </div>
      </section>

      <section className="section section-dark">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Produk kami</p>
            <h2>Produk SaaS yang sedang kami bangun</h2>
          </div>
          {products.length === 0 ? (
            <p>Belum ada produk yang dapat ditampilkan. Kunjungi kembali nanti untuk kabar perkembangan.</p>
          ) : (
            <div className="grid grid-2">
              {products.map(product => (
                <article key={product.id} className="card" style={{ background: 'transparent', borderColor: 'rgba(237, 232, 223, 0.4)', color: 'inherit' }}>
                  <h3 style={{ color: 'var(--color-base)' }}>{product.name ?? 'Nama produk menyusul'}</h3>
                  <p style={{ margin: 0 }}>{product.description}</p>
                  <p className="status-badge" style={{ marginTop: '1rem' }}>Sedang dikembangkan</p>
                </article>
              ))}
            </div>
          )}
          <p style={{ marginTop: '2rem' }}><Link href="/products">Lihat detail produk</Link></p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Apa yang kami kerjakan</p>
            <h2>Rekayasa produk, otomasi, dan integrasi</h2>
            <p>Kami membangun produk SaaS sendiri sebagai inti bisnis, dan menerima proyek pengembangan software khusus, otomasi alur kerja, serta integrasi sistem yang terpilih.</p>
          </div>
          <div className="grid grid-3">
            <article className="card"><h3>Produk SaaS</h3><p>Tim kami merancang dan mengembangkan produk digital sendiri, dari konsep hingga rilis bertahap.</p></article>
            <article className="card"><h3>Otomasi alur kerja</h3><p>Proses manual yang berulang kami susun ulang menjadi alur yang terstruktur dan dapat dipantau.</p></article>
            <article className="card"><h3>Integrasi sistem</h3><p>Sistem yang terpisah kami hubungkan agar data mengalir konsisten antar alat yang sudah Anda pakai.</p></article>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container grid grid-2" style={{ alignItems: 'center' }}>
          <div>
            <p className="eyebrow">Pengembangan khusus</p>
            <h2>Butuh software yang menyesuaikan cara kerja tim Anda?</h2>
            <p>Kami menerima proyek pengembangan khusus secara selektif, dimulai dari sesi discovery untuk memahami kebutuhan Anda sebelum menawarkan solusi.</p>
            <Link className="button" href="/contact">Diskusikan proyek Anda</Link>
          </div>
          <figure className="figure-full">
            <img src="/brand/workflow.png" alt="Discovery, desain, pengembangan, lalu review dan iterasi; pendekatan disesuaikan dengan kebutuhan proyek." width={1200} height={560} />
            <figcaption className="figure-caption">Alur kerja ilustratif; setiap proyek disesuaikan dengan kebutuhan.</figcaption>
          </figure>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <p className="eyebrow">Cara kami bekerja</p>
          <ol className="steps grid-3" style={{ listStyle: 'none' }}>
            <li><h3>Discovery</h3><p>Memahami konteks, kebutuhan, dan batasan proyek Anda.</p></li>
            <li><h3>Desain</h3><p>Menyusun arsitektur dan rancangan solusi bersama Anda.</p></li>
            <li><h3>Pengembangan</h3><p>Membangun perangkat lunak secara bertahap dan terukur.</p></li>
            <li><h3>Review &amp; iterasi</h3><p>Uji, iterasi &amp; perbaikan sampai solusi layak dipakai.</p></li>
          </ol>
          <p style={{ marginTop: '2rem' }}><Link href="/contact">Hubungi kami</Link> untuk memulai percakapan.</p>
        </div>
      </section>

      <section className="section section-dark">
        <div className="container" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '2rem', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ margin: 0 }}>Tertarik pada produk atau butuh solusi khusus?</h2>
            <p style={{ margin: 0 }}>Sampaikan minat produk atau kebutuhan proyek Anda melalui halaman kontak.</p>
          </div>
          <Link className="button" href="/contact" style={{ flex: 'none' }}>Buka halaman kontak</Link>
        </div>
      </section>
    </>
  );
}
