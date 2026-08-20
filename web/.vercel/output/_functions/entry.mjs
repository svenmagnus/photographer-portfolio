import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_CMNYl3qg.mjs';
import { manifest } from './manifest_Cwjl005N.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/en/_slug_/_postslug_.astro.mjs');
const _page2 = () => import('./pages/en/_slug_.astro.mjs');
const _page3 = () => import('./pages/en.astro.mjs');
const _page4 = () => import('./pages/log-in.astro.mjs');
const _page5 = () => import('./pages/_slug_/_postslug_.astro.mjs');
const _page6 = () => import('./pages/_slug_.astro.mjs');
const _page7 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["../node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/en/[slug]/[postSlug].astro", _page1],
    ["src/pages/en/[slug].astro", _page2],
    ["src/pages/en/index.astro", _page3],
    ["src/pages/log-in.astro", _page4],
    ["src/pages/[slug]/[postSlug].astro", _page5],
    ["src/pages/[slug].astro", _page6],
    ["src/pages/index.astro", _page7]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "00b28463-7296-465d-9ad9-a5cb752032d2",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) ;

export { __astrojsSsrVirtualEntry as default, pageMap };
