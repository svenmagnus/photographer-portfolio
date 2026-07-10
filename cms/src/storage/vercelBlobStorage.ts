import { cloudStoragePlugin } from '@payloadcms/plugin-cloud-storage'
import { getFileKey } from '@payloadcms/plugin-cloud-storage/utilities'
import { initClientUploads } from '@payloadcms/plugin-cloud-storage/utilities'
import { handleUpload } from '@vercel/blob/client'
import { del, head, put } from '@vercel/blob'
import { BlobNotFoundError } from '@vercel/blob'
import { getFilePrefix as getDocPrefix } from '@payloadcms/plugin-cloud-storage/utilities'
import { APIError, Forbidden } from 'payload'
import { getRangeRequestInfo } from 'payload/internal'
import path from 'path'
import type { CollectionConfig, Plugin } from 'payload'

import {
  getBlobAuthOptions,
  getPayloadBlobPluginToken,
  getVercelBlobReadWriteToken,
  resolveBlobStoreIdFromToken,
} from '@/lib/vercelBlob'

type VercelBlobStorageOptions = {
  access?: 'public' | 'private'
  addRandomSuffix?: boolean
  cacheControlMaxAge?: number
  clientUploads?: boolean | { access?: typeof defaultClientUploadAccess }
  collections: Record<string, boolean | object>
  enabled?: boolean
  token?: string
  useCompositePrefixes?: boolean
}

const defaultUploadOptions = {
  access: 'public' as const,
  addRandomSuffix: false,
  cacheControlMaxAge: 60 * 60 * 24 * 365,
  enabled: true,
}

const defaultClientUploadAccess = ({ req }: { req: { user?: unknown } }) => Boolean(req.user)

function getClientUploadRoute({
  access = defaultClientUploadAccess,
  addRandomSuffix,
  cacheControlMaxAge,
  token,
}: {
  access?: (args: { collectionSlug?: string; req: { user?: unknown } }) => boolean | Promise<boolean>
  addRandomSuffix?: boolean
  cacheControlMaxAge?: number
  token: string
}) {
  // Payload passes a Next/Payload request object here, not a plain Fetch Request.
  return async (req: any) => {
    const body = await req.json()

    try {
      const jsonResponse = await handleUpload({
        body,
        onBeforeGenerateToken: async (_pathname, collectionSlug) => {
          if (!collectionSlug) {
            throw new APIError('No payload was provided')
          }

          if (
            !(await access({
              collectionSlug,
              req: req as { user?: unknown },
            }))
          ) {
            throw new Forbidden()
          }

          return Promise.resolve({
            addRandomSuffix,
            cacheControlMaxAge,
          })
        },
        onUploadCompleted: async () => {},
        request: req,
        token,
      })

      return Response.json(jsonResponse)
    } catch (error) {
      req.payload?.logger.error(error)
      throw new APIError('storage-vercel-blob client upload route error')
    }
  }
}

function generateURL({
  baseUrl,
  collectionPrefix = '',
  filename,
  prefix,
  useCompositePrefixes = false,
}: {
  baseUrl: string
  collectionPrefix?: string
  filename: string
  prefix?: string
  useCompositePrefixes?: boolean
}) {
  const { fileKey: fileKeyWithPrefix } = getFileKey({
    collectionPrefix,
    docPrefix: prefix,
    filename,
    useCompositePrefixes,
  })

  const dir = path.posix.dirname(fileKeyWithPrefix)
  const encodedFilename = encodeURIComponent(path.posix.basename(fileKeyWithPrefix))
  const fileKeyWithEncodedFilename =
    dir === '.' ? encodedFilename : path.posix.join(dir, encodedFilename)

  return `${baseUrl}/${fileKeyWithEncodedFilename}`
}

