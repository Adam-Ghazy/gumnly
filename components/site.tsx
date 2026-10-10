import Link from 'next/link';

const NAV = [
  { href: '/', label: 'Beranda' },
  { href: '/products', label: 'Produk' },
  { href: '/services', label: 'Layanan' },
  { href: '/about', label: 'Tentang' },
  { href: '/contact', label: 'Kontak' },
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
        <Link href="/" className="wordmark-link" aria-label="GUMNLY — kembali ke beranda">
          <Wordmark />
        </Link>
        <input id="nav-toggle" type="checkbox" hidden />
        <SiteNav />
      </div>
    </header>
  );
}

export function SiteNav() {
  return (
    <nav className="site-nav" aria-label="Navigasi utama">
      {NAV.map(item => (
        <Link key={item.href} href={item.href}>{item.label}</Link>
      ))}
    </nav>
  );
}

export function SiteFooter({ name }: { name: string }) {
  return (
    <footer className="site-footer">
      <div className="container inner">
        <p style={{ margin: 0 }}>{name} — SaaS Products &amp; Software Engineering</p>
        <p style={{ margin: 0 }}><Link href="/privacy">Privasi</Link> · <Link href="/contact">Kontak</Link></p>
      </div>
    </footer>
  );
}
