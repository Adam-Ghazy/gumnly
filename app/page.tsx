import { publicCopy } from '../src/public-copy.ts';
import Link from 'next/link';
import { getBackend } from '../src/server/runtime.ts';
import { HomeReveal, HomeNavigation, Count, ServiceTabs, HomeFAQ, CapabilityTicker } from '../components/home-motion.tsx';
import './home.css';

export const dynamic = 'force-dynamic';

// Design studies referensi — bukan proyek klien GUMNLY; provenance di docs/REFERENCE-ASSETS.md.
const examples = [['Brandora', 'brandora.jpg'], ['Nivora', 'nivora.jpg'], ['Codify', 'codify.png'], ['Neutra', 'neutra.jpg'], ['Snapkit', 'snapkit.png'], ['Todofusion', 'todofusion.jpg']];
const benefits = [
  ['SaaS product development', 'From focused planning and interface design to a working product, released in stages.'],
  ['Customer-focused services', 'Design and development shaped around the problems your business needs to solve.'],
  ['Launch and support', 'Prepare for launch, then improve the product with practical support and user feedback.'],
];
const steps = [
  ['Discovery', 'We start with your goals, audience, and the problem the project needs to solve.'],
  ['Strategy', 'We agree on the structure, priorities, and approach before design begins.'],
  ['Direction', 'Layouts, typography, and visual references establish a clear direction.'],
  ['Design', 'We work through the key screens, interactions, and details with your team.'],
  ['Development', 'We build responsive pages and test the flows that matter to your users.'],
  ['Handover', 'You receive the finished work, documentation, and an agreed launch plan.'],
];
const expertise = [
  ['Clear scope', 'Agree on priorities and scope before development begins.'],
  ['Consistency', 'A shared visual system keeps screens and interactions consistent.'],
  ['Scalability', 'Build on a structure that can adapt as your product grows.'],
  ['Speed', 'Small, focused releases turn ideas into working software and make room for feedback.'],
  ['Flexibility', 'Adjust priorities as your product and team learn more.'],
  ['Across disciplines', 'Product, design, and engineering work together on the same problem.'],
  ['Support', 'Regular reviews and support within the agreed project scope.'],
  ['Simplicity', 'A straightforward workflow, from the first conversation to handover.'],
];
const faqs = [
  { q: 'How do I start a project?', a: 'Tell us about your goals and current workflow through the contact form. We review each enquiry before agreeing on scope.' },
  { q: 'What happens after I get in touch?', a: 'We discuss the problem, clarify the constraints, and agree on the next steps.' },
  { q: 'How long does a project take?', a: 'Timing depends on scope, complexity, and feedback. We agree on a realistic schedule after discovery.' },
  { q: 'Can you work with our team?', a: 'Yes. Regular reviews help us understand your workflow and work alongside your team.' },
  { q: 'What products are you building?', a: 'Our SaaS products are in development. Visit Products for their current descriptions and status.' },
  { q: 'Do you take on one-off projects?', a: 'We take on selected software, automation, and integration projects that fit our focus and capacity.' },
  { q: 'Which tools do you use?', a: 'We choose tools to suit the project, your existing systems, and long-term maintenance.' },
  { q: 'How are pricing and support agreed?', a: 'Scope, pricing, handover, and support are agreed before work starts.' },
];

function SectionHeading({ label, title, description }: { label?: string; title: string; description: string }) {
  return <HomeReveal className="home-section-heading">{label && <span className="home-tag">{label}</span>}<h2>{title}</h2><p>{description}</p></HomeReveal>;
}

