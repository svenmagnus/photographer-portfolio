export function getBlobStoreId(): string | undefined {
  const raw = process.env.BLOB_STORE_ID?.trim()
  if (!raw) return undefined

  return raw.replace(/^store_/i, '').toLowerCase()
}

export function getVercelBlobReadWriteToken(): string | undefined {
  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim()
  return token || undefined
}

export function usesVercelBlobOidc(): boolean {
  return (
    process.env.VERCEL === '1' &&
    Boolean(getBlobStoreId()) &&
    !getVercelBlobReadWriteToken()
  )
}

export function isVercelBlobConfigured(): boolean {
  if (getVercelBlobReadWriteToken()) return true
  if (process.env.VERCEL === '1' && getBlobStoreId()) return true
  return false
}

/**
 * Payload's vercel-blob plugin requires a token-shaped string to enable itself.
 * With OIDC-only setups, Vercel injects BLOB_STORE_ID instead of BLOB_READ_WRITE_TOKEN.
 */
export function getPayloadBlobPluginToken(): string | undefined {
  const token = getVercelBlobReadWriteToken()
  if (token) return token

  const storeId = getBlobStoreId()
  if (storeId && process.env.VERCEL === '1') {
    return `vercel_blob_rw_${storeId}_oidc`
  }

  return undefined
}

export function resolveBlobStoreIdFromToken(token: string | undefined): string | undefined {
  if (!token) return undefined

  const fromToken = token.match(/^vercel_blob_rw_([a-z\d]+)_[a-z\d]+$/i)?.[1]?.toLowerCase()
  return fromToken || getBlobStoreId()
}

export function getBlobAuthOptions(): { token?: string } {
  const token = getVercelBlobReadWriteToken()
  return token ? { token } : {}
}
