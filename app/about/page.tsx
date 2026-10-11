import { publicCopy } from '../../src/public-copy.ts';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getBackend } from '../../src/server/runtime.ts';
import { HomeReveal, HomeNavigation, PageFooter } from '../../components/home-motion.tsx';
import '../home.css';
import '../pages.css';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'About' };

const approach = [
  { title: 'Strategy first', icon: '⌕', text: 'Understand the goals, audience, and problem before writing code.' },
  { title: 'A clear direction', icon: '◇', text: 'Agree on a focused structure and a direction everyone can follow.' },
  { title: 'Careful execution', icon: '✧', text: 'Work through the details until the result is ready to use and maintain.' },
];
const principles = [
  { title: 'Clarity first', text: 'Good software makes work easier to understand and carry out.' },
  { title: 'Useful details', text: 'Structure, screens, and interactions should serve the people using them.' },
  { title: 'Simple systems', text: 'Keep the structure useful and consistent as the product grows.' },
  { title: 'Thoughtful delivery', text: 'Test the work and prepare it for everyday use.' },
];
const tools = [
  { title: 'Design', text: 'Interfaces and shared visual systems.' },
  { title: 'Development', text: 'Web applications with tested, maintainable code.' },
  { title: 'Automation', text: 'Automation for repetitive manual work.' },
  { title: 'Data', text: 'Integrations and data flows between systems.' },
];
const story = [
  'Gumnly focuses on building software for everyday work.',
  'We map the existing process, identify what can be simpler, and develop the product in stages.',
  'We develop our own SaaS products and take on selected custom software projects.',
];

export default function AboutPage() {
  const company = getBackend().company();
  return (
    <div className="gumnly-home">
      <HomeNavigation active="/about" />
      <div>
        <section className="home-container page-hero" aria-label="About introduction">
          <div className="page-hero-split">
            <div className="page-hero-copy">
              <HomeReveal delay={0.3}><span className="home-tag">About us</span></HomeReveal>
              <HomeReveal delay={0.4}><h1>{publicCopy(company.headline)}</h1></HomeReveal>
              <HomeReveal delay={0.5} y={24}><p className="page-hero-description">{publicCopy(company.about)}</p></HomeReveal>
              <HomeReveal delay={0.6} y={0}><div className="page-hero-actions"><Link className="home-button textured" href="/contact">Get in touch</Link><Link className="home-button secondary" href="/services">View services</Link></div></HomeReveal>
            </div>
            <HomeReveal delay={0.7} y={48} className="page-hero-photo"><img src="/reference/workspace.jpg" alt="Software development workspace with code displayed on a monitor" width={1100} height={1100} fetchPriority="high" /></HomeReveal>
          </div>
        </section>
        <section className="home-section home-container" aria-label="Our focus">
          <div className="page-stat-grid">
            <HomeReveal delay={0.05}><article className="page-stat-card"><span className="page-stat-icon" aria-hidden="true">◈</span><div><strong>Products</strong><span>Our own SaaS products</span><p>Developed in stages, from planning to release.</p></div></article></HomeReveal>
            <HomeReveal delay={0.15}><article className="page-stat-card"><span className="page-stat-icon" aria-hidden="true">✧</span><div><strong>3</strong><span>Core services</span><p>Custom software, workflow automation, and system integration.</p></div></article></HomeReveal>
            <HomeReveal delay={0.25}><article className="page-stat-card"><span className="page-stat-icon" aria-hidden="true">↗</span><div><strong>Selected</strong><span>Open to project enquiries</span><p>We review each project for fit and available capacity.</p></div></article></HomeReveal>
          </div>
        </section>
        <section className="home-section home-container" aria-label="Approach">
          <HomeReveal className="home-section-heading"><span className="home-tag">Approach</span><h2>Design beyond the surface</h2><p>A clear, collaborative workflow from the first idea to delivery.</p></HomeReveal>
          <div className="page-approach-grid">{approach.map((item, i) => <HomeReveal key={item.title} delay={i * 0.12} y={48}><article><span className="home-service-icon" aria-hidden="true">{item.icon}</span><h3>{item.title}</h3><p>{item.text}</p></article></HomeReveal>)}</div>
        </section>
        <section className="home-section home-container" aria-label="Principles">
          <HomeReveal className="home-section-heading"><span className="home-tag">Principles</span><h2>How we approach the work</h2><p>A few practical principles guide our decisions from planning to release.</p></HomeReveal>
          <div className="page-principle-grid">{principles.map((item, i) => <HomeReveal key={item.title} delay={i * 0.08} y={48}><article className="page-principle"><span className="page-principle-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span><div><h3>{item.title}</h3><p>{item.text}</p></div></article></HomeReveal>)}</div>
        </section>
        <section className="home-section home-container" aria-label="Expertise">
          <HomeReveal className="home-section-heading"><span className="home-tag">Expertise</span><h2>The disciplines behind our work</h2><p>The skills we bring together to plan, build, and maintain a product.</p></HomeReveal>
          <div className="page-tools-grid">{tools.map((tool, i) => <HomeReveal key={tool.title} delay={i * 0.08} y={48}><article className="page-tool"><h3>{tool.title}</h3><p>{tool.text}</p><small aria-hidden="true">{String(i + 1).padStart(2, '0')}</small></article></HomeReveal>)}</div>
        </section>
        <section className="home-section home-container" aria-label="Our focus">
          <div className="page-story">
            <div className="page-story-side">
              <HomeReveal><div><strong>Build</strong><span>Product development</span></div></HomeReveal>
              <HomeReveal delay={0.1}><div><strong>SaaS</strong><span>Our product focus</span></div></HomeReveal>
            </div>
            <div>
              <HomeReveal><h2 className="home-split-heading-h">From an idea to a working product</h2></HomeReveal>
              <div className="page-story-copy">{story.map((paragraph, i) => <HomeReveal key={i} delay={i * 0.1} y={24}><p>{paragraph}</p></HomeReveal>)}</div>
            </div>
          </div>
        </section>
        <section className="home-section home-container" aria-label="Get in touch">
          <HomeReveal><div className="page-cta-band">
            <div><h2>Start a conversation</h2><p>Have a product idea or a development project? Tell us what you have in mind.</p></div>
            <Link className="home-button" href="/contact">Get in touch <span aria-hidden="true">↗</span></Link>
          </div></HomeReveal>
        </section>
      </div>
      <PageFooter companyName={company.name} />
    </div>
  );
}
