import { nodemailerAdapter } from '@payloadcms/email-nodemailer'

function getSmtpPort(): number {
  const port = Number.parseInt(process.env.SMTP_PORT || '', 10)
  if (Number.isFinite(port)) return port

  // Strato standard: SSL on port 465
  if (process.env.SMTP_HOST?.includes('strato.de')) return 465

  return 587
}

function isSmtpSecure(port: number): boolean {
  if (process.env.SMTP_SECURE === 'true') return true
  if (process.env.SMTP_SECURE === 'false') return false

  // Strato + port 465 expect implicit TLS
  return port === 465
}

export function isEmailConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS)
}

export function getEmailConfig() {
  if (!isEmailConfigured()) return undefined

  const port = getSmtpPort()
  const secure = isSmtpSecure(port)

  return nodemailerAdapter({
    defaultFromAddress:
      process.env.SMTP_FROM_ADDRESS || process.env.SMTP_USER || 'info@svenmagnus.com',
    defaultFromName: process.env.SMTP_FROM_NAME || 'Sven Magnus Portfolio',
    transportOptions: {
      host: process.env.SMTP_HOST,
      port,
      secure,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        minVersion: 'TLSv1.2',
      },
    },
  })
}
