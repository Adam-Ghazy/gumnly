import type { Metadata } from 'next';
import Link from 'next/link';
import { getBackend } from '../../src/server/runtime.ts';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Layanan' };

export default function ServicesPage() {
  const company = getBackend().company();
  return (
    <>
      <section className="section">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Layanan</p>
            <h1>Pengembangan khusus, otomasi, dan integrasi</h1>
            <p className="lede">{company.services}</p>
            <p>Kami menerima proyek secara selektif agar setiap kerja sama tetap fokus dan hasilnya terukur.</p>
          </div>
          <div className="grid grid-3">
            <article className="card">
              <h2>Software khusus</h2>
              <p><strong>Input:</strong> kebutuhan proses bisnis Anda.</p>
              <p><strong>Proses:</strong> discovery, desain solusi, pengembangan bertahap bersama tim Anda.</p>
              <p><strong>Output:</strong> aplikasi yang dipakai tim Anda sehari-hari.</p>
            </article>
            <article className="card">
              <h2>Otomasi alur kerja</h2>
              <p><strong>Input:</strong> proses manual yang berulang.</p>
              <p><strong>Proses:</strong> pemetaan alur, penyusunan ulang langkah, penerapan otomasi.</p>
              <p><strong>Output:</strong> alur kerja yang lebih ringkas dan terpantau.</p>
            </article>
            <article className="card">
              <h2>Integrasi sistem</h2>
              <p><strong>Input:</strong> beberapa sistem terpisah yang data-nya perlu menyatu.</p>
              <p><strong>Proses:</strong> analisis antarmuka, perancangan penghubung, uji aliran data.</p>
              <p><strong>Output:</strong> data yang mengalir konsisten antar sistem.</p>
            </article>
          </div>
        </div>
      </section>
      <section className="section section-dark">
        <div className="container grid grid-2" style={{ alignItems: 'center' }}>
          <figure className="figure-full" style={{ margin: 0 }}>
            <img src="/brand/workflow.png" alt="Discovery, desain, pengembangan, lalu review dan iterasi; pendekatan disesuaikan dengan kebutuhan proyek." width={1200} height={560} />
            <figcaption className="figure-caption">Discovery — Desain — Pengembangan — Review &amp; iterasi.</figcaption>
          </figure>
          <div>
            <h2>Pendekatan pengerjaan</h2>
            <ol className="steps" style={{ color: 'inherit' }}>
              <li><h3 style={{ color: 'inherit' }}>Discovery</h3><p>Memahami kebutuhan dan batasan proyek Anda.</p></li>
              <li><h3 style={{ color: 'inherit' }}>Desain</h3><p>Menyusun rancangan solusi dan arsitekturnya.</p></li>
              <li><h3 style={{ color: 'inherit' }}>Pengembangan</h3><p>Membangun solusi secara bertahap.</p></li>
              <li><h3 style={{ color: 'inherit' }}>Review &amp; iterasi</h3><p>Uji, iterasi &amp; perbaikan sampai layak dipakai.</p></li>
            </ol>
            <p style={{ marginTop: '1.5rem' }}>Setiap proyek berbeda; alur di atas adalah kerangka, bukan paket tetap.</p>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <h2>Mulai percakapan</h2>
          <p>Ceritakan kebutuhan Anda; kami akan membalas untuk menyepakati sesi discovery.</p>
          <Link className="button" href="/contact">Diskusikan proyek Anda</Link>
        </div>
      </section>
    </>
  );
}
