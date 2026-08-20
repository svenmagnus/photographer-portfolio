import { e as createAstro, f as createComponent, r as renderTemplate, l as defineScriptVars, h as addAttribute, m as maybeRenderHead, u as unescapeHTML, k as renderComponent } from './astro/server_CBEUGtRa.mjs';
import 'piccolore';
import { t, e as contactIntroHtml, m as modelFormMessages, l as localizedPageText, p as pageLabel, g as dateLocale, f as fetchPageBySlug, a as fetchMainMenu, b as fetchNavigationPages, c as buildNavigation, d as $$Layout, $ as $$Header } from './mainMenu_B__XZ3Id.mjs';
import { l as lexicalToHtml, g as getMediaUrl, a as getFullMediaUrl, b as getBlogPostListImage, c as fetchBlogPostsForPage } from './blogPosts_CtFuqp7_.mjs';
import 'clsx';
import { D as DEFAULT_LOCALE, l as localePath, f as fetchSiteSettings } from './siteSettings_7gddyI71.mjs';
/* empty css                          */
import { $ as $$Lightbox } from './Lightbox_7aebDbUQ.mjs';

function getVideoEmbedUrl(url) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtube.com")) {
      const videoId = parsed.searchParams.get("v");
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }
    if (parsed.hostname === "youtu.be") {
      const videoId = parsed.pathname.replace(/^\//, "");
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }
    if (parsed.hostname.includes("vimeo.com")) {
      const videoId = parsed.pathname.split("/").filter(Boolean).pop();
      if (videoId) return `https://player.vimeo.com/video/${videoId}`;
    }
  } catch {
    return null;
  }
  return null;
}
function getAspectRatioClass(aspectRatio) {
  switch (aspectRatio) {
    case "4:3":
      return "aspect-[4/3]";
    case "9:16":
      return "aspect-[9/16]";
    case "16:9":
    default:
      return "aspect-video";
  }
}

var __freeze$2 = Object.freeze;
var __defProp$2 = Object.defineProperty;
var __template$2 = (cooked, raw) => __freeze$2(__defProp$2(cooked, "raw", { value: __freeze$2(cooked.slice()) }));
var _a$2;
const $$Astro$5 = createAstro("http://localhost:4321");
const $$CategoryPhotoGrid = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$5, $$props, $$slots);
  Astro2.self = $$CategoryPhotoGrid;
  const { category, rootId, locale = DEFAULT_LOCALE } = Astro2.props;
  return renderTemplate(_a$2 || (_a$2 = __template$2(["", "<div", "", ' class="photo-grid"></div> <p', ' class="py-12 text-center text-[13px] text-portfolio-muted"> ', " </p> <p", ' class="hidden py-12 text-center text-[13px] text-portfolio-muted"> ', " </p> <p", ' class="hidden py-12 text-center text-[13px] text-red-700" role="alert"></p> <script>(function(){', "\n  import { loadCategoryPhotoGrid } from '../../lib/photoLoader'\n\n  loadCategoryPhotoGrid(category, rootId)\n})();<\/script>"])), maybeRenderHead(), addAttribute(`${rootId}-grid`, "id"), addAttribute(rootId, "data-lightbox-group"), addAttribute(`${rootId}-loading`, "id"), t(locale, "photoGridLoading"), addAttribute(`${rootId}-empty`, "id"), t(locale, "photoGridEmptyCategory"), addAttribute(`${rootId}-error`, "id"), defineScriptVars({ category, rootId }));
}, "/Users/svenmagnus/Websites/Portfolio_Sven_Magnus/web/src/components/blocks/CategoryPhotoGrid.astro", void 0);

