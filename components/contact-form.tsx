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
      setFeedback({ ok: false, message: 'Connection failed. Check your network and try again. Your entries are still here.' });
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="form-stack" onSubmit={submit} aria-busy={pending}>
      <fieldset className="form-stack" disabled={pending}>
        <legend>Enquiry type</legend>
        <label className="field" htmlFor="kind">
          I am getting in touch about
          <select id="kind" name="kind" defaultValue="product" required>
            <option value="product">A GUMNLY product</option>
            <option value="project">A custom development project</option>
          </select>
        </label>
      </fieldset>
      <label className="field" htmlFor="name">Name
        <input id="name" name="name" required maxLength={100} autoComplete="name" />
      </label>
      <label className="field" htmlFor="email">Email
        <input id="email" name="email" type="email" required maxLength={254} autoComplete="email" />
      </label>
      <label className="field" htmlFor="message">Message
        <textarea id="message" name="message" required minLength={10} maxLength={5000} />
      </label>
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="website">Leave this field empty
          <input id="website" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <label className="field" style={{ gridAutoFlow: 'column', justifyContent: 'start', gap: '0.6rem', display: 'flex' }}>
        <input type="checkbox" name="consent" required style={{ width: '1.1rem', height: '1.1rem' }} />
        <span>I agree to the processing of my data as described in the <a href="/privacy">Privacy</a>.</span>
      </label>
      <button className="button" type="submit">{pending ? 'Sending…' : 'Send enquiry'}</button>
      {feedback && (
        <p className={feedback.ok ? 'notice' : 'notice notice-error'} role={feedback.ok ? 'status' : 'alert'}>
          {feedback.message}
        </p>
      )}
    </form>
  );
}
