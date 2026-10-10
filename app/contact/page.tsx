import type { Metadata } from 'next';
import { ContactForm } from '@/components/contact-form';

export const metadata: Metadata = { title: 'Kontak' };

export default function ContactPage() {
  return (
    <section className="section">
      <div className="container grid grid-2" style={{ gap: 'clamp(2rem, 5vw, 4rem)' }}>
        <div>
          <p className="eyebrow">Kontak</p>
          <h1>Mari berdiskusi</h1>
          <p className="lede">Silakan pilih jalur yang sesuai: minat pada produk kami, atau kebutuhan proyek pengembangan khusus.</p>
          <p>Pertanyaan Anda disimpan di server GUMNLY dan diteruskan ke penyedia email hanya jika pengiriman email dikonfigurasi. Balasan dikirim ke alamat email yang Anda cantumkan.</p>
          <p>Kanal resmi lain (telepon, alamat kantor) akan ditambahkan setelah diverifikasi.</p>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}
