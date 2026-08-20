const LOCALES = ["de", "en"];
const DEFAULT_LOCALE = "de";
function localePath(path, locale) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const withoutLocale = normalized.replace(/^\/en(?=\/|$)/, "") || "/";
  if (locale === DEFAULT_LOCALE) {
    return withoutLocale;
  }
  return withoutLocale === "/" ? "/en" : `/en${withoutLocale}`;
}
function switchLocalePath(currentPath, targetLocale) {
  const withoutLocale = currentPath.replace(/^\/en(?=\/|$)/, "") || "/";
  return localePath(withoutLocale, targetLocale);
}
function stripLocalePrefix(path) {
  return path.replace(/^\/en(?=\/|$)/, "") || "/";
}
function withLocaleParam(params, locale) {
  params.set("locale", locale);
  return params;
}
function alternateLocalePaths(pathname) {
  const path = stripLocalePrefix(pathname);
  return {
    de: localePath(path, "de"),
    en: localePath(path, "en")
  };
}

function getPayloadUrl() {
  const runtime = typeof process !== "undefined" && process.env.PUBLIC_PAYLOAD_URL ? process.env.PUBLIC_PAYLOAD_URL : void 0;
  const baked = "http://localhost:3000";
  return (runtime || baked || "http://localhost:3000").replace(/\/$/, "");
}

function getDefaults() {
  return {
    productionDomain: "svenmagnus.com",
    cmsUrl: getPayloadUrl(),
    loginPath: "/log-in",
    photographerName: "Sven Magnus Hanefeld",
    photographerTitle: "Photographer",
    contactEmail: null,
    instagramUrl: null,
    facebookUrl: null,
    metaDescription: "Photography Portfolio by Sven Magnus Hanefeld"
  };
}
async function fetchSiteSettings(locale = "de") {
  const defaults = getDefaults();
  try {
    const params = withLocaleParam(new URLSearchParams({ depth: "1" }), locale);
    const response = await fetch(`${getPayloadUrl()}/api/globals/site-settings?${params.toString()}`);
    if (!response.ok) {
      return defaults;
    }
    const data = await response.json();
    return { ...defaults, ...data };
  } catch {
    return defaults;
  }
}
function getAdminLoginUrl(_settings) {
  return `${getPayloadUrl()}/admin`;
}

export { DEFAULT_LOCALE as D, LOCALES as L, alternateLocalePaths as a, switchLocalePath as b, getAdminLoginUrl as c, fetchSiteSettings as f, getPayloadUrl as g, localePath as l, stripLocalePrefix as s, withLocaleParam as w };
