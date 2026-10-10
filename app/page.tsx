import Link from 'next/link';
import { getBackend } from '../src/server/runtime.ts';
import { Reveal, TiltCard } from '../components/motion.tsx';

export const dynamic = 'force-dynamic';

const BENEFITS = [
  {
    title: 'Produk SaaS karya sendiri',
    body: 'Tim kami merancang dan mengembangkan produk digital sendiri, dari konsep hingga rilis bertahap.',
  },
  {
    title: 'Pengembangan khusus selektif',
    body: 'Proyek yang kami ambil dipilih agar setiap kerja sama tetap fokus dan hasilnya terukur.',
  },
  {
    title: 'Otomasi & integrasi sistem',
    body: 'Proses manual disusun ulang dan sistem terpisah dihubungkan agar data mengalir konsisten.',
  },
];

const SERVICES = [
  {
    title: 'Software khusus',
    body: 'Aplikasi yang dibangun mengikuti proses bisnis Anda: discovery, desain solusi, pengembangan bertahap bersama tim Anda.',
  },
  {
    title: 'Otomasi alur kerja',
    body: 'Proses manual yang berulang dipetakan, disusun ulang, lalu diotomasi menjadi alur yang ringkas dan terpantau.',
  },
  {
    title: 'Integrasi sistem',
    body: 'Sistem terpisah dihubungkan dengan penghubung yang dirancang dan diuji agar data mengalir konsisten.',
  },
];

const PROCESS = [
  { title: 'Discovery', body: 'Memahami konteks, kebutuhan, dan batasan proyek Anda.' },
  { title: 'Desain', body: 'Menyusun arsitektur dan rancangan solusi bersama Anda.' },
  { title: 'Pengembangan', body: 'Membangun perangkat lunak secara bertahap dan terukur.' },
  { title: 'Review & iterasi', body: 'Uji, iterasi, dan perbaikan sampai solusi layak dipakai.' },
];

const FAQS = [
  {
    q: 'Produk apa yang sedang GUMNLY bangun?',
    a: 'Kami sedang mengembangkan produk SaaS secara bertahap dan jujur soal statusnya. Daftar produk beserta status terkininya selalu tersedia di halaman Produk.',
  },
  {
    q: 'Apakah GUMNLY menerima proyek pengembangan khusus?',
    a: 'Ya, secara selektif. Kami memulai dari sesi discovery untuk memahami kebutuhan Anda, lalu menawarkan solusi bila cocok dengan kapasitas dan fokus kami.',
  },
  {
    q: 'Bagaimana alur kerja samanya?',
    a: 'Discovery, desain solusi, pengembangan bertahap, lalu review dan iterasi sampai solusi layak dipakai sehari-hari oleh tim Anda.',
  },
  {
    q: 'Bagaimana cara menghubungi GUMNLY?',
    a: 'Gunakan form di halaman kontak. Pesan Anda tersimpan dengan aman dan dibaca tim kami; balasan dikirim ke email yang Anda cantumkan.',
  },
];

