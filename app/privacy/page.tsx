import type { Metadata } from 'next';
import { getBackend } from '../../src/server/runtime.ts';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Privasi' };

export default function PrivacyPage() {
  const company = getBackend().company();
  return (
    <section className="page-head">
      <div className="container">
        <h1 style={{ maxWidth: '20ch' }}>Cara kami menangani data Anda</h1>
        <div style={{ marginTop: 'clamp(2.5rem, 6vw, 4rem)', maxWidth: '62ch' }}>
          <p className="lede">{company.privacy}</p>
          <p style={{ marginBottom: 0 }}>Halaman ini akan diperbarui sebelum situs diluncurkan secara publik, termasuk detail retensi dan kontak privasi yang telah disetujui.</p>
        </div>
      </div>
    </section>
  );
}
