import { nodemailerAdapter } from '@payloadcms/email-nodemailer'

function getSmtpPort(): number {
  const port = Number.parseInt(process.env.SMTP_PORT || '587', 10)
  return Number.isFinite(port) ? port : 587
}

export function isEmailConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS)
}

export function getEmailConfig() {
  if (!isEmailConfigured()) return undefined

  return nodemailerAdapter({
    defaultFromAddress:
      process.env.SMTP_FROM_ADDRESS || process.env.SMTP_USER || 'noreply@svenmagnus.com',
    defaultFromName: process.env.SMTP_FROM_NAME || 'Sven Magnus Portfolio',
    transportOptions: {
      host: process.env.SMTP_HOST,
      port: getSmtpPort(),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    },
  })
}
