import type { Metadata } from 'next';
import { ContactForm } from '@/components/contact-form';

export const metadata: Metadata = { title: 'Kontak' };

export default function ContactPage() {
  return (
    <section className="page-head">
      <div className="container split-wide" style={{ paddingBottom: 'var(--space-section)' }}>
        <div>
          <h1 style={{ maxWidth: '14ch' }}>Mari berdiskusi</h1>
          <p className="lede" style={{ marginTop: '1.25rem' }}>Silakan pilih jalur yang sesuai: minat pada produk kami, atau kebutuhan proyek pengembangan khusus.</p>
          <p>Pertanyaan Anda disimpan di server GUMNLY dan diteruskan ke penyedia email hanya jika pengiriman email dikonfigurasi. Balasan dikirim ke alamat email yang Anda cantumkan.</p>
          <p style={{ marginBottom: 0 }}>Kanal resmi lain (telepon, alamat kantor) akan ditambahkan setelah diverifikasi.</p>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}
