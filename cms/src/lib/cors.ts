const defaultOrigins = [
  'https://svenmagnus.com',
  'https://www.svenmagnus.com',
  'https://photographer-portfolio-web.vercel.app',
  'http://localhost:4321',
]

export function getAllowedOrigins(): string[] {
  const envOrigins =
    process.env.CORS_ORIGINS?.split(',').map((origin) => origin.trim()).filter(Boolean) ?? []

  const serverUrl = process.env.PAYLOAD_PUBLIC_SERVER_URL
  const origins = envOrigins.length > 0 ? envOrigins : defaultOrigins

  if (serverUrl) {
    return [...new Set([...origins, serverUrl])]
  }

  return origins
}

export function corsHeaders(request: Request): HeadersInit {
  const origin = request.headers.get('origin')
  const allowed = getAllowedOrigins()
  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    Vary: 'Origin',
  }

  if (origin && allowed.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin
  }

  return headers
}
