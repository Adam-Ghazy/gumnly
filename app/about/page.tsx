import type { Metadata } from 'next';
import { getBackend } from '../../src/server/runtime.ts';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Tentang' };

export default function AboutPage() {
  const company = getBackend().company();
  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow">Tentang</p>
          <h1>Startup yang membangun produknya sendiri</h1>
        </div>
        <p className="lede">{company.about}</p>
        <p>GUMNLY berfokus pada produk SaaS sebagai inti bisnis. Layanan pengembangan khusus kami jalankan secara selektif dan menjadi bagian dari cara kami belajar membangun perangkat lunak yang benar-benar dipakai.</p>
        <p>Riwayat dan pencapaian resmi perusahaan akan kami tambahkan setelah diverifikasi. Kami memilih menampilkan apa yang benar, bukan angka yang belum dapat kami buktikan.</p>
      </div>
    </section>
  );
}
