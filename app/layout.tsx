import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { SiteHeader, SiteFooter } from '../components/site';
import { getBackend } from '../src/server/runtime.ts';
import './globals.css';

const lora = localFont({ src: './fonts/lora-latin.woff2', weight: '500', style: 'normal', variable: '--font-lora', display: 'swap', declarations: [{ prop: 'font-family', value: 'Lora' }] });
const manrope = localFont({ src: './fonts/manrope-latin.woff2', weight: '600 800', style: 'normal', variable: '--font-manrope', display: 'swap', declarations: [{ prop: 'font-family', value: 'Manrope' }] });
const inter = localFont({ src: './fonts/inter-latin.woff2', weight: '400 600', style: 'normal', variable: '--font-inter', display: 'swap', declarations: [{ prop: 'font-family', value: 'Inter' }] });

export const metadata: Metadata = {
  title: { default: 'GUMNLY Tech — SaaS Products & Software Engineering', template: '%s — GUMNLY Tech' },
  description: 'GUMNLY mengembangkan produk SaaS dan solusi software khusus untuk membantu bisnis mengelola proses kerja dengan lebih terstruktur.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  let name = 'GUMNLY Tech';
  try { name = getBackend().company().name; } catch { /* fail closed: default name */ }
  return (
    <html lang="id" className={`${lora.variable} ${manrope.variable} ${inter.variable}`}>
      <body>
        <a className="skip-link" href="#main">Langsung ke konten utama</a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter name={name} />
      </body>
    </html>
  );
}
