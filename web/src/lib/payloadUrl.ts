/** Payload-API-URL — zur Laufzeit auf Vercel, sonst Build-Zeit-Fallback. */
export function getPayloadUrl(): string {
  const runtime =
    typeof process !== 'undefined' && process.env.PUBLIC_PAYLOAD_URL
      ? process.env.PUBLIC_PAYLOAD_URL
      : undefined

  const baked = import.meta.env.PUBLIC_PAYLOAD_URL
  return (runtime || baked || 'http://localhost:3000').replace(/\/$/, '')
}
