import { f as createComponent, m as maybeRenderHead, h as addAttribute, n as renderScript, r as renderTemplate, e as createAstro, k as renderComponent } from './astro/server_CBEUGtRa.mjs';
import 'piccolore';
import { a as fetchMainMenu, b as fetchNavigationPages, c as buildNavigation, d as $$Layout, $ as $$Header } from './mainMenu_B__XZ3Id.mjs';
import 'clsx';
import { $ as $$Lightbox } from './Lightbox_7aebDbUQ.mjs';
import { f as fetchSiteSettings } from './siteSettings_7gddyI71.mjs';

const $$PhotoGrid = createComponent(($$result, $$props, $$slots) => {
  const payloadUrl = "http://localhost:3000".replace(/\/$/, "");
  return renderTemplate`${maybeRenderHead()}<div id="photo-grid" data-lightbox-group="photo-grid" class="photo-grid"></div> <p id="photo-grid-loading" class="py-24 text-center text-[13px] text-portfolio-muted">
Fotografien werden geladen…
</p> <p id="photo-grid-empty" class="hidden py-24 text-center text-[13px] text-portfolio-muted">
Noch keine Fotografien vorhanden. Bitte im${" "} <a${addAttribute(`${payloadUrl}/admin`, "href")} class="underline">
Admin-Panel
</a>${" "}
Bilder hochladen.
</p> <p id="photo-grid-error" class="hidden py-24 text-center text-[13px] text-red-700" role="alert"></p> ${renderScript($$result, "/Users/svenmagnus/Websites/Portfolio_Sven_Magnus/web/src/components/PhotoGrid.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/svenmagnus/Websites/Portfolio_Sven_Magnus/web/src/components/PhotoGrid.astro", void 0);

const $$CategoryFilter = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderScript($$result, "/Users/svenmagnus/Websites/Portfolio_Sven_Magnus/web/src/components/CategoryFilter.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/svenmagnus/Websites/Portfolio_Sven_Magnus/web/src/components/CategoryFilter.astro", void 0);

const $$Astro = createAstro("http://localhost:4321");
const $$HomePage = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$HomePage;
  const { locale } = Astro2.props;
  const activeCategory = Astro2.url.searchParams.get("category") ?? "hollywood";
  const [settings, mainMenu, navPages] = await Promise.all([
    fetchSiteSettings(locale),
    fetchMainMenu(locale),
    fetchNavigationPages(locale)
  ]);
  const navItems = buildNavigation(settings, navPages, mainMenu.items, locale);
  const pageTitle = `${settings.photographerName || "Sven Magnus Hanefeld"} \u2014 ${settings.photographerTitle || "Photographer"}`;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": pageTitle, "description": settings.metaDescription || void 0, "locale": locale }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="min-h-screen bg-white"> ${renderComponent($$result2, "Header", $$Header, { "activeCategory": activeCategory, "navItems": navItems, "settings": settings, "locale": locale })} ${renderComponent($$result2, "PhotoGrid", $$PhotoGrid, {})} ${renderComponent($$result2, "Lightbox", $$Lightbox, {})} ${renderComponent($$result2, "CategoryFilter", $$CategoryFilter, {})} </main> ` })}`;
}, "/Users/svenmagnus/Websites/Portfolio_Sven_Magnus/web/src/components/pages/HomePage.astro", void 0);

export { $$HomePage as $ };
