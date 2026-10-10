import Link from 'next/link';
import { getBackend } from '../src/server/runtime.ts';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const company = getBackend().company();
  const products = getBackend().products();
  return (
    <>
      <section className="hero">
        <div className="container">
          <h1 className="hero-title">{company.headline}</h1>
          <div className="hero-grid">
            <div className="hero-copy">
              <p className="lede">{company.description}</p>
              <div className="hero-actions">
                <Link className="button" href="/products">Jelajahi produk</Link>
                <Link className="button button-secondary" href="/services">Lihat layanan</Link>
              </div>
            </div>
            <figure className="hero-visual">
              <img src="/brand/hero.png" alt="Ilustrasi konseptual produk SaaS yang terhubung dengan otomasi dan integrasi." width={1000} height={900} />
            </figure>
          </div>
          <ul className="hero-meta">
            <li>Produk SaaS karya sendiri</li>
            <li>Pengembangan khusus selektif</li>
            <li>Otomasi &amp; integrasi sistem</li>
          </ul>
        </div>
      </section>

      <section className="section section-dark">
        <div className="container split">
          <div className="section-head" style={{ marginBottom: 0 }}>
            <h2>Produk yang sedang kami bangun</h2>
            <p className="lede">Kami mengembangkan produk SaaS secara bertahap dan jujur soal statusnya.</p>
          </div>
          <div>
            {products.length === 0 ? (
              <p>Belum ada produk yang dapat ditampilkan. Kunjungi kembali nanti untuk kabar perkembangan.</p>
            ) : (
              <ul className="rule-list">
                {products.map(product => (
                  <li key={product.id}>
                    <h3>{product.name ?? 'Nama produk menyusul'}</h3>
                    <p>{product.description}</p>
                    <p className="status-badge" style={{ marginTop: '1.1rem', marginBottom: 0 }}>Sedang dikembangkan</p>
                  </li>
                ))}
              </ul>
            )}
            <p style={{ marginTop: '2.25rem', marginBottom: 0 }}><Link href="/products">Lihat detail produk</Link></p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>Rekayasa produk, otomasi, dan integrasi</h2>
            <p className="lede">Kami membangun produk SaaS sendiri sebagai inti bisnis, dan menerima proyek pengembangan software khusus, otomasi alur kerja, serta integrasi sistem yang terpilih.</p>
          </div>
          <div className="grid grid-3">
            <article className="col-rule"><h3>Produk SaaS</h3><p>Tim kami merancang dan mengembangkan produk digital sendiri, dari konsep hingga rilis bertahap.</p></article>
            <article className="col-rule"><h3>Otomasi alur kerja</h3><p>Proses manual yang berulang kami susun ulang menjadi alur yang terstruktur dan dapat dipantau.</p></article>
            <article className="col-rule"><h3>Integrasi sistem</h3><p>Sistem yang terpisah kami hubungkan agar data mengalir konsisten antar alat yang sudah Anda pakai.</p></article>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <div>
            <h2>Butuh software yang menyesuaikan cara kerja tim Anda?</h2>
            <p className="lede">Kami menerima proyek pengembangan khusus secara selektif, dimulai dari sesi discovery untuk memahami kebutuhan Anda sebelum menawarkan solusi.</p>
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
          <div className="section-head">
            <h2>Cara kami bekerja</h2>
            <p className="lede">Satu kerangka kerja sama untuk produk maupun proyek klien, disesuaikan dengan kebutuhan masing-masing.</p>
          </div>
          <ol className="steps grid grid-4">
            <li><h3>Discovery</h3><p>Memahami konteks, kebutuhan, dan batasan proyek Anda.</p></li>
            <li><h3>Desain</h3><p>Menyusun arsitektur dan rancangan solusi bersama Anda.</p></li>
            <li><h3>Pengembangan</h3><p>Membangun perangkat lunak secara bertahap dan terukur.</p></li>
            <li><h3>Review &amp; iterasi</h3><p>Uji, iterasi &amp; perbaikan sampai solusi layak dipakai.</p></li>
          </ol>
        </div>
      </section>

      <section className="section section-dark">
        <div className="container cta-band">
          <h2>Tertarik pada produk atau butuh solusi khusus?</h2>
          <p className="lede">Sampaikan minat produk atau kebutuhan proyek Anda melalui halaman kontak.</p>
          <Link className="button" href="/contact">Buka halaman kontak</Link>
        </div>
      </section>
    </>
  );
}
