import type { BlogPost } from './blogPosts'

type LexicalNode = {
  type: string
  text?: string
  children?: LexicalNode[]
}

const INTRO_MAX_LENGTH = 260

function collectPlainText(nodes: LexicalNode[] | undefined, parts: string[]): void {
  if (!nodes?.length) return

  for (const node of nodes) {
    if (node.type === 'text' && node.text) {
      parts.push(node.text)
      continue
    }

    if (node.children?.length) {
      collectPlainText(node.children, parts)
    }
  }
}

export function lexicalToPlainText(content: Record<string, unknown> | null | undefined): string {
  if (!content) return ''

  const root =
    'root' in content && content.root && typeof content.root === 'object'
      ? (content.root as LexicalNode)
      : 'type' in content && content.type === 'root'
        ? (content as LexicalNode)
        : null

  if (!root?.children?.length) return ''

  const parts: string[] = []
  collectPlainText(root.children, parts)

  return parts.join(' ').replace(/\s+/g, ' ').trim()
}

function truncateIntro(text: string): { intro: string; isTruncated: boolean } {
  const normalized = text.replace(/\s+/g, ' ').trim()
  if (normalized.length <= INTRO_MAX_LENGTH) {
    return { intro: normalized, isTruncated: false }
  }

  const slice = normalized.slice(0, INTRO_MAX_LENGTH).replace(/\s+\S*$/, '').trim()
  return { intro: `${slice}…`, isTruncated: true }
}

export function getBlogPostIntro(post: BlogPost): { intro: string; showReadMore: boolean } {
  const excerpt = post.excerpt?.replace(/\s+/g, ' ').trim()
  const fullText = lexicalToPlainText(post.content)

  const source = excerpt || fullText
  if (!source) {
    return { intro: '', showReadMore: false }
  }

  const { intro, isTruncated } = truncateIntro(source)
  const fullIsLonger = fullText.length > INTRO_MAX_LENGTH
  const excerptIsShort = Boolean(excerpt && fullText.length > excerpt.length + 40)

  return {
    intro,
    showReadMore: isTruncated || fullIsLonger || excerptIsShort,
  }
}
