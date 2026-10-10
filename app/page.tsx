import Link from 'next/link';
import { getBackend } from '../src/server/runtime.ts';
import { HomeReveal, HomeNavigation, Count, ServiceTabs, HomeFAQ, CapabilityTicker } from '../components/home-motion.tsx';
import './home.css';

export const dynamic = 'force-dynamic';

// Studi desain referensi — bukan proyek klien GUMNLY; provenance di docs/REFERENCE-ASSETS.md.
const examples = [['Brandora', 'brandora.jpg'], ['Nivora', 'nivora.jpg'], ['Codify', 'codify.png'], ['Neutra', 'neutra.jpg'], ['Snapkit', 'snapkit.png'], ['Todofusion', 'todofusion.jpg']];
const benefits = [
  ['Produk SaaS karya sendiri', 'Kami merancang dan mengembangkan produk digital sendiri, dari perencanaan yang fokus, antarmuka yang intuitif, hingga rilis bertahap.'],
  ['Layanan berfokus pelanggan', 'Layanan desain dan pengembangan digital yang disesuaikan dengan tantangan bisnis yang perlu Anda selesaikan.'],
  ['Rilis dan dukungan berkelanjutan', 'Dari konsep menuju peluncuran, lalu terus mengembangkan produk dengan dukungan praktis dan umpan balik pelanggan.'],
];
const steps = [
  ['Discovery', 'Kami mulai dengan memahami tujuan, audiens, kebutuhan merek, dan arah yang harus diambil proyek Anda.'],
  ['Strategi', 'Kami menentukan struktur, pesan, dan pendekatan kreatif sebelum masuk ke tahap desain visual.'],
  ['Arah', 'Arah visual yang jelas dibentuk melalui mood, gagasan layout, tipografi, dan bahasa desain keseluruhan.'],
  ['Desain', 'Layout utama, elemen merek, dan pengalaman digital dikerjakan dengan perhatian penuh pada detail.'],
  ['Pengembangan', 'Desain diubah menjadi halaman responsif dan rapi dengan interaksi halus dan struktur bersih.'],
  ['Penyerahan', 'Aset akhir, halaman, dan panduan disiapkan dengan jelas sehingga semuanya siap diluncurkan.'],
];
const expertise = [
  ['Biaya terjangkau', 'Ruang lingkup yang fokus dan prioritas yang jelas menjaga pengembangan tetap praktis.'],
  ['Konsistensi', 'Sistem visual yang konsisten di seluruh produk dan titik sentuh Anda.'],
  ['Skalabilitas', 'Sistem yang dirancang mengikuti kebutuhan produk dan bisnis yang terus tumbuh.'],
  ['Kecepatan', 'Rilis kecil dan terfokus membantu mengubah ide menjadi software yang berfungsi, dengan ruang untuk terus belajar dan membaik.'],
  ['Fleksibilitas', 'Sesuaikan ruang lingkup dengan kebutuhan produk dan tim Anda.'],
  ['Lintas disiplin', 'Product thinking, desain, dan rekayasa bekerja sama menyelesaikan masalah yang sama.'],
  ['Dukungan', 'Komunikasi dan umpan balik yang jelas selama ruang lingkup proyek yang disepakati.'],
  ['Kemudahan', 'Alur kerja yang lugas, dari percakapan pertama hingga penyerahan.'],
];
const faqs = [
  { q: 'Bagaimana cara mengajukan permintaan proyek?', a: 'Gunakan form di halaman kontak untuk menceritakan tujuan, alur kerja saat ini, dan masalah yang ingin Anda selesaikan. Kami meninjau setiap permintaan sebelum menyepakati ruang lingkup.' },
  { q: 'Bagaimana proses onboarding berjalan?', a: 'Kami memulai dari discovery, memperjelas ruang lingkup dan batasan, lalu menyepakati langkah berikutnya bersama.' },
  { q: 'Berapa lama pengerjaan proyek?', a: 'Durasi bergantung pada ruang lingkup, kompleksitas, dan umpan balik. Kami mendiskusikan jadwal yang realistis setelah discovery, bukan menjanjikan waktu tetap.' },
  { q: 'Apakah bekerja sama dengan tim kami?', a: 'Ya. Kolaborasi dan review berkala membantu kami memahami cara kerja tim Anda yang sebenarnya.' },
  { q: 'Produk apa yang sedang dibangun?', a: 'Produk SaaS kami sedang dikembangkan. Kunjungi halaman Produk untuk deskripsi dan status terkini.' },
  { q: 'Bisakah mengajukan proyek sekali jalan?', a: 'Kami menerima proyek software khusus, otomasi, dan integrasi terpilih bila sesuai fokus dan kapasitas kami.' },
  { q: 'Tools apa yang digunakan?', a: 'Kami memilih tools berdasarkan kebutuhan, sistem yang sudah ada, dan kebutuhan pemeliharaan jangka panjang setiap proyek.' },
  { q: 'Bagaimana kesepakatan harga dan dukungan?', a: 'Ruang lingkup, harga, penyerahan, dan dukungan didiskusikan satu per satu sebelum pekerjaan dimulai.' },
];

