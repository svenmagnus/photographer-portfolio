import type { APIRoute } from 'astro'
import { cmsFetch, CMS_REVALIDATE_SECONDS } from '../../lib/cmsFetch'

export const prerender = false

export const GET: APIRoute = async ({ url }) => {
  const params = new URLSearchParams({
    depth: '1',
    limit: '200',
    sort: '-date',
  })

  const category = url.searchParams.get('category')
  if (category) {
    params.set('where[category][equals]', category)
  }

  try {
    const response = await cmsFetch(`/api/photos?${params.toString()}`)
    const body = await response.text()

    return new Response(body, {
      status: response.status,
      headers: {
        'content-type': response.headers.get('content-type') || 'application/json',
        'cache-control': `public, s-maxage=${CMS_REVALIDATE_SECONDS}, stale-while-revalidate=${CMS_REVALIDATE_SECONDS * 24}`,
      },
    })
  } catch {
    return new Response(JSON.stringify({ docs: [], totalDocs: 0, error: 'cms_timeout' }), {
      status: 504,
      headers: {
        'content-type': 'application/json',
        'cache-control': 'no-store',
      },
    })
  }
}