var __freeze$1 = Object.freeze;
var __defProp$1 = Object.defineProperty;
var __template$1 = (cooked, raw) => __freeze$1(__defProp$1(cooked, "raw", { value: __freeze$1(raw || cooked.slice()) }));
var _a$1;
const $$Astro$4 = createAstro("http://localhost:4321");
const $$ContactForm = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$ContactForm;
  const {
    blockId,
    intro,
    showPhone = true,
    showEmail = true,
    submitLabel,
    successMessage,
    email,
    phone,
    locale = DEFAULT_LOCALE,
    pageSlug
  } = Astro2.props;
  const introHtml = intro ? lexicalToHtml(intro) : "";
  const payloadUrl = "http://localhost:3000".replace(/\/$/, "");
  const formId = `contact-form-${blockId}`;
  const resolvedSubmitLabel = submitLabel || t(locale, "contactDefaultSubmit");
  const resolvedSuccessMessage = successMessage || t(locale, "contactDefaultSuccess");
  const displayIntroHtml = introHtml || (pageSlug === "contact" ? contactIntroHtml(locale) : "");
  const labels = {
    phone: t(locale, "contactPhoneLabel"),
    email: t(locale, "contactEmailLabel"),
    name: t(locale, "contactNamePlaceholder"),
    emailField: t(locale, "contactEmailPlaceholder"),
    message: t(locale, "contactMessagePlaceholder"),
    requiredFields: t(locale, "contactRequiredFields"),
    sending: t(locale, "contactSending"),
    sendError: t(locale, "contactSendError")
  };
  return renderTemplate(_a$1 || (_a$1 = __template$1(["", '<section class="py-8 max-w-3xl mx-auto" data-astro-cid-6pqxsueg> ', ' <div class="grid gap-12 md:grid-cols-2 md:items-start" data-astro-cid-6pqxsueg> <div class="space-y-8 text-[15px] leading-relaxed text-black" data-astro-cid-6pqxsueg> ', " ", " </div> <form", ' class="contact-form space-y-0" novalidate data-astro-cid-6pqxsueg> <label class="sr-only"', " data-astro-cid-6pqxsueg>", "</label> <input", ' type="text" name="name"', ' required autocomplete="name" class="contact-field" data-astro-cid-6pqxsueg> <label class="sr-only"', " data-astro-cid-6pqxsueg>", "</label> <input", ' type="email" name="email"', ' required autocomplete="email" class="contact-field" data-astro-cid-6pqxsueg> <label class="sr-only"', " data-astro-cid-6pqxsueg>", "</label> <textarea", ' name="message"', ' required rows="6" class="contact-field contact-field-textarea" data-astro-cid-6pqxsueg></textarea> <input type="text" name="website" tabindex="-1" autocomplete="off" class="hidden" aria-hidden="true" data-astro-cid-6pqxsueg> <button type="submit" class="contact-submit" data-astro-cid-6pqxsueg> ', ' </button> <p class="contact-status hidden mt-4 text-[13px]" role="status" aria-live="polite" data-astro-cid-6pqxsueg></p> </form> </div> </section> <script>(function(){', "\n  const form = document.getElementById(formId)\n  if (!form) throw new Error('Contact form not found')\n\n  const statusEl = form.querySelector('.contact-status')\n  const submitBtn = form.querySelector('.contact-submit')\n\n  form.addEventListener('submit', async (event) => {\n    event.preventDefault()\n\n    if (!(submitBtn instanceof HTMLButtonElement) || !(statusEl instanceof HTMLElement)) return\n\n    const formData = new FormData(form)\n    const name = String(formData.get('name') || '').trim()\n    const email = String(formData.get('email') || '').trim()\n    const message = String(formData.get('message') || '').trim()\n    const website = String(formData.get('website') || '').trim()\n\n    statusEl.classList.remove('hidden', 'text-red-700', 'text-black')\n    statusEl.textContent = ''\n\n    if (!name || !email || !message) {\n      statusEl.textContent = labels.requiredFields\n      statusEl.classList.add('text-red-700')\n      return\n    }\n\n    submitBtn.disabled = true\n    submitBtn.textContent = labels.sending\n\n    try {\n      const response = await fetch(`${payloadUrl}/api/contact`, {\n        method: 'POST',\n        headers: { 'Content-Type': 'application/json' },\n        body: JSON.stringify({ name, email, message, website }),\n      })\n\n      const data = await response.json().catch(() => ({}))\n\n      if (!response.ok) {\n        throw new Error(data.error || labels.sendError)\n      }\n\n      form.reset()\n      statusEl.textContent = resolvedSuccessMessage\n      statusEl.classList.add('text-black')\n    } catch (error) {\n      statusEl.textContent =\n        error instanceof Error ? error.message : labels.sendError\n      statusEl.classList.add('text-red-700')\n    } finally {\n      submitBtn.disabled = false\n      submitBtn.textContent = submitBtn.dataset.label || resolvedSubmitLabel\n      statusEl.classList.remove('hidden')\n    }\n  })\n\n  if (submitBtn instanceof HTMLButtonElement) {\n    submitBtn.dataset.label = submitBtn.textContent || resolvedSubmitLabel\n  }\n})();</script> "], ["", '<section class="py-8 max-w-3xl mx-auto" data-astro-cid-6pqxsueg> ', ' <div class="grid gap-12 md:grid-cols-2 md:items-start" data-astro-cid-6pqxsueg> <div class="space-y-8 text-[15px] leading-relaxed text-black" data-astro-cid-6pqxsueg> ', " ", " </div> <form", ' class="contact-form space-y-0" novalidate data-astro-cid-6pqxsueg> <label class="sr-only"', " data-astro-cid-6pqxsueg>", "</label> <input", ' type="text" name="name"', ' required autocomplete="name" class="contact-field" data-astro-cid-6pqxsueg> <label class="sr-only"', " data-astro-cid-6pqxsueg>", "</label> <input", ' type="email" name="email"', ' required autocomplete="email" class="contact-field" data-astro-cid-6pqxsueg> <label class="sr-only"', " data-astro-cid-6pqxsueg>", "</label> <textarea", ' name="message"', ' required rows="6" class="contact-field contact-field-textarea" data-astro-cid-6pqxsueg></textarea> <input type="text" name="website" tabindex="-1" autocomplete="off" class="hidden" aria-hidden="true" data-astro-cid-6pqxsueg> <button type="submit" class="contact-submit" data-astro-cid-6pqxsueg> ', ' </button> <p class="contact-status hidden mt-4 text-[13px]" role="status" aria-live="polite" data-astro-cid-6pqxsueg></p> </form> </div> </section> <script>(function(){', "\n  const form = document.getElementById(formId)\n  if (!form) throw new Error('Contact form not found')\n\n  const statusEl = form.querySelector('.contact-status')\n  const submitBtn = form.querySelector('.contact-submit')\n\n  form.addEventListener('submit', async (event) => {\n    event.preventDefault()\n\n    if (!(submitBtn instanceof HTMLButtonElement) || !(statusEl instanceof HTMLElement)) return\n\n    const formData = new FormData(form)\n    const name = String(formData.get('name') || '').trim()\n    const email = String(formData.get('email') || '').trim()\n    const message = String(formData.get('message') || '').trim()\n    const website = String(formData.get('website') || '').trim()\n\n    statusEl.classList.remove('hidden', 'text-red-700', 'text-black')\n    statusEl.textContent = ''\n\n    if (!name || !email || !message) {\n      statusEl.textContent = labels.requiredFields\n      statusEl.classList.add('text-red-700')\n      return\n    }\n\n    submitBtn.disabled = true\n    submitBtn.textContent = labels.sending\n\n    try {\n      const response = await fetch(\\`\\${payloadUrl}/api/contact\\`, {\n        method: 'POST',\n        headers: { 'Content-Type': 'application/json' },\n        body: JSON.stringify({ name, email, message, website }),\n      })\n\n      const data = await response.json().catch(() => ({}))\n\n      if (!response.ok) {\n        throw new Error(data.error || labels.sendError)\n      }\n\n      form.reset()\n      statusEl.textContent = resolvedSuccessMessage\n      statusEl.classList.add('text-black')\n    } catch (error) {\n      statusEl.textContent =\n        error instanceof Error ? error.message : labels.sendError\n      statusEl.classList.add('text-red-700')\n    } finally {\n      submitBtn.disabled = false\n      submitBtn.textContent = submitBtn.dataset.label || resolvedSubmitLabel\n      statusEl.classList.remove('hidden')\n    }\n  })\n\n  if (submitBtn instanceof HTMLButtonElement) {\n    submitBtn.dataset.label = submitBtn.textContent || resolvedSubmitLabel\n  }\n})();</script> "])), maybeRenderHead(), displayIntroHtml ? renderTemplate`<div class="cms-rich-text mb-10 text-center md:text-left" data-astro-cid-6pqxsueg>${unescapeHTML(displayIntroHtml)}</div>` : null, showPhone !== false && phone ? renderTemplate`<div data-astro-cid-6pqxsueg> <p class="font-semibold mb-1" data-astro-cid-6pqxsueg>${labels.phone}</p> <p data-astro-cid-6pqxsueg> <a${addAttribute(`tel:${phone.replace(/\s/g, "")}`, "href")} class="hover:opacity-60 transition-opacity" data-astro-cid-6pqxsueg> ${phone} </a> </p> </div>` : null, showEmail !== false && email ? renderTemplate`<div data-astro-cid-6pqxsueg> <p class="font-semibold mb-1" data-astro-cid-6pqxsueg>${labels.email}</p> <p data-astro-cid-6pqxsueg> <a${addAttribute(`mailto:${email}`, "href")} class="hover:opacity-60 transition-opacity" data-astro-cid-6pqxsueg> ${email} </a> </p> </div>` : null, addAttribute(formId, "id"), addAttribute(`${formId}-name`, "for"), labels.name, addAttribute(`${formId}-name`, "id"), addAttribute(labels.name, "placeholder"), addAttribute(`${formId}-email`, "for"), labels.emailField, addAttribute(`${formId}-email`, "id"), addAttribute(labels.emailField, "placeholder"), addAttribute(`${formId}-message`, "for"), labels.message, addAttribute(`${formId}-message`, "id"), addAttribute(labels.message, "placeholder"), resolvedSubmitLabel, defineScriptVars({ formId, payloadUrl, resolvedSuccessMessage, labels, resolvedSubmitLabel }));
}, "/Users/svenmagnus/Websites/Portfolio_Sven_Magnus/web/src/components/blocks/ContactForm.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Astro$3 = createAstro("http://localhost:4321");
const $$ModelApplicationForm = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$ModelApplicationForm;
  const {
    blockId,
    intro,
    privacyUrl = "/datenschutz",
    submitLabel,
    successMessage,
    locale = DEFAULT_LOCALE
  } = Astro2.props;
  const introHtml = intro ? lexicalToHtml(intro) : "";
  const formId = `model-application-form-${blockId}`;
  const payloadUrl = "http://localhost:3000".replace(/\/$/, "");
  const resolvedSubmitLabel = submitLabel || t(locale, "mafDefaultSubmit");
  const resolvedSuccessMessage = successMessage || t(locale, "mafDefaultSuccess");
  const resolvedPrivacyUrl = privacyUrl?.startsWith("/") ? localePath(privacyUrl, locale) : privacyUrl || localePath("/datenschutz", locale);
  const useCmsIntro = Boolean(introHtml);
  const defaultIntro = t(locale, "mafDefaultIntro");
  const polaSlots = [
    { name: "polaFront", label: t(locale, "mafPolaFront") },
    { name: "polaBack", label: t(locale, "mafPolaBack") },
    { name: "polaProfile", label: t(locale, "mafPolaProfile") },
    { name: "polaPortrait", label: t(locale, "mafPolaPortrait") }
  ];
  const formMessages = modelFormMessages(locale);
  return renderTemplate(_a || (_a = __template(["", '<section class="maf-section py-8 max-w-2xl mx-auto" data-astro-cid-pxefkots> <form', ' class="maf space-y-12" novalidate enctype="multipart/form-data" data-astro-cid-pxefkots> ', ' <div class="maf-honeypot" aria-hidden="true" data-astro-cid-pxefkots> <label', " data-astro-cid-pxefkots>Website</label> <input", ' type="text" name="website" tabindex="-1" autocomplete="off" data-astro-cid-pxefkots> </div> <div data-form-body class="space-y-12" data-astro-cid-pxefkots> <div class="space-y-5" data-astro-cid-pxefkots> <h2 class="maf-section-title font-serif text-lg tracking-wide" data-astro-cid-pxefkots>', '</h2> <div class="grid gap-4 sm:grid-cols-2" data-astro-cid-pxefkots> <div class="maf-field" data-field="firstName" data-astro-cid-pxefkots> <label', " data-astro-cid-pxefkots>", "</label> <input", ' name="firstName" type="text" required autocomplete="given-name" class="maf-input" data-astro-cid-pxefkots> <p class="maf-field-error" data-field-error hidden data-astro-cid-pxefkots></p> </div> <div class="maf-field" data-field="lastName" data-astro-cid-pxefkots> <label', " data-astro-cid-pxefkots>", "</label> <input", ' name="lastName" type="text" required autocomplete="family-name" class="maf-input" data-astro-cid-pxefkots> <p class="maf-field-error" data-field-error hidden data-astro-cid-pxefkots></p> </div> </div> <div class="grid gap-4 sm:grid-cols-2" data-astro-cid-pxefkots> <div class="maf-field" data-field="birthDate" data-astro-cid-pxefkots> <label', " data-astro-cid-pxefkots>", "</label> <input", ' name="birthDate" type="date" required class="maf-input" data-astro-cid-pxefkots> <p class="maf-field-error" data-field-error hidden data-astro-cid-pxefkots></p> </div> <div class="maf-field" data-field="age" data-astro-cid-pxefkots> <label', " data-astro-cid-pxefkots>", "</label> <input", ' name="age" type="number" min="14" max="99" required class="maf-input" data-astro-cid-pxefkots> <p class="text-xs text-portfolio-muted mt-1" data-astro-cid-pxefkots>', '</p> <p class="maf-field-error" data-field-error hidden data-astro-cid-pxefkots></p> </div> </div> <div class="maf-field" data-field="location" data-astro-cid-pxefkots> <label', " data-astro-cid-pxefkots>", "</label> <input", ' name="location" type="text" required autocomplete="address-level2" class="maf-input" data-astro-cid-pxefkots> <p class="maf-field-error" data-field-error hidden data-astro-cid-pxefkots></p> </div> <div class="grid gap-4 sm:grid-cols-2" data-astro-cid-pxefkots> <div class="maf-field" data-field="email" data-astro-cid-pxefkots> <label', " data-astro-cid-pxefkots>", "</label> <input", ' name="email" type="email" required autocomplete="email" class="maf-input" data-astro-cid-pxefkots> <p class="maf-field-error" data-field-error hidden data-astro-cid-pxefkots></p> </div> <div class="maf-field" data-field="phone" data-astro-cid-pxefkots> <label', " data-astro-cid-pxefkots>", "</label> <input", ' name="phone" type="tel" required autocomplete="tel" class="maf-input" data-astro-cid-pxefkots> <p class="maf-field-error" data-field-error hidden data-astro-cid-pxefkots></p> </div> </div> <div class="grid gap-4 sm:grid-cols-2" data-astro-cid-pxefkots> <div class="maf-field" data-field="instagram" data-astro-cid-pxefkots> <label', " data-astro-cid-pxefkots>", "</label> <input", ' name="instagram" type="url" placeholder="https://instagram.com/…" class="maf-input" data-astro-cid-pxefkots> </div> <div class="maf-field" data-field="tiktok" data-astro-cid-pxefkots> <label', " data-astro-cid-pxefkots>", "</label> <input", ' name="tiktok" type="url" placeholder="https://tiktok.com/@…" class="maf-input" data-astro-cid-pxefkots> </div> </div> </div> <div class="space-y-5" data-astro-cid-pxefkots> <h2 class="maf-section-title font-serif text-lg tracking-wide" data-astro-cid-pxefkots>', '</h2> <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" data-astro-cid-pxefkots> <div class="maf-field" data-field="heightCm" data-astro-cid-pxefkots> <label', " data-astro-cid-pxefkots>", "</label> <input", ' name="heightCm" type="number" min="100" max="230" required class="maf-input" data-astro-cid-pxefkots> <p class="maf-field-error" data-field-error hidden data-astro-cid-pxefkots></p> </div> <div class="maf-field" data-field="bustCm" data-astro-cid-pxefkots> <label', " data-astro-cid-pxefkots>", "</label> <input", ' name="bustCm" type="number" min="50" max="200" required class="maf-input" data-astro-cid-pxefkots> <p class="maf-field-error" data-field-error hidden data-astro-cid-pxefkots></p> </div> <div class="maf-field" data-field="waistCm" data-astro-cid-pxefkots> <label', " data-astro-cid-pxefkots>", "</label> <input", ' name="waistCm" type="number" min="40" max="200" required class="maf-input" data-astro-cid-pxefkots> <p class="maf-field-error" data-field-error hidden data-astro-cid-pxefkots></p> </div> <div class="maf-field" data-field="hipsCm" data-astro-cid-pxefkots> <label', " data-astro-cid-pxefkots>", "</label> <input", ' name="hipsCm" type="number" min="50" max="200" required class="maf-input" data-astro-cid-pxefkots> <p class="maf-field-error" data-field-error hidden data-astro-cid-pxefkots></p> </div> </div> <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" data-astro-cid-pxefkots> <div class="maf-field" data-field="clothingSize" data-astro-cid-pxefkots> <label', " data-astro-cid-pxefkots>", "</label> <select", ' name="clothingSize" required class="maf-input" data-astro-cid-pxefkots> <option value="" data-astro-cid-pxefkots>', '</option> <option value="XXS" data-astro-cid-pxefkots>XXS</option> <option value="XS" data-astro-cid-pxefkots>XS</option> <option value="S" data-astro-cid-pxefkots>S</option> <option value="M" data-astro-cid-pxefkots>M</option> <option value="L" data-astro-cid-pxefkots>L</option> <option value="XL" data-astro-cid-pxefkots>XL</option> <option value="XXL" data-astro-cid-pxefkots>XXL</option> </select> <p class="maf-field-error" data-field-error hidden data-astro-cid-pxefkots></p> </div> <div class="maf-field" data-field="shoeSize" data-astro-cid-pxefkots> <label', " data-astro-cid-pxefkots>", "</label> <input", ' name="shoeSize" type="number" min="30" max="50" step="0.5" required class="maf-input" data-astro-cid-pxefkots> <p class="maf-field-error" data-field-error hidden data-astro-cid-pxefkots></p> </div> <div class="maf-field" data-field="hairColor" data-astro-cid-pxefkots> <label', " data-astro-cid-pxefkots>", "</label> <input", ' name="hairColor" type="text" required class="maf-input" data-astro-cid-pxefkots> <p class="maf-field-error" data-field-error hidden data-astro-cid-pxefkots></p> </div> <div class="maf-field" data-field="eyeColor" data-astro-cid-pxefkots> <label', " data-astro-cid-pxefkots>", "</label> <input", ' name="eyeColor" type="text" required class="maf-input" data-astro-cid-pxefkots> <p class="maf-field-error" data-field-error hidden data-astro-cid-pxefkots></p> </div> </div> </div> <div class="space-y-5" data-astro-cid-pxefkots> <h2 class="maf-section-title font-serif text-lg tracking-wide" data-astro-cid-pxefkots>', '</h2> <div class="maf-info-box border border-[#d4d4d4] bg-[#f7f7f7] p-4 text-sm leading-relaxed text-portfolio-muted" data-astro-cid-pxefkots> <p class="text-black" data-astro-cid-pxefkots>', '</p> <ul class="mt-2 list-disc space-y-1 pl-5" data-astro-cid-pxefkots> <li data-astro-cid-pxefkots>', "</li> <li data-astro-cid-pxefkots>", "</li> <li data-astro-cid-pxefkots>", "</li> <li data-astro-cid-pxefkots>", "</li> <li data-astro-cid-pxefkots>", '</li> </ul> </div> <div class="grid gap-4 sm:grid-cols-2" data-astro-cid-pxefkots> ', ' </div> </div> </div> <div class="space-y-5 border-t border-[#d4d4d4] pt-8" data-form-footer data-astro-cid-pxefkots> <div class="maf-field maf-privacy" data-field="privacyConsent" data-astro-cid-pxefkots> <input', ' name="privacyConsent" type="checkbox" required data-astro-cid-pxefkots> <label', " data-astro-cid-pxefkots> <span data-astro-cid-pxefkots>", '</span> </label> <p class="maf-field-error" data-field-error hidden data-astro-cid-pxefkots></p> </div> <button type="submit" data-submit-button class="maf-submit" data-astro-cid-pxefkots> ', ' </button> <p class="maf-status hidden text-sm" role="status" aria-live="polite" data-form-status data-astro-cid-pxefkots></p> </div> </form> </section> <script>(function(){', "\n  function bootModelForm() {\n    if (typeof window.initModelApplicationForm !== 'function') return false\n    window.initModelApplicationForm({\n      form: `#${formId}`,\n      apiUrl: `${payloadUrl}/api/model-application`,\n      successMessage: resolvedSuccessMessage,\n      messages: formMessages,\n    })\n    return true\n  }\n\n  if (!bootModelForm()) {\n    const script = document.createElement('script')\n    script.src = '/forms/model-application-form.js'\n    script.onload = bootModelForm\n    document.head.appendChild(script)\n  }\n})();</script> "], ["", '<section class="maf-section py-8 max-w-2xl mx-auto" data-astro-cid-pxefkots> <form', ' class="maf space-y-12" novalidate enctype="multipart/form-data" data-astro-cid-pxefkots> ', ' <div class="maf-honeypot" aria-hidden="true" data-astro-cid-pxefkots> <label', " data-astro-cid-pxefkots>Website</label> <input", ' type="text" name="website" tabindex="-1" autocomplete="off" data-astro-cid-pxefkots> </div> <div data-form-body class="space-y-12" data-astro-cid-pxefkots> <div class="space-y-5" data-astro-cid-pxefkots> <h2 class="maf-section-title font-serif text-lg tracking-wide" data-astro-cid-pxefkots>', '</h2> <div class="grid gap-4 sm:grid-cols-2" data-astro-cid-pxefkots> <div class="maf-field" data-field="firstName" data-astro-cid-pxefkots> <label', " data-astro-cid-pxefkots>", "</label> <input", ' name="firstName" type="text" required autocomplete="given-name" class="maf-input" data-astro-cid-pxefkots> <p class="maf-field-error" data-field-error hidden data-astro-cid-pxefkots></p> </div> <div class="maf-field" data-field="lastName" data-astro-cid-pxefkots> <label', " data-astro-cid-pxefkots>", "</label> <input", ' name="lastName" type="text" required autocomplete="family-name" class="maf-input" data-astro-cid-pxefkots> <p class="maf-field-error" data-field-error hidden data-astro-cid-pxefkots></p> </div> </div> <div class="grid gap-4 sm:grid-cols-2" data-astro-cid-pxefkots> <div class="maf-field" data-field="birthDate" data-astro-cid-pxefkots> <label', " data-astro-cid-pxefkots>", "</label> <input", ' name="birthDate" type="date" required class="maf-input" data-astro-cid-pxefkots> <p class="maf-field-error" data-field-error hidden data-astro-cid-pxefkots></p> </div> <div class="maf-field" data-field="age" data-astro-cid-pxefkots> <label', " data-astro-cid-pxefkots>", "</label> <input", ' name="age" type="number" min="14" max="99" required class="maf-input" data-astro-cid-pxefkots> <p class="text-xs text-portfolio-muted mt-1" data-astro-cid-pxefkots>', '</p> <p class="maf-field-error" data-field-error hidden data-astro-cid-pxefkots></p> </div> </div> <div class="maf-field" data-field="location" data-astro-cid-pxefkots> <label', " data-astro-cid-pxefkots>", "</label> <input", ' name="location" type="text" required autocomplete="address-level2" class="maf-input" data-astro-cid-pxefkots> <p class="maf-field-error" data-field-error hidden data-astro-cid-pxefkots></p> </div> <div class="grid gap-4 sm:grid-cols-2" data-astro-cid-pxefkots> <div class="maf-field" data-field="email" data-astro-cid-pxefkots> <label', " data-astro-cid-pxefkots>", "</label> <input", ' name="email" type="email" required autocomplete="email" class="maf-input" data-astro-cid-pxefkots> <p class="maf-field-error" data-field-error hidden data-astro-cid-pxefkots></p> </div> <div class="maf-field" data-field="phone" data-astro-cid-pxefkots> <label', " data-astro-cid-pxefkots>", "</label> <input", ' name="phone" type="tel" required autocomplete="tel" class="maf-input" data-astro-cid-pxefkots> <p class="maf-field-error" data-field-error hidden data-astro-cid-pxefkots></p> </div> </div> <div class="grid gap-4 sm:grid-cols-2" data-astro-cid-pxefkots> <div class="maf-field" data-field="instagram" data-astro-cid-pxefkots> <label', " data-astro-cid-pxefkots>", "</label> <input", ' name="instagram" type="url" placeholder="https://instagram.com/…" class="maf-input" data-astro-cid-pxefkots> </div> <div class="maf-field" data-field="tiktok" data-astro-cid-pxefkots> <label', " data-astro-cid-pxefkots>", "</label> <input", ' name="tiktok" type="url" placeholder="https://tiktok.com/@…" class="maf-input" data-astro-cid-pxefkots> </div> </div> </div> <div class="space-y-5" data-astro-cid-pxefkots> <h2 class="maf-section-title font-serif text-lg tracking-wide" data-astro-cid-pxefkots>', '</h2> <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" data-astro-cid-pxefkots> <div class="maf-field" data-field="heightCm" data-astro-cid-pxefkots> <label', " data-astro-cid-pxefkots>", "</label> <input", ' name="heightCm" type="number" min="100" max="230" required class="maf-input" data-astro-cid-pxefkots> <p class="maf-field-error" data-field-error hidden data-astro-cid-pxefkots></p> </div> <div class="maf-field" data-field="bustCm" data-astro-cid-pxefkots> <label', " data-astro-cid-pxefkots>", "</label> <input", ' name="bustCm" type="number" min="50" max="200" required class="maf-input" data-astro-cid-pxefkots> <p class="maf-field-error" data-field-error hidden data-astro-cid-pxefkots></p> </div> <div class="maf-field" data-field="waistCm" data-astro-cid-pxefkots> <label', " data-astro-cid-pxefkots>", "</label> <input", ' name="waistCm" type="number" min="40" max="200" required class="maf-input" data-astro-cid-pxefkots> <p class="maf-field-error" data-field-error hidden data-astro-cid-pxefkots></p> </div> <div class="maf-field" data-field="hipsCm" data-astro-cid-pxefkots> <label', " data-astro-cid-pxefkots>", "</label> <input", ' name="hipsCm" type="number" min="50" max="200" required class="maf-input" data-astro-cid-pxefkots> <p class="maf-field-error" data-field-error hidden data-astro-cid-pxefkots></p> </div> </div> <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" data-astro-cid-pxefkots> <div class="maf-field" data-field="clothingSize" data-astro-cid-pxefkots> <label', " data-astro-cid-pxefkots>", "</label> <select", ' name="clothingSize" required class="maf-input" data-astro-cid-pxefkots> <option value="" data-astro-cid-pxefkots>', '</option> <option value="XXS" data-astro-cid-pxefkots>XXS</option> <option value="XS" data-astro-cid-pxefkots>XS</option> <option value="S" data-astro-cid-pxefkots>S</option> <option value="M" data-astro-cid-pxefkots>M</option> <option value="L" data-astro-cid-pxefkots>L</option> <option value="XL" data-astro-cid-pxefkots>XL</option> <option value="XXL" data-astro-cid-pxefkots>XXL</option> </select> <p class="maf-field-error" data-field-error hidden data-astro-cid-pxefkots></p> </div> <div class="maf-field" data-field="shoeSize" data-astro-cid-pxefkots> <label', " data-astro-cid-pxefkots>", "</label> <input", ' name="shoeSize" type="number" min="30" max="50" step="0.5" required class="maf-input" data-astro-cid-pxefkots> <p class="maf-field-error" data-field-error hidden data-astro-cid-pxefkots></p> </div> <div class="maf-field" data-field="hairColor" data-astro-cid-pxefkots> <label', " data-astro-cid-pxefkots>", "</label> <input", ' name="hairColor" type="text" required class="maf-input" data-astro-cid-pxefkots> <p class="maf-field-error" data-field-error hidden data-astro-cid-pxefkots></p> </div> <div class="maf-field" data-field="eyeColor" data-astro-cid-pxefkots> <label', " data-astro-cid-pxefkots>", "</label> <input", ' name="eyeColor" type="text" required class="maf-input" data-astro-cid-pxefkots> <p class="maf-field-error" data-field-error hidden data-astro-cid-pxefkots></p> </div> </div> </div> <div class="space-y-5" data-astro-cid-pxefkots> <h2 class="maf-section-title font-serif text-lg tracking-wide" data-astro-cid-pxefkots>', '</h2> <div class="maf-info-box border border-[#d4d4d4] bg-[#f7f7f7] p-4 text-sm leading-relaxed text-portfolio-muted" data-astro-cid-pxefkots> <p class="text-black" data-astro-cid-pxefkots>', '</p> <ul class="mt-2 list-disc space-y-1 pl-5" data-astro-cid-pxefkots> <li data-astro-cid-pxefkots>', "</li> <li data-astro-cid-pxefkots>", "</li> <li data-astro-cid-pxefkots>", "</li> <li data-astro-cid-pxefkots>", "</li> <li data-astro-cid-pxefkots>", '</li> </ul> </div> <div class="grid gap-4 sm:grid-cols-2" data-astro-cid-pxefkots> ', ' </div> </div> </div> <div class="space-y-5 border-t border-[#d4d4d4] pt-8" data-form-footer data-astro-cid-pxefkots> <div class="maf-field maf-privacy" data-field="privacyConsent" data-astro-cid-pxefkots> <input', ' name="privacyConsent" type="checkbox" required data-astro-cid-pxefkots> <label', " data-astro-cid-pxefkots> <span data-astro-cid-pxefkots>", '</span> </label> <p class="maf-field-error" data-field-error hidden data-astro-cid-pxefkots></p> </div> <button type="submit" data-submit-button class="maf-submit" data-astro-cid-pxefkots> ', ' </button> <p class="maf-status hidden text-sm" role="status" aria-live="polite" data-form-status data-astro-cid-pxefkots></p> </div> </form> </section> <script>(function(){', "\n  function bootModelForm() {\n    if (typeof window.initModelApplicationForm !== 'function') return false\n    window.initModelApplicationForm({\n      form: \\`#\\${formId}\\`,\n      apiUrl: \\`\\${payloadUrl}/api/model-application\\`,\n      successMessage: resolvedSuccessMessage,\n      messages: formMessages,\n    })\n    return true\n  }\n\n  if (!bootModelForm()) {\n    const script = document.createElement('script')\n    script.src = '/forms/model-application-form.js'\n    script.onload = bootModelForm\n    document.head.appendChild(script)\n  }\n})();</script> "])), maybeRenderHead(), addAttribute(formId, "id"), useCmsIntro ? renderTemplate`<div class="maf-intro cms-rich-text text-[15px] leading-relaxed text-portfolio-muted" data-form-intro data-astro-cid-pxefkots>${unescapeHTML(introHtml)}</div>` : renderTemplate`<div class="maf-intro text-[15px] leading-relaxed text-portfolio-muted" data-form-intro data-astro-cid-pxefkots>${unescapeHTML(defaultIntro)}</div>`, addAttribute(`${formId}-website`, "for"), addAttribute(`${formId}-website`, "id"), t(locale, "mafSectionPersonal"), addAttribute(`${formId}-firstName`, "for"), t(locale, "mafFirstName"), addAttribute(`${formId}-firstName`, "id"), addAttribute(`${formId}-lastName`, "for"), t(locale, "mafLastName"), addAttribute(`${formId}-lastName`, "id"), addAttribute(`${formId}-birthDate`, "for"), t(locale, "mafBirthDate"), addAttribute(`${formId}-birthDate`, "id"), addAttribute(`${formId}-age`, "for"), t(locale, "mafAge"), addAttribute(`${formId}-age`, "id"), t(locale, "mafAgeHint"), addAttribute(`${formId}-location`, "for"), t(locale, "mafLocation"), addAttribute(`${formId}-location`, "id"), addAttribute(`${formId}-email`, "for"), t(locale, "mafEmail"), addAttribute(`${formId}-email`, "id"), addAttribute(`${formId}-phone`, "for"), t(locale, "mafPhone"), addAttribute(`${formId}-phone`, "id"), addAttribute(`${formId}-instagram`, "for"), t(locale, "mafInstagram"), addAttribute(`${formId}-instagram`, "id"), addAttribute(`${formId}-tiktok`, "for"), t(locale, "mafTiktok"), addAttribute(`${formId}-tiktok`, "id"), t(locale, "mafSectionMeasurements"), addAttribute(`${formId}-heightCm`, "for"), t(locale, "mafHeight"), addAttribute(`${formId}-heightCm`, "id"), addAttribute(`${formId}-bustCm`, "for"), t(locale, "mafBust"), addAttribute(`${formId}-bustCm`, "id"), addAttribute(`${formId}-waistCm`, "for"), t(locale, "mafWaist"), addAttribute(`${formId}-waistCm`, "id"), addAttribute(`${formId}-hipsCm`, "for"), t(locale, "mafHips"), addAttribute(`${formId}-hipsCm`, "id"), addAttribute(`${formId}-clothingSize`, "for"), t(locale, "mafClothingSize"), addAttribute(`${formId}-clothingSize`, "id"), t(locale, "mafClothingSizePlaceholder"), addAttribute(`${formId}-shoeSize`, "for"), t(locale, "mafShoeSize"), addAttribute(`${formId}-shoeSize`, "id"), addAttribute(`${formId}-hairColor`, "for"), t(locale, "mafHairColor"), addAttribute(`${formId}-hairColor`, "id"), addAttribute(`${formId}-eyeColor`, "for"), t(locale, "mafEyeColor"), addAttribute(`${formId}-eyeColor`, "id"), t(locale, "mafSectionPolas"), t(locale, "mafPolasIntro"), t(locale, "mafPolasTip1"), t(locale, "mafPolasTip2"), t(locale, "mafPolasTip3"), t(locale, "mafPolasTip4"), t(locale, "mafPolasTip5"), polaSlots.map((slot) => renderTemplate`<div class="maf-field"${addAttribute(slot.name, "data-field")} data-astro-cid-pxefkots> <p class="mb-2 text-sm text-portfolio-muted" data-astro-cid-pxefkots>${slot.label}</p> <div class="maf-upload" data-upload-box data-astro-cid-pxefkots> <input type="file"${addAttribute(slot.name, "name")} accept="image/jpeg,image/png,image/webp,image/heic" data-astro-cid-pxefkots> <div class="maf-upload-placeholder" data-upload-placeholder data-astro-cid-pxefkots> <span data-astro-cid-pxefkots>${t(locale, "mafUploadPlaceholder")}</span> </div> <img class="maf-upload-preview" alt="" data-upload-preview hidden data-astro-cid-pxefkots> <button type="button" class="maf-upload-remove" data-upload-remove hidden data-astro-cid-pxefkots> ${t(locale, "mafUploadRemove")} </button> </div> <p class="maf-field-error" data-field-error hidden data-astro-cid-pxefkots></p> </div>`), addAttribute(`${formId}-privacy`, "id"), addAttribute(`${formId}-privacy`, "for"), unescapeHTML(t(locale, "mafPrivacyConsent", {
    link: `<a href="${resolvedPrivacyUrl}" class="underline hover:opacity-70">${t(locale, "mafPrivacyLink")}</a>`
  })), resolvedSubmitLabel, defineScriptVars({ formId, payloadUrl, resolvedSuccessMessage, formMessages }));
}, "/Users/svenmagnus/Websites/Portfolio_Sven_Magnus/web/src/components/blocks/ModelApplicationForm.astro", void 0);

