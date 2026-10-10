import type { Metadata } from 'next';
import { getBackend } from '../../src/server/runtime.ts';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Privasi' };

export default function PrivacyPage() {
  const company = getBackend().company();
  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow">Privasi</p>
          <h1>Cara kami menangani data Anda</h1>
        </div>
        <p>{company.privacy}</p>
        <p>Halaman ini akan diperbarui sebelum situs diluncurkan secara publik, termasuk detail retensi dan kontak privasi yang telah disetujui.</p>
      </div>
    </section>
  );
}
