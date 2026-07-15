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
  children: Array<LexicalTextNode | LexicalLinkNode>
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
    newTab: boolean
    linkType: 'custom'
  }
  format: ''
  indent: 0
  version: 3
  children: LexicalTextNode[]
  direction: null
}

type LexicalChild = LexicalParagraphNode | LexicalHeadingNode

function textNode(text: string): LexicalTextNode {
  return {
    type: 'text',
    mode: 'normal',
    text,
    style: '',
    detail: 0,
    format: 0,
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