const $$Astro$2 = createAstro("http://localhost:4321");
const $$BlockRenderer = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$BlockRenderer;
  const { blocks, pageType = "content", settings, locale = DEFAULT_LOCALE, pageSlug } = Astro2.props;
  function isMedia(value) {
    return Boolean(value && typeof value === "object" && "id" in value);
  }
  function getWidthClass(width) {
    switch (width) {
      case "narrow":
        return "max-w-prose";
      case "full":
        return "max-w-none w-full";
      case "normal":
      default:
        return "max-w-3xl";
    }
  }
  function getSpacerClass(size) {
    switch (size) {
      case "small":
        return "h-6 md:h-8";
      case "large":
        return "h-16 md:h-24";
      case "medium":
      default:
        return "h-10 md:h-14";
    }
  }
  function getGalleryCols(columns) {
    switch (columns) {
      case "2":
        return "content-gallery-grid content-gallery-grid--max-2";
      case "3":
        return "content-gallery-grid content-gallery-grid--max-3";
      case "4":
      default:
        return "content-gallery-grid";
    }
  }
  function getMediaTextLayout(layout, imageWidth) {
    if (layout === "stacked") {
      return {
        container: "flex flex-col gap-8",
        image: "w-full",
        text: "w-full"
      };
    }
    const imageBasis = imageWidth === "third" ? "md:basis-1/3" : imageWidth === "twoThirds" ? "md:basis-2/3" : "md:basis-1/2";
    return {
      container: `flex flex-col gap-8 md:flex-row md:items-start ${layout === "imageRight" ? "md:flex-row-reverse" : ""}`,
      image: `w-full shrink-0 ${imageBasis}`,
      text: "w-full flex-1"
    };
  }
  function getGalleryEntryMedia(entry) {
    if (isMedia(entry)) return entry;
    if (entry && typeof entry === "object" && "image" in entry) {
      const image = entry.image;
      return isMedia(image) ? image : null;
    }
    return null;
  }
  function getGalleryEntryCaption(entry) {
    if (entry && typeof entry === "object" && "caption" in entry) {
      const caption = entry.caption;
      return caption || null;
    }
    return null;
  }
  const sectionWidth = pageType === "landing" ? "max-w-[1400px]" : "max-w-5xl";
  return renderTemplate`${maybeRenderHead()}<div${addAttribute(`page-content mx-auto px-4 md:px-6 ${sectionWidth}`, "class")} data-astro-cid-b6654hkf> ${blocks.map((block, index) => {
    if (block.blockType === "heading") {
      const Tag = block.level === "h2" ? "h2" : "h1";
      const align = block.align === "left" ? "text-left" : "text-center";
      const headingText = localizedPageText(pageSlug, locale, block.text);
      return renderTemplate`<section${addAttribute(`py-6 ${align}`, "class")} data-astro-cid-b6654hkf> ${renderComponent($$result, "Tag", Tag, { "class": "font-normal tracking-tight text-black text-[clamp(1.75rem,4vw,2.75rem)] leading-tight", "data-astro-cid-b6654hkf": true }, { "default": ($$result2) => renderTemplate`${headingText}` })} </section>`;
    }
    if (block.blockType === "richText") {
      const html = lexicalToHtml(block.content);
      return renderTemplate`<section${addAttribute(`py-4 mx-auto ${getWidthClass(block.width)}`, "class")} data-astro-cid-b6654hkf> <div class="cms-rich-text" data-astro-cid-b6654hkf>${unescapeHTML(html)}</div> </section>`;
    }
    if (block.blockType === "mediaText" && isMedia(block.image)) {
      const html = lexicalToHtml(block.content);
      const layout = getMediaTextLayout(block.layout, block.imageWidth);
      const src = getMediaUrl(block.image, "grid");
      return renderTemplate`<section class="py-10" data-astro-cid-b6654hkf> <div${addAttribute(`${layout.container} md:gap-12`, "class")} data-astro-cid-b6654hkf> <div${addAttribute(layout.image, "class")} data-astro-cid-b6654hkf> ${src ? renderTemplate`<img${addAttribute(src, "src")}${addAttribute(block.image.alt || "", "alt")} loading="lazy" decoding="async" class="w-full h-auto object-cover" data-astro-cid-b6654hkf>` : null} </div> <div${addAttribute(layout.text, "class")} data-astro-cid-b6654hkf> <div class="cms-rich-text" data-astro-cid-b6654hkf>${unescapeHTML(html)}</div> </div> </div> </section>`;
    }
    if (block.blockType === "imageGallery" && block.images?.length) {
      const fullWidth = block.fullWidth !== false;
      const galleryId = `gallery-${index}`;
      return renderTemplate`<section${addAttribute(`py-4 ${fullWidth ? "gallery-full-bleed" : ""}`, "class")} data-astro-cid-b6654hkf> <div${addAttribute(getGalleryCols(block.columns), "class")}${addAttribute(galleryId, "data-lightbox-group")} data-astro-cid-b6654hkf> ${block.images.map((entry) => {
        const media = getGalleryEntryMedia(entry);
        const src = getMediaUrl(media, "grid");
        const fullSrc = getFullMediaUrl(media);
        if (!src) return null;
        const caption = getGalleryEntryCaption(entry);
        const alt = media?.alt || caption || "";
        return renderTemplate`<figure class="relative overflow-hidden bg-neutral-100" data-astro-cid-b6654hkf> <button type="button" class="lightbox-item block w-full cursor-zoom-in border-0 bg-transparent p-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30"${addAttribute(fullSrc || src, "data-full")}${addAttribute(alt, "data-title")}${addAttribute(`${alt} vergr\xF6\xDFern`, "aria-label")} data-astro-cid-b6654hkf> <img${addAttribute(src, "src")}${addAttribute(alt, "alt")} loading="lazy" decoding="async"${addAttribute([
          "block w-full pointer-events-none",
          fullWidth ? "h-auto object-contain" : "h-full object-cover"
        ], "class:list")} data-astro-cid-b6654hkf> </button> ${caption ? renderTemplate`<figcaption class="px-2 py-2 text-[11px] text-portfolio-muted text-center" data-astro-cid-b6654hkf> ${caption} </figcaption>` : null} </figure>`;
      })} </div> </section>`;
    }
    if (block.blockType === "photoGrid") {
      const gridId = `page-grid-${index}`;
      return renderTemplate`<section class="py-4" data-astro-cid-b6654hkf> ${block.showTitle ? renderTemplate`<h2 class="mb-4 text-center text-xl" data-astro-cid-b6654hkf> ${pageLabel(block.category, locale, block.category)} </h2>` : null} ${renderComponent($$result, "CategoryPhotoGrid", $$CategoryPhotoGrid, { "category": block.category, "rootId": gridId, "locale": locale, "data-astro-cid-b6654hkf": true })} </section>`;
    }
    if (block.blockType === "video") {
      const embedUrl = getVideoEmbedUrl(block.url);
      const posterMedia = isMedia(block.poster) ? block.poster : null;
      const posterUrl = getMediaUrl(posterMedia);
      return renderTemplate`<section class="py-8 max-w-4xl mx-auto" data-astro-cid-b6654hkf> ${embedUrl ? renderTemplate`<div${addAttribute(`relative w-full overflow-hidden bg-black ${getAspectRatioClass(block.aspectRatio)}`, "class")} data-astro-cid-b6654hkf> <iframe${addAttribute(embedUrl, "src")}${addAttribute(block.caption || "Video", "title")} class="absolute inset-0 h-full w-full border-0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen data-astro-cid-b6654hkf></iframe> </div>` : posterUrl ? renderTemplate`<img${addAttribute(posterUrl, "src")}${addAttribute(block.caption || "Video", "alt")} class="w-full h-auto" loading="lazy" data-astro-cid-b6654hkf>` : renderTemplate`<p class="text-center text-[13px] text-portfolio-muted" data-astro-cid-b6654hkf> <a${addAttribute(block.url, "href")} class="underline" target="_blank" rel="noopener noreferrer" data-astro-cid-b6654hkf>
Video öffnen
</a> </p>`} ${block.caption ? renderTemplate`<p class="mt-3 text-center text-[13px] text-portfolio-muted" data-astro-cid-b6654hkf>${block.caption}</p>` : null} </section>`;
    }
    if (block.blockType === "spacer") {
      return renderTemplate`<div${addAttribute(getSpacerClass(block.size), "class")} aria-hidden="true" data-astro-cid-b6654hkf></div>`;
    }
    if (block.blockType === "contactForm") {
      const email = settings?.contactEmail || settings?.professionalEmail;
      const phone = settings?.contactPhone;
      return renderTemplate`${renderComponent($$result, "ContactForm", $$ContactForm, { "blockId": String(index), "intro": block.intro, "showPhone": block.showPhone, "showEmail": block.showEmail, "submitLabel": block.submitLabel, "successMessage": block.successMessage, "email": email, "phone": phone, "locale": locale, "pageSlug": pageSlug, "data-astro-cid-b6654hkf": true })}`;
    }
    if (block.blockType === "modelApplicationForm") {
      return renderTemplate`${renderComponent($$result, "ModelApplicationForm", $$ModelApplicationForm, { "blockId": String(index), "intro": block.intro, "privacyUrl": block.privacyUrl, "submitLabel": block.submitLabel, "successMessage": block.successMessage, "locale": locale, "data-astro-cid-b6654hkf": true })}`;
    }
    if (block.blockType === "contactInfo") {
      const email = settings?.contactEmail || settings?.professionalEmail;
      const align = block.align === "left" ? "text-left" : "text-center";
      const socialAlign = block.align === "left" ? "justify-start" : "justify-center";
      return renderTemplate`<section${addAttribute(`py-4 max-w-2xl mx-auto text-[15px] leading-relaxed ${align}`, "class")} data-astro-cid-b6654hkf> ${email ? renderTemplate`<p data-astro-cid-b6654hkf> <a${addAttribute(`mailto:${email}`, "href")} class="underline hover:opacity-60 transition-opacity" data-astro-cid-b6654hkf> ${email} </a> </p>` : renderTemplate`<p class="text-portfolio-muted" data-astro-cid-b6654hkf>
E-Mail unter Website-Einstellungen → Kontakt & Social hinterlegen.
</p>`} ${block.showSocial !== false && (settings?.instagramUrl || settings?.facebookUrl) ? renderTemplate`<div${addAttribute(`mt-4 flex flex-wrap gap-4 text-[13px] ${socialAlign}`, "class")} data-astro-cid-b6654hkf> ${settings?.instagramUrl ? renderTemplate`<a${addAttribute(settings.instagramUrl, "href")} class="underline hover:opacity-60 transition-opacity" target="_blank" rel="noopener noreferrer" data-astro-cid-b6654hkf>
Instagram
</a>` : null} ${settings?.facebookUrl ? renderTemplate`<a${addAttribute(settings.facebookUrl, "href")} class="underline hover:opacity-60 transition-opacity" target="_blank" rel="noopener noreferrer" data-astro-cid-b6654hkf>
Facebook
</a>` : null} </div>` : null} </section>`;
    }
    return null;
  })} </div> `;
}, "/Users/svenmagnus/Websites/Portfolio_Sven_Magnus/web/src/components/blocks/BlockRenderer.astro", void 0);

