'use client';

import { useState, type FormEvent } from 'react';
import { contactPayload, contactResult } from './contact-logic';

export function ContactForm() {
  const [pending, setPending] = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; message: string } | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const form = event.currentTarget;
    setPending(true);
    setFeedback(null);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(contactPayload(new FormData(form))),
      });
      const body: unknown = await response.json().catch(() => null);
      const result = contactResult(response.ok, body);
      setFeedback(result);
      if (result.ok) form.reset();
    } catch {
      setFeedback({ ok: false, message: 'Koneksi gagal. Periksa jaringan Anda lalu coba lagi; isian di layar tetap ada.' });
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="form-stack" onSubmit={submit} aria-busy={pending}>
      <fieldset className="form-stack" disabled={pending}>
        <legend>Jenis pertanyaan</legend>
        <label className="field" htmlFor="kind">
          Saya menghubungi tentang
          <select id="kind" name="kind" defaultValue="product" required>
            <option value="product">Minat pada produk GUMNLY</option>
            <option value="project">Kebutuhan proyek / pengembangan khusus</option>
          </select>
        </label>
      </fieldset>
      <label className="field" htmlFor="name">Nama
        <input id="name" name="name" required maxLength={100} autoComplete="name" />
      </label>
      <label className="field" htmlFor="email">Email
        <input id="email" name="email" type="email" required maxLength={254} autoComplete="email" />
      </label>
      <label className="field" htmlFor="message">Pesan
        <textarea id="message" name="message" required minLength={10} maxLength={5000} />
      </label>
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="website">Jangan isi kolom ini
          <input id="website" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <label className="field" style={{ gridAutoFlow: 'column', justifyContent: 'start', gap: '0.6rem', display: 'flex' }}>
        <input type="checkbox" name="consent" required style={{ width: '1.1rem', height: '1.1rem' }} />
        <span>Saya setuju data saya diproses seperti dijelaskan di halaman <a href="/privacy">Privasi</a>.</span>
      </label>
      <button className="button" type="submit">{pending ? 'Mengirim…' : 'Kirim pertanyaan'}</button>
      {feedback && (
        <p className={feedback.ok ? 'notice' : 'notice notice-error'} role={feedback.ok ? 'status' : 'alert'}>
          {feedback.message}
        </p>
      )}
    </form>
  );
}
