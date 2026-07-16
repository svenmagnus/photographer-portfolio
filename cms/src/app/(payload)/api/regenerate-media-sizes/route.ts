import config from '@payload-config'
import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'

import { regenerateMediaSizes } from '@/lib/regenerateMediaSizes'

export async function POST(request: Request) {
  const payload = await getPayload({ config })
  const headers = await getHeaders()
  const { user } = await payload.auth({ headers })

  if (!user) {
    return Response.json({ error: 'Nicht angemeldet' }, { status: 401 })
  }

  const body = (await request.json().catch(() => ({}))) as {
    limit?: number
    offset?: number
    force?: boolean
  }

  try {
    const result = await regenerateMediaSizes(payload, {
      limit: body.limit,
      offset: body.offset,
      force: body.force,
    })

    return Response.json({ success: true, ...result })
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}
