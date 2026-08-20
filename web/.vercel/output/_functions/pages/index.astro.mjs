/* empty css                                  */
import { f as createComponent, k as renderComponent, r as renderTemplate } from '../chunks/astro/server_CBEUGtRa.mjs';
import 'piccolore';
import { $ as $$HomePage } from '../chunks/HomePage_XYNCebR-.mjs';
export { renderers } from '../renderers.mjs';

const prerender = false;
const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "HomePage", $$HomePage, { "locale": "de" })}`;
}, "/Users/svenmagnus/Websites/Portfolio_Sven_Magnus/web/src/pages/index.astro", void 0);

const $$file = "/Users/svenmagnus/Websites/Portfolio_Sven_Magnus/web/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Index,
	file: $$file,
	prerender,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
