import type { Metadata } from 'next';
import { getBackend } from '../../src/server/runtime.ts';
import { HomeReveal, HomeNavigation, PageFooter } from '../../components/home-motion.tsx';
import { ContactForm } from '@/components/contact-form';
import '../home.css';
import '../pages.css';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Kontak' };

export default function ContactPage() {
  const company = getBackend().company();
  return (
    <div className="gumnly-home">
      <HomeNavigation active="/contact" />
      <div>
        <section className="home-container page-hero" aria-label="Pengantar kontak">
          <div className="page-hero-copy">
            <HomeReveal delay={0.3}><span className="home-tag">Kontak</span></HomeReveal>
            <HomeReveal delay={0.4}><h1>Mari berdiskusi</h1></HomeReveal>
            <HomeReveal delay={0.5} y={24}><p className="page-hero-description">Silakan pilih jalur yang sesuai: minat pada produk kami, atau kebutuhan proyek pengembangan khusus.</p></HomeReveal>
          </div>
        </section>
        <section className="home-section home-container" aria-label="Formulir kontak">
          <div className="page-contact-grid">
            <HomeReveal y={48}><div className="page-contact-form"><ContactForm /></div></HomeReveal>
            <HomeReveal delay={0.15} y={48}><aside className="page-contact-aside">
              <strong>Menerima proyek terpilih</strong>
              <span>Proyek diterima seperlunya agar tetap fokus.</span>
              <dl>
                <div className="page-contact-row"><span className="page-contact-icon" aria-hidden="true">✉</span><div><dt>Kontak</dt><dd>Formulir di halaman ini</dd></div></div>
                <div className="page-contact-row"><span className="page-contact-icon" aria-hidden="true">◇</span><div><dt>Perusahaan</dt><dd>{company.name}</dd></div></div>
                <div className="page-contact-row"><span className="page-contact-icon" aria-hidden="true">↗</span><div><dt>Waktu respons</dt><dd>Ditinjau secara berkala</dd></div></div>
              </dl>
              <p style={{ fontSize: 14, color: '#b5c2bd' }}>Pertanyaan Anda disimpan di server GUMNLY dan diteruskan ke penyedia email hanya jika pengiriman email dikonfigurasi. Kanal resmi lain akan ditambahkan setelah diverifikasi.</p>
            </aside></HomeReveal>
          </div>
        </section>
      </div>
      <PageFooter companyName={company.name} />
    </div>
  );
}