const INTRO_MAX_LENGTH = 260;
function collectPlainText(nodes, parts) {
  if (!nodes?.length) return;
  for (const node of nodes) {
    if (node.type === "text" && node.text) {
      parts.push(node.text);
      continue;
    }
    if (node.children?.length) {
      collectPlainText(node.children, parts);
    }
  }
}
function lexicalToPlainText(content) {
  if (!content) return "";
  const root = "root" in content && content.root && typeof content.root === "object" ? content.root : "type" in content && content.type === "root" ? content : null;
  if (!root?.children?.length) return "";
  const parts = [];
  collectPlainText(root.children, parts);
  return parts.join(" ").replace(/\s+/g, " ").trim();
}
function truncateIntro(text) {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= INTRO_MAX_LENGTH) {
    return { intro: normalized, isTruncated: false };
  }
  const slice = normalized.slice(0, INTRO_MAX_LENGTH).replace(/\s+\S*$/, "").trim();
  return { intro: `${slice}…`, isTruncated: true };
}
function getBlogPostIntro(post) {
  const excerpt = post.excerpt?.replace(/\s+/g, " ").trim();
  const fullText = lexicalToPlainText(post.content);
  const source = excerpt || fullText;
  if (!source) {
    return { intro: "", showReadMore: false };
  }
  const { intro, isTruncated } = truncateIntro(source);
  const fullIsLonger = fullText.length > INTRO_MAX_LENGTH;
  const excerptIsShort = Boolean(excerpt && fullText.length > excerpt.length + 40);
  return {
    intro,
    showReadMore: isTruncated || fullIsLonger || excerptIsShort
  };
}

