/**
 * Test Strato SMTP credentials locally before relying on "Forgot password".
 *
 * Usage:
 *   cd cms
 *   SMTP_HOST=smtp.strato.de SMTP_USER=info@svenmagnus.com SMTP_PASS="..." \
 *     node scripts/test-smtp.mjs info@svenmagnus.com
 */
import nodemailer from 'nodemailer'

const to = process.argv[2]
const host = process.env.SMTP_HOST
const user = process.env.SMTP_USER
const pass = process.env.SMTP_PASS

if (!host || !user || !pass || !to) {
  console.error(
    'Usage: SMTP_HOST=... SMTP_USER=... SMTP_PASS=... node scripts/test-smtp.mjs <to-email>',
  )
  process.exit(1)
}

const port = Number.parseInt(process.env.SMTP_PORT || '465', 10)
const secure = process.env.SMTP_SECURE !== 'false' && port === 465

const transporter = nodemailer.createTransport({
  host,
  port,
  secure,
  auth: { user, pass },
  tls: { minVersion: 'TLSv1.2' },
})

try {
  await transporter.verify()
  console.log('SMTP connection OK')

  const info = await transporter.sendMail({
    from: process.env.SMTP_FROM_ADDRESS || user,
    to,
    subject: 'SMTP Test — Sven Magnus Portfolio CMS',
    text: 'Wenn du diese Mail siehst, funktioniert Strato SMTP.',
  })

  console.log('Test mail sent:', info.messageId)
} catch (error) {
  console.error('SMTP failed:', error instanceof Error ? error.message : error)
  process.exit(1)
}
