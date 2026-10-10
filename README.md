# GUMNLY Tech — Company Profile Website

Situs profil perusahaan GUMNLY Tech (SaaS-first startup) dengan dasbor admin konten yang aman. Next.js (App Router) + TypeScript + SQLite (`node:sqlite`), tanpa framework CSS eksternal.

## Fitur

- Halaman publik (Bahasa Indonesia): Beranda, Produk, Layanan, Tentang, Kontak, Privasi.
- Form kontak tervalidasi dengan honeypot, consent, rate limiting, dan status pengiriman yang jujur (lihat bawah).
- Dasbor admin `/admin`: edit konten perusahaan (langsung tampil di situs publik), CRUD produk (selalu berstatus "sedang dikembangkan"), dan daftar/ubah status/hapus pertanyaan masuk.
- Autentikasi admin: scrypt + session token HttpOnly SameSite=Strict (Secure + prefix `__Host-` di produksi), CSRF token untuk semua mutasi, rate limiting login/kontak yang bertahan lintas restart, validasi origin, batas ukuran body, tanpa kepercayaan header proxy.
- Aset merek asli Moda di `public/brand/` (wordmark, hero, workflow); sumber dapat diedit di `docs/brand-sources/`; manifest: `docs/ASSET-MANIFEST.md`.
- Warna merek tepat tiga: `#EDE8DF`, `#0F8F73`, `#0B2F2B`; font Manrope + Inter di-hosting lokal (`app/fonts/`, lisensi disertakan).

## Setup

```bash
npm install
cp .env.example .env          # isi APP_ORIGIN dulu
npm run admin:generate -- --username <nama-anda>   # buat kredensial admin privat
# ikuti petunjuk outputnya: gabungkan admin.env ke .env Anda
npm run dev                    # http://localhost:3000
```

Tidak ada kredensial default publik. Tanpa `ADMIN_USERNAME`/`ADMIN_PASSWORD_HASH`, halaman login jujur menyatakan "belum dikonfigurasi" dan menolak submit (503).

## Variabel lingkungan

Lihat `.env.example`. Wajib: `APP_ORIGIN` (origin kanonik; produksi wajib HTTPS — HTTP loopback diperbolehkan untuk uji lokal). Opsional: `DATABASE_PATH` (default `data/gumnly.sqlite`, di luar `public/`, di-ignore git), kredensial admin, dan konfigurasi email.

## Email

`MAIL_PROVIDER=disabled` (default): pertanyaan hanya tersimpan lokal dan pengirim diberi tahu secara jujur bahwa email belum dikirim. `MAIL_PROVIDER=resend` + `RESEND_API_KEY`/`MAIL_FROM`/`MAIL_TO`: mengirim ke penerima tetap operator (pengirim tidak dapat menentukan tujuan).

## Verifikasi

```bash
npm run typecheck   # next typegen + tsc --noEmit
npm test            # 18 test (store, auth, api, config, mail, runtime, session, frontend)
npm run build       # build produksi
APP_ORIGIN=http://127.0.0.1:PORT npm run start
```

## Status & batasan jujur

- Produk pertama masih dalam pengembangan; nama/lingkup belum final — tidak ada klaim metrik/pelanggan fiktif.
- Wordmark masih eksplorasi, bukan persetujuan logo final.
- Halaman privasi masih ringkas; perlu penyelesaian sebelum peluncuran publik.
- Email/DNS adalah prasyarat deployment terpisah.
