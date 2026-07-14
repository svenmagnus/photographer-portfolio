import config from '@payload-config'
import { getPayload } from 'payload'

import { corsHeaders } from '@/lib/cors'
import { sendContactFormEmail, validateContactForm } from '@/lib/contactForm'

export async function OPTIONS(request: Request) {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(request),
  })
}

export async function POST(request: Request) {
  const headers = corsHeaders(request)

  let body: unknown

  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Ungültige Anfrage' }, { status: 400, headers })
  }

  const validation = validateContactForm(body)

  if (!validation.ok) {
    return Response.json({ error: validation.error }, { status: 400, headers })
  }

  const payload = await getPayload({ config })
  const result = await sendContactFormEmail(payload, validation.data)

  if (!result.ok) {
    return Response.json({ error: result.error }, { status: 503, headers })
  }

  return Response.json({ success: true }, { headers })
}
