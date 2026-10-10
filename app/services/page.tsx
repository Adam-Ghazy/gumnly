import type { Metadata } from 'next';
import Link from 'next/link';
import { getBackend } from '../../src/server/runtime.ts';
import { HomeReveal, HomeNavigation, PageFooter, ServiceTabs } from '../../components/home-motion.tsx';
import '../home.css';
import '../pages.css';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Layanan' };

const services = [
  { title: 'Software khusus', icon: '⌘', input: 'Kebutuhan proses bisnis Anda.', process: 'Discovery, desain solusi, pengembangan bertahap bersama tim Anda.', output: 'Aplikasi yang dipakai tim Anda sehari-hari.' },
  { title: 'Otomasi alur kerja', icon: '✧', input: 'Proses manual yang berulang.', process: 'Pemetaan alur, penyusunan ulang langkah, penerapan otomasi.', output: 'Alur kerja yang lebih ringkas dan terpantau.' },
  { title: 'Integrasi sistem', icon: '◇', input: 'Beberapa sistem terpisah yang datanya perlu menyatu.', process: 'Analisis antarmuka, perancangan penghubung, uji aliran data.', output: 'Data yang mengalir konsisten antar sistem.' },
];
const process = [
  { title: 'Discovery', text: 'Memahami kebutuhan dan batasan proyek Anda.' },
  { title: 'Desain', text: 'Menyusun rancangan solusi dan arsitekturnya.' },
  { title: 'Pengembangan', text: 'Membangun solusi secara bertahap.' },
  { title: 'Review & iterasi', text: 'Uji, iterasi, dan perbaikan sampai layak dipakai.' },
];

export default function ServicesPage() {
  const company = getBackend().company();
  return (
    <div className="gumnly-home">
      <HomeNavigation active="/services" />
      <div>
        <section className="home-container page-hero" aria-label="Pengantar layanan">
          <div className="page-hero-copy">
            <HomeReveal delay={0.3}><span className="home-tag">Layanan</span></HomeReveal>
            <HomeReveal delay={0.4}><h1>Pengembangan khusus, otomasi, dan integrasi</h1></HomeReveal>
            <HomeReveal delay={0.5} y={24}><p className="page-hero-description">{company.services}</p></HomeReveal>
            <HomeReveal delay={0.6} y={0}><div className="page-hero-actions"><Link className="home-button textured" href="/contact">Diskusikan proyek</Link><Link className="home-button secondary" href="/about">Tentang kami</Link></div></HomeReveal>
          </div>
        </section>
        <section className="home-section home-container" aria-label="Layanan inti">
          <HomeReveal className="home-section-heading"><span className="home-tag">Layanan inti</span><h2>Tiga cara kami membantu</h2><p>Setiap layanan berjalan dari masalah nyata menuju hasil yang bisa dipakai, bukan paket fitur generik.</p></HomeReveal>
          <div className="page-service-cards">{services.map((service, i) => <HomeReveal key={service.title} delay={i * 0.12} y={48}><article className="page-service-card">
            <span className="home-service-icon" aria-hidden="true">{service.icon}</span>
            <h3>{service.title}</h3>
            <dl><div><dt>Input</dt><dd>{service.input}</dd></div><div><dt>Proses</dt><dd>{service.process}</dd></div><div><dt>Output</dt><dd>{service.output}</dd></div></dl>
          </article></HomeReveal>)}</div>
        </section>
        <section className="home-section home-container" aria-label="Pendekatan pengerjaan">
          <HomeReveal className="home-section-heading"><span className="home-tag">Pendekatan</span><h2>Bangun produk. Kembangkan bisnis Anda.</h2><p>Berkolaborasi dengan GUMNLY untuk pengembangan SaaS, platform digital, dan layanan teknologi berkelanjutan.</p></HomeReveal>
          <ServiceTabs />
        </section>
        <section className="home-section home-container" aria-label="Alur pengerjaan">
          <HomeReveal className="home-section-heading"><span className="home-tag">Alur kerja</span><h2>Pendekatan pengerjaan yang runtut</h2><p>Setiap proyek berbeda; alur di bawah adalah kerangka, bukan paket tetap.</p></HomeReveal>
          <ol className="page-process-list">{process.map((step, i) => <li key={step.title}><HomeReveal delay={i * 0.1} y={48}><article className="page-process-item"><span className="page-principle-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span><h3>{step.title}</h3><p>{step.text}</p></article></HomeReveal></li>)}</ol>
        </section>
        <section className="home-section home-container" aria-label="Ajakan kontak">
          <HomeReveal><div className="page-cta-band">
            <div><h2>Mulai percakapan</h2><p>Ceritakan kebutuhan Anda; kami akan membalas untuk menyepakati sesi discovery.</p></div>
            <Link className="home-button" href="/contact">Diskusikan proyek Anda <span aria-hidden="true">↗</span></Link>
          </div></HomeReveal>
        </section>
      </div>
      <PageFooter companyName={company.name} />
    </div>
  );
}