function SectionHeading({ label, title, description }: { label?: string; title: string; description: string }) {
  return <HomeReveal className="home-section-heading">{label && <span className="home-tag">{label}</span>}<h2>{title}</h2><p>{description}</p></HomeReveal>;
}

function BenefitArt({ index }: { index: number }) {
  return <div className={`home-benefit-art art-${index}`} aria-hidden="true">{index === 0 ? <div className="home-ui-kit"><div className="home-kit-tools">⌘　⌕　↗　▣　✧　◇</div>{['Utama', 'Sekunder', 'Outline', 'Polos'].map((text, i) => <div key={text}><span className={`kit-button kit-${i}`}>{text}</span><span className={`kit-button kit-${i}`}>{text}</span></div>)}</div> : index === 1 ? <div className="home-chart"><small>Ringkasan produk · studi antarmuka</small><svg viewBox="0 0 360 160"><path d="M0 125 L40 95 L80 110 L120 50 L160 70 L200 30 L240 60 L280 20 L320 30 L360 0" fill="none" stroke="currentColor" strokeWidth="3"/><path d="M0 150 L40 135 L80 140 L120 95 L160 105 L200 75 L240 90 L280 55 L320 70 L360 40" fill="none" stroke="currentColor" strokeWidth="2" opacity=".4"/></svg><div><span>Tren penggunaan</span><span>Wawasan produk</span></div></div> : <div className="home-launch-ui"><span className="home-notice">✓ Siap untuk langkah berikutnya</span><div><small>DALAM PENGEMBANGAN</small><strong>Produk Gumnly</strong><p>Bangun. Belajar. Tingkatkan.</p><div className="home-mini-previews"><img src="/reference/codify.png" alt=""/><img src="/reference/todofusion.jpg" alt=""/></div></div></div>}</div>;
}

