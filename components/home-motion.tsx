'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { AnimatePresence, animate, motion, useInView, useReducedMotion } from 'motion/react';

/** Reference appear effects: 400ms spring, 64px heading / 48px stats. */
export function HomeReveal({ children, className, delay = 0, y = 64, x = 0 }: { children: ReactNode; className?: string; delay?: number; y?: number; x?: number }) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={false} whileInView={reduced ? { opacity: 1 } : { opacity: [0, 1], y: [y, 0], x: [x, 0] }} viewport={{ once: true, amount: 0.12 }} transition={{ type: 'spring', duration: 0.4, bounce: 0.08, delay: reduced ? 0 : delay }}>{children}</motion.div>;
}

export function Count({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const visible = useInView(ref, { once: true });
  const reduced = useReducedMotion();
  useEffect(() => {
    if (!visible || reduced || !ref.current) return;
    const control = animate(0, value, { duration: 1.2, onUpdate: n => { if (ref.current) ref.current.textContent = String(Math.round(n)); } });
    return () => control.stop();
  }, [visible, reduced, value]);
  return <span ref={ref}>{value}</span>;
}

const navigation = [['/', 'Beranda'], ['/products', 'Produk'], ['/services', 'Layanan'], ['/about', 'Tentang'], ['/contact', 'Kontak']];
export function HomeNavigation() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reduced = useReducedMotion();
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 180);
    update(); window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);
  useEffect(() => {
    const close = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', close); return () => window.removeEventListener('keydown', close);
  }, []);
  return <header className={`home-nav ${scrolled ? 'is-scrolled' : ''}`}>
    <div className="home-nav-inner">
      <Link href="/" className="home-logo" aria-label="Gumnly home"><span aria-hidden="true">g.</span>Gumnly</Link>
      <nav className="home-desktop-links" aria-label="Navigasi beranda">{navigation.map(([href, text]) => <Link key={href} href={href}>{text}</Link>)}</nav>
      <Link href="/contact" className="home-button home-nav-cta">Mari bicara <span aria-hidden="true">↗</span></Link>
      <button className="home-menu-toggle" aria-label={open ? 'Tutup menu' : 'Buka menu'} aria-expanded={open} aria-controls="home-mobile-menu" onClick={() => setOpen(!open)}><span /><span /></button>
    </div>
    <AnimatePresence>{open && <motion.nav id="home-mobile-menu" className="home-mobile-menu" aria-label="Navigasi mobile" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: reduced ? 0 : 0.25 }}>{navigation.map(([href, text]) => <Link onClick={() => setOpen(false)} key={href} href={href}>{text}</Link>)}</motion.nav>}</AnimatePresence>
  </header>;
}

export const services = [
  { title: 'Software khusus', icon: '⌘', text: 'Aplikasi yang dibangun mengikuti proses bisnis Anda: discovery, desain solusi, dan pengembangan bertahap bersama tim Anda.' },
  { title: 'Otomasi alur kerja', icon: '✧', text: 'Proses manual yang berulang dipetakan, disusun ulang, lalu diotomasi menjadi alur yang ringkas dan terpantau.' },
  { title: 'Integrasi sistem', icon: '◇', text: 'Sistem terpisah dihubungkan dengan penghubung yang dirancang dan diuji agar data mengalir konsisten.' },
];

export function ServiceTabs() {
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  return <div className="home-service-layout">
    <div role="tablist" aria-label="Layanan" aria-orientation="vertical" className="home-service-tabs">{services.map((service, i) => <button key={service.title} ref={el => { refs.current[i] = el; }} role="tab" id={`service-tab-${i}`} aria-controls="service-panel" aria-selected={active === i} tabIndex={active === i ? 0 : -1} onClick={() => setActive(i)} onKeyDown={e => {
      if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) return;
      e.preventDefault(); const next = e.key === 'Home' ? 0 : e.key === 'End' ? 2 : (active + (e.key === 'ArrowDown' ? 1 : 2)) % 3;
      setActive(next); refs.current[next]?.focus();
    }}><span className="home-service-icon" aria-hidden="true">{service.icon}</span><strong>{service.title}</strong><span>{service.text}</span></button>)}</div>
    <div role="tabpanel" id="service-panel" aria-labelledby={`service-tab-${active}`} tabIndex={0} className="home-service-art">
      <AnimatePresence mode="wait"><motion.div key={active} className={`home-layer-stack layer-${active}`} initial={{ opacity: 0, y: reduced ? 0 : 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : 0.35 }}>
        {[2, 1, 0].map((layer) => <div className="home-interface-layer" key={layer} style={{ '--layer': layer } as React.CSSProperties}><img src={`/reference/${['development.png', 'visual-system.png', 'product-design.png'][active]}`} alt={layer === 0 ? `Studi antarmuka ${services[active].title}` : ''} /></div>)}
      </motion.div></AnimatePresence>
    </div>
  </div>;
}

export function HomeFAQ({ items }: { items: { q: string; a: string }[] }) {
  const [active, setActive] = useState<number | null>(null);
  const reduced = useReducedMotion();
  return <div className="home-faq-list">{items.map((item, i) => <div key={item.q} className="home-faq-item"><h3><button id={`faq-trigger-${i}`} aria-expanded={active === i} aria-controls={`faq-answer-${i}`} onClick={() => setActive(active === i ? null : i)}>{item.q}<motion.span aria-hidden="true" animate={{ rotate: active === i ? 45 : 0 }} transition={{ duration: reduced ? 0 : 0.2 }}>+</motion.span></button></h3><motion.div id={`faq-answer-${i}`} role="region" aria-labelledby={`faq-trigger-${i}`} aria-hidden={active !== i} initial={false} animate={{ height: active === i ? 'auto' : 0, opacity: active === i ? 1 : 0 }} transition={{ duration: reduced ? 0 : 0.3 }} className="home-faq-answer"><p>{item.a}</p></motion.div></div>)}</div>;
}

export function CapabilityTicker() {
  const reduced = useReducedMotion();
  const labels = ['Produk SaaS', 'Rekayasa software', 'Otomasi', 'Integrasi sistem', 'Desain produk', 'Dukungan berkelanjutan'];
  return <div className="home-ticker" aria-label="Kapabilitas kami"><motion.div className="home-ticker-track" animate={reduced ? { x: 0 } : { x: ['0%', '-50%'] }} transition={{ duration: 32, ease: 'linear', repeat: Infinity }}>{[0, 1].map(copy => <div className="home-ticker-set" key={copy} aria-hidden={copy === 1}>{labels.map((label, i) => <span key={label}><b aria-hidden="true">{['◈', '⌘', '↗', '✳', '◇', '◉'][i]}</b>{label}</span>)}</div>)}</motion.div></div>;
}
