import {
  lexicalHeading,
  lexicalParagraph,
  lexicalParagraphWithLink,
  lexicalRoot,
} from './lexicalNodes'

const BOD_HARDCOVER_URL =
  'https://www.bod.de/buchshop/geschichte-der-fashion-und-beauty-photographie-sven-magnus-hanefeld-9783741222016?utm_source=saleswidget&utm_medium=referral&utm_campaign=saleswidget_button'

const BOD_PAPERBACK_URL =
  'https://www.bod.de/buchshop/geschichte-der-fashion-und-beauty-photographie-sven-magnus-hanefeld-9783744895064?utm_source=saleswidget&utm_medium=referral&utm_campaign=saleswidget_large'

const BEAUTYSHOTS_DE_URL =
  'https://publish.bookmundo.de/shop/index.php/catalog/product/view/id/477099/s/svenmagnus-beautyshots-218907-publish-bookmundo-de/category/147/'

const BEAUTYSHOTS_UK_URL =
  'http://www.mybestseller.co.uk/shop/index.php/catalog/product/view/id/479465/s/svenmagnus-beautyshots-221072-www-mybestseller-co-uk/category/147/?___store=ymfkzgq1mwy3zwuwn2vjnjexywm1mz&___from_store=mgfimjrjm2m0mzzjymuxzjg2ztblzd'

function bookBlockContent() {
  return lexicalRoot(
    lexicalHeading('History of Fashion & Beauty Photography'),
    lexicalParagraph('A historical work in two volumes'),
    lexicalParagraph(
      'These beautifully designed and thoroughly researched art books shed light on the history of photography from the perspectives of fashion and beauty. After the first volume appeared several years ago, the second volume now covers the period up to 1945.',
    ),
    lexicalParagraph(
      'The focus is on the aesthetic development and cultural significance of the medium of photography.',
    ),
    lexicalParagraph(
      'In the first volume, the author shows that fashion and beauty as photographic subjects were already present in the 19th century.',
    ),
    lexicalParagraph(
      'This is the first comprehensive treatment of the history of fashion and beauty photography, especially of the 19th century, and thus a milestone in photographic literature. Contrary to the common view that fashion and beauty as photographic disciplines only emerged in the 20th century, the author takes a completely new approach that represents a paradigm shift.',
    ),
    lexicalParagraph(
      'Briefly described are the invention of Daguerre and his competitors, the rise of the first portrait studios, the phenomenon of early nude photography in Paris, the so-called "academies," and the rapid worldwide spread of the medium. The beginnings of fashion photography in the broadest sense are presented, along with the first model in history, Virginia Oldoini, the photographer Clementina Hawarden, and others. A chapter covers the Pre-Raphaelite school, including Oscar Gustave Rejlander and Julia Margaret Cameron. The improvements in technical processes and their socio-economic consequences are described, as well as the beginnings of pictorialist and early avant-garde movements. An extensive chapter addresses the tendencies of the so-called art photography movement. Finally, the author provides an overview of the Autochrome process, which brought color into photography. Numerous biographies of photographers who primarily portrayed people round out the picture and reveal that photography that can be described with the terms fashion and beauty already existed in the 19th century.',
    ),
    lexicalParagraph(
      "The second volume covers the period from 1918 to 1945. It begins with the new profession of fashion photographer, represented by Adolph de Meyer, the first to be given the professional title of fashion photographer. The overcoming of Pictorialism through American Modernism is shown through the protagonists Alfred Stieglitz and Edward Steichen. Arnold Genthe played a special role. With Edward Weston there is the West Coast style and an important exponent of Straight Photography. Chapters follow on the so-called Golden Twenties and Hollywood glamour photography. The development of the magazines Vogue and Harper's Bazaar is described in detail, especially the photographic development lines with Hoyningen Huene, Cecil Beaton, and Horst P. Horst. With Martin Munkácsi, the element of movement came into play. John Rawlings brought color, Man Ray Dadaism, and Erwin Blumenfeld Surrealism. Nude and fashion photography are treated equally. The first model agencies emerged, and with Lisa Fonssagrives there was a first supermodel. A chapter describes the war years and the specific fates of some Jewish photographers. Finally, the techniques and camera systems commonly used at the time are also discussed. Like the first volume, this one is rich in images and biographies of individual photographers and should not be missing from any photographic library.",
    ),
    lexicalParagraph(''),
    lexicalParagraph('Volume I: The 19th Century'),
    lexicalParagraph(
      'The book is published as a hardcover (special edition) with dust jacket and bookmark ribbon',
    ),
    lexicalParagraph('Publisher: BoD'),
    lexicalParagraph('ISBN: 978-3-7412-2201-6'),
    lexicalParagraph('Pages: 408'),
    lexicalParagraph('Size: 19 x 3 x 27 cm'),
    lexicalParagraph('Price: €98.99'),
    lexicalParagraphWithLink('Purchase: ', 'Click here', BOD_HARDCOVER_URL),
    lexicalParagraph(
      'A paperback edition with fewer color illustrations is now also available',
    ),
    lexicalParagraph('ISBN 978-3-7448-9506-4'),
    lexicalParagraph('Pages: 408'),
    lexicalParagraph('Size: 19 x 3 x 27 cm'),
    lexicalParagraph('Price: €44.99'),
    lexicalParagraphWithLink('Purchase: ', 'Click here', BOD_PAPERBACK_URL),
    lexicalParagraph(''),
    lexicalParagraph('Volume II: 1918 – 1948'),
    lexicalParagraph('452 pages'),
    lexicalParagraph('Hardcover (special edition): €78.99'),
    lexicalParagraph('ISBN 978-3-7562-2183-7'),
    lexicalParagraph(''),
    lexicalParagraph('Paperback: €44.99'),
    lexicalParagraph('ISBN 978-3-7562-2262-9'),
    lexicalParagraph(''),
  )
}

