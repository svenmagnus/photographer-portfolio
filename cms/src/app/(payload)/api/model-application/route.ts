import config from '@payload-config'
import { getPayload } from 'payload'

import { corsHeaders } from '@/lib/cors'
import { sendModelApplicationEmail, validateModelApplicationForm } from '@/lib/modelApplicationForm'

/** CORS-Preflight für Cross-Origin-Requests vom Astro-Frontend */
export async function OPTIONS(request: Request) {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(request),
  })
}

/** Empfängt Model-Bewerbungen als multipart/form-data (Text + 4 Fotos) */
export async function POST(request: Request) {
  const headers = corsHeaders(request)

  let formData: FormData

  try {
    formData = await request.formData()
  } catch {
    return Response.json({ error: 'Ungültige Anfrage' }, { status: 400, headers })
  }

  const validation = validateModelApplicationForm(formData)

  if (!validation.ok) {
    return Response.json({ error: validation.error }, { status: 400, headers })
  }

  const payload = await getPayload({ config })
  const result = await sendModelApplicationEmail(payload, validation.data)

  if (!result.ok) {
    return Response.json({ error: result.error }, { status: 503, headers })
  }

  return Response.json({ success: true }, { headers })
}