export default async function HomePage() {
  const company = getBackend().company();
  const products = getBackend().products();
  const headline = company.headline;
  const description = company.description;
  return <div className="gumnly-home">
    <HomeNavigation />
    <section className="home-hero home-container" aria-label="Pengantar">
      <div className="home-hero-panel">
        <div className="home-hero-copy">
          <HomeReveal delay={0.4}><h1>{headline}</h1></HomeReveal>
          <HomeReveal delay={0.5} y={24}><p className="home-hero-description">{description}</p></HomeReveal>
          <HomeReveal delay={0.6} y={0}><div className="home-actions"><Link className="home-button textured" href="#selected-work">Lihat karya</Link><Link className="home-button secondary" href="/contact">Hubungi kami</Link></div></HomeReveal>
          <HomeReveal delay={0.9} y={48}><dl className="home-stats"><div><dt><Count value={products.length}/></dt><dd>Produk SaaS dikembangkan</dd></div><div><dt><Count value={3}/></dt><dd>Layanan inti</dd></div><div><dt><Count value={6}/></dt><dd>Tahap proses</dd></div></dl></HomeReveal>
        </div>
        <div className="home-hero-photo"><img src="/reference/workspace.jpg" alt="Ruang kerja pengembangan software dengan kode tampil di layar monitor" width={1100} height={1650} fetchPriority="high" /></div>
        <HomeReveal className="home-availability" delay={0.8} x={-24} y={24}><Link href="/contact"><div><small>Pilih layanan</small><strong>Terima proyek baru</strong><p>Ceritakan bisnis dan tantangan<br/>yang ingin Anda selesaikan.</p></div><span aria-hidden="true">↗</span></Link></HomeReveal>
      </div>
      <CapabilityTicker />
    </section>
    <section className="home-section home-container home-benefits">
      <SectionHeading label="Keunggulan" title="Kenapa kami berbeda" description="GUMNLY menggabungkan cara berpikir yang jernih, desain yang cermat, dan teknologi untuk membantu bisnis menciptakan pengalaman digital yang lebih baik."/>
      <div className="home-benefit-grid">{benefits.map(([title, text], i) => <HomeReveal key={title} delay={i * 0.12} y={96}><article className="home-benefit-card"><BenefitArt index={i}/><div className="home-benefit-copy"><h3>{title}</h3><p>{text}</p></div></article></HomeReveal>)}</div>
    </section>
    <section id="selected-work" className="home-section home-container home-projects">
      <SectionHeading label="Studi desain" title="Membangun produk digital yang berguna" description="Galeri studi desain referensi — bukan proyek klien GUMNLY yang telah selesai. Produk SaaS kami sendiri masih dalam pengembangan."/>
      <div className="home-project-grid">{examples.map(([name, image], i) => <HomeReveal key={name} delay={i % 2 * 0.1}><a className="home-project" href={`/reference/${image}`} aria-label={`Lihat studi desain referensi ${name}`}><div className="home-project-image"><img src={`/reference/${image}`} alt={`${name} — studi desain referensi, bukan proyek klien GUMNLY`} loading="lazy" width={1600} height={1200}/></div><div className="home-project-label"><span className="home-project-name"><span>{name}</span><span aria-hidden="true">{name}</span></span><span aria-hidden="true">↗</span></div></a></HomeReveal>)}</div>
      <div className="home-product-status"><Link href="/products">Produk GUMNLY dalam pengembangan ↗</Link>{products.length === 0 ? <p>Belum ada produk yang dapat ditampilkan.</p> : products.map(product => <p key={product.id}><strong>{product.name ?? 'Produk SaaS pertama'}</strong> — {product.description}</p>)}</div>
    </section>
    <section className="home-section home-container home-proof">
      <div className="home-split-heading"><HomeReveal><span className="home-tag">Kenapa GUMNLY</span><h2>Startup yang dibangun untuk menyelesaikan masalah nyata</h2></HomeReveal><HomeReveal delay={0.1}><p>Kami menggabungkan product thinking, pengembangan software, dan layanan berfokus pelanggan untuk mengubah ide yang berguna menjadi solusi digital yang dapat diandalkan.</p></HomeReveal></div>
      <div className="home-proof-grid"><div className="home-proof-column"><HomeReveal><div className="home-proof-strip"><span aria-hidden="true">◉ ◈ ◇</span>Produk · Desain · Rekayasa</div></HomeReveal><HomeReveal><article className="home-proof-card"><p>Arah desain yang jelas, dibentuk mengikuti tujuan setiap proyek.</p><strong><Count value={6}/></strong><span>Tahap proses kolaboratif</span></article></HomeReveal></div><div className="home-proof-column"><HomeReveal><article className="home-proof-card"><p>Pengembangan software, otomasi, dan integrasi sistem.</p><strong><Count value={3}/></strong><span>Area layanan inti</span></article></HomeReveal><HomeReveal><Link className="home-proof-strip" href="/contact"><i/>Terima proyek baru</Link></HomeReveal></div><HomeReveal className="home-proof-dark"><article><p>Dari produk SaaS baru hingga layanan yang disesuaikan, kami berfokus pada solusi praktis yang membuat pekerjaan sehari-hari lebih sederhana.</p><div><strong>SaaS</strong><span>Produk dalam pengembangan<br/>Dibangun dengan fokus jangka panjang</span></div></article></HomeReveal></div>
    </section>
    <section className="home-section home-container home-services"><SectionHeading title="Bangun produk. Kembangkan bisnis Anda." description="Berkolaborasi dengan GUMNLY untuk pengembangan SaaS, platform digital, dan layanan teknologi berkelanjutan yang dirancang di sekitar pelanggan Anda."/><ServiceTabs/></section>
    <section className="home-section home-container home-process"><div className="home-process-heading"><SectionHeading label="Proses" title="Alur proses yang jelas dan runtut" description="Alur kerja yang jelas dan kolaboratif, membawa setiap proyek dari ide pertama hingga hasil akhir yang rapi."/></div><ol className="home-timeline">{steps.map(([title, text], i) => <li key={title}><HomeReveal y={48}><article><span className="home-step-icon" aria-hidden="true">{['⌕', '◇', '✧', '▧', '⌘', '↗'][i]}</span><div><h3>{title}</h3><p>{text}</p></div></article></HomeReveal></li>)}</ol></section>
    <section className="home-section home-container home-expertise"><SectionHeading label="Keahlian" title="Dari ide pertama hingga nilai bagi pelanggan" description="Validasi konsep Anda, luncurkan produk yang terfokus, lalu kembangkan bersama umpan balik pelanggan dan dukungan berkelanjutan."/><div className="home-expertise-grid">{expertise.map(([title, text], i) => <HomeReveal className={`expertise-cell expertise-${i}`} key={title} delay={i % 4 * 0.08} y={96}><article><span className="home-expertise-icon" aria-hidden="true">{['◇', '◫', '↗', 'ϟ', '✧', '◈', '♧', '⌘'][i]}</span><div><h3>{title}</h3><p>{text}</p></div></article></HomeReveal>)}</div></section>
    <section className="home-section home-container home-faq"><SectionHeading title="Jelajahi FAQ kami" description="Jawaban atas pertanyaan seputar proses, harga, timeline, dan detail proyek"/><HomeFAQ items={faqs}/></section>
    <footer className="home-footer home-container"><div className="home-footer-panel"><div className="home-footer-top"><div><Link className="home-logo" href="/"><span aria-hidden="true">g.</span>Gumnly</Link><p>Gumnly adalah startup teknologi yang membangun produk SaaS dan menghadirkan layanan digital berfokus pelanggan.</p></div><div><strong>Halaman</strong><Link href="/">Beranda</Link><Link href="/about">Tentang</Link><Link href="/products">Produk</Link><Link href="/services">Layanan</Link><Link href="/contact">Kontak</Link></div><div><strong>Informasi</strong><Link href="/privacy">Privasi</Link><a href="#selected-work">Studi desain</a><Link href="/contact">Hubungi kami</Link></div></div><p className="home-footer-wordmark">Gumnly.</p><div className="home-footer-bottom">© {company.name}. Semua hak dilindungi.</div></div></footer>
    <Link className="home-floating-contact" href="/contact">Kontak Gumnly</Link>
  </div>;
}