function beautyshotsBlockContent() {
  const description =
    'This high-quality illustrated book of atmospheric density and unique beauty shows pictures by photographer Sven Magnus Hanefeld. It gives an insight into the work of the photographer, who calls himself SVENMAGNUS. It is a retrospective of his work over the past 20 years. Shown are test shoots with amateur and professional models as well as photographic impressions from the international fashion shows in Milan, New York and Paris. Previously unpublished photographs of top models such as Laetitia Casta, Omahyra Mota, Magdalena Frackowiak, Hana Soukupova, Natalya Vodianova, Heidi Klum, Miranda Kerr, Gemma Ward, Nataliia Gotsii and Edita Vilkeviciute. Pictures created on the catwalks, backstage, or at the edge of the shows and bustle, offering a glimpse behind the scenes. In addition, there are always test shoots with unknown models that testify to beauty and grace, that do not impose themselves on the eye but impress through their naturalness.'

  return lexicalRoot(
    lexicalHeading('SVENMAGNUS BEAUTYSHOTS'),
    lexicalParagraph(description),
    lexicalParagraph('Pages: 136'),
    lexicalParagraph('Year: 2020'),
    lexicalParagraph('Binding: Paperback'),
    lexicalParagraph('Format: A4 (21 x 29.7 cm)'),
    lexicalParagraph('ISBN 978-9-4639-8424-9'),
    lexicalParagraph('€39.80'),
    lexicalParagraphWithLink('Purchase in Germany: ', 'Click here', BEAUTYSHOTS_DE_URL),
    lexicalParagraph(description),
    lexicalParagraph('Pages: 136'),
    lexicalParagraph('Year: 2020'),
    lexicalParagraph('Binding: Paperback'),
    lexicalParagraph('Format: A4 (21 x 29.7 cm)'),
    lexicalParagraph('ISBN 978-9-4639-8424-9'),
    lexicalParagraph('Publisher: mybestseller.co.uk'),
    lexicalParagraph('£19.99 (same edition)'),
    lexicalParagraphWithLink('Purchase in Great Britain: ', 'Click here', BEAUTYSHOTS_UK_URL),
  )
}

/** Englisches Layout für die Publications-Seite — Bild-IDs aus dem DE-Layout übernehmen. */
export function buildPublicationsEnLayout(
  bookImageId: number | string,
  beautyshotsImageId: number | string,
): Record<string, unknown>[] {
  return [
    {
      blockType: 'mediaText',
      image: bookImageId,
      layout: 'imageLeft',
      imageWidth: 'third',
      content: bookBlockContent(),
    },
    {
      blockType: 'mediaText',
      image: beautyshotsImageId,
      layout: 'imageLeft',
      imageWidth: 'third',
      content: beautyshotsBlockContent(),
    },
  ]
}
