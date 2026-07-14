import type { CollectionConfig } from 'payload'

function getResetPasswordUrl(token: string): string {
  const serverURL = (
    process.env.PAYLOAD_PUBLIC_SERVER_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
  ).replace(/\/$/, '')

  return `${serverURL}/admin/reset/${token}`
}

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: {
    forgotPassword: {
      generateEmailSubject: () => 'Passwort zurücksetzen — Sven Magnus Portfolio',
      generateEmailHTML: (args) => {
        const token = args?.token ?? ''
        const user = args?.user
        const resetUrl = getResetPasswordUrl(token)

        return `
          <p>Hallo,</p>
          <p>du hast ein neues Passwort für dein Portfolio-CMS angefordert.</p>
          <p><a href="${resetUrl}">Passwort jetzt zurücksetzen</a></p>
          <p>Falls du das nicht warst, kannst du diese E-Mail ignorieren.</p>
          <p style="color:#666;font-size:12px;">Konto: ${user?.email ?? ''}</p>
        `
      },
    },
  },
  fields: [],
}
