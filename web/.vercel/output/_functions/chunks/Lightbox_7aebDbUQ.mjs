import { f as createComponent, m as maybeRenderHead, n as renderScript, r as renderTemplate } from './astro/server_CBEUGtRa.mjs';
import 'piccolore';
import 'clsx';

const $$Lightbox = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div id="lightbox" class="fixed inset-0 z-50 hidden bg-black" role="dialog" aria-modal="true" aria-label="Vollbildansicht" hidden> <button type="button" id="lightbox-backdrop" class="absolute inset-0 w-full h-full cursor-default bg-black border-0 p-0" aria-label="Schließen"></button> <button type="button" id="lightbox-prev" class="absolute left-0 top-0 z-10 h-full w-1/4 border-0 bg-transparent p-0 opacity-0" aria-label="Vorheriges Bild" tabindex="-1"></button> <figure class="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center p-4 md:p-8"> <img id="lightbox-image" src="" alt="" class="max-h-full max-w-full select-none object-contain"> </figure> <button type="button" id="lightbox-next" class="absolute right-0 top-0 z-10 h-full w-1/4 border-0 bg-transparent p-0 opacity-0" aria-label="Nächstes Bild" tabindex="-1"></button> </div> ${renderScript($$result, "/Users/svenmagnus/Websites/Portfolio_Sven_Magnus/web/src/components/Lightbox.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/svenmagnus/Websites/Portfolio_Sven_Magnus/web/src/components/Lightbox.astro", void 0);

export { $$Lightbox as $ };
