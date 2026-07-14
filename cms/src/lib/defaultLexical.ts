type LexicalTextNode = {
  type: 'text'
  text: string
  format: number
  version: number
}

type LexicalParagraphNode = {
  type: 'paragraph'
  children: LexicalTextNode[]
  direction: 'ltr'
  format: ''
  indent: 0
  version: number
}

export function lexicalParagraphs(...paragraphs: string[]) {
  const children: LexicalParagraphNode[] = paragraphs.map((text) => ({
    type: 'paragraph',
    children: [
      {
        type: 'text',
        text,
        format: 0,
        version: 1,
      },
    ],
    direction: 'ltr',
    format: '',
    indent: 0,
    version: 1,
  }))

  return {
    root: {
      type: 'root',
      children,
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      version: 1,
    },
  }
}
