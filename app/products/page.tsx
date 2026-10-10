import type { Metadata } from 'next';
import Link from 'next/link';
import { getBackend } from '../../src/server/runtime.ts';
import { HomeReveal, HomeNavigation, PageFooter } from '../../components/home-motion.tsx';
import { ProductGallery } from '../../components/product-gallery.tsx';
import '../home.css';
import '../pages.css';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Produk' };

export default function ProductsPage() {
  const products = getBackend().products();
  const company = getBackend().company();
  return (
    <div className="gumnly-home">
      <HomeNavigation active="/products" />
      <div>
        <section className="home-container page-hero" aria-label="Pengantar produk">
          <div className="page-hero-copy">
            <HomeReveal delay={0.3}><span className="home-tag">Produk</span></HomeReveal>
            <HomeReveal delay={0.4}><h1>Produk yang sedang kami kembangkan</h1></HomeReveal>
            <HomeReveal delay={0.5} y={24}><p className="page-hero-description">Kami membangun produk SaaS secara bertahap. Semua yang tampil di halaman ini masih dalam pengembangan dan belum tersedia untuk publik.</p></HomeReveal>
            <HomeReveal delay={0.6} y={0}><div className="page-hero-actions"><Link className="home-button textured" href="/contact">Sampaikan minat</Link><Link className="home-button secondary" href="/about">Tentang kami</Link></div></HomeReveal>
          </div>
        </section>
        <section className="home-section home-container" aria-label="Daftar produk">
          <HomeReveal><ProductGallery products={products} /></HomeReveal>
          <div className="page-reference-note">
            <p>Ingin tahu lebih jauh atau menyarankan kebutuhan Anda? <Link href="/contact">Sampaikan minat Anda</Link>, kami akan mengabari saat ada kabar perkembangan.</p>
          </div>
        </section>
      </div>
      <PageFooter companyName={company.name} />
    </div>
  );
}
