import type { Metadata } from 'next';
import { getBackend } from '../../src/server/runtime.ts';
import { HomeReveal, HomeNavigation, PageFooter } from '../../components/home-motion.tsx';
import { ContactForm } from '@/components/contact-form';
import '../home.css';
import '../pages.css';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Contact' };

export default function ContactPage() {
  const company = getBackend().company();
  return (
    <div className="gumnly-home">
      <HomeNavigation active="/contact" />
      <div>
        <section className="home-container page-hero" aria-label="Contact introduction">
          <div className="page-hero-copy">
            <HomeReveal delay={0.3}><span className="home-tag">Contact</span></HomeReveal>
            <HomeReveal delay={0.4}><h1>Let’s talk</h1></HomeReveal>
            <HomeReveal delay={0.5} y={24}><p className="page-hero-description">Ask about a product or tell us about a custom development project.</p></HomeReveal>
          </div>
        </section>
        <section className="home-section home-container" aria-label="Contact form">
          <div className="page-contact-grid">
            <HomeReveal y={48}><div className="page-contact-form"><ContactForm /></div></HomeReveal>
            <HomeReveal delay={0.15} y={48}><aside className="page-contact-aside">
              <strong>Open to selected projects</strong>
              <span>We review each enquiry for fit and capacity.</span>
              <dl>
                <div className="page-contact-row"><span className="page-contact-icon" aria-hidden="true">✉</span><div><dt>Contact</dt><dd>Use the form on this page</dd></div></div>
                <div className="page-contact-row"><span className="page-contact-icon" aria-hidden="true">◇</span><div><dt>Company</dt><dd>{company.name}</dd></div></div>
                <div className="page-contact-row"><span className="page-contact-icon" aria-hidden="true">↗</span><div><dt>Response time</dt><dd>Enquiries reviewed regularly</dd></div></div>
              </dl>
              <p style={{ fontSize: 14, color: '#b5c2bd' }}>Your enquiry is saved on our server. It is sent to an email provider only when email delivery is configured.</p>
            </aside></HomeReveal>
          </div>
        </section>
      </div>
      <PageFooter companyName={company.name} />
    </div>
  );
}
