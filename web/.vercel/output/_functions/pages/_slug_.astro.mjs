/* empty css                                  */
import { e as createAstro, f as createComponent, k as renderComponent, r as renderTemplate } from '../chunks/astro/server_CBEUGtRa.mjs';
import 'piccolore';
import { $ as $$CmsSlugPage } from '../chunks/CmsSlugPage_BnGjms7P.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro("http://localhost:4321");
const prerender = false;
const $$slug = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$slug;
  const slug = Astro2.params.slug;
  if (!slug) {
    return new Response(null, { status: 404, statusText: "Not Found" });
  }
  return renderTemplate`${renderComponent($$result, "CmsSlugPage", $$CmsSlugPage, { "locale": "de", "slug": slug })}`;
}, "/Users/svenmagnus/Websites/Portfolio_Sven_Magnus/web/src/pages/[slug].astro", void 0);

const $$file = "/Users/svenmagnus/Websites/Portfolio_Sven_Magnus/web/src/pages/[slug].astro";
const $$url = "/[slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$slug,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
