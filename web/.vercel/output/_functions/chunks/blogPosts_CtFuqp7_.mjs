import { w as withLocaleParam } from './siteSettings_7gddyI71.mjs';

function isMediaObject$1(value) {
  return Boolean(value && typeof value === "object" && "id" in value);
}
function mediaFromUploadNode$1(node) {
  if (node.type !== "upload") return null;
  if (isMediaObject$1(node.value)) {
    return node.value;
  }
  const fields = node.fields;
  if (fields && isMediaObject$1(fields.value)) {
    return fields.value;
  }
  return null;
}
function collectMediaFromLexical(content) {
  const root = content && "root" in content && content.root && typeof content.root === "object" ? content.root : content && "type" in content && content.type === "root" ? content : null;
  if (!root) return [];
  const media = [];
  function walk(node) {
    if (!node) return;
    const uploadMedia = mediaFromUploadNode$1(node);
    if (uploadMedia) {
      media.push(uploadMedia);
    }
    node.children?.forEach(walk);
  }
  walk(root);
  return media;
}
function getFirstMediaFromLexical(content) {
  return collectMediaFromLexical(content)[0] ?? null;
}
function normalizeFeaturedImages(featuredImage) {
  if (!featuredImage) return [];
  if (Array.isArray(featuredImage)) {
    return featuredImage.filter((item) => typeof item === "object" && item !== null);
  }
  if (typeof featuredImage === "object") {
    return [featuredImage];
  }
  return [];
}
function getBlogPostListImage(post) {
  const featured = normalizeFeaturedImages(post.featuredImage)[0];
  if (featured) return featured;
  return getFirstMediaFromLexical(post.content);
}

function sizeLikelyMissingOnBlob(originalUrl, sizeUrl) {
  if (!originalUrl) return false;
  const originalName = originalUrl.split("/").pop() || "";
  const sizeName = sizeUrl.split("/").pop() || "";
  const originalStem = originalName.replace(/\.[^.]+$/, "");
  const suffixMatch = originalStem.match(/-([A-Za-z0-9_-]{16,})$/);
  if (!suffixMatch) return false;
  return !sizeName.includes(suffixMatch[1]);
}
function hasUsableSize(size, originalUrl) {
  if (!size?.url) return false;
  if (typeof size.filesize === "number" && size.filesize <= 0) return false;
  if (sizeLikelyMissingOnBlob(originalUrl, size.url)) return false;
  return true;
}
function pickMediaUrl(media, preferred) {
  const order = preferred ? preferred === "thumbnail" ? ["thumbnail", "grid", "original", "fullscreen"] : preferred === "grid" ? ["grid", "thumbnail", "original", "fullscreen"] : ["fullscreen", "original", "grid", "thumbnail"] : ["grid", "original", "fullscreen", "thumbnail"];
  for (const key of order) {
    if (key === "original") {
      if (media.url) {
        return { url: media.url, width: media.width, height: media.height };
      }
      continue;
    }
    const size = media.sizes?.[key];
    if (hasUsableSize(size, media.url)) {
      return { url: size.url, width: size.width, height: size.height };
    }
  }
  return { url: media.url || "" };
}
function pickFullMediaUrl(media) {
  return pickMediaUrl(media, "fullscreen");
}

function getPayloadUrl$1() {
  return "http://localhost:3000".replace(/\/$/, "");
}
function resolveMediaUrl(url) {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  const payloadUrl = getPayloadUrl$1();
  return `${payloadUrl}${url.startsWith("/") ? url : `/${url}`}`;
}
function getFullMediaUrl(media) {
  if (!media) return "";
  if (typeof media === "string") return resolveMediaUrl(media);
  return resolveMediaUrl(pickFullMediaUrl(media).url);
}
function getMediaUrl(media, size = "grid") {
  if (!media) return "";
  if (typeof media === "string") return resolveMediaUrl(media);
  return resolveMediaUrl(pickMediaUrl(media, size).url);
}

