import { e as createAstro, f as createComponent, m as maybeRenderHead, h as addAttribute, r as renderTemplate, u as unescapeHTML, k as renderComponent } from './astro/server_CBEUGtRa.mjs';
import 'piccolore';
import { t, f as fetchPageBySlug, a as fetchMainMenu, b as fetchNavigationPages, c as buildNavigation, $ as $$Header, d as $$Layout } from './mainMenu_B__XZ3Id.mjs';
import 'clsx';
import { n as normalizeFeaturedImages, l as lexicalToHtml, g as getMediaUrl, f as fetchBlogPost } from './blogPosts_CtFuqp7_.mjs';
import { D as DEFAULT_LOCALE, l as localePath, f as fetchSiteSettings } from './siteSettings_7gddyI71.mjs';
/* empty css                              */

const $$Astro$1 = createAstro("http://localhost:4321");
const $$BlogPostArticle = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$BlogPostArticle;
  const { post, blogSlug, blogTitle, locale = DEFAULT_LOCALE } = Astro2.props;
  const heroImages = normalizeFeaturedImages(post.featuredImage);
  const html = lexicalToHtml(post.content);
  return renderTemplate`${maybeRenderHead()}<article class="blog-article" data-astro-cid-vdnpecyn> <header class="blog-article-header" data-astro-cid-vdnpecyn> <p class="blog-article-back" data-astro-cid-vdnpecyn> <a${addAttribute(localePath(`/${blogSlug}`, locale), "href")} data-astro-cid-vdnpecyn>${t(locale, "blogBack", { title: blogTitle })}</a> </p> <h1 class="blog-article-title" data-astro-cid-vdnpecyn>${post.title}</h1> </header> ${heroImages.length > 0 ? renderTemplate`<div class="blog-article-heroes" data-astro-cid-vdnpecyn> ${heroImages.map((image) => {
    const imageUrl = getMediaUrl(image);
    if (!imageUrl) return null;
    return renderTemplate`<figure class="blog-article-hero" data-astro-cid-vdnpecyn> <img${addAttribute(imageUrl, "src")}${addAttribute(image.alt || post.title, "alt")} loading="eager" decoding="async" data-astro-cid-vdnpecyn> </figure>`;
  })} </div>` : null} <div class="blog-article-body cms-rich-text" data-astro-cid-vdnpecyn>${unescapeHTML(html)}</div> </article> `;
}, "/Users/svenmagnus/Websites/Portfolio_Sven_Magnus/web/src/components/blog/BlogPostArticle.astro", void 0);

const $$Astro = createAstro("http://localhost:4321");
const $$BlogPostPage = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$BlogPostPage;
  const { locale, blogSlug, postSlug } = Astro2.props;
  if (blogSlug === "film-editor") {
    return Astro2.redirect(localePath(`/blog/${postSlug}`, locale), 301);
  }
  const [blogPage, post, settings, mainMenu, navPages] = await Promise.all([
    fetchPageBySlug(blogSlug, locale),
    fetchBlogPost(blogSlug, postSlug, locale),
    fetchSiteSettings(locale),
    fetchMainMenu(locale),
    fetchNavigationPages(locale)
  ]);
  if (!blogPage || blogPage.pageType !== "blog" || !post) {
    return new Response(null, { status: 404, statusText: "Not Found" });
  }
  const navItems = buildNavigation(settings, navPages, mainMenu.items, locale);
  const pageTitle = post.metaTitle || `${post.title} \u2014 ${blogPage.title} \u2014 ${settings.photographerName || "Sven Magnus Hanefeld"}`;
  const description = post.metaDescription || post.excerpt || post.title;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": pageTitle, "description": description, "locale": locale }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="min-h-screen bg-white pb-16"> ${renderComponent($$result2, "Header", $$Header, { "activeSlug": blogSlug, "navItems": navItems, "settings": settings, "locale": locale })} ${renderComponent($$result2, "BlogPostArticle", $$BlogPostArticle, { "post": post, "blogSlug": blogSlug, "blogTitle": blogPage.title, "locale": locale })} </main> ` })}`;
}, "/Users/svenmagnus/Websites/Portfolio_Sven_Magnus/web/src/components/pages/BlogPostPage.astro", void 0);

export { $$BlogPostPage as $ };
