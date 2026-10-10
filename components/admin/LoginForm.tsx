'use client';

import { useState, type FormEvent } from 'react';

export function LoginForm({ configured }: { configured: boolean }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [available, setAvailable] = useState(configured);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending || !available) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    setPending(true);
    setError('');
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST', credentials: 'same-origin',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ username: data.get('username'), password: data.get('password') }),
      });
      const result = await response.json();
      if (!response.ok) {
        if (response.status === 503) setAvailable(false);
        throw new Error(result.error || 'Tidak dapat masuk. Coba lagi.');
      }
      form.reset();
      window.location.assign('/admin');
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : 'Koneksi gagal. Coba lagi.');
      setPending(false);
    }
  }

  return <form className="form-stack" onSubmit={login} aria-busy={pending} aria-describedby={error ? 'login-error' : undefined}>
    {!available && <p className="notice" role="status">Login belum dikonfigurasi. Pengelola server perlu menyiapkan kredensial admin sebelum akses dapat digunakan. Tidak ada akun bawaan.</p>}
    {error && <p className="notice" id="login-error" role="alert">{error}</p>}
    <fieldset disabled={!available || pending} className="form-stack">
      <legend>Kredensial admin</legend>
      <label className="field" htmlFor="username">Nama pengguna
        <input id="username" name="username" autoComplete="username" required maxLength={100} autoCapitalize="none" spellCheck={false} />
      </label>
      <label className="field" htmlFor="password">Kata sandi
        <input id="password" name="password" type="password" autoComplete="current-password" required maxLength={1024} />
      </label>
      <button className="button" type="submit">{pending ? 'Memeriksa kredensial…' : 'Masuk'}</button>
    </fieldset>
  </form>;
}