function createOidcAwareVercelBlobAdapter({
  access,
  addRandomSuffix,
  baseUrl,
  cacheControlMaxAge,
  clientUploads,
  useCompositePrefixes = false,
}: {
  access: 'public' | 'private'
  addRandomSuffix: boolean
  baseUrl: string
  cacheControlMaxAge: number
  clientUploads?: boolean
  useCompositePrefixes?: boolean
}) {
  const authOptions = getBlobAuthOptions()

  return ({ collection, prefix = '' }: { collection: CollectionConfig; prefix?: string }) => ({
    name: 'vercel-blob',
    clientUploads,
    generateURL: ({ filename, prefix: urlPrefix = '' }: { filename: string; prefix?: string }) =>
      generateURL({
        baseUrl,
        collectionPrefix: prefix,
        filename,
        prefix: urlPrefix,
        useCompositePrefixes,
      }),
    handleDelete: async ({
      doc: { prefix: docPrefix = '' },
      filename,
    }: {
      doc: { prefix?: string }
      filename: string
    }) => {
      const fileUrl = generateURL({
        baseUrl,
        collectionPrefix: prefix,
        filename,
        prefix: docPrefix,
        useCompositePrefixes,
      })

      await del(fileUrl, authOptions)
    },
    handleUpload: async ({
      data,
      file: { buffer, filename, mimeType },
    }: {
      data: { prefix?: string; filename?: string }
      file: { buffer: Buffer; filename: string; mimeType: string }
    }) => {
      const { fileKey } = getFileKey({
        collectionPrefix: prefix,
        docPrefix: data.prefix,
        filename,
        useCompositePrefixes,
      })

      const result = await put(fileKey, buffer, {
        access,
        addRandomSuffix,
        cacheControlMaxAge,
        contentType: mimeType,
        ...authOptions,
      })

      if (addRandomSuffix) {
        const pathname = result.pathname.replace(/^\/+/, '')
        const basename = path.posix.basename(pathname)
        data.filename = decodeURIComponent(basename)
      }

      return data
    },
    staticHandler: async (
      req: any,
      {
        headers,
        params: { clientUploadContext, filename, prefix: prefixQueryParam },
      }: {
        headers: Headers
        params: {
          clientUploadContext?: unknown
          filename: string
          prefix?: string
        }
      },
    ) => {
      try {
        const docPrefix = await getDocPrefix({
          clientUploadContext,
          collection,
          filename,
          prefixQueryParam,
          req,
        })

        const fileUrl = generateURL({
          baseUrl,
          collectionPrefix: prefix,
          filename,
          prefix: docPrefix,
          useCompositePrefixes,
        })

        const etagFromHeaders = req.headers.get('etag') || req.headers.get('if-none-match')
        const blobMetadata = await head(fileUrl, authOptions)
        const { contentDisposition, contentType, size, uploadedAt } = blobMetadata
        const uploadedAtString = uploadedAt.toISOString()
        const fileKeyForETag = fileUrl.replace(`${baseUrl}/`, '')
        const ETag = `"${fileKeyForETag}-${uploadedAtString}"`

        const rangeHeader = req.headers.get('range')
        const rangeResult = getRangeRequestInfo({
          fileSize: size,
          rangeHeader,
        })

        if (rangeResult.type === 'invalid') {
          return new Response(null, {
            headers: new Headers(rangeResult.headers),
            status: rangeResult.status,
          })
        }

        let responseHeaders = new Headers(headers)

        for (const [key, value] of Object.entries(rangeResult.headers)) {
          responseHeaders.append(key, value)
        }

        responseHeaders.append('Cache-Control', `public, max-age=${cacheControlMaxAge}`)
        responseHeaders.append('Content-Disposition', contentDisposition)
        responseHeaders.append('Content-Type', contentType)
        responseHeaders.append('ETag', ETag)

        if (contentType === 'image/svg+xml') {
          responseHeaders.append('Content-Security-Policy', "script-src 'none'")
        }

        if (
          collection.upload &&
          typeof collection.upload === 'object' &&
          typeof collection.upload.modifyResponseHeaders === 'function'
        ) {
          responseHeaders =
            collection.upload.modifyResponseHeaders({
              headers: responseHeaders,
            }) || responseHeaders
        }

        if (etagFromHeaders && etagFromHeaders === ETag) {
          return new Response(null, {
            headers: responseHeaders,
            status: 304,
          })
        }

        const response = await fetch(`${fileUrl}?${uploadedAtString}`, {
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate',
            Pragma: 'no-cache',
            ...(rangeResult.type === 'partial' && {
              Range: `bytes=${rangeResult.rangeStart}-${rangeResult.rangeEnd}`,
            }),
          },
        })

        if (!response.ok || !response.body) {
          return new Response(null, {
            status: 204,
            statusText: 'No Content',
          })
        }

        responseHeaders.append('Last-Modified', uploadedAtString)

        return new Response(response.body, {
          headers: responseHeaders,
          status: rangeResult.status,
        })
      } catch (err) {
        if (err instanceof BlobNotFoundError) {
          return new Response(null, {
            status: 404,
            statusText: 'Not Found',
          })
        }

        return new Response('Internal Server Error', {
          status: 500,
        })
      }
    },
  })
}

