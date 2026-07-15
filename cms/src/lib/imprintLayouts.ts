import {
  lexicalHeading,
  lexicalParagraph,
  lexicalParagraphWithAutolink,
  lexicalParagraphWithBoldPrefix,
  lexicalRoot,
} from './lexicalNodes'

function imprintRichTextDe() {
  return lexicalRoot(
    lexicalHeading('Impressum', 'h2'),
    lexicalParagraph('Sven Magnus Hanefeld Dedesdorfer Str. 1 28219 Bremen Deutschland'),
    lexicalParagraphWithAutolink('Für alle Lizenzanfragen: ', 'info@svenmagnus.com', 'mailto:info@svenmagnus.com'),
    lexicalHeading('Referenzen', 'h3'),
    lexicalParagraphWithBoldPrefix(
      'Mailand:',
      ' Mariella Burani, Trend les copains, Who is on next, Versace',
    ),
    lexicalParagraphWithBoldPrefix(
      'Paris:',
      ' Ann Demeulemeester, Jean Paul Gaultier, Karl Lagerfeld, Stella McCartney, Leonard, Barbara Bui, Giambattista Valli u.a.',
    ),
    lexicalParagraphWithBoldPrefix(
      'NY:',
      ' Babyphat, BCBG Max Azria, John Bartlett, Lacoste, Terevox UPS, Diane von Furstenberg, DKNY, Carolina Herrera, Maria Cornejo, Oscar de la Renta, Betsey Johnson, Michael Kors, Milly, Vincent Licari, Jason Wu, Zak Posen, Manuel Cuevas, Project Runway',
    ),
    lexicalHeading('Datenschutzerklärung', 'h3'),
    lexicalParagraph('Gültig ab: 24. Februar 2019'),
    lexicalParagraph(
      'Svenmagnus Photography („wir“, „uns“ oder „unser“) betreibt die Website http://www.svenmagnus.com (der „Dienst“).',
    ),
    lexicalParagraph(
      'Diese Seite informiert Sie über unsere Richtlinien zur Erhebung, Nutzung und Offenlegung personenbezogener Daten, wenn Sie unseren Dienst nutzen, und über die damit verbundenen Wahlmöglichkeiten.',
    ),
    lexicalParagraph(
      'Wir verwenden Ihre Daten, um den Dienst bereitzustellen und zu verbessern. Durch die Nutzung des Dienstes stimmen Sie der Erhebung und Verwendung von Informationen gemäß dieser Richtlinie zu.',
    ),
    lexicalHeading('Erhebung und Nutzung von Informationen', 'h3'),
    lexicalParagraph(
      'Wir erheben verschiedene Arten von Informationen für unterschiedliche Zwecke, um unseren Dienst bereitzustellen und zu verbessern.',
    ),
    lexicalParagraph('Arten der erhobenen Daten — Personenbezogene Daten'),
    lexicalParagraph(
      'Bei der Nutzung unseres Dienstes können wir Sie bitten, uns bestimmte personenbezogene Daten mitzuteilen, die zur Kontaktaufnahme oder Identifizierung verwendet werden können („Personenbezogene Daten“), z. B. E-Mail-Adresse, Vor- und Nachname sowie Cookies und Nutzungsdaten.',
    ),
    lexicalParagraph('Nutzungsdaten'),
    lexicalParagraph(
      'Wir können auch Informationen darüber erheben, wie der Dienst aufgerufen und genutzt wird („Nutzungsdaten“), z. B. IP-Adresse, Browsertyp, besuchte Seiten, Datum und Uhrzeit des Besuchs sowie weitere Diagnosedaten.',
    ),
    lexicalParagraph('Cookies und Tracking-Daten'),
    lexicalParagraph(
      'Wir verwenden Cookies und ähnliche Tracking-Technologien, um Aktivitäten auf unserem Dienst zu verfolgen und bestimmte Informationen zu speichern. Sie können Ihren Browser anweisen, alle Cookies abzulehnen; einzelne Funktionen des Dienstes sind dann ggf. nicht verfügbar.',
    ),
    lexicalHeading('Verwendung der Daten', 'h3'),
    lexicalParagraph(
      'Svenmagnus Photography verwendet die erhobenen Daten u. a. zur Bereitstellung und Wartung des Dienstes, zur Benachrichtigung über Änderungen, zur Kundenbetreuung, zur Analyse und Verbesserung des Dienstes sowie zur Erkennung und Verhinderung technischer Probleme.',
    ),
    lexicalHeading('Datenübermittlung', 'h3'),
    lexicalParagraph(
      'Ihre Informationen, einschließlich personenbezogener Daten, können auf Server außerhalb Ihres Landes übertragen und dort gespeichert werden. Wenn Sie sich außerhalb Deutschlands befinden und uns Informationen übermitteln, werden die Daten nach Deutschland übertragen und dort verarbeitet.',
    ),
    lexicalHeading('Offenlegung von Daten', 'h3'),
    lexicalParagraph(
      'Svenmagnus Photography kann personenbezogene Daten offenlegen, wenn dies zur Erfüllung gesetzlicher Pflichten, zum Schutz von Rechten oder zur Untersuchung möglicher Verstöße im Zusammenhang mit dem Dienst erforderlich ist.',
    ),
    lexicalHeading('Sicherheit der Daten', 'h3'),
    lexicalParagraph(
      'Die Sicherheit Ihrer Daten ist uns wichtig, aber keine Übertragungsmethode über das Internet ist zu 100 % sicher. Wir bemühen uns um wirtschaftlich angemessene Schutzmaßnahmen, können jedoch keine absolute Sicherheit garantieren.',
    ),
    lexicalHeading('Kontakt', 'h3'),
    lexicalParagraphWithAutolink(
      'Bei Fragen zu dieser Datenschutzerklärung: ',
      'info@svenmagnus.com',
      'mailto:info@svenmagnus.com',
    ),
  )
}

