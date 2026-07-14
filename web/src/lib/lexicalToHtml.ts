type LexicalNode = {
  type: string
  children?: LexicalNode[]
  text?: string
  format?: number | string
  tag?: string
  url?: string
  newTab?: boolean
  listType?: 'bullet' | 'number'
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
        case 'link': {
          const href = escapeHtml(String(node.url || '#'))
          const target = node.newTab ? ' target="_blank" rel="noopener noreferrer"' : ''
          return `<a href="${href}"${target}>${renderNodes(node.children)}</a>`
        }
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