const FORMAT_BOLD = 1;
const FORMAT_ITALIC = 2;
const FORMAT_UNDERLINE = 8;
function escapeHtml(value) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function wrapText(text, format) {
  let result = escapeHtml(text);
  if (format & FORMAT_BOLD) result = `<strong>${result}</strong>`;
  if (format & FORMAT_ITALIC) result = `<em>${result}</em>`;
  if (format & FORMAT_UNDERLINE) result = `<u>${result}</u>`;
  return result;
}
function isMediaObject(value) {
  return Boolean(value && typeof value === "object" && "id" in value);
}
function mediaFromUploadNode(node) {
  if (node.type !== "upload") return null;
  if (isMediaObject(node.value)) return node.value;
  if (node.fields && isMediaObject(node.fields.value)) return node.fields.value;
  return null;
}
function renderUpload(node) {
  const media = mediaFromUploadNode(node);
  if (!media) return "";
  const src = getMediaUrl(media);
  if (!src) return "";
  const alt = escapeHtml(media.alt || "");
  return `<figure class="cms-upload-image"><img src="${escapeHtml(src)}" alt="${alt}" loading="lazy" decoding="async" /></figure>`;
}
function getLinkFields(node) {
  if (node.fields && typeof node.fields === "object") {
    return node.fields;
  }
  return {
    url: typeof node.url === "string" ? node.url : void 0,
    newTab: Boolean(node.newTab),
    linkType: "custom"
  };
}
function resolveInternalLinkHref(doc) {
  if (!doc?.value) return null;
  const value = doc.value;
  if (typeof value === "object" && typeof value.slug === "string" && value.slug.trim()) {
    const slug = value.slug.trim();
    return slug === "home" ? "/" : `/${slug}`;
  }
  return null;
}
function getLinkHref(node) {
  const fields = getLinkFields(node);
  if (fields.linkType === "internal") {
    const internalHref = resolveInternalLinkHref(fields.doc);
    if (internalHref) return internalHref;
  }
  const href = fields.url ?? (typeof node.url === "string" ? node.url : "");
  return href.trim() || "#";
}
function renderLink(node) {
  const fields = getLinkFields(node);
  const href = escapeHtml(getLinkHref(node));
  const openInNewTab = fields.newTab ?? Boolean(node.newTab);
  const target = openInNewTab ? ' target="_blank" rel="noopener noreferrer"' : "";
  return `<a href="${href}"${target}>${renderNodes(node.children)}</a>`;
}
function renderNodes(nodes) {
  if (!nodes?.length) return "";
  return nodes.map((node) => {
    switch (node.type) {
      case "text": {
        const format = typeof node.format === "number" ? node.format : 0;
        return wrapText(node.text || "", format);
      }
      case "linebreak":
        return "<br />";
      case "paragraph":
        return `<p>${renderNodes(node.children)}</p>`;
      case "heading": {
        const tag = typeof node.tag === "string" ? node.tag : "h2";
        return `<${tag}>${renderNodes(node.children)}</${tag}>`;
      }
      case "link":
      case "autolink":
        return renderLink(node);
      case "upload":
        return renderUpload(node);
      case "list": {
        const tag = node.listType === "number" ? "ol" : "ul";
        return `<${tag}>${renderNodes(node.children)}</${tag}>`;
      }
      case "listitem":
        return `<li>${renderNodes(node.children)}</li>`;
      case "quote":
        return `<blockquote>${renderNodes(node.children)}</blockquote>`;
      case "horizontalrule":
        return "<hr />";
      default:
        return node.children ? renderNodes(node.children) : "";
    }
  }).join("");
}
function lexicalToHtml(content) {
  if (!content) return "";
  const root = "root" in content && content.root ? content.root : "type" in content && content.type === "root" ? content : null;
  if (!root) return "";
  return renderNodes(root.children);
}

function getPayloadUrl() {
  return "http://localhost:3000".replace(/\/$/, "");
}
function getPostSortTime(post) {
  const published = post.publishedAt ? Date.parse(post.publishedAt) : Number.NaN;
  if (!Number.isNaN(published)) return published;
  return typeof post.id === "number" ? post.id : 0;
}
function sortBlogPostsNewestFirst(posts) {
  return [...posts].sort((a, b) => getPostSortTime(b) - getPostSortTime(a));
}
async function fetchBlogPostsForPage(blogPageSlug, locale = "de") {
  const pageParams = withLocaleParam(
    new URLSearchParams({
      depth: "0",
      limit: "1",
      "where[slug][equals]": blogPageSlug,
      "where[pageType][equals]": "blog",
      "where[status][equals]": "published"
    }),
    locale
  );
  try {
    const pageResponse = await fetch(`${getPayloadUrl()}/api/pages?${pageParams.toString()}`);
    if (!pageResponse.ok) return [];
    const pageData = await pageResponse.json();
    const pageId = pageData.docs?.[0]?.id;
    if (pageId == null) return [];
    const postParams = withLocaleParam(
      new URLSearchParams({
        depth: "2",
        limit: "100",
        sort: "-publishedAt",
        "where[status][equals]": "published",
        "where[blogPage][equals]": String(pageId)
      }),
      locale
    );
    const response = await fetch(`${getPayloadUrl()}/api/blog-posts?${postParams.toString()}`);
    if (!response.ok) return [];
    const data = await response.json();
    return sortBlogPostsNewestFirst(data.docs ?? []);
  } catch (error) {
    console.warn("Blog posts API unreachable:", error);
    return [];
  }
}
async function fetchBlogPost(blogPageSlug, postSlug, locale = "de") {
  const params = withLocaleParam(
    new URLSearchParams({
      depth: "2",
      limit: "1",
      "where[slug][equals]": postSlug,
      "where[status][equals]": "published",
      "where[blogPage.slug][equals]": blogPageSlug
    }),
    locale
  );
  try {
    const response = await fetch(`${getPayloadUrl()}/api/blog-posts?${params.toString()}`);
    if (!response.ok) return null;
    const data = await response.json();
    return data.docs?.[0] ?? null;
  } catch {
    return null;
  }
}

export { getFullMediaUrl as a, getBlogPostListImage as b, fetchBlogPostsForPage as c, fetchBlogPost as f, getMediaUrl as g, lexicalToHtml as l, normalizeFeaturedImages as n };
