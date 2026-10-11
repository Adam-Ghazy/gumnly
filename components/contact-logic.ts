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
  if (!ok) return { ok: false, message: typeof data.error === 'string' ? data.error : 'Delivery could not be confirmed. Your entries are still here.' };
  switch (data.delivery) {
    case 'stored': return { ok: true, message: 'Your enquiry is saved on the GUMNLY server. No email has been sent.' };
    case 'accepted': return { ok: true, message: 'Your enquiry is saved. The email provider accepted the message; inbox delivery is not confirmed.' };
    case 'pending':
    case 'failed': return { ok: true, message: 'Your enquiry is saved. Email delivery is not confirmed; there is no need to submit again.' };
    default: return { ok: false, message: 'Delivery status could not be confirmed. Your entries are still here; submitting again may create a duplicate.' };
  }
}
