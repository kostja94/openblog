import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CategoryArchive, JsonLd } from "@openblog/components";
import { resolveFeatures, tagToSlug } from "@openblog/core";

import { absoluteUrl, authorPath } from "@/config/site";
import { buildBreadcrumbJsonLd } from "@/lib/schema";
import { getAllPosts, getPostsByAuthor } from "@/lib/posts";
import { config, siteHelpers } from "@/lib/openblog-config";

const features = resolveFeatures(config);

type PageProps = {
  params: Promise<{ slug: string }>;
};

function resolveAuthorName(
  posts: ReturnType<typeof getPostsByAuthor>,
  authorSlug: string,
): string {
  return posts.find((post) => post.author && tagToSlug(post.author) === authorSlug)?.author ?? authorSlug;
}

export async function generateStaticParams() {
  if (!features.authors) {
    return [];
  }

  const posts = getAllPosts();
  const slugs = new Set(
    posts
      .map((post) => (post.author ? tagToSlug(post.author) : undefined))
      .filter((slug): slug is string => Boolean(slug)),
  );

  return [...slugs].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  if (!features.authors) {
    return {};
  }

  const { slug } = await params;
  const posts = getPostsByAuthor(slug);

  if (!posts.length) {
    return {};
  }

  const authorName = resolveAuthorName(posts, slug);
  const canonical = absoluteUrl(authorPath(slug));

  return {
    title: `${authorName} | Blog`,
    description: `Articles by ${authorName} on Open Blog.`,
    alternates: { canonical },
    openGraph: {
      title: `${authorName} | Blog`,
      url: canonical,
      type: "website",
    },
  };
}

export default async function AuthorPage({ params }: PageProps) {
  if (!features.authors) {
    notFound();
  }

  const { slug } = await params;
  const posts = getPostsByAuthor(slug);

  if (!posts.length) {
    notFound();
  }

  const authorName = resolveAuthorName(posts, slug);
  const breadcrumbs = [
    { name: "Blog", path: siteHelpers.blogPath() },
    { name: authorName, path: siteHelpers.authorPath(slug) },
  ];

  return (
    <>
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbs)} />
      <CategoryArchive
        categoryName={authorName}
        categorySlug={slug}
        posts={posts}
        description={`${posts.length} article${posts.length === 1 ? "" : "s"} by ${authorName}.`}
      />
    </>
  );
}
