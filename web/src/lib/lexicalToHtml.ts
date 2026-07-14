import { getMediaUrl, type Media } from './photoLoader'

type LinkFields = {
  url?: string
  newTab?: boolean
  linkType?: 'custom' | 'internal'
  doc?: {
    relationTo?: string
    value?:
      | number
      | string
      | {
          slug?: string
          id?: number | string
        }
  } | null
}

export type LexicalNode = {
  type: string
  children?: LexicalNode[]
  text?: string
  format?: number | string
  tag?: string
  url?: string
  newTab?: boolean
  listType?: 'bullet' | 'number'
  fields?: LinkFields & Record<string, unknown>
  value?: unknown
  relationTo?: string
  [key: string]: unknown
}

type LexicalContent = {
  root?: LexicalNode
} | LexicalNode

const FORMAT_BOLD = 1
const FORMAT_ITALIC = 2
const FORMAT_UNDERLINE = 8

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function wrapText(text: string, format: number): string {
  let result = escapeHtml(text)
  if (format & FORMAT_BOLD) result = `<strong>${result}</strong>`
  if (format & FORMAT_ITALIC) result = `<em>${result}</em>`
  if (format & FORMAT_UNDERLINE) result = `<u>${result}</u>`
  return result
}

function isMediaObject(value: unknown): value is Media {
  return Boolean(value && typeof value === 'object' && 'id' in value)
}

function mediaFromUploadNode(node: LexicalNode): Media | null {
  if (node.type !== 'upload') return null
  if (isMediaObject(node.value)) return node.value
  if (node.fields && isMediaObject(node.fields.value)) return node.fields.value as Media
  return null
}

function renderUpload(node: LexicalNode): string {
  const media = mediaFromUploadNode(node)
  if (!media) return ''

  const src = getMediaUrl(media)
  if (!src) return ''

  const alt = escapeHtml(media.alt || '')
  return `<figure class="cms-upload-image"><img src="${escapeHtml(src)}" alt="${alt}" loading="lazy" decoding="async" /></figure>`
}

function getLinkFields(node: LexicalNode): LinkFields {
  if (node.fields && typeof node.fields === 'object') {
    return node.fields
  }

  return {
    url: typeof node.url === 'string' ? node.url : undefined,
    newTab: Boolean(node.newTab),
    linkType: 'custom',
  }
}

function resolveInternalLinkHref(doc: LinkFields['doc']): string | null {
  if (!doc?.value) return null

  const value = doc.value

  if (typeof value === 'object' && typeof value.slug === 'string' && value.slug.trim()) {
    const slug = value.slug.trim()
    return slug === 'home' ? '/' : `/${slug}`
  }

  return null
}

function getLinkHref(node: LexicalNode): string {
  const fields = getLinkFields(node)

  if (fields.linkType === 'internal') {
    const internalHref = resolveInternalLinkHref(fields.doc)
    if (internalHref) return internalHref
  }

  const href = fields.url ?? (typeof node.url === 'string' ? node.url : '')
  return href.trim() || '#'
}

function renderLink(node: LexicalNode): string {
  const fields = getLinkFields(node)
  const href = escapeHtml(getLinkHref(node))
  const openInNewTab = fields.newTab ?? Boolean(node.newTab)
  const target = openInNewTab ? ' target="_blank" rel="noopener noreferrer"' : ''

  return `<a href="${href}"${target}>${renderNodes(node.children)}</a>`
}

function renderNodes(nodes: LexicalNode[] | undefined): string {
  if (!nodes?.length) return ''

  return nodes
    .map((node) => {
      switch (node.type) {
        case 'text': {
          const format = typeof node.format === 'number' ? node.format : 0
          return wrapText(node.text || '', format)
        }
        case 'linebreak':
          return '<br />'
        case 'paragraph':
          return `<p>${renderNodes(node.children)}</p>`
        case 'heading': {
          const tag = typeof node.tag === 'string' ? node.tag : 'h2'
          return `<${tag}>${renderNodes(node.children)}</${tag}>`
        }
        case 'link':
        case 'autolink':
          return renderLink(node)
        case 'upload':
          return renderUpload(node)
        case 'list': {
          const tag = node.listType === 'number' ? 'ol' : 'ul'
          return `<${tag}>${renderNodes(node.children)}</${tag}>`
        }
        case 'listitem':
          return `<li>${renderNodes(node.children)}</li>`
        case 'quote':
          return `<blockquote>${renderNodes(node.children)}</blockquote>`
        case 'horizontalrule':
          return '<hr />'
        default:
          return node.children ? renderNodes(node.children) : ''
      }
    })
    .join('')
}

export function lexicalToHtml(content: LexicalContent | null | undefined): string {
  if (!content) return ''

  const root =
    'root' in content && content.root
      ? content.root
      : 'type' in content && content.type === 'root'
        ? content
        : null

  if (!root) return ''

  return renderNodes(root.children)
}
