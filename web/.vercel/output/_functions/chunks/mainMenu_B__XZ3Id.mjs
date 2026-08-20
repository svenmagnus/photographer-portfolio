import { e as createAstro, f as createComponent, h as addAttribute, r as renderTemplate, o as renderHead, p as renderSlot, l as defineScriptVars, m as maybeRenderHead } from './astro/server_CBEUGtRa.mjs';
import 'piccolore';
import 'clsx';
/* empty css                              */
import { D as DEFAULT_LOCALE, s as stripLocalePrefix, a as alternateLocalePaths, l as localePath, L as LOCALES, b as switchLocalePath, w as withLocaleParam, g as getPayloadUrl } from './siteSettings_7gddyI71.mjs';

const $$Astro$1 = createAstro("http://localhost:4321");
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Layout;
  const {
    title = "Sven Magnus Hanefeld \u2014 Photographer",
    description = "Photography Portfolio",
    locale = DEFAULT_LOCALE,
    canonicalPath
  } = Astro2.props;
  const pathForAlternates = stripLocalePrefix(canonicalPath ?? Astro2.url.pathname);
  const alternates = alternateLocalePaths(pathForAlternates);
  const siteOrigin = Astro2.site?.origin ?? "";
  const canonicalUrl = `${siteOrigin}${localePath(pathForAlternates, locale)}`;
  return renderTemplate`<html${addAttribute(locale, "lang")}> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="description"${addAttribute(description, "content")}><link rel="canonical"${addAttribute(canonicalUrl, "href")}>${LOCALES.map((loc) => renderTemplate`<link rel="alternate"${addAttribute(loc, "hreflang")}${addAttribute(`${siteOrigin}${alternates[loc]}`, "href")}>`)}<link rel="alternate" hreflang="x-default"${addAttribute(`${siteOrigin}${alternates[DEFAULT_LOCALE]}`, "href")}><link rel="icon" type="image/svg+xml" href="/favicon.svg"><title>${title}</title>${renderHead()}</head> <body class="bg-white text-black font-sans antialiased"> <div class="site-shell"> ${renderSlot($$result, $$slots["default"])} </div> </body></html>`;
}, "/Users/svenmagnus/Websites/Portfolio_Sven_Magnus/web/src/layouts/Layout.astro", void 0);

const PHOTO_CATEGORIES = [
  { label: "hollywood", value: "hollywood" },
  { label: "fashion clicks", value: "fashion-clicks" },
  { label: "black & white", value: "black-white" },
  { label: "beauty pics", value: "beauty-pics" },
  { label: "runway", value: "runway" },
  { label: "miscellaneous", value: "miscellaneous" },
  { label: "alaïa collection", value: "alaia-collection" },
  { label: "advertorial", value: "advertorial" },
  { label: "motion", value: "motion" },
  { label: "insta", value: "insta" },
  { label: "publications", value: "publications" }
];
const STATIC_NAV_LINKS = [
  { label: "blog", href: "/blog" },
  { label: "model-bewerbung", href: "/model-bewerbung" },
  { label: "imprint", href: "/imprint" },
  { label: "contact", href: "/contact" }
];

const PAGE_LABELS = {
  contact: { de: "Kontakt", en: "Contact" },
  imprint: { de: "Impressum", en: "Imprint" },
  publications: { de: "publications", en: "Publications" },
  "model-bewerbung": { de: "Model-Bewerbung", en: "Model Application" }
};
function pageLabel(slug, locale, fallback = "") {
  if (!slug) return fallback;
  return fallback || PAGE_LABELS[slug]?.[locale] || slug;
}
function localizedPageText(slug, locale, cmsText) {
  const fromCms = cmsText?.trim();
  if (fromCms) return fromCms;
  if (slug && PAGE_LABELS[slug]?.[locale]) return PAGE_LABELS[slug][locale];
  return "";
}
function contactIntroHtml(locale) {
  if (locale === "de") {
    return `<p>Für lokale Projekte und Anfragen bin ich erreichbar. Nutze das Formular für Preise, Verfügbarkeit — oder sag einfach Hallo.</p>`;
  }
  return `<p>I'm available for local projects as well as potential employment opportunities. Use the form to inquire about rates and availability, or just to say hi.</p>`;
}

