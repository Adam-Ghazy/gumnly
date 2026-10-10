import type { Metadata } from 'next';
import Link from 'next/link';
import { getBackend } from '../../src/server/runtime.ts';
import { HomeReveal, HomeNavigation, PageFooter } from '../../components/home-motion.tsx';
import '../home.css';
import '../pages.css';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Tentang' };

const approach = [
  { title: 'Strategi dulu', icon: '⌕', text: 'Memahami tujuan, audiens, dan masalah yang harus diselesaikan sebelum menulis baris kode.' },
  { title: 'Arah yang jelas', icon: '◇', text: 'Menyusun struktur dan arah solusi yang fokus, konsisten, dan mudah dijelaskan.' },
  { title: 'Eksekusi cermat', icon: '✧', text: 'Menggarap detail sampai hasil akhir layak dipakai dan siap dikembangkan lebih lanjut.' },
];
const principles = [
  { title: 'Kejelasan utama', text: 'Software yang baik membuat pekerjaan lebih mudah dipahami dan dijalankan, bukan sebaliknya.' },
  { title: 'Detail yang berguna', text: 'Setiap pilihan struktur, antarmuka, dan interaksi mendukung tujuan penggunanya.' },
  { title: 'Sistem sederhana', text: 'Struktur yang tetap berguna, lentur, dan konsisten saat produk dan bisnis tumbuh.' },
  { title: 'Eksekusi terpikir', text: 'Hasil akhir terasa rapi, disengaja, dan siap dipakai dengan percaya diri.' },
];
const tools = [
  { title: 'Desain', text: 'Antarmuka dan sistem visual yang konsisten.' },
  { title: 'Pengembangan', text: 'Web modern dengan struktur bersih dan teruji.' },
  { title: 'Otomasi', text: 'Alur kerja manual yang diringkas menjadi otomasi.' },
  { title: 'Data', text: 'Integrasi dan aliran data antar sistem.' },
];
const story = [
  'Gumnly dimulai dari keinginan sederhana: membangun software yang benar-benar dipakai, bukan sekadar di rilis.',
  'Dari sana kami belajar memetakan proses nyata, menyederhanakan yang berlebihan, dan mengembangkan produk secara bertahap bersama umpan balik pengguna.',
  'Hari ini Gumnly berfokus membangun produk SaaS sendiri dan menjalankan proyek pengembangan khusus secara selektif.',
];

