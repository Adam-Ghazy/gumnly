export function contactPayload(form: FormData) {
  return {
    kind: String(form.get('kind') ?? ''),
    name: String(form.get('name') ?? '').trim(),
    email: String(form.get('email') ?? '').trim(),
    message: String(form.get('message') ?? '').trim(),
    consent: form.get('consent') === 'on',
    website: String(form.get('website') ?? ''),
  };
}

export function contactResult(ok: boolean, body: unknown): { ok: boolean; message: string } {
  const data = body && typeof body === 'object' ? body as Record<string, unknown> : {};
  if (!ok) return { ok: false, message: typeof data.error === 'string' ? data.error : 'Pengiriman belum dapat dikonfirmasi. Isian Anda tetap tersedia.' };
  switch (data.delivery) {
    case 'stored': return { ok: true, message: 'Pertanyaan tersimpan secara lokal di server GUMNLY. Email belum dikirim.' };
    case 'accepted': return { ok: true, message: 'Pertanyaan tersimpan. Penyedia email menerima pesan; ini bukan jaminan pesan masuk ke kotak masuk.' };
    case 'pending':
    case 'failed': return { ok: true, message: 'Pertanyaan tersimpan. Penerimaan email belum dikonfirmasi; Anda tidak perlu mengirim ulang.' };
    default: return { ok: false, message: 'Status pengiriman belum dapat dikonfirmasi. Isian Anda tetap tersedia; mengirim ulang dapat membuat pertanyaan ganda.' };
  }
}
