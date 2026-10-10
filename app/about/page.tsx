import type { Metadata } from 'next';
import { getBackend } from '../../src/server/runtime.ts';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Tentang' };

export default function AboutPage() {
  const company = getBackend().company();
  return (
    <section className="page-head">
      <div className="container">
        <h1 style={{ maxWidth: '18ch' }}>Startup yang membangun produknya sendiri</h1>
        <div style={{ marginTop: 'clamp(2.5rem, 6vw, 4rem)', maxWidth: '62ch' }}>
          <p className="lede">{company.about}</p>
          <p>GUMNLY berfokus pada produk SaaS sebagai inti bisnis. Layanan pengembangan khusus kami jalankan secara selektif dan menjadi bagian dari cara kami belajar membangun perangkat lunak yang benar-benar dipakai.</p>
          <p style={{ marginBottom: 0 }}>Riwayat dan pencapaian resmi perusahaan akan kami tambahkan setelah diverifikasi. Kami memilih menampilkan apa yang benar, bukan angka yang belum dapat kami buktikan.</p>
        </div>
      </div>
    </section>
  );
}
