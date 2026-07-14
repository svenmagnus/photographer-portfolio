import {
  HeadingFeature,
  lexicalEditor,
  LinkFeature,
} from '@payloadcms/richtext-lexical'

export const contentLexicalEditor = lexicalEditor({
  features: ({ defaultFeatures }) =>
    defaultFeatures.map((feature) => {
      if (feature.key === 'heading') {
        return HeadingFeature({
          enabledHeadingSizes: ['h1', 'h2', 'h3'],
        })
      }

      if (feature.key === 'link') {
        return LinkFeature({
          enabledCollections: ['pages'],
          maxDepth: 1,
        })
      }

      return feature
    }),
})
