export const PHOTO_CATEGORIES = [
  { label: 'hollywood', value: 'hollywood' },
  { label: 'fashion clicks', value: 'fashion-clicks' },
  { label: 'black & white', value: 'black-white' },
  { label: 'beauty pics', value: 'beauty-pics' },
  { label: 'runway', value: 'runway' },
  { label: 'miscellaneous', value: 'miscellaneous' },
  { label: 'alaïa collection', value: 'alaia-collection' },
  { label: 'advertorial', value: 'advertorial' },
  { label: 'motion', value: 'motion' },
  { label: 'insta', value: 'insta' },
  { label: 'publications', value: 'publications' },
] as const

export const STATIC_NAV_LINKS = [
  { label: 'blog', href: '/blog' },
  { label: 'model-bewerbung', href: '/model-bewerbung' },
  { label: 'imprint', href: '/imprint' },
  { label: 'contact', href: '/contact' },
] as const

export type PhotoCategory = (typeof PHOTO_CATEGORIES)[number]['value']