function BenefitArt({ index }: { index: number }) {
  return <div className={`home-benefit-art art-${index}`} aria-hidden="true">{index === 0 ? <div className="home-ui-kit"><div className="home-kit-tools">⌘　⌕　↗　▣　✧　◇</div>{['Primary', 'Secondary', 'Outline', 'Ghost'].map((text, i) => <div key={text}><span className={`kit-button kit-${i}`}>{text}</span><span className={`kit-button kit-${i}`}>{text}</span></div>)}</div> : index === 1 ? <div className="home-chart"><small>Product overview · interface study</small><svg viewBox="0 0 360 160"><path d="M0 125 L40 95 L80 110 L120 50 L160 70 L200 30 L240 60 L280 20 L320 30 L360 0" fill="none" stroke="currentColor" strokeWidth="3"/><path d="M0 150 L40 135 L80 140 L120 95 L160 105 L200 75 L240 90 L280 55 L320 70 L360 40" fill="none" stroke="currentColor" strokeWidth="2" opacity=".4"/></svg><div><span>Usage trends</span><span>Product insights</span></div></div> : <div className="home-launch-ui"><span className="home-notice">✓ Ready for the next step</span><div><small>IN DEVELOPMENT</small><strong>Gumnly products</strong><p>Build. Learn. Improve.</p><div className="home-mini-previews"><img src="/reference/codify.png" alt=""/><img src="/reference/todofusion.jpg" alt=""/></div></div></div>}</div>;
}

