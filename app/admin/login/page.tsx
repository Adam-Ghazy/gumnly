import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { getBackend } from '../../../src/server/runtime.ts';
import { LoginForm } from '@/components/admin/LoginForm';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Masuk admin', robots: { index: false, follow: false } };

export default async function AdminLoginPage() {
  const backend = getBackend();
  const cookie = (await headers()).get('cookie');
  if (backend.sessionFromCookieHeader(cookie)) redirect('/admin');
  return (
    <section className="section">
      <div className="container" style={{ maxWidth: '26rem' }}>
        <p className="eyebrow">Admin GUMNLY</p>
        <h1>Masuk ke dasbor konten</h1>
        <LoginForm configured={backend.loginConfigured()} />
      </div>
    </section>
  );
}