const $$Astro$1 = createAstro("http://localhost:4321");
const $$BlogPostList = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$BlogPostList;
  const { posts, blogSlug, locale = DEFAULT_LOCALE } = Astro2.props;
  function formatPostDate(value) {
    if (!value) return null;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;
    return new Intl.DateTimeFormat(dateLocale(locale), {
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(date);
  }
  return renderTemplate`${maybeRenderHead()}<section class="blog-post-list" aria-label="Blog-Beiträge" data-astro-cid-3mavlll6> ${posts.length === 0 ? renderTemplate`<p class="blog-post-empty" data-astro-cid-3mavlll6>${t(locale, "blogEmpty")}</p>` : renderTemplate`<ul class="blog-post-rows" data-astro-cid-3mavlll6> ${posts.map((post) => {
    const postUrl = localePath(`/${blogSlug}/${post.slug}`, locale);
    const listImage = getBlogPostListImage(post);
    const imageUrl = getMediaUrl(listImage);
    const dateLabel = formatPostDate(post.publishedAt);
    const { intro, showReadMore } = getBlogPostIntro(post);
    return renderTemplate`<li class="blog-post-card" data-astro-cid-3mavlll6> ${imageUrl ? renderTemplate`<a${addAttribute(postUrl, "href")} class="blog-post-image-link" data-astro-cid-3mavlll6> <img${addAttribute(imageUrl, "src")}${addAttribute(listImage?.alt || post.title, "alt")} loading="lazy" decoding="async" class="blog-post-image" data-astro-cid-3mavlll6> </a>` : null} <div class="blog-post-body" data-astro-cid-3mavlll6> <h2 class="blog-post-title" data-astro-cid-3mavlll6> <a${addAttribute(postUrl, "href")} data-astro-cid-3mavlll6>${post.title}</a> </h2> ${dateLabel ? renderTemplate`<p class="blog-post-date" data-astro-cid-3mavlll6>${dateLabel}</p>` : null} ${intro ? renderTemplate`<p class="blog-post-intro" data-astro-cid-3mavlll6>${intro}</p>` : null} ${showReadMore ? renderTemplate`<a${addAttribute(postUrl, "href")} class="blog-post-read-more" data-astro-cid-3mavlll6> ${t(locale, "blogReadMore")} </a>` : null} </div> </li>`;
  })} </ul>`} </section> `;
}, "/Users/svenmagnus/Websites/Portfolio_Sven_Magnus/web/src/components/blog/BlogPostList.astro", void 0);