function getPageSlug(page) {
  if (page && typeof page === "object" && "slug" in page && typeof page.slug === "string") {
    return page.slug;
  }
  return void 0;
}
function getPageTitle(page) {
  if (page && typeof page === "object" && "title" in page && typeof page.title === "string") {
    return page.title;
  }
  return void 0;
}
function getPageType(page) {
  if (page && typeof page === "object" && "pageType" in page && typeof page.pageType === "string") {
    return page.pageType;
  }
  return void 0;
}
function getGalleryCategory(page) {
  if (page && typeof page === "object" && "galleryCategory" in page && typeof page.galleryCategory === "string") {
    return page.galleryCategory;
  }
  return void 0;
}
function prefixHref(href, locale) {
  if (href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return href;
  }
  if (href.startsWith("/?")) {
    return localePath("/", locale) + href.slice(1);
  }
  return localePath(href, locale);
}
function menuItemToNavItem(item, locale, isSubItem = false) {
  const label = item.label?.trim();
  const linkType = item.linkType || "page";
  if (linkType === "page") {
    const slug = getPageSlug(item.page);
    if (!slug) return null;
    const pageType = getPageType(item.page);
    const categoryValue = pageType === "gallery" ? getGalleryCategory(item.page) || slug : void 0;
    return {
      label: pageLabel(slug, locale, label || getPageTitle(item.page) || slug),
      href: prefixHref(
        pageType === "gallery" && categoryValue ? `/?category=${categoryValue}` : `/${slug}`,
        locale
      ),
      categoryValue,
      slug,
      openInNewTab: Boolean(item.openInNewTab),
      isSubItem
    };
  }
  if (linkType === "category" && item.category) {
    return {
      label: pageLabel(item.category, locale, label || item.category),
      href: prefixHref(`/?category=${item.category}`, locale),
      categoryValue: item.category,
      openInNewTab: Boolean(item.openInNewTab),
      isSubItem
    };
  }
  if (linkType === "external" && item.url) {
    return {
      label: label || item.url,
      href: item.url,
      openInNewTab: Boolean(item.openInNewTab),
      isSubItem
    };
  }
  return null;
}
function buildNavigationFromMainMenu(items, locale) {
  const result = [];
  for (const item of items) {
    const navItem = menuItemToNavItem(item, locale, false);
    if (navItem) result.push(navItem);
    for (const child of item.children ?? []) {
      const childItem = menuItemToNavItem(child, locale, true);
      if (childItem) result.push(childItem);
    }
  }
  return result;
}
function buildNavigationFromPages(pages, locale) {
  return pages.filter((page) => page.showInNavigation !== false).map((page) => {
    const categoryValue = page.pageType === "gallery" ? page.galleryCategory || page.slug : void 0;
    return {
      label: pageLabel(page.slug, locale, page.title),
      href: prefixHref(
        page.pageType === "gallery" && categoryValue ? `/?category=${categoryValue}` : `/${page.slug}`,
        locale
      ),
      categoryValue,
      slug: page.slug
    };
  });
}
function buildNavigation(settings, navPages, mainMenuItems, locale = "de") {
  if (mainMenuItems?.length) {
    return buildNavigationFromMainMenu(mainMenuItems, locale);
  }
  if (navPages?.length) {
    return buildNavigationFromPages(navPages, locale);
  }
  const custom = settings.navigation;
  if (custom?.length) {
    return custom.map((item) => {
      const label = item.label?.trim();
      if (!label) return null;
      if (item.linkType === "category" && item.category) {
        return {
          label,
          href: prefixHref(`/?category=${item.category}`, locale),
          categoryValue: item.category
        };
      }
      if (item.linkType === "page") {
        const slug = getPageSlug(item.page);
        if (!slug) return null;
        return {
          label,
          href: prefixHref(`/${slug}`, locale),
          slug
        };
      }
      if (item.linkType === "external" && item.url) {
        const href = item.url.startsWith("http") ? item.url : item.url;
        return {
          label,
          href,
          openInNewTab: Boolean(item.openInNewTab)
        };
      }
      return null;
    }).filter((item) => Boolean(item));
  }
  const categoryItems = PHOTO_CATEGORIES.map((category) => ({
    label: pageLabel(category.value, locale, category.label),
    href: prefixHref(`/?category=${category.value}`, locale),
    categoryValue: category.value
  }));
  const staticItems = STATIC_NAV_LINKS.map((link) => ({
    label: pageLabel(link.href.replace(/^\//, ""), locale, link.label),
    href: prefixHref(link.href, locale),
    slug: link.href.replace(/^\//, "")
  }));
  return [...categoryItems, ...staticItems];
}
function estimateNavItemWidth(label) {
  return label.trim().toLowerCase().length * 11 + 50;
}
function splitNavigation(items) {
  if (items.length <= 5) {
    return { rowOne: items, rowTwo: [] };
  }
  const widths = items.map((item) => estimateNavItemWidth(item.label));
  const totalWidth = widths.reduce((sum, width) => sum + width, 0);
  const targetWidth = totalWidth / 2;
  let rowOneWidth = 0;
  let splitIndex = Math.ceil(items.length / 2);
  for (let index = 0; index < items.length - 1; index += 1) {
    rowOneWidth += widths[index];
    if (rowOneWidth >= targetWidth) {
      splitIndex = index + 1;
      break;
    }
    splitIndex = index + 1;
  }
  return {
    rowOne: items.slice(0, splitIndex),
    rowTwo: items.slice(splitIndex)
  };
}

const messages = {
  de: {
    langSwitch: "Sprache",
    langDe: "DE",
    langEn: "EN",
    menuOpen: "Menü öffnen",
    menuClose: "Menü schließen",
    mainNav: "Hauptnavigation",
    blogReadMore: "Weiterlesen …",
    blogEmpty: "Noch keine Beiträge veröffentlicht.",
    blogBack: "← {title}",
    photoGridEmpty: "Noch keine Fotografien vorhanden. Bitte im CMS unter Fotos anlegen.",
    photoGridEmptyCms: "CMS",
    photoGridLoading: "Fotografien werden geladen…",
    photoGridEmptyCategory: "Noch keine Fotografien in dieser Kategorie.",
    contactPhoneLabel: "Telefon",
    contactEmailLabel: "E-Mail",
    contactNamePlaceholder: "Name",
    contactEmailPlaceholder: "E-Mail",
    contactMessagePlaceholder: "Nachricht",
    contactRequiredFields: "Bitte alle Felder ausfüllen.",
    contactSending: "Wird gesendet …",
    contactSendError: "Senden fehlgeschlagen. Bitte später erneut versuchen.",
    contactDefaultSubmit: "Nachricht senden",
    contactDefaultSuccess: "Vielen Dank — deine Nachricht wurde gesendet.",
    mafDefaultSubmit: "Bewerbung absenden",
    mafDefaultSuccess: "Vielen Dank — deine Bewerbung wurde erfolgreich gesendet.",
    mafDefaultIntro: "<p>Für diese Bewerbung brauchst du keine professionellen Fotos. Natürliche <strong>Polas</strong> (Polaroids / Snapshots) reichen völlig aus — aufgenommen bei Tageslicht, ohne Make-up und in schlichter Kleidung.</p><p>Bitte fülle alle Pflichtfelder aus und lade deine vier Polas hoch.</p>",
    mafSectionPersonal: "Persönliche Daten",
    mafFirstName: "Vorname *",
    mafLastName: "Nachname *",
    mafBirthDate: "Geburtsdatum *",
    mafAge: "Alter *",
    mafAgeHint: "Wird automatisch aus dem Geburtsdatum berechnet.",
    mafLocation: "Aktueller Wohnort *",
    mafEmail: "E-Mail-Adresse *",
    mafPhone: "Telefonnummer *",
    mafInstagram: "Instagram (optional)",
    mafTiktok: "TikTok (optional)",
    mafSectionMeasurements: "Körpermaße",
    mafHeight: "Größe (cm) *",
    mafBust: "Brustumfang (cm) *",
    mafWaist: "Taillenumfang (cm) *",
    mafHips: "Hüftumfang (cm) *",
    mafClothingSize: "Konfektionsgröße *",
    mafClothingSizePlaceholder: "Bitte wählen",
    mafShoeSize: "Schuhgröße *",
    mafHairColor: "Haarfarbe *",
    mafEyeColor: "Augenfarbe *",
    mafSectionPolas: "Polas / Snapshots",
    mafPolasIntro: "So sollten deine Polas aussehen:",
    mafPolasTip1: "Tageslicht (kein Blitz, kein Studiolicht)",
    mafPolasTip2: "Kein Make-up, natürlicher Look",
    mafPolasTip3: "Eng anliegendes oder schlichtes Outfit (z. B. Top & Jeans)",
    mafPolasTip4: "Neutraler, gerader Blick in die Kamera",
    mafPolasTip5: "Einfacher, aufgeräumter Hintergrund",
    mafPolaFront: "1. Ganzkörper von vorne *",
    mafPolaBack: "2. Ganzkörper von hinten *",
    mafPolaProfile: "3. Profil (Seite) *",
    mafPolaPortrait: "4. Porträt (von vorne) *",
    mafUploadPlaceholder: "Foto hier ablegen oder klicken",
    mafUploadRemove: "Entfernen",
    mafPrivacyConsent: "Ich willige ein, dass meine Angaben und Fotos zur Bearbeitung meiner Bewerbung verarbeitet werden. Die {link} habe ich gelesen. *",
    mafPrivacyLink: "Datenschutzerklärung",
    mafValidationRequired: "Bitte dieses Pflichtfeld ausfüllen.",
    mafValidationEmail: "Bitte eine gültige E-Mail-Adresse angeben.",
    mafValidationPhone: "Bitte eine gültige Telefonnummer angeben.",
    mafValidationAge: "Bitte ein gültiges Alter zwischen 14 und 99 angeben.",
    mafValidationNumber: "Bitte eine gültige Zahl angeben.",
    mafValidationPrivacy: "Bitte der Datenschutzerklärung zustimmen.",
    mafValidationPhotoRequired: "Bitte ein Foto hochladen.",
    mafValidationPhotoTooLarge: "Die Datei ist zu groß (max. 8 MB).",
    mafValidationPhotoType: "Bitte nur JPG, PNG oder WebP hochladen.",
    mafValidationSummary: "Bitte alle markierten Felder prüfen.",
    mafSending: "Wird gesendet …",
    mafSendError: "Senden fehlgeschlagen. Bitte später erneut versuchen.",
    mafNetworkError: "Verbindungsfehler. Bitte Internetverbindung prüfen."
  },
  en: {
    langSwitch: "Language",
    langDe: "DE",
    langEn: "EN",
    menuOpen: "Open menu",
    menuClose: "Close menu",
    mainNav: "Main navigation",
    blogReadMore: "Read more …",
    blogEmpty: "No posts published yet.",
    blogBack: "← {title}",
    photoGridEmpty: "No photographs yet. Please add photos in the CMS under Photos.",
    photoGridEmptyCms: "CMS",
    photoGridLoading: "Loading photographs…",
    photoGridEmptyCategory: "No photographs in this category yet.",
    contactPhoneLabel: "Phone",
    contactEmailLabel: "Email",
    contactNamePlaceholder: "Name",
    contactEmailPlaceholder: "Email",
    contactMessagePlaceholder: "Message",
    contactRequiredFields: "Please fill in all fields.",
    contactSending: "Sending…",
    contactSendError: "Failed to send. Please try again later.",
    contactDefaultSubmit: "Send message",
    contactDefaultSuccess: "Thank you — your message has been sent.",
    mafDefaultSubmit: "Submit application",
    mafDefaultSuccess: "Thank you — your application was sent successfully.",
    mafDefaultIntro: "<p>You do not need professional photos for this application. Natural <strong>polas</strong> (polaroids / snapshots) are enough — taken in daylight, without make-up and in simple clothing.</p><p>Please fill in all required fields and upload your four polas.</p>",
    mafSectionPersonal: "Personal details",
    mafFirstName: "First name *",
    mafLastName: "Last name *",
    mafBirthDate: "Date of birth *",
    mafAge: "Age *",
    mafAgeHint: "Calculated automatically from your date of birth.",
    mafLocation: "Current city *",
    mafEmail: "Email address *",
    mafPhone: "Phone number *",
    mafInstagram: "Instagram (optional)",
    mafTiktok: "TikTok (optional)",
    mafSectionMeasurements: "Measurements",
    mafHeight: "Height (cm) *",
    mafBust: "Bust (cm) *",
    mafWaist: "Waist (cm) *",
    mafHips: "Hips (cm) *",
    mafClothingSize: "Clothing size *",
    mafClothingSizePlaceholder: "Please select",
    mafShoeSize: "Shoe size *",
    mafHairColor: "Hair colour *",
    mafEyeColor: "Eye colour *",
    mafSectionPolas: "Polas / snapshots",
    mafPolasIntro: "Your polas should look like this:",
    mafPolasTip1: "Daylight (no flash, no studio lighting)",
    mafPolasTip2: "No make-up, natural look",
    mafPolasTip3: "Fitted or simple outfit (e.g. top & jeans)",
    mafPolasTip4: "Neutral, straight gaze into the camera",
    mafPolasTip5: "Simple, uncluttered background",
    mafPolaFront: "1. Full body, front *",
    mafPolaBack: "2. Full body, back *",
    mafPolaProfile: "3. Profile (side) *",
    mafPolaPortrait: "4. Portrait (front) *",
    mafUploadPlaceholder: "Drop photo here or click",
    mafUploadRemove: "Remove",
    mafPrivacyConsent: "I consent to my details and photos being processed for my application. I have read the {link}. *",
    mafPrivacyLink: "privacy policy",
    mafValidationRequired: "Please fill in this required field.",
    mafValidationEmail: "Please enter a valid email address.",
    mafValidationPhone: "Please enter a valid phone number.",
    mafValidationAge: "Please enter a valid age between 14 and 99.",
    mafValidationNumber: "Please enter a valid number.",
    mafValidationPrivacy: "Please accept the privacy policy.",
    mafValidationPhotoRequired: "Please upload a photo.",
    mafValidationPhotoTooLarge: "The file is too large (max. 8 MB).",
    mafValidationPhotoType: "Please upload JPG, PNG or WebP only.",
    mafValidationSummary: "Please check all highlighted fields.",
    mafSending: "Sending…",
    mafSendError: "Failed to send. Please try again later.",
    mafNetworkError: "Connection error. Please check your internet connection."
  }
};
function t(locale, key, vars) {
  let text = messages[locale][key] ?? messages.de[key];
  if (vars) {
    for (const [name, value] of Object.entries(vars)) {
      text = text.replace(`{${name}}`, value);
    }
  }
  return text;
}
function dateLocale(locale) {
  return locale === "en" ? "en-GB" : "de-DE";
}
function modelFormMessages(locale) {
  return {
    required: t(locale, "mafValidationRequired"),
    invalidEmail: t(locale, "mafValidationEmail"),
    invalidPhone: t(locale, "mafValidationPhone"),
    invalidAge: t(locale, "mafValidationAge"),
    invalidNumber: t(locale, "mafValidationNumber"),
    privacyRequired: t(locale, "mafValidationPrivacy"),
    photoRequired: t(locale, "mafValidationPhotoRequired"),
    photoTooLarge: t(locale, "mafValidationPhotoTooLarge"),
    photoInvalidType: t(locale, "mafValidationPhotoType"),
    sending: t(locale, "mafSending"),
    sendError: t(locale, "mafSendError"),
    networkError: t(locale, "mafNetworkError"),
    validationSummary: t(locale, "mafValidationSummary")
  };
}

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Astro = createAstro("http://localhost:4321");
const $$Header = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Header;
  const { activeCategory, activeSlug, navItems, settings, locale = DEFAULT_LOCALE } = Astro2.props;
  const homeHref = localePath("/", locale);
  const currentPath = Astro2.url.pathname;
  const deHref = switchLocalePath(currentPath, "de");
  const enHref = switchLocalePath(currentPath, "en");
  const photographerName = settings?.photographerName || "Sven Magnus Hanefeld";
  const photographerTitle = settings?.photographerTitle || "Photographer";
  const instagramUrl = settings?.instagramUrl || undefined                                     || "#";
  const facebookUrl = settings?.facebookUrl || undefined                                    || "#";
  const navigation = navItems?.length ? navItems : buildNavigation(
    {
      navigation: null
    },
    void 0,
    void 0,
    locale
  );
  const { rowOne, rowTwo } = splitNavigation(navigation);
  function isActive(item) {
    if (activeSlug && item.slug) {
      return item.slug === activeSlug;
    }
    if (activeCategory && item.categoryValue) {
      return item.categoryValue === activeCategory;
    }
    return false;
  }
  function navItemClasses(active) {
    return [
      "nav-link lowercase font-normal transition-colors",
      active && "nav-link-active underline underline-offset-[4px] decoration-[0.5px]"
    ];
  }
  return renderTemplate(_a || (_a = __template(["", '<header class="site-header" data-astro-cid-3ef6ksr2> <div class="site-header-bar" data-astro-cid-3ef6ksr2> <h1 class="site-logo" data-astro-cid-3ef6ksr2> <a', ' class="site-logo-link" data-astro-cid-3ef6ksr2> <span class="site-logo-line" data-astro-cid-3ef6ksr2>', '</span> <span class="site-logo-line" data-astro-cid-3ef6ksr2>', '</span> </a> </h1> <div class="site-header-actions" data-astro-cid-3ef6ksr2> <nav class="site-lang-switch"', " data-astro-cid-3ef6ksr2> <a", "", ' hreflang="de" lang="de" data-astro-cid-3ef6ksr2> ', ' </a> <span class="site-lang-sep" aria-hidden="true" data-astro-cid-3ef6ksr2>/</span> <a', "", ' hreflang="en" lang="en" data-astro-cid-3ef6ksr2> ', ' </a> </nav> <button type="button" id="site-nav-toggle" class="site-nav-toggle" aria-expanded="false" aria-controls="site-nav-mobile"', ' data-astro-cid-3ef6ksr2> <span class="site-nav-toggle-bar" aria-hidden="true" data-astro-cid-3ef6ksr2></span> <span class="site-nav-toggle-bar" aria-hidden="true" data-astro-cid-3ef6ksr2></span> <span class="site-nav-toggle-bar" aria-hidden="true" data-astro-cid-3ef6ksr2></span> </button> </div> </div> <nav class="site-nav site-nav-desktop mt-7"', " data-astro-cid-3ef6ksr2> ", ' </nav> <nav id="site-nav-mobile" class="site-nav-mobile hidden" aria-label="Mobile Navigation" aria-hidden="true" data-astro-cid-3ef6ksr2> <ul class="site-nav-mobile-list" data-astro-cid-3ef6ksr2> ', ' </ul> <div class="site-social site-social-mobile" data-astro-cid-3ef6ksr2> <a', "", "", ' aria-label="Facebook" class="site-social-link hover:opacity-60 transition-opacity" data-astro-cid-3ef6ksr2> <svg class="site-social-icon fill-current" viewBox="0 0 24 24" aria-hidden="true" data-astro-cid-3ef6ksr2> <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" data-astro-cid-3ef6ksr2></path> </svg> </a> <a', "", "", ' aria-label="Instagram" class="site-social-link hover:opacity-60 transition-opacity" data-astro-cid-3ef6ksr2> <svg class="site-social-icon fill-current" viewBox="0 0 24 24" aria-hidden="true" data-astro-cid-3ef6ksr2> <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.227-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" data-astro-cid-3ef6ksr2></path> </svg> </a> </div> </nav> <div class="site-social site-social-desktop mt-5 flex justify-center items-center gap-4 text-black" data-astro-cid-3ef6ksr2> <a', "", "", ' aria-label="Facebook" class="site-social-link hover:opacity-60 transition-opacity" data-astro-cid-3ef6ksr2> <svg class="site-social-icon fill-current" viewBox="0 0 24 24" aria-hidden="true" data-astro-cid-3ef6ksr2> <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" data-astro-cid-3ef6ksr2></path> </svg> </a> <a', "", "", ' aria-label="Instagram" class="site-social-link hover:opacity-60 transition-opacity" data-astro-cid-3ef6ksr2> <svg class="site-social-icon fill-current" viewBox="0 0 24 24" aria-hidden="true" data-astro-cid-3ef6ksr2> <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.227-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" data-astro-cid-3ef6ksr2></path> </svg> </a> <div class="relative" id="share-menu" data-astro-cid-3ef6ksr2> <button type="button" id="share-button" class="share-trigger lowercase tracking-[0.02em] hover:opacity-60 transition-opacity" aria-expanded="false" aria-haspopup="true" aria-controls="share-dropdown" data-astro-cid-3ef6ksr2>\nShare\n</button> <div id="share-dropdown" class="share-dropdown hidden absolute left-1/2 top-full z-50 mt-2 w-56 -translate-x-1/2 border border-neutral-200 bg-white text-left shadow-sm" role="menu" aria-labelledby="share-button" data-astro-cid-3ef6ksr2> <a href="#" data-share="facebook" class="share-item" role="menuitem" target="_blank" rel="noopener noreferrer" data-astro-cid-3ef6ksr2> <svg class="share-icon" viewBox="0 0 24 24" aria-hidden="true" data-astro-cid-3ef6ksr2> <path fill="currentColor" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" data-astro-cid-3ef6ksr2></path> </svg> <span data-astro-cid-3ef6ksr2>Share to Facebook</span> </a> <a href="#" data-share="twitter" class="share-item" role="menuitem" target="_blank" rel="noopener noreferrer" data-astro-cid-3ef6ksr2> <svg class="share-icon" viewBox="0 0 24 24" aria-hidden="true" data-astro-cid-3ef6ksr2> <path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" data-astro-cid-3ef6ksr2></path> </svg> <span data-astro-cid-3ef6ksr2>Share to Twitter</span> </a> <a href="#" data-share="tumblr" class="share-item" role="menuitem" target="_blank" rel="noopener noreferrer" data-astro-cid-3ef6ksr2> <svg class="share-icon" viewBox="0 0 24 24" aria-hidden="true" data-astro-cid-3ef6ksr2> <path fill="currentColor" d="M14.563 24c-5.093 0-7.031-3.756-7.031-6.411V9.747H3.658V6.648c3.063-1.102 4.188-3.84 4.312-5.648H9.53v4.8h4.688v3.099H9.53v7.313c0 1.75.832 2.637 2.563 2.637.888 0 1.85-.281 2.47-.563z" data-astro-cid-3ef6ksr2></path> </svg> <span data-astro-cid-3ef6ksr2>Post to Tumblr</span> </a> <a href="#" data-share="pinterest" class="share-item" role="menuitem" target="_blank" rel="noopener noreferrer" data-astro-cid-3ef6ksr2> <svg class="share-icon" viewBox="0 0 24 24" aria-hidden="true" data-astro-cid-3ef6ksr2> <path fill="currentColor" d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.247 3.772-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" data-astro-cid-3ef6ksr2></path> </svg> <span data-astro-cid-3ef6ksr2>Post to Pinterest</span> </a> </div> </div> </div> </header>  <script>(function(){', "\n  // define:vars scripts are inlined as raw JS — no TypeScript syntax allowed.\n  function getShareUrl(network, pageUrl, title) {\n    const encodedUrl = encodeURIComponent(pageUrl)\n    const encodedTitle = encodeURIComponent(title)\n\n    switch (network) {\n      case 'facebook':\n        return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`\n      case 'twitter':\n        return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`\n      case 'tumblr':\n        return `https://www.tumblr.com/widgets/share/tool?posttype=link&title=${encodedTitle}&content=${encodedUrl}&canonicalUrl=${encodedUrl}`\n      case 'pinterest':\n        return `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedTitle}`\n      default:\n        return pageUrl\n    }\n  }\n\n  function initShareMenu() {\n    const menu = document.getElementById('share-menu')\n    const button = document.getElementById('share-button')\n    const dropdown = document.getElementById('share-dropdown')\n\n    if (!menu || !button || !dropdown) return\n    if (button.dataset.bound === 'true') return\n    button.dataset.bound = 'true'\n\n    const close = () => {\n      dropdown.classList.add('hidden')\n      button.setAttribute('aria-expanded', 'false')\n    }\n\n    const open = () => {\n      dropdown.classList.remove('hidden')\n      button.setAttribute('aria-expanded', 'true')\n    }\n\n    button.addEventListener('click', (event) => {\n      event.stopPropagation()\n      const isOpen = !dropdown.classList.contains('hidden')\n      if (isOpen) close()\n      else open()\n    })\n\n    dropdown.querySelectorAll('[data-share]').forEach((link) => {\n      link.addEventListener('click', (event) => {\n        event.preventDefault()\n        const network = link instanceof HTMLElement ? link.dataset.share : null\n        if (!network) return\n\n        const shareUrl = getShareUrl(network, window.location.href, document.title)\n        window.open(shareUrl, '_blank', 'noopener,noreferrer,width=600,height=500')\n        close()\n      })\n    })\n\n    document.addEventListener('click', (event) => {\n      if (event.target instanceof Node && !menu.contains(event.target)) {\n        close()\n      }\n    })\n\n    document.addEventListener('keydown', (event) => {\n      if (event.key === 'Escape') close()\n    })\n  }\n\n  function initMobileNav() {\n    const toggle = document.getElementById('site-nav-toggle')\n    const panel = document.getElementById('site-nav-mobile')\n\n    if (!toggle || !panel) return\n    if (toggle.dataset.bound === 'true') return\n    toggle.dataset.bound = 'true'\n\n    const close = () => {\n      panel.classList.add('hidden')\n      panel.setAttribute('aria-hidden', 'true')\n      toggle.classList.remove('is-open')\n      toggle.setAttribute('aria-expanded', 'false')\n      toggle.setAttribute('aria-label', menuOpenLabel)\n      document.body.classList.remove('site-nav-open')\n    }\n\n    const open = () => {\n      panel.classList.remove('hidden')\n      panel.setAttribute('aria-hidden', 'false')\n      toggle.classList.add('is-open')\n      toggle.setAttribute('aria-expanded', 'true')\n      toggle.setAttribute('aria-label', menuCloseLabel)\n      document.body.classList.add('site-nav-open')\n    }\n\n    toggle.addEventListener('click', () => {\n      const isOpen = !panel.classList.contains('hidden')\n      if (isOpen) close()\n      else open()\n    })\n\n    panel.querySelectorAll('a').forEach((link) => {\n      link.addEventListener('click', () => {\n        close()\n      })\n    })\n\n    document.addEventListener('keydown', (event) => {\n      if (event.key === 'Escape') close()\n    })\n\n    window.addEventListener('resize', () => {\n      if (window.matchMedia('(min-width: 1024px)').matches) {\n        close()\n      }\n    })\n  }\n\n  function initHeader() {\n    initShareMenu()\n    initMobileNav()\n  }\n\n  initHeader()\n  document.addEventListener('astro:page-load', initHeader)\n})();</script>"], ["", '<header class="site-header" data-astro-cid-3ef6ksr2> <div class="site-header-bar" data-astro-cid-3ef6ksr2> <h1 class="site-logo" data-astro-cid-3ef6ksr2> <a', ' class="site-logo-link" data-astro-cid-3ef6ksr2> <span class="site-logo-line" data-astro-cid-3ef6ksr2>', '</span> <span class="site-logo-line" data-astro-cid-3ef6ksr2>', '</span> </a> </h1> <div class="site-header-actions" data-astro-cid-3ef6ksr2> <nav class="site-lang-switch"', " data-astro-cid-3ef6ksr2> <a", "", ' hreflang="de" lang="de" data-astro-cid-3ef6ksr2> ', ' </a> <span class="site-lang-sep" aria-hidden="true" data-astro-cid-3ef6ksr2>/</span> <a', "", ' hreflang="en" lang="en" data-astro-cid-3ef6ksr2> ', ' </a> </nav> <button type="button" id="site-nav-toggle" class="site-nav-toggle" aria-expanded="false" aria-controls="site-nav-mobile"', ' data-astro-cid-3ef6ksr2> <span class="site-nav-toggle-bar" aria-hidden="true" data-astro-cid-3ef6ksr2></span> <span class="site-nav-toggle-bar" aria-hidden="true" data-astro-cid-3ef6ksr2></span> <span class="site-nav-toggle-bar" aria-hidden="true" data-astro-cid-3ef6ksr2></span> </button> </div> </div> <nav class="site-nav site-nav-desktop mt-7"', " data-astro-cid-3ef6ksr2> ", ' </nav> <nav id="site-nav-mobile" class="site-nav-mobile hidden" aria-label="Mobile Navigation" aria-hidden="true" data-astro-cid-3ef6ksr2> <ul class="site-nav-mobile-list" data-astro-cid-3ef6ksr2> ', ' </ul> <div class="site-social site-social-mobile" data-astro-cid-3ef6ksr2> <a', "", "", ' aria-label="Facebook" class="site-social-link hover:opacity-60 transition-opacity" data-astro-cid-3ef6ksr2> <svg class="site-social-icon fill-current" viewBox="0 0 24 24" aria-hidden="true" data-astro-cid-3ef6ksr2> <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" data-astro-cid-3ef6ksr2></path> </svg> </a> <a', "", "", ' aria-label="Instagram" class="site-social-link hover:opacity-60 transition-opacity" data-astro-cid-3ef6ksr2> <svg class="site-social-icon fill-current" viewBox="0 0 24 24" aria-hidden="true" data-astro-cid-3ef6ksr2> <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.227-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" data-astro-cid-3ef6ksr2></path> </svg> </a> </div> </nav> <div class="site-social site-social-desktop mt-5 flex justify-center items-center gap-4 text-black" data-astro-cid-3ef6ksr2> <a', "", "", ' aria-label="Facebook" class="site-social-link hover:opacity-60 transition-opacity" data-astro-cid-3ef6ksr2> <svg class="site-social-icon fill-current" viewBox="0 0 24 24" aria-hidden="true" data-astro-cid-3ef6ksr2> <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" data-astro-cid-3ef6ksr2></path> </svg> </a> <a', "", "", ' aria-label="Instagram" class="site-social-link hover:opacity-60 transition-opacity" data-astro-cid-3ef6ksr2> <svg class="site-social-icon fill-current" viewBox="0 0 24 24" aria-hidden="true" data-astro-cid-3ef6ksr2> <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.227-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" data-astro-cid-3ef6ksr2></path> </svg> </a> <div class="relative" id="share-menu" data-astro-cid-3ef6ksr2> <button type="button" id="share-button" class="share-trigger lowercase tracking-[0.02em] hover:opacity-60 transition-opacity" aria-expanded="false" aria-haspopup="true" aria-controls="share-dropdown" data-astro-cid-3ef6ksr2>\nShare\n</button> <div id="share-dropdown" class="share-dropdown hidden absolute left-1/2 top-full z-50 mt-2 w-56 -translate-x-1/2 border border-neutral-200 bg-white text-left shadow-sm" role="menu" aria-labelledby="share-button" data-astro-cid-3ef6ksr2> <a href="#" data-share="facebook" class="share-item" role="menuitem" target="_blank" rel="noopener noreferrer" data-astro-cid-3ef6ksr2> <svg class="share-icon" viewBox="0 0 24 24" aria-hidden="true" data-astro-cid-3ef6ksr2> <path fill="currentColor" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" data-astro-cid-3ef6ksr2></path> </svg> <span data-astro-cid-3ef6ksr2>Share to Facebook</span> </a> <a href="#" data-share="twitter" class="share-item" role="menuitem" target="_blank" rel="noopener noreferrer" data-astro-cid-3ef6ksr2> <svg class="share-icon" viewBox="0 0 24 24" aria-hidden="true" data-astro-cid-3ef6ksr2> <path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" data-astro-cid-3ef6ksr2></path> </svg> <span data-astro-cid-3ef6ksr2>Share to Twitter</span> </a> <a href="#" data-share="tumblr" class="share-item" role="menuitem" target="_blank" rel="noopener noreferrer" data-astro-cid-3ef6ksr2> <svg class="share-icon" viewBox="0 0 24 24" aria-hidden="true" data-astro-cid-3ef6ksr2> <path fill="currentColor" d="M14.563 24c-5.093 0-7.031-3.756-7.031-6.411V9.747H3.658V6.648c3.063-1.102 4.188-3.84 4.312-5.648H9.53v4.8h4.688v3.099H9.53v7.313c0 1.75.832 2.637 2.563 2.637.888 0 1.85-.281 2.47-.563z" data-astro-cid-3ef6ksr2></path> </svg> <span data-astro-cid-3ef6ksr2>Post to Tumblr</span> </a> <a href="#" data-share="pinterest" class="share-item" role="menuitem" target="_blank" rel="noopener noreferrer" data-astro-cid-3ef6ksr2> <svg class="share-icon" viewBox="0 0 24 24" aria-hidden="true" data-astro-cid-3ef6ksr2> <path fill="currentColor" d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.247 3.772-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" data-astro-cid-3ef6ksr2></path> </svg> <span data-astro-cid-3ef6ksr2>Post to Pinterest</span> </a> </div> </div> </div> </header>  <script>(function(){', "\n  // define:vars scripts are inlined as raw JS — no TypeScript syntax allowed.\n  function getShareUrl(network, pageUrl, title) {\n    const encodedUrl = encodeURIComponent(pageUrl)\n    const encodedTitle = encodeURIComponent(title)\n\n    switch (network) {\n      case 'facebook':\n        return \\`https://www.facebook.com/sharer/sharer.php?u=\\${encodedUrl}\\`\n      case 'twitter':\n        return \\`https://twitter.com/intent/tweet?url=\\${encodedUrl}&text=\\${encodedTitle}\\`\n      case 'tumblr':\n        return \\`https://www.tumblr.com/widgets/share/tool?posttype=link&title=\\${encodedTitle}&content=\\${encodedUrl}&canonicalUrl=\\${encodedUrl}\\`\n      case 'pinterest':\n        return \\`https://pinterest.com/pin/create/button/?url=\\${encodedUrl}&description=\\${encodedTitle}\\`\n      default:\n        return pageUrl\n    }\n  }\n\n  function initShareMenu() {\n    const menu = document.getElementById('share-menu')\n    const button = document.getElementById('share-button')\n    const dropdown = document.getElementById('share-dropdown')\n\n    if (!menu || !button || !dropdown) return\n    if (button.dataset.bound === 'true') return\n    button.dataset.bound = 'true'\n\n    const close = () => {\n      dropdown.classList.add('hidden')\n      button.setAttribute('aria-expanded', 'false')\n    }\n\n    const open = () => {\n      dropdown.classList.remove('hidden')\n      button.setAttribute('aria-expanded', 'true')\n    }\n\n    button.addEventListener('click', (event) => {\n      event.stopPropagation()\n      const isOpen = !dropdown.classList.contains('hidden')\n      if (isOpen) close()\n      else open()\n    })\n\n    dropdown.querySelectorAll('[data-share]').forEach((link) => {\n      link.addEventListener('click', (event) => {\n        event.preventDefault()\n        const network = link instanceof HTMLElement ? link.dataset.share : null\n        if (!network) return\n\n        const shareUrl = getShareUrl(network, window.location.href, document.title)\n        window.open(shareUrl, '_blank', 'noopener,noreferrer,width=600,height=500')\n        close()\n      })\n    })\n\n    document.addEventListener('click', (event) => {\n      if (event.target instanceof Node && !menu.contains(event.target)) {\n        close()\n      }\n    })\n\n    document.addEventListener('keydown', (event) => {\n      if (event.key === 'Escape') close()\n    })\n  }\n\n  function initMobileNav() {\n    const toggle = document.getElementById('site-nav-toggle')\n    const panel = document.getElementById('site-nav-mobile')\n\n    if (!toggle || !panel) return\n    if (toggle.dataset.bound === 'true') return\n    toggle.dataset.bound = 'true'\n\n    const close = () => {\n      panel.classList.add('hidden')\n      panel.setAttribute('aria-hidden', 'true')\n      toggle.classList.remove('is-open')\n      toggle.setAttribute('aria-expanded', 'false')\n      toggle.setAttribute('aria-label', menuOpenLabel)\n      document.body.classList.remove('site-nav-open')\n    }\n\n    const open = () => {\n      panel.classList.remove('hidden')\n      panel.setAttribute('aria-hidden', 'false')\n      toggle.classList.add('is-open')\n      toggle.setAttribute('aria-expanded', 'true')\n      toggle.setAttribute('aria-label', menuCloseLabel)\n      document.body.classList.add('site-nav-open')\n    }\n\n    toggle.addEventListener('click', () => {\n      const isOpen = !panel.classList.contains('hidden')\n      if (isOpen) close()\n      else open()\n    })\n\n    panel.querySelectorAll('a').forEach((link) => {\n      link.addEventListener('click', () => {\n        close()\n      })\n    })\n\n    document.addEventListener('keydown', (event) => {\n      if (event.key === 'Escape') close()\n    })\n\n    window.addEventListener('resize', () => {\n      if (window.matchMedia('(min-width: 1024px)').matches) {\n        close()\n      }\n    })\n  }\n\n  function initHeader() {\n    initShareMenu()\n    initMobileNav()\n  }\n\n  initHeader()\n  document.addEventListener('astro:page-load', initHeader)\n})();</script>"])), maybeRenderHead(), addAttribute(homeHref, "href"), photographerName, photographerTitle, addAttribute(t(locale, "langSwitch"), "aria-label"), addAttribute(deHref, "href"), addAttribute(["site-lang-link", locale === "de" && "site-lang-link-active"], "class:list"), t(locale, "langDe"), addAttribute(enHref, "href"), addAttribute(["site-lang-link", locale === "en" && "site-lang-link-active"], "class:list"), t(locale, "langEn"), addAttribute(t(locale, "menuOpen"), "aria-label"), addAttribute(t(locale, "mainNav"), "aria-label"), [rowOne, rowTwo].map(
    (row) => row.length > 0 && renderTemplate`<ul class="site-nav-list" data-astro-cid-3ef6ksr2> ${row.map((item) => {
      const active = isActive(item);
      return renderTemplate`<li class="site-nav-item" data-astro-cid-3ef6ksr2> <a${addAttribute(item.href, "href")}${addAttribute(item.categoryValue, "data-category")}${addAttribute(navItemClasses(active), "class:list")}${addAttribute(item.openInNewTab ? "_blank" : void 0, "target")}${addAttribute(item.openInNewTab ? "noopener noreferrer" : void 0, "rel")} data-astro-cid-3ef6ksr2> ${item.label} </a> </li>`;
    })} </ul>`
  ), navigation.map((item) => {
    const active = isActive(item);
    return renderTemplate`<li data-astro-cid-3ef6ksr2> <a${addAttribute(item.href, "href")}${addAttribute(item.categoryValue, "data-category")}${addAttribute(["site-nav-mobile-link", navItemClasses(active)], "class:list")}${addAttribute(item.openInNewTab ? "_blank" : void 0, "target")}${addAttribute(item.openInNewTab ? "noopener noreferrer" : void 0, "rel")} data-astro-cid-3ef6ksr2> ${item.label} </a> </li>`;
  }), addAttribute(facebookUrl, "href"), addAttribute(facebookUrl !== "#" ? "_blank" : void 0, "target"), addAttribute(facebookUrl !== "#" ? "noopener noreferrer" : void 0, "rel"), addAttribute(instagramUrl, "href"), addAttribute(instagramUrl !== "#" ? "_blank" : void 0, "target"), addAttribute(instagramUrl !== "#" ? "noopener noreferrer" : void 0, "rel"), addAttribute(facebookUrl, "href"), addAttribute(facebookUrl !== "#" ? "_blank" : void 0, "target"), addAttribute(facebookUrl !== "#" ? "noopener noreferrer" : void 0, "rel"), addAttribute(instagramUrl, "href"), addAttribute(instagramUrl !== "#" ? "_blank" : void 0, "target"), addAttribute(instagramUrl !== "#" ? "noopener noreferrer" : void 0, "rel"), defineScriptVars({ menuOpenLabel: t(locale, "menuOpen"), menuCloseLabel: t(locale, "menuClose") }));
}, "/Users/svenmagnus/Websites/Portfolio_Sven_Magnus/web/src/components/Header.astro", void 0);

async function fetchNavigationPages(locale = "de") {
  const params = withLocaleParam(
    new URLSearchParams({
      depth: "0",
      limit: "100",
      sort: "navOrder",
      "where[status][equals]": "published",
      "where[showInNavigation][equals]": "true"
    }),
    locale
  );
  try {
    const response = await fetch(`${getPayloadUrl()}/api/pages?${params.toString()}`, {
      cache: "no-store"
    });
    if (!response.ok) {
      console.warn(`Navigation pages API error: ${response.status}`);
      return [];
    }
    const data = await response.json();
    const docs = data.docs ?? [];
    return [...docs].sort((a, b) => (a.navOrder ?? 999) - (b.navOrder ?? 999));
  } catch (error) {
    console.warn("Navigation pages API unreachable:", error);
    return [];
  }
}
async function fetchPageBySlug(slug, locale = "de") {
  const params = withLocaleParam(
    new URLSearchParams({
      depth: "2",
      limit: "1",
      "where[slug][equals]": slug,
      "where[status][equals]": "published"
    }),
    locale
  );
  try {
    const response = await fetch(`${getPayloadUrl()}/api/pages?${params.toString()}`, {
      cache: "no-store"
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data.docs?.[0] ?? null;
  } catch {
    return null;
  }
}

const payloadUrl = "http://localhost:3000".replace(/\/$/, "");
async function fetchMainMenu(locale = "de") {
  try {
    const params = withLocaleParam(new URLSearchParams({ depth: "2" }), locale);
    const response = await fetch(`${payloadUrl}/api/globals/main-menu?${params.toString()}`);
    if (!response.ok) {
      return { items: [] };
    }
    return await response.json();
  } catch {
    return { items: [] };
  }
}

export { $$Header as $, fetchMainMenu as a, fetchNavigationPages as b, buildNavigation as c, $$Layout as d, contactIntroHtml as e, fetchPageBySlug as f, dateLocale as g, localizedPageText as l, modelFormMessages as m, pageLabel as p, t };
