import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { getBackend } from '../../src/server/runtime.ts';
import { Dashboard } from '../../components/admin/Dashboard';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Dasbor', robots: { index: false, follow: false } };

export default async function AdminPage() {
  const backend = getBackend();
  const session = backend.sessionFromCookieHeader((await headers()).get('cookie'));
  if (!session) redirect('/admin/login');
  return <Dashboard session={session} initialData={{ company: backend.company(), products: backend.products(), enquiries: backend.enquiries() }} />;
}
