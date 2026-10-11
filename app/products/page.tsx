import type { Metadata } from 'next';
import Link from 'next/link';
import { getBackend } from '../../src/server/runtime.ts';
import { HomeReveal, HomeNavigation, PageFooter } from '../../components/home-motion.tsx';
import { ProductGallery } from '../../components/product-gallery.tsx';
import '../home.css';
import '../pages.css';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Products' };

export default function ProductsPage() {
  const products = getBackend().products();
  const company = getBackend().company();
  return (
    <div className="gumnly-home">
      <HomeNavigation active="/products" />
      <div>
        <section className="home-container page-hero" aria-label="Products introduction">
          <div className="page-hero-copy">
            <HomeReveal delay={0.3}><span className="home-tag">Products</span></HomeReveal>
            <HomeReveal delay={0.4}><h1>Products in development</h1></HomeReveal>
            <HomeReveal delay={0.5} y={24}><p className="page-hero-description">We are developing our SaaS products in stages. The products listed here are not yet available to the public.</p></HomeReveal>
            <HomeReveal delay={0.6} y={0}><div className="page-hero-actions"><Link className="home-button textured" href="/contact">Register your interest</Link><Link className="home-button secondary" href="/about">About us</Link></div></HomeReveal>
          </div>
        </section>
        <section className="home-section home-container" aria-label="Product list">
          <HomeReveal><ProductGallery products={products} /></HomeReveal>
          <div className="page-reference-note">
            <p>Want to know more or suggest a use case? <Link href="/contact">Tell us what you need</Link>, and we can discuss the next steps.</p>
          </div>
        </section>
      </div>
      <PageFooter companyName={company.name} />
    </div>
  );
}