const $$Astro = createAstro("http://localhost:4321");
const $$CmsSlugPage = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$CmsSlugPage;
  const { locale, slug } = Astro2.props;
  if (slug === "film-editor") {
    return Astro2.redirect(locale === "en" ? "/en/blog" : "/blog", 301);
  }
  const [page, settings, mainMenu, navPages] = await Promise.all([
    fetchPageBySlug(slug, locale),
    fetchSiteSettings(locale),
    fetchMainMenu(locale),
    fetchNavigationPages(locale)
  ]);
  const blogPosts = page?.pageType === "blog" ? await fetchBlogPostsForPage(page.slug, locale) : [];
  if (!page) {
    return new Response(null, { status: 404, statusText: "Not Found" });
  }
  const navItems = buildNavigation(settings, navPages, mainMenu.items, locale);
  const activeCategory = page.pageType === "gallery" ? page.galleryCategory || page.slug : void 0;
  const displayTitle = pageLabel(slug, locale, page.title);
  const pageTitle = page.metaTitle || `${displayTitle} \u2014 ${settings.photographerName || "Sven Magnus Hanefeld"}`;
  const description = page.metaDescription || settings.metaDescription || displayTitle;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": pageTitle, "description": description, "locale": locale }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="min-h-screen bg-white pb-16"> ${renderComponent($$result2, "Header", $$Header, { "locale": locale, "activeSlug": page.pageType !== "gallery" ? page.slug : void 0, "activeCategory": activeCategory, "navItems": navItems, "settings": settings })} ${page.pageType === "blog" ? renderTemplate`${renderComponent($$result2, "BlogPostList", $$BlogPostList, { "posts": blogPosts, "blogSlug": page.slug, "locale": locale })}` : renderTemplate`${renderComponent($$result2, "BlockRenderer", $$BlockRenderer, { "blocks": page.layout, "pageType": page.pageType, "settings": settings, "locale": locale, "pageSlug": page.slug })}`} ${renderComponent($$result2, "Lightbox", $$Lightbox, {})} </main> ` })}`;
}, "/Users/svenmagnus/Websites/Portfolio_Sven_Magnus/web/src/components/pages/CmsSlugPage.astro", void 0);

export { $$CmsSlugPage as $ };
