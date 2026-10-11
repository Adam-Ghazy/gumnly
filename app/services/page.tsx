import { publicCopy } from '../../src/public-copy.ts';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getBackend } from '../../src/server/runtime.ts';
import { HomeReveal, HomeNavigation, PageFooter, ServiceTabs } from '../../components/home-motion.tsx';
import '../home.css';
import '../pages.css';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Services' };

const services = [
  { title: 'Custom software', icon: '⌘', input: 'Your business workflow and requirements.', process: 'Discovery, solution design, and staged development with your team.', output: 'An application for your team’s everyday work.' },
  { title: 'Workflow automation', icon: '✧', input: 'Repetitive manual tasks.', process: 'Map the workflow, simplify the steps, and implement automation.', output: 'A shorter, trackable workflow.' },
  { title: 'System integration', icon: '◇', input: 'Separate systems that need to share data.', process: 'Review interfaces, build connections, and test data flows.', output: 'Consistent data across connected systems.' },
];
const process = [
  { title: 'Discovery', text: 'Understand the project requirements and constraints.' },
  { title: 'Design', text: 'Plan the solution and its structure.' },
  { title: 'Development', text: 'Build and review the solution in stages.' },
  { title: 'Review & iteration', text: 'Test, review, and refine the work before release.' },
];

export default function ServicesPage() {
  const company = getBackend().company();
  return (
    <div className="gumnly-home">
      <HomeNavigation active="/services" />
      <div>
        <section className="home-container page-hero" aria-label="Services introduction">
          <div className="page-hero-copy">
            <HomeReveal delay={0.3}><span className="home-tag">Services</span></HomeReveal>
            <HomeReveal delay={0.4}><h1>Custom software, automation, and integration</h1></HomeReveal>
            <HomeReveal delay={0.5} y={24}><p className="page-hero-description">{publicCopy(company.services)}</p></HomeReveal>
            <HomeReveal delay={0.6} y={0}><div className="page-hero-actions"><Link className="home-button textured" href="/contact">Discuss a project</Link><Link className="home-button secondary" href="/about">About us</Link></div></HomeReveal>
          </div>
        </section>
        <section className="home-section home-container" aria-label="Core services">
          <HomeReveal className="home-section-heading"><span className="home-tag">Core services</span><h2>Three ways we can help</h2><p>Each service starts with a specific problem and an agreed outcome.</p></HomeReveal>
          <div className="page-service-cards">{services.map((service, i) => <HomeReveal key={service.title} delay={i * 0.12} y={48}><article className="page-service-card">
            <span className="home-service-icon" aria-hidden="true">{service.icon}</span>
            <h3>{service.title}</h3>
            <dl><div><dt>Input</dt><dd>{service.input}</dd></div><div><dt>Process</dt><dd>{service.process}</dd></div><div><dt>Output</dt><dd>{service.output}</dd></div></dl>
          </article></HomeReveal>)}</div>
        </section>
        <section className="home-section home-container" aria-label="Our approach">
          <HomeReveal className="home-section-heading"><span className="home-tag">Approach</span><h2>Build a product. Grow your business.</h2><p>Work with GUMNLY on SaaS products, digital platforms, and the systems behind them.</p></HomeReveal>
          <ServiceTabs />
        </section>
        <section className="home-section home-container" aria-label="Project workflow">
          <HomeReveal className="home-section-heading"><span className="home-tag">Workflow</span><h2>A clear path through the project</h2><p>Every project is different. This is a working framework, not a fixed package.</p></HomeReveal>
          <ol className="page-process-list">{process.map((step, i) => <li key={step.title}><HomeReveal delay={i * 0.1} y={48}><article className="page-process-item"><span className="page-principle-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span><h3>{step.title}</h3><p>{step.text}</p></article></HomeReveal></li>)}</ol>
        </section>
        <section className="home-section home-container" aria-label="Get in touch">
          <HomeReveal><div className="page-cta-band">
            <div><h2>Start a conversation</h2><p>Tell us what you need so we can discuss the scope and next steps.</p></div>
            <Link className="home-button" href="/contact">Discuss your project <span aria-hidden="true">↗</span></Link>
          </div></HomeReveal>
        </section>
      </div>
      <PageFooter companyName={company.name} />
    </div>
  );
}