export default function AboutPage() {
  const company = getBackend().company();
  return (
    <div className="gumnly-home">
      <HomeNavigation active="/about" />
      <div>
        <section className="home-container page-hero" aria-label="Pengantar tentang">
          <div className="page-hero-split">
            <div className="page-hero-copy">
              <HomeReveal delay={0.3}><span className="home-tag">Tentang kami</span></HomeReveal>
              <HomeReveal delay={0.4}><h1>{company.headline}</h1></HomeReveal>
              <HomeReveal delay={0.5} y={24}><p className="page-hero-description">{company.about}</p></HomeReveal>
              <HomeReveal delay={0.6} y={0}><div className="page-hero-actions"><Link className="home-button textured" href="/contact">Hubungi kami</Link><Link className="home-button secondary" href="/services">Lihat layanan</Link></div></HomeReveal>
            </div>
            <HomeReveal delay={0.7} y={48} className="page-hero-photo"><img src="/reference/workspace.jpg" alt="Ruang kerja pengembangan software dengan kode tampil di layar monitor" width={1100} height={1100} fetchPriority="high" /></HomeReveal>
          </div>
        </section>
        <section className="home-section home-container" aria-label="Fokus kami">
          <div className="page-stat-grid">
            <HomeReveal delay={0.05}><article className="page-stat-card"><span className="page-stat-icon" aria-hidden="true">◈</span><div><strong>Produk</strong><span>SaaS karya sendiri</span><p>Dikembangkan bertahap dari perencanaan yang fokus hingga rilis.</p></div></article></HomeReveal>
            <HomeReveal delay={0.15}><article className="page-stat-card"><span className="page-stat-icon" aria-hidden="true">✧</span><div><strong>3</strong><span>Layanan inti</span><p>Software khusus, otomasi alur kerja, dan integrasi sistem.</p></div></article></HomeReveal>
            <HomeReveal delay={0.25}><article className="page-stat-card"><span className="page-stat-icon" aria-hidden="true">↗</span><div><strong>Selektif</strong><span>Menerima proyek baru</span><p>Proyek diterima seperlunya agar tetap fokus dan hasilnya terukur.</p></div></article></HomeReveal>
          </div>
        </section>
        <section className="home-section home-container" aria-label="Pendekatan">
          <HomeReveal className="home-section-heading"><span className="home-tag">Pendekatan</span><h2>Desain lebih dari sekadar tampilan</h2><p>Alur kerja yang jelas dan kolaboratif membawa setiap proyek dari ide pertama sampai hasil akhir yang rapi.</p></HomeReveal>
          <div className="page-approach-grid">{approach.map((item, i) => <HomeReveal key={item.title} delay={i * 0.12} y={48}><article><span className="home-service-icon" aria-hidden="true">{item.icon}</span><h3>{item.title}</h3><p>{item.text}</p></article></HomeReveal>)}</div>
        </section>
        <section className="home-section home-container" aria-label="Prinsip">
          <HomeReveal className="home-section-heading"><span className="home-tag">Prinsip</span><h2>Nilai di balik cara kami bekerja</h2><p>Beberapa prinsip sederhana memandu setiap proyek, dari arah awal hingga eksekusi akhir.</p></HomeReveal>
          <div className="page-principle-grid">{principles.map((item, i) => <HomeReveal key={item.title} delay={i * 0.08} y={48}><article className="page-principle"><span className="page-principle-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span><div><h3>{item.title}</h3><p>{item.text}</p></div></article></HomeReveal>)}</div>
        </section>
        <section className="home-section home-container" aria-label="Keahlian">
          <HomeReveal className="home-section-heading"><span className="home-tag">Keahlian</span><h2>Perangkat di balik pekerjaan kami</h2><p>Bidang yang kami gunakan untuk membentuk ide, membangun sistem, dan menyiapkan hasil yang siap pakai.</p></HomeReveal>
          <div className="page-tools-grid">{tools.map((tool, i) => <HomeReveal key={tool.title} delay={i * 0.08} y={48}><article className="page-tool"><h3>{tool.title}</h3><p>{tool.text}</p><small aria-hidden="true">{String(i + 1).padStart(2, '0')}</small></article></HomeReveal>)}</div>
        </section>
        <section className="home-section home-container" aria-label="Cerita kami">
          <div className="page-story">
            <div className="page-story-side">
              <HomeReveal><div><strong>2026</strong><span>Tahun Gumnly dirintis</span></div></HomeReveal>
              <HomeReveal delay={0.1}><div><strong>SaaS</strong><span>Fokus utama produk kami</span></div></HomeReveal>
            </div>
            <div>
              <HomeReveal><h2 className="home-split-heading-h">Dari rasa ingin tahu menjadi produk</h2></HomeReveal>
              <div className="page-story-copy">{story.map((paragraph, i) => <HomeReveal key={i} delay={i * 0.1} y={24}><p>{paragraph}</p></HomeReveal>)}</div>
            </div>
          </div>
        </section>
        <section className="home-section home-container" aria-label="Ajakan kontak">
          <HomeReveal><div className="page-cta-band">
            <div><h2>Mulai percakapan</h2><p>Punya ide produk atau kebutuhan pengembangan? Ceritakan sedikit, kami balas untuk menyepakati langkah berikutnya.</p></div>
            <Link className="home-button" href="/contact">Hubungi kami <span aria-hidden="true">↗</span></Link>
          </div></HomeReveal>
        </section>
      </div>
      <PageFooter companyName={company.name} />
    </div>
  );
}
