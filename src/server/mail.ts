import type { Enquiry } from './store.ts';
export type MailConfig = { apiKey: string; from: string; to: string; timeoutMs: number };

export async function deliver(enquiry: Enquiry, config: MailConfig, transport: typeof fetch): Promise<'accepted' | 'failed'> {
  const controller = new AbortController();
  let timer: NodeJS.Timeout | undefined;
  const deadline = new Promise<never>((_, reject) => {
    timer = setTimeout(() => { controller.abort(); reject(new Error('Email deadline exceeded')); }, config.timeoutMs);
  });
  try {
    const operation = async () => {
      const response = await transport('https://api.resend.com/emails', {
        method: 'POST', redirect: 'error', signal: controller.signal,
        headers: { authorization: `Bearer ${config.apiKey}`, 'content-type': 'application/json', 'idempotency-key': enquiry.id },
        body: JSON.stringify({ from: config.from, to: [config.to], reply_to: enquiry.email, subject: `GUMNLY: ${enquiry.kind === 'product' ? 'Minat produk' : 'Pertanyaan proyek'}`, text: `Nama: ${enquiry.name}\nEmail: ${enquiry.email}\n\n${enquiry.message}` }),
      });
      if (!response.ok) { void response.body?.cancel(); return 'failed' as const; }
      const result: unknown = await response.json();
      return typeof result === 'object' && result !== null && 'id' in result && typeof result.id === 'string' && result.id.length > 0 ? 'accepted' as const : 'failed' as const;
    };
    return await Promise.race([operation(), deadline]);
  } catch { return 'failed'; }
  finally { clearTimeout(timer); }
}