export default async function HomePage() {
  const company = getBackend().company();
  const products = getBackend().products();
  const headline = publicCopy(company.headline);
  const description = publicCopy(company.description);
  return <div className="gumnly-home">
    <HomeNavigation />
    <section className="home-hero home-container" aria-label="Introduction">
      <div className="home-hero-panel">
        <div className="home-hero-copy">
          <HomeReveal delay={0.4}><h1>{headline}</h1></HomeReveal>
          <HomeReveal delay={0.5} y={24}><p className="home-hero-description">{description}</p></HomeReveal>
          <HomeReveal delay={0.6} y={0}><div className="home-actions"><Link className="home-button textured" href="#selected-work">View projects</Link><Link className="home-button secondary" href="/contact">Get in touch</Link></div></HomeReveal>
          <HomeReveal delay={0.9} y={48}><dl className="home-stats"><div><dt><Count value={products.length}/></dt><dd>Products in progress</dd></div><div><dt><Count value={3}/></dt><dd>Core services</dd></div><div><dt><Count value={6}/></dt><dd>Process steps</dd></div></dl></HomeReveal>
        </div>
        <div className="home-hero-photo"><img src="/reference/workspace.jpg" alt="Software development workspace with code displayed on a monitor" width={1100} height={1650} fetchPriority="high" /></div>
        <HomeReveal className="home-availability" delay={0.8} x={-24} y={24}><Link href="/contact"><div><small>Select a service</small><strong>Available for projects</strong><p>Tell us about your business and<br/>the challenges you want to solve.</p></div><span aria-hidden="true">↗</span></Link></HomeReveal>
      </div>
      <CapabilityTicker />
    </section>
    <section className="home-section home-container home-benefits">
      <SectionHeading label="Benefits" title="Discover why we stand out" description="We bring product planning, design, and development together to make useful software."/>
      <div className="home-benefit-grid">{benefits.map(([title, text], i) => <HomeReveal key={title} delay={i * 0.12} y={96}><article className="home-benefit-card"><BenefitArt index={i}/><div className="home-benefit-copy"><h3>{title}</h3><p>{text}</p></div></article></HomeReveal>)}</div>
    </section>
    <section id="selected-work" className="home-section home-container home-projects">
      <SectionHeading label="Design studies" title="Building useful digital products" description="Reference design studies, not GUMNLY client projects. Our own SaaS products are in development."/>
      <div className="home-project-grid">{examples.map(([name, image], i) => <HomeReveal key={name} delay={i % 2 * 0.1}><a className="home-project" href={`/reference/${image}`} aria-label={`View reference design study ${name}`}><div className="home-project-image"><img src={`/reference/${image}`} alt={`${name} — reference design study, not a GUMNLY client project`} loading="lazy" width={1600} height={1200}/></div><div className="home-project-label"><span className="home-project-name"><span>{name}</span><span aria-hidden="true">{name}</span></span><span aria-hidden="true">↗</span></div></a></HomeReveal>)}</div>
      <div className="home-product-status"><Link href="/products">GUMNLY products in development ↗</Link>{products.length === 0 ? <p>No products to show yet.</p> : products.map(product => <p key={product.id}><strong>{product.name ?? 'First SaaS product'}</strong> — {publicCopy(product.description)}</p>)}</div>
    </section>
    <section className="home-section home-container home-proof">
      <div className="home-split-heading"><HomeReveal><span className="home-tag">Why GUMNLY</span><h2>A startup built to solve real problems</h2></HomeReveal><HomeReveal delay={0.1}><p>We build SaaS products and take on selected software projects, from early planning to development and support.</p></HomeReveal></div>
      <div className="home-proof-grid"><div className="home-proof-column"><HomeReveal><div className="home-proof-strip"><span aria-hidden="true">◉ ◈ ◇</span>Product · Design · Engineering</div></HomeReveal><HomeReveal><article className="home-proof-card"><p>A clear direction, shaped around each project.</p><strong><Count value={6}/></strong><span>Collaborative process steps</span></article></HomeReveal></div><div className="home-proof-column"><HomeReveal><article className="home-proof-card"><p>Custom software, automation, and system integration.</p><strong><Count value={3}/></strong><span>Core service areas</span></article></HomeReveal><HomeReveal><Link className="home-proof-strip" href="/contact"><i/>Available for projects</Link></HomeReveal></div><HomeReveal className="home-proof-dark"><article><p>From a new SaaS product to a custom application, we focus on making everyday work simpler.</p><div><strong>SaaS</strong><span>Products in development<br/>Built for the long term</span></div></article></HomeReveal></div>
    </section>
    <section className="home-section home-container home-services"><SectionHeading title="Build a product. Grow your business." description="Work with GUMNLY on SaaS products, digital platforms, and the systems behind them."/><ServiceTabs/></section>
    <section className="home-section home-container home-process"><div className="home-process-heading"><SectionHeading label="Process" title="How the process flows with clarity" description="A collaborative process from the first conversation to handover."/></div><ol className="home-timeline">{steps.map(([title, text], i) => <li key={title}><HomeReveal y={48}><article><span className="home-step-icon" aria-hidden="true">{['⌕', '◇', '✧', '▧', '⌘', '↗'][i]}</span><div><h3>{title}</h3><p>{text}</p></div></article></HomeReveal></li>)}</ol></section>
    <section className="home-section home-container home-expertise"><SectionHeading label="Expertise" title="From first idea to customer value" description="Test your idea, release a focused product, and improve it with feedback."/><div className="home-expertise-grid">{expertise.map(([title, text], i) => <HomeReveal className={`expertise-cell expertise-${i}`} key={title} delay={i % 4 * 0.08} y={96}><article><span className="home-expertise-icon" aria-hidden="true">{['◇', '◫', '↗', 'ϟ', '✧', '◈', '♧', '⌘'][i]}</span><div><h3>{title}</h3><p>{text}</p></div></article></HomeReveal>)}</div></section>
    <section className="home-section home-container home-faq"><SectionHeading title="Explore our FAQs" description="Answers about our process, pricing, timelines, and project details."/><HomeFAQ items={faqs}/></section>
    <footer className="home-footer home-container"><div className="home-footer-panel"><div className="home-footer-top"><div><Link className="home-logo" href="/"><span aria-hidden="true">g.</span>Gumnly</Link><p>Gumnly builds SaaS products and provides custom software, automation, and integration services.</p></div><div><strong>Pages</strong><Link href="/">Home</Link><Link href="/about">About</Link><Link href="/products">Products</Link><Link href="/services">Services</Link><Link href="/contact">Contact</Link></div><div><strong>Information</strong><Link href="/privacy">Privacy</Link><a href="#selected-work">Design studies</a><Link href="/contact">Get in touch</Link></div></div><p className="home-footer-wordmark">Gumnly.</p><div className="home-footer-bottom">© {company.name}. All rights reserved.</div></div></footer>
    <Link className="home-floating-contact" href="/contact">Contact Gumnly</Link>
  </div>;
}
