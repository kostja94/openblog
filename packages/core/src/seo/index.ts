import type { Post, PostMeta } from "../types/post";
import { tagToSlug } from "../types/post";
import { resolvePostImageUrl } from "../utils/index";
import type { SiteHelpers } from "../site/context";

export function buildBlogPostingJsonLd(post: Post | PostMeta, site: SiteHelpers) {
  const features = site.runtime.features;
  const url = site.absoluteUrl(site.postPath(post.slug));
  const imageUrl = resolvePostImageUrl(post.coverImage, site.absoluteUrl);

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    ...(post.updated ? { dateModified: post.updated } : {}),
    ...(features.authors && post.author
      ? {
          author: {
            "@type": "Person",
            name: post.author,
          },
        }
      : {}),
    publisher: {
      "@type": "Organization",
      name: site.runtime.site.name,
      url: site.absoluteUrl("/"),
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    inLanguage: site.runtime.site.locale,
    ...(features.categories && post.category
      ? { articleSection: post.category }
      : {}),
    url,
    ...(imageUrl ? { image: [imageUrl] } : {}),
  };
}

export function buildBreadcrumbJsonLd(
  items: { name: string; path: string }[],
  site: SiteHelpers,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.path.startsWith("http")
        ? item.path
        : site.absoluteUrl(item.path),
    })),
  };
}

export function getArticleBreadcrumbItems(
  postTitle: string,
  slug: string,
  categoryName: string | undefined,
  categorySlug: string | undefined,
  site: SiteHelpers,
) {
  const items: { name: string; path: string }[] = [
    { name: "Blog", path: site.blogPath() },
  ];

  if (site.runtime.features.categories && categoryName && categorySlug) {
    items.push({ name: categoryName, path: site.categoryPath(categorySlug) });
  }

  items.push({ name: postTitle, path: site.postPath(slug) });

  return items;
}

export function getCategoryBreadcrumbItems(
  categoryName: string,
  categorySlug: string,
  site: SiteHelpers,
) {
  return [
    { name: "Home", path: site.blogPath() },
    { name: "Blog", path: site.blogPath() },
    { name: categoryName, path: site.categoryPath(categorySlug) },
  ];
}

export function buildRssFeed(
  posts: PostMeta[],
  site: SiteHelpers,
): string {
  const escapeXml = (value: string): string =>
    value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");

  const features = site.runtime.features;

  const items = posts
    .map((post) => {
      const url = site.absoluteUrl(site.postPath(post.slug));
      const categoryXml =
        features.categories && post.category
          ? `\n      <category>${escapeXml(post.category)}</category>`
          : "";
      const authorXml =
        features.authors && post.author
          ? `\n      <author>${escapeXml(post.author)}</author>`
          : "";
      return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description>${escapeXml(post.description)}</description>${categoryXml}${authorXml}
    </item>`;
    })
    .join("");

  const language = site.runtime.site.locale.toLowerCase();

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(site.runtime.site.name)}</title>
    <link>${site.absoluteUrl(site.blogPath())}</link>
    <description>${escapeXml(site.runtime.site.description)}</description>
    <language>${escapeXml(language)}</language>${items}
  </channel>
</rss>`;
}

function formatSitemapLastmod(date: string): string {
  return new Date(date).toISOString().split("T")[0]!;
}

function latestDateFromPosts(items: PostMeta[]): string | undefined {
  let latest: string | undefined;
  for (const post of items) {
    const candidate = post.updated ?? post.date;
    if (candidate && (!latest || candidate > latest)) {
      latest = candidate;
    }
  }
  return latest;
}

function buildSitemapUrlEntry(loc: string, lastmod?: string): string {
  const lastmodLine = lastmod
    ? `\n  <lastmod>${formatSitemapLastmod(lastmod)}</lastmod>`
    : "";
  return `<url>
  <loc>${loc}</loc>${lastmodLine}
  <changefreq>weekly</changefreq>
</url>`;
}

export function buildSitemapXml(posts: PostMeta[], site: SiteHelpers): string {
  const features = site.runtime.features;
  const entries: { loc: string; lastmod?: string }[] = [];

  const blogLastmod = latestDateFromPosts(posts);
  entries.push({
    loc: site.absoluteUrl(site.blogPath()),
    ...(blogLastmod ? { lastmod: blogLastmod } : {}),
  });

  for (const post of posts) {
    entries.push({
      loc: site.absoluteUrl(site.postPath(post.slug)),
      ...(post.date ? { lastmod: post.updated ?? post.date } : {}),
    });
  }

  if (features.categories) {
    const categorySlugs = [
      ...new Set(
        posts
          .map((post) => post.categorySlug)
          .filter((slug): slug is string => Boolean(slug)),
      ),
    ];
    for (const slug of categorySlugs) {
      const categoryPosts = posts.filter((post) => post.categorySlug === slug);
      const lastmod = latestDateFromPosts(categoryPosts);
      entries.push({
        loc: site.absoluteUrl(site.categoryPath(slug)),
        ...(lastmod ? { lastmod } : {}),
      });
    }
  }

  if (features.tags) {
    const tagSlugs = new Set<string>();
    for (const post of posts) {
      for (const tag of post.tags) {
        tagSlugs.add(tagToSlug(tag));
      }
    }
    for (const slug of tagSlugs) {
      const tagPosts = posts.filter((post) =>
        post.tags.some((tag) => tagToSlug(tag) === slug),
      );
      const lastmod = latestDateFromPosts(tagPosts);
      entries.push({
        loc: site.absoluteUrl(site.tagPath(slug)),
        ...(lastmod ? { lastmod } : {}),
      });
    }
  }

  if (features.authors) {
    const authorSlugs = new Set(
      posts
        .map((post) => (post.author ? tagToSlug(post.author) : undefined))
        .filter((slug): slug is string => Boolean(slug)),
    );
    for (const slug of authorSlugs) {
      const authorPosts = posts.filter(
        (post) => post.author && tagToSlug(post.author) === slug,
      );
      const lastmod = latestDateFromPosts(authorPosts);
      entries.push({
        loc: site.absoluteUrl(site.authorPath(slug)),
        ...(lastmod ? { lastmod } : {}),
      });
    }
  }

  const body = entries
    .map(({ loc, lastmod }) => buildSitemapUrlEntry(loc, lastmod))
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>`;
}