export default async function HomePage() {
  const company = getBackend().company();
  const products = getBackend().products();

  const stats = [
    { value: String(products.length), label: 'Produk SaaS dibangun sendiri' },
    { value: 'Selektif', label: 'Proyek khusus yang kami terima' },
    { value: '3', label: 'Fokus layanan inti' },
  ];

  return (
    <>
      {/* Hero — dua kolom: konten kiri, kartu gelap kanan */}
      <section className="hero-v2">
        <div className="container">
          <div className="hero-v2-grid">
            <div className="hero-v2-lead">
              <Reveal><p className="eyebrow">SaaS Products &amp; Software Engineering</p></Reveal>
              <Reveal delay={0.06}><h1 className="hero-title">{company.headline}</h1></Reveal>
              <Reveal delay={0.12}><p className="lede">{company.description}</p></Reveal>
              <Reveal delay={0.18}>
                <div className="hero-actions">
                  <Link className="button" href="/products">Jelajahi produk</Link>
                  <Link className="button button-secondary" href="/services">Lihat layanan</Link>
                </div>
              </Reveal>
              <Reveal delay={0.24}>
                <ul className="hero-stats">
                  {stats.map(s => (
                    <li key={s.label}>
                      <span className="hero-stats-value">{s.value}</span>
                      <span className="hero-stats-label">{s.label}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
            <Reveal delay={0.15} className="hero-v2-side">
              <TiltCard className="hero-card">
                <div className="hero-card-head">
                  <p className="hero-card-eyebrow">Cara kami bekerja</p>
                  <h2>Dibangun bertahap, diukur, jujur soal status</h2>
                  <p>Setiap produk dan proyek dikerjakan dengan alur yang sama: dipahami dulu, dirancang, dibangun, lalu diiterasi.</p>
                </div>
                <figure className="hero-card-visual">
                  <img src="/brand/hero.png" alt="Ilustrasi konseptual produk SaaS yang terhubung dengan otomasi dan integrasi." width={1000} height={900} />
                </figure>
                <Link className="hero-card-cta" href="/about">Kenali tim &amp; cara kerja kami <span aria-hidden="true">→</span></Link>
              </TiltCard>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Benefits — kenapa GUMNLY */}
      <section className="section">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <p className="eyebrow">Kenapa GUMNLY</p>
              <h2>Fokus pada hasil yang terstruktur dan terukur</h2>
              <p className="lede">Tiga hal yang menjadi dasar setiap keputusan kami, baik untuk produk sendiri maupun proyek klien.</p>
            </div>
          </Reveal>
          <div className="grid grid-3">
            {BENEFITS.map((b, i) => (
              <Reveal key={b.title} delay={i * 0.08}>
                <article className="benefit-card">
                  <span className="benefit-dot" aria-hidden="true" />
                  <h3>{b.title}</h3>
                  <p>{b.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Projects → Produk */}
      <section className="section">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <p className="eyebrow">Produk</p>
              <h2>Produk yang sedang kami bangun</h2>
              <p className="lede">Kami mengembangkan produk SaaS secara bertahap dan jujur soal statusnya.</p>
            </div>
          </Reveal>
          {products.length === 0 ? (
            <Reveal><p>Belum ada produk yang dapat ditampilkan. Kunjungi kembali nanti untuk kabar perkembangan.</p></Reveal>
          ) : (
            <div className="grid grid-3">
              {products.map((product, i) => (
                <Reveal key={product.id} delay={i * 0.08}>
                  <TiltCard className="product-card" maxTilt={5} maxMove={8}>
                    <span className="status-badge">Sedang dikembangkan</span>
                    <h3>{product.name ?? 'Nama produk menyusul'}</h3>
                    <p>{product.description}</p>
                  </TiltCard>
                </Reveal>
              ))}
            </div>
          )}
          <Reveal><p className="section-more"><Link href="/products">Lihat detail produk →</Link></p></Reveal>
        </div>
      </section>

      {/* Why choose me → proyek khusus */}
      <section className="section">
        <div className="container split">
          <Reveal>
            <p className="eyebrow">Proyek khusus</p>
            <h2>Butuh software yang menyesuaikan cara kerja tim Anda?</h2>
            <p className="lede">Kami menerima proyek pengembangan khusus secara selektif, dimulai dari sesi discovery untuk memahami kebutuhan Anda sebelum menawarkan solusi.</p>
            <Link className="button" href="/contact">Diskusikan proyek Anda</Link>
          </Reveal>
          <Reveal delay={0.12}>
            <figure className="figure-full">
              <img src="/brand/workflow.png" alt="Discovery, desain, pengembangan, lalu review dan iterasi; pendekatan disesuaikan dengan kebutuhan proyek." width={1200} height={560} />
              <figcaption className="figure-caption">Alur kerja ilustratif; setiap proyek disesuaikan dengan kebutuhan.</figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      {/* Services — baris layanan interaktif */}
      <section className="section">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <p className="eyebrow">Layanan</p>
              <h2>Rekayasa produk, otomasi, dan integrasi</h2>
              <p className="lede">Kami membangun produk SaaS sendiri sebagai inti bisnis, dan menerima proyek pengembangan software khusus yang terpilih.</p>
            </div>
          </Reveal>
          <ul className="service-rows">
            {SERVICES.map((s, i) => (
              <li key={s.title}>
                <Reveal delay={i * 0.06}>
                  <Link href="/services" className="service-row">
                    <span className="service-row-index" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                    <span className="service-row-body">
                      <span className="service-row-title">{s.title}</span>
                      <span className="service-row-desc">{s.body}</span>
                    </span>
                    <span className="service-row-arrow" aria-hidden="true">→</span>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Process */}
      <section className="section">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <p className="eyebrow">Proses</p>
              <h2>Cara kami bekerja</h2>
              <p className="lede">Satu kerangka kerja sama untuk produk maupun proyek klien, disesuaikan dengan kebutuhan masing-masing.</p>
            </div>
          </Reveal>
          <ol className="steps grid grid-4">
            {PROCESS.map((p, i) => (
              <li key={p.title}>
                <Reveal delay={i * 0.08}>
                  <h3>{p.title}</h3>
                  <p>{p.body}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* FAQs */}
      <section className="section">
        <div className="container faq-wrap">
          <Reveal>
            <div className="section-head">
              <p className="eyebrow">FAQ</p>
              <h2>Pertanyaan yang sering diajukan</h2>
            </div>
          </Reveal>
          <div className="faq-list">
            {FAQS.map((f, i) => (
              <Reveal key={f.q} delay={i * 0.05}>
                <details className="faq-item">
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="section section-dark">
        <div className="container cta-band">
          <Reveal>
            <h2>Tertarik pada produk atau butuh solusi khusus?</h2>
            <p className="lede">Sampaikan minat produk atau kebutuhan proyek Anda melalui halaman kontak.</p>
            <Link className="button" href="/contact">Buka halaman kontak</Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