export function vercelBlobStorage(options: VercelBlobStorageOptions): Plugin {
  return (incomingConfig) => {
    const pluginToken = options.token ?? getPayloadBlobPluginToken()
    const storeId = resolveBlobStoreIdFromToken(pluginToken)
    const isPluginDisabled = options.enabled === false || !pluginToken || !storeId

    if (!storeId && !isPluginDisabled) {
      throw new Error(
        'Invalid Vercel Blob configuration. Set BLOB_READ_WRITE_TOKEN or connect a Blob store (BLOB_STORE_ID).',
      )
    }

    const optionsWithDefaults = {
      ...defaultUploadOptions,
      ...options,
      token: pluginToken,
    }

    const readWriteToken = getVercelBlobReadWriteToken()
    const baseUrl =
      process.env.STORAGE_VERCEL_BLOB_BASE_URL ||
      `https://${storeId}.${optionsWithDefaults.access}.blob.vercel-storage.com`

    initClientUploads({
      clientHandler: '@payloadcms/storage-vercel-blob/client#VercelBlobClientUploadHandler',
      collections: options.collections,
      config: incomingConfig,
      enabled: !isPluginDisabled && Boolean(options.clientUploads) && Boolean(readWriteToken),
      extraClientHandlerProps: () => ({
        addRandomSuffix: !!optionsWithDefaults.addRandomSuffix,
        useCompositePrefixes: !!options.useCompositePrefixes,
      }),
      serverHandler: getClientUploadRoute({
        access:
          typeof options.clientUploads === 'object' ? options.clientUploads.access : undefined,
        addRandomSuffix: optionsWithDefaults.addRandomSuffix,
        cacheControlMaxAge: options.cacheControlMaxAge,
        token: readWriteToken ?? '',
      }),
      serverHandlerPath: '/vercel-blob-client-upload-route',
    })

    if (isPluginDisabled) {
      return incomingConfig
    }

    const adapter = createOidcAwareVercelBlobAdapter({
      access: optionsWithDefaults.access ?? 'public',
      addRandomSuffix: optionsWithDefaults.addRandomSuffix,
      baseUrl,
      cacheControlMaxAge: optionsWithDefaults.cacheControlMaxAge ?? 60 * 60 * 24 * 365,
      clientUploads: optionsWithDefaults.clientUploads && Boolean(readWriteToken),
      useCompositePrefixes: options.useCompositePrefixes,
    })

    const collectionsWithAdapter = Object.entries(options.collections).reduce(
      (acc, [slug, collOptions]) => ({
        ...acc,
        [slug]: {
          ...(collOptions === true ? {} : collOptions),
          adapter,
        },
      }),
      {},
    )

    const config = {
      ...incomingConfig,
      collections: (incomingConfig.collections || []).map((collection) => {
        if (!collectionsWithAdapter[collection.slug as keyof typeof collectionsWithAdapter]) {
          return collection
        }

        return {
          ...collection,
          upload: {
            ...(typeof collection.upload === 'object' ? collection.upload : {}),
            disableLocalStorage: true,
          },
        }
      }),
    }

    return cloudStoragePlugin({
      collections: collectionsWithAdapter,
      useCompositePrefixes: options.useCompositePrefixes,
    })(config)
  }
}
