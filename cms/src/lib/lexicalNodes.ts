type LexicalTextNode = {
  type: 'text'
  mode?: 'normal'
  text: string
  style?: string
  detail?: number
  format: number
  version: number
}

type LexicalParagraphNode = {
  type: 'paragraph'
  children: Array<LexicalTextNode | LexicalLinkNode | LexicalAutolinkNode>
  direction: null
  format: 'start' | ''
  indent: 0
  version: number
  textStyle?: string
  textFormat?: number
}

type LexicalHeadingNode = {
  tag: 'h1' | 'h2' | 'h3'
  type: 'heading'
  children: LexicalTextNode[]
  direction: null
  format: 'start' | ''
  indent: 0
  version: number
}

type LexicalLinkNode = {
  type: 'link'
  fields: {
    url: string
    newTab?: boolean
    linkType: 'custom'
  }
  format: ''
  indent: 0
  version: 3
  children: LexicalTextNode[]
  direction: null
}

type LexicalAutolinkNode = {
  type: 'autolink'
  fields: {
    url: string
    linkType: 'custom'
  }
  format: ''
  indent: 0
  version: 2
  children: LexicalTextNode[]
  direction: null
}

type LexicalChild = LexicalParagraphNode | LexicalHeadingNode

const FORMAT_BOLD = 1

function textNode(text: string, format = 0): LexicalTextNode {
  return {
    type: 'text',
    mode: 'normal',
    text,
    style: '',
    detail: 0,
    format,
    version: 1,
  }
}

export function lexicalHeading(text: string, tag: 'h1' | 'h2' | 'h3' = 'h2'): LexicalHeadingNode {
  return {
    tag,
    type: 'heading',
    format: 'start',
    indent: 0,
    version: 1,
    children: [textNode(text)],
    direction: null,
  }
}

export function lexicalParagraph(text: string): LexicalParagraphNode {
  return {
    type: 'paragraph',
    format: 'start',
    indent: 0,
    version: 1,
    children: [textNode(text)],
    direction: null,
    textStyle: '',
    textFormat: 0,
  }
}

export function lexicalParagraphWithBoldPrefix(prefix: string, text: string): LexicalParagraphNode {
  return {
    type: 'paragraph',
    format: 'start',
    indent: 0,
    version: 1,
    children: [textNode(prefix, FORMAT_BOLD), textNode(text)],
    direction: null,
    textStyle: '',
    textFormat: 0,
  }
}

export function lexicalParagraphWithAutolink(
  prefix: string,
  linkText: string,
  url: string,
): LexicalParagraphNode {
  const link: LexicalAutolinkNode = {
    type: 'autolink',
    fields: {
      url,
      linkType: 'custom',
    },
    format: '',
    indent: 0,
    version: 2,
    children: [textNode(linkText)],
    direction: null,
  }

  return {
    type: 'paragraph',
    format: 'start',
    indent: 0,
    version: 1,
    children: prefix ? [textNode(prefix), link] : [link],
    direction: null,
    textStyle: '',
    textFormat: 0,
  }
}

export function lexicalParagraphWithLink(
  prefix: string,
  linkText: string,
  url: string,
): LexicalParagraphNode {
  const link: LexicalLinkNode = {
    type: 'link',
    fields: {
      url,
      newTab: true,
      linkType: 'custom',
    },
    format: '',
    indent: 0,
    version: 3,
    children: [textNode(linkText)],
    direction: null,
  }

  return {
    type: 'paragraph',
    format: 'start',
    indent: 0,
    version: 1,
    children: prefix ? [textNode(prefix), link] : [link],
    direction: null,
    textStyle: '',
    textFormat: 0,
  }
}

export function lexicalRoot(...children: LexicalChild[]) {
  return {
    root: {
      type: 'root' as const,
      format: '' as const,
      indent: 0 as const,
      version: 1,
      children,
      direction: 'ltr' as const,
    },
  }
}
