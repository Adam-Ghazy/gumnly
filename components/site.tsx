import Link from 'next/link';

const NAV = [
  { href: '/', label: 'Beranda' },
  { href: '/products', label: 'Produk' },
  { href: '/services', label: 'Layanan' },
  { href: '/about', label: 'Tentang' },
  { href: '/contact', label: 'Kontak', cta: true },
];

export function Wordmark({ width = 132, height = 40, dark = false }: { width?: number; height?: number; dark?: boolean }) {
  // Crop the 1440x480 canvas padding via a wrapper; ink bounds x112-1262, y105-406.
  const cropLeft = (112 / 1440) * 100;
  const cropTop = (105 / 480) * 100;
  const cropW = ((1262 - 112) / 1440) * 100;
  const cropH = ((406 - 105) / 480) * 100;
  const scaleFactor = 100 / cropW;
  return (
    <span className="wordmark-crop" style={{ width, height }}>
      <img
        src="/brand/wordmark.png"
        alt="GUMNLY"
        width={width}
        height={height}
        style={{
          width: `${scaleFactor * 100}%`,
          height: `${(100 / cropH) * 100}%`,
          objectFit: 'cover',
          objectPosition: `${cropLeft}% ${cropTop}%`,
          background: dark ? '#0B2F2B' : '#EDE8DF',
        }}
      />
    </span>
  );
}

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container inner">
        <Link href="/" className="wordmark-link" aria-label="GUMNLY, kembali ke beranda">
          <Wordmark width={144} height={42} />
        </Link>
        <input id="nav-toggle" type="checkbox" className="nav-toggle-input" />
        <label className="nav-toggle" htmlFor="nav-toggle">
          <span className="nav-toggle-open">Menu</span>
          <span className="nav-toggle-close">Tutup</span>
        </label>
        <SiteNav />
      </div>
    </header>
  );
}

export function SiteNav() {
  return (
    <nav className="site-nav" aria-label="Navigasi utama">
      {NAV.map(item => (
        <Link key={item.href} href={item.href} className={item.cta ? 'nav-cta' : undefined}>{item.label}</Link>
      ))}
    </nav>
  );
}

export function SiteFooter({ name }: { name: string }) {
  return (
    <footer className="site-footer">
      <div className="container inner">
        <p className="footer-wordmark">gumnly<span className="footer-dot">.</span></p>
        <p>{name} · SaaS Products &amp; Software Engineering</p>
        <ul className="footer-links">
          <li><Link href="/products">Produk</Link></li>
          <li><Link href="/services">Layanan</Link></li>
          <li><Link href="/privacy">Privasi</Link></li>
          <li><Link href="/contact">Kontak</Link></li>
        </ul>
      </div>
    </footer>
  );
}

