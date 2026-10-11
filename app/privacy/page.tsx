import { publicCopy } from '../../src/public-copy.ts';
import type { Metadata } from 'next';
import { getBackend } from '../../src/server/runtime.ts';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Privacy' };

export default function PrivacyPage() {
  const company = getBackend().company();
  return (
    <section className="page-head">
      <div className="container">
        <h1 style={{ maxWidth: '20ch' }}>How we handle your data</h1>
        <div style={{ marginTop: 'clamp(2.5rem, 6vw, 4rem)', maxWidth: '62ch' }}>
          <p className="lede">{publicCopy(company.privacy)}</p>
          <p style={{ marginBottom: 0 }}>This page will be updated before public launch with the agreed retention periods and privacy contact.</p>
        </div>
      </div>
    </section>
  );
}
