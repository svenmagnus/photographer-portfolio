import type { Payload } from 'payload'

/**
 * ============================================================================
 * MODEL-BEWERBUNG — Server-Validierung & E-Mail-Versand
 * ============================================================================
 *
 * Empfängt multipart/form-data vom Frontend, prüft alle Felder und sendet
 * die Bewerbung per E-Mail (inkl. Foto-Anhänge) an die Website-Einstellungen.
 * ============================================================================
 */

export interface ModelApplicationData {
  firstName: string
  lastName: string
  birthDate: string
  age: number
  location: string
  email: string
  phone: string
  instagram?: string
  tiktok?: string
  heightCm: number
  bustCm: number
  waistCm: number
  hipsCm: number
  clothingSize: string
  shoeSize: number
  hairColor: string
  eyeColor: string
  photos: {
    polaFront: File
    polaBack: File
    polaProfile: File
    polaPortrait: File
  }
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX_FILE_SIZE = 8 * 1024 * 1024
const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'])

const PHOTO_FIELDS = ['polaFront', 'polaBack', 'polaProfile', 'polaPortrait'] as const

export function validateModelApplicationForm(
  formData: FormData,
): { ok: true; data: ModelApplicationData } | { ok: false; error: string } {
  /** Honeypot */
  const website = getString(formData, 'website')
  if (website) {
    return { ok: false, error: 'Anfrage abgelehnt' }
  }

  const firstName = getString(formData, 'firstName')
  const lastName = getString(formData, 'lastName')
  const birthDate = getString(formData, 'birthDate')
  const location = getString(formData, 'location')
  const email = getString(formData, 'email')
  const phone = getString(formData, 'phone')
  const clothingSize = getString(formData, 'clothingSize')
  const hairColor = getString(formData, 'hairColor')
  const eyeColor = getString(formData, 'eyeColor')

  if (!firstName || !lastName) {
    return { ok: false, error: 'Bitte Vor- und Nachname angeben' }
  }

  if (!birthDate) {
    return { ok: false, error: 'Bitte Geburtsdatum angeben' }
  }

  if (!location) {
    return { ok: false, error: 'Bitte Wohnort angeben' }
  }

  if (!email || !EMAIL_PATTERN.test(email)) {
    return { ok: false, error: 'Bitte eine gültige E-Mail-Adresse angeben' }
  }

  if (!phone || phone.length < 6) {
    return { ok: false, error: 'Bitte eine gültige Telefonnummer angeben' }
  }

  const age = parsePositiveInt(getString(formData, 'age'))
  if (age == null || age < 14 || age > 99) {
    return { ok: false, error: 'Bitte ein gültiges Alter angeben' }
  }

  const heightCm = parsePositiveFloat(getString(formData, 'heightCm'))
  const bustCm = parsePositiveFloat(getString(formData, 'bustCm'))
  const waistCm = parsePositiveFloat(getString(formData, 'waistCm'))
  const hipsCm = parsePositiveFloat(getString(formData, 'hipsCm'))
  const shoeSize = parsePositiveFloat(getString(formData, 'shoeSize'))

  if ([heightCm, bustCm, waistCm, hipsCm, shoeSize].some((value) => value == null)) {
    return { ok: false, error: 'Bitte alle Körpermaße korrekt angeben' }
  }

  if (!clothingSize) {
    return { ok: false, error: 'Bitte Konfektionsgröße wählen' }
  }

  if (!hairColor || !eyeColor) {
    return { ok: false, error: 'Bitte Haar- und Augenfarbe angeben' }
  }

  const privacyConsent = formData.get('privacyConsent')
  if (privacyConsent !== 'on') {
    return { ok: false, error: 'Bitte der Datenschutzerklärung zustimmen' }
  }

  const photos = {} as ModelApplicationData['photos']

  for (const field of PHOTO_FIELDS) {
    const file = formData.get(field)
    if (!(file instanceof File) || file.size === 0) {
      return { ok: false, error: `Bitte Foto „${field}" hochladen` }
    }

    if (file.size > MAX_FILE_SIZE) {
      return { ok: false, error: `Datei „${file.name}" ist zu groß (max. 8 MB)` }
    }

    const mime = file.type.toLowerCase()
    if (mime && !ALLOWED_MIME.has(mime)) {
      return { ok: false, error: `Datei „${file.name}" hat ein ungültiges Format` }
    }

    photos[field] = file
  }

  return {
    ok: true,
    data: {
      firstName,
      lastName,
      birthDate,
      age,
      location,
      email,
      phone,
      instagram: getString(formData, 'instagram') || undefined,
      tiktok: getString(formData, 'tiktok') || undefined,
      heightCm: heightCm!,
      bustCm: bustCm!,
      waistCm: waistCm!,
      hipsCm: hipsCm!,
      clothingSize,
      shoeSize: shoeSize!,
      hairColor,
      eyeColor,
      photos,
    },
  }
}

export async function sendModelApplicationEmail(
  payload: Payload,
  data: ModelApplicationData,
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

  const fullName = `${data.firstName} ${data.lastName}`
  const subject = `Model-Bewerbung: ${fullName}`

  const html = `
    <h2>Neue Model-Bewerbung</h2>
    <h3>Persönliche Daten</h3>
    <p><strong>Name:</strong> ${escapeHtml(fullName)}</p>
    <p><strong>Geburtsdatum:</strong> ${escapeHtml(data.birthDate)} (${data.age} Jahre)</p>
    <p><strong>Wohnort:</strong> ${escapeHtml(data.location)}</p>
    <p><strong>E-Mail:</strong> ${escapeHtml(data.email)}</p>
    <p><strong>Telefon:</strong> ${escapeHtml(data.phone)}</p>
    ${data.instagram ? `<p><strong>Instagram:</strong> ${escapeHtml(data.instagram)}</p>` : ''}
    ${data.tiktok ? `<p><strong>TikTok:</strong> ${escapeHtml(data.tiktok)}</p>` : ''}
    <h3>Körpermaße</h3>
    <p><strong>Größe:</strong> ${data.heightCm} cm</p>
    <p><strong>Brust / Taille / Hüfte:</strong> ${data.bustCm} / ${data.waistCm} / ${data.hipsCm} cm</p>
    <p><strong>Konfektion:</strong> ${escapeHtml(data.clothingSize)}</p>
    <p><strong>Schuhgröße:</strong> ${data.shoeSize}</p>
    <p><strong>Haare / Augen:</strong> ${escapeHtml(data.hairColor)} / ${escapeHtml(data.eyeColor)}</p>
    <p>Die vier Polas sind als Anhänge beigefügt.</p>
  `.trim()

  const attachments = await Promise.all([
    fileToAttachment(data.photos.polaFront, '1-ganzkoerper-vorne'),
    fileToAttachment(data.photos.polaBack, '2-ganzkoerper-hinten'),
    fileToAttachment(data.photos.polaProfile, '3-profil'),
    fileToAttachment(data.photos.polaPortrait, '4-portraet'),
  ])

  try {
    await payload.sendEmail({
      to: recipient,
      replyTo: data.email,
      subject,
      html,
      attachments,
    })

    return { ok: true }
  } catch (error) {
    payload.logger.error(error)
    return {
      ok: false,
      error: 'Die Bewerbung konnte nicht gesendet werden. Bitte später erneut versuchen.',
    }
  }
}

function getString(formData: FormData, key: string): string {
  return String(formData.get(key) || '').trim()
}

function parsePositiveInt(value: string): number | null {
  const num = Number.parseInt(value, 10)
  return Number.isNaN(num) ? null : num
}

function parsePositiveFloat(value: string): number | null {
  const num = Number.parseFloat(value.replace(',', '.'))
  return Number.isNaN(num) || num <= 0 ? null : num
}

async function fileToAttachment(
  file: File,
  prefix: string,
): Promise<{ filename: string; content: Buffer; contentType?: string }> {
  const buffer = Buffer.from(await file.arrayBuffer())
  const extension = file.name.includes('.') ? file.name.slice(file.name.lastIndexOf('.')) : '.jpg'

  return {
    filename: `${prefix}${extension}`,
    content: buffer,
    contentType: file.type || undefined,
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
