/* empty css                                     */
import { e as createAstro, f as createComponent, k as renderComponent, r as renderTemplate } from '../../chunks/astro/server_CBEUGtRa.mjs';
import 'piccolore';
import { $ as $$BlogPostPage } from '../../chunks/BlogPostPage_CcNH54t3.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro("http://localhost:4321");
const prerender = false;
const $$postSlug = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$postSlug;
  const blogSlug = Astro2.params.slug;
  const postSlug = Astro2.params.postSlug;
  if (!blogSlug || !postSlug) {
    return new Response(null, { status: 404, statusText: "Not Found" });
  }
  return renderTemplate`${renderComponent($$result, "BlogPostPage", $$BlogPostPage, { "locale": "de", "blogSlug": blogSlug, "postSlug": postSlug })}`;
}, "/Users/svenmagnus/Websites/Portfolio_Sven_Magnus/web/src/pages/[slug]/[postSlug].astro", void 0);

const $$file = "/Users/svenmagnus/Websites/Portfolio_Sven_Magnus/web/src/pages/[slug]/[postSlug].astro";
const $$url = "/[slug]/[postSlug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$postSlug,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
