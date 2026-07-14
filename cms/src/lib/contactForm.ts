import type { Payload } from 'payload'

export interface ContactFormPayload {
  name: string
  email: string
  message: string
  website?: string
}

export interface ContactFormValidation {
  ok: true
  data: ContactFormPayload
}

export interface ContactFormValidationError {
  ok: false
  error: string
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateContactForm(body: unknown): ContactFormValidation | ContactFormValidationError {
  if (!body || typeof body !== 'object') {
    return { ok: false, error: 'Ungültige Anfrage' }
  }

  const { name, email, message, website } = body as Record<string, unknown>

  if (typeof website === 'string' && website.trim()) {
    return { ok: false, error: 'Anfrage abgelehnt' }
  }

  if (typeof name !== 'string' || name.trim().length < 2) {
    return { ok: false, error: 'Bitte einen gültigen Namen angeben' }
  }

  if (typeof email !== 'string' || !EMAIL_PATTERN.test(email.trim())) {
    return { ok: false, error: 'Bitte eine gültige E-Mail-Adresse angeben' }
  }

  if (typeof message !== 'string' || message.trim().length < 10) {
    return { ok: false, error: 'Bitte eine Nachricht mit mindestens 10 Zeichen schreiben' }
  }

  if (message.trim().length > 10000) {
    return { ok: false, error: 'Die Nachricht ist zu lang' }
  }

  return {
    ok: true,
    data: {
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
    },
  }
}

export async function sendContactFormEmail(
  payload: Payload,
  data: ContactFormPayload,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!payload.email) {
    return {
      ok: false,
      error: 'E-Mail-Versand ist nicht konfiguriert. Bitte SMTP in Vercel setzen.',
    }
  }

  const settings = await payload.findGlobal({
    slug: 'site-settings',
    depth: 0,
  })

  const recipient =
    settings.contactEmail || settings.professionalEmail || process.env.SMTP_FROM_ADDRESS

  if (!recipient) {
    return {
      ok: false,
      error: 'Kein Empfänger in den Website-Einstellungen hinterlegt.',
    }
  }

  const subject = `Kontaktanfrage von ${data.name}`
  const html = `
    <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
    <p><strong>E-Mail:</strong> ${escapeHtml(data.email)}</p>
    <p><strong>Nachricht:</strong></p>
    <p>${escapeHtml(data.message).replace(/\n/g, '<br>')}</p>
  `.trim()

  try {
    await payload.sendEmail({
      to: recipient,
      replyTo: data.email,
      subject,
      html,
    })

    return { ok: true }
  } catch (error) {
    payload.logger.error(error)
    return {
      ok: false,
      error: 'Die Nachricht konnte nicht gesendet werden. Bitte später erneut versuchen.',
    }
  }
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}
