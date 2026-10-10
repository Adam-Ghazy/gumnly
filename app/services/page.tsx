import type { Metadata } from 'next';
import Link from 'next/link';
import { getBackend } from '../../src/server/runtime.ts';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Layanan' };

export default function ServicesPage() {
  const company = getBackend().company();
  return (
    <>
      <section className="page-head">
        <div className="container">
          <h1 style={{ maxWidth: '20ch' }}>Pengembangan khusus, otomasi, dan integrasi</h1>
          <p className="lede">{company.services}</p>
          <p style={{ marginTop: '1.25rem', marginBottom: 0 }}>Kami menerima proyek secara selektif agar setiap kerja sama tetap fokus dan hasilnya terukur.</p>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 'clamp(2.5rem, 6vw, 4rem)' }}>
        <div className="container">
          <div className="grid grid-3">
            <article className="col-rule">
              <h2 style={{ fontSize: '1.45rem' }}>Software khusus</h2>
              <p><strong>Input:</strong> kebutuhan proses bisnis Anda.</p>
              <p><strong>Proses:</strong> discovery, desain solusi, pengembangan bertahap bersama tim Anda.</p>
              <p><strong>Output:</strong> aplikasi yang dipakai tim Anda sehari-hari.</p>
            </article>
            <article className="col-rule">
              <h2 style={{ fontSize: '1.45rem' }}>Otomasi alur kerja</h2>
              <p><strong>Input:</strong> proses manual yang berulang.</p>
              <p><strong>Proses:</strong> pemetaan alur, penyusunan ulang langkah, penerapan otomasi.</p>
              <p><strong>Output:</strong> alur kerja yang lebih ringkas dan terpantau.</p>
            </article>
            <article className="col-rule">
              <h2 style={{ fontSize: '1.45rem' }}>Integrasi sistem</h2>
              <p><strong>Input:</strong> beberapa sistem terpisah yang data-nya perlu menyatu.</p>
              <p><strong>Proses:</strong> analisis antarmuka, perancangan penghubung, uji aliran data.</p>
              <p><strong>Output:</strong> data yang mengalir konsisten antar sistem.</p>
            </article>
          </div>
        </div>
      </section>
      <section className="section section-dark">
        <div className="container split-wide">
          <figure className="figure-full">
            <img src="/brand/workflow.png" alt="Discovery, desain, pengembangan, lalu review dan iterasi; pendekatan disesuaikan dengan kebutuhan proyek." width={1200} height={560} />
            <figcaption className="figure-caption">Discovery, desain, pengembangan, lalu review &amp; iterasi.</figcaption>
          </figure>
          <div>
            <h2>Pendekatan pengerjaan</h2>
            <ol className="steps">
              <li><h3>Discovery</h3><p>Memahami kebutuhan dan batasan proyek Anda.</p></li>
              <li><h3>Desain</h3><p>Menyusun rancangan solusi dan arsitekturnya.</p></li>
              <li><h3>Pengembangan</h3><p>Membangun solusi secara bertahap.</p></li>
              <li><h3>Review &amp; iterasi</h3><p>Uji, iterasi &amp; perbaikan sampai layak dipakai.</p></li>
            </ol>
            <p style={{ marginTop: '1.5rem', marginBottom: 0 }}>Setiap proyek berbeda; alur di atas adalah kerangka, bukan paket tetap.</p>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container cta-band">
          <h2>Mulai percakapan</h2>
          <p className="lede">Ceritakan kebutuhan Anda; kami akan membalas untuk menyepakati sesi discovery.</p>
          <Link className="button" href="/contact">Diskusikan proyek Anda</Link>
        </div>
      </section>
    </>
  );
}