function imprintRichTextEn() {
  return lexicalRoot(
    lexicalHeading('Imprint', 'h2'),
    lexicalParagraph('Sven Magnus Hanefeld Dedesdorfer Str. 1 28219 Bremen Germany'),
    lexicalParagraphWithAutolink(
      'For all licensing requests: ',
      'info@svenmagnus.com',
      'mailto:info@svenmagnus.com',
    ),
    lexicalHeading('Credentials', 'h3'),
    lexicalParagraphWithBoldPrefix(
      'Milan:',
      ' Mariella Burani, Trend les copains, Who is on next, Versace',
    ),
    lexicalParagraphWithBoldPrefix(
      'Paris:',
      ' Ann Demeulemeester, Jean Paul Gaultier, Karl Lagerfeld, Stella McCartney, Leonard, Barbara Bui, Giambattista Valli et al.',
    ),
    lexicalParagraphWithBoldPrefix(
      'NY:',
      ' Babyphat, BCBG Max Azria, John Bartlett, Lacoste, Terevox UPS, Diane von Furstenberg, DKNY, Carolina Herrera, Maria Cornejo, Oscar de la Renta, Betsey Johnson, Michael Kors, Milly, Vincent Licari, Jason Wu, Zak Posen, Manuel Cuevas, Project Runway',
    ),
    lexicalHeading('Privacy Policy', 'h3'),
    lexicalParagraph('Effective date: February 24, 2019'),
    lexicalParagraph(
      'Svenmagnus Photography ("us", "we", or "our") operates the http://www.svenmagnus.com website (the "Service").',
    ),
    lexicalParagraph(
      'This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.',
    ),
    lexicalParagraph(
      'We use your data to provide and improve the Service. By using the Service, you agree to the collection and use of information in accordance with this policy.',
    ),
    lexicalHeading('Information Collection And Use', 'h3'),
    lexicalParagraph(
      'We collect several different types of information for various purposes to provide and improve our Service to you.',
    ),
    lexicalParagraph('Types of Data Collected — Personal Data'),
    lexicalParagraph(
      'While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"), including email address, first and last name, cookies and usage data.',
    ),
    lexicalParagraph('Usage Data'),
    lexicalParagraph(
      'We may also collect information how the Service is accessed and used ("Usage Data"), such as IP address, browser type, pages visited, and diagnostic data.',
    ),
    lexicalHeading('Use of Data', 'h3'),
    lexicalParagraph(
      'Svenmagnus Photography uses the collected data to provide and maintain the Service, notify you about changes, provide customer care, improve the Service, and detect technical issues.',
    ),
    lexicalHeading('Contact Us', 'h3'),
    lexicalParagraphWithAutolink('By email: ', 'info@svenmagnus.com', 'mailto:info@svenmagnus.com'),
  )
}

function imprintPageLayout(content: ReturnType<typeof lexicalRoot>): Record<string, unknown>[] {
  return [
    {
      blockType: 'heading',
      text: 'Impressum',
      level: 'h1',
      align: 'left',
    },
    {
      blockType: 'richText',
      width: 'narrow',
      content,
    },
  ]
}

export function buildImprintDeLayout(): Record<string, unknown>[] {
  return imprintPageLayout(imprintRichTextDe())
}

export function buildImprintEnLayout(): Record<string, unknown>[] {
  return [
    {
      blockType: 'heading',
      text: 'Imprint',
      level: 'h1',
      align: 'left',
    },
    {
      blockType: 'richText',
      width: 'narrow',
      content: imprintRichTextEn(),
    },
  ]
}

const PLACEHOLDER_MARKERS = ['Angaben gemäß § 5 TMG', 'Legal information pursuant to § 5 TMG']

export function isPlaceholderImprintLayout(layout: unknown): boolean {
  if (!Array.isArray(layout)) return false
  const serialized = JSON.stringify(layout)
  return PLACEHOLDER_MARKERS.some((marker) => serialized.includes(marker))
}
