import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { JsonLd, TagArchive } from "@openblog/components";
import { resolveFeatures, tagToSlug } from "@openblog/core";

import { absoluteUrl, tagPath } from "@/config/site";
import { buildBreadcrumbJsonLd } from "@/lib/schema";
import { getAllPosts, getPostsByTag } from "@/lib/posts";
import { config, siteHelpers } from "@/lib/openblog-config";

const features = resolveFeatures(config);

type PageProps = {
  params: Promise<{ slug: string }>;
};

function resolveTagName(posts: ReturnType<typeof getPostsByTag>, tagSlug: string): string {
  for (const post of posts) {
    for (const tag of post.tags) {
      if (tagToSlug(tag) === tagSlug) {
        return tag;
      }
    }
  }
  return tagSlug;
}

export async function generateStaticParams() {
  if (!features.tags) {
    return [];
  }

  const posts = getAllPosts();
  const slugs = new Set<string>();

  for (const post of posts) {
    for (const tag of post.tags) {
      slugs.add(tagToSlug(tag));
    }
  }

  return [...slugs].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  if (!features.tags) {
    return {};
  }

  const { slug } = await params;
  const posts = getPostsByTag(slug);

  if (!posts.length) {
    return {};
  }

  const tagName = resolveTagName(posts, slug);
  const canonical = absoluteUrl(tagPath(slug));

  return {
    title: `${tagName} | Blog`,
    description: `Articles tagged with ${tagName} on Open Blog.`,
    alternates: { canonical },
    openGraph: {
      title: `${tagName} | Blog`,
      url: canonical,
      type: "website",
    },
  };
}

export default async function TagPage({ params }: PageProps) {
  if (!features.tags) {
    notFound();
  }

  const { slug } = await params;
  const posts = getPostsByTag(slug);

  if (!posts.length) {
    notFound();
  }

  const tagName = resolveTagName(posts, slug);
  const breadcrumbs = [
    { name: "Blog", path: siteHelpers.blogPath() },
    { name: tagName, path: siteHelpers.tagPath(slug) },
  ];

  return (
    <>
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbs)} />
      <TagArchive
        tagName={tagName}
        tagSlug={slug}
        posts={posts}
        description={`${posts.length} article${posts.length === 1 ? "" : "s"} tagged with ${tagName}.`}
      />
    </>
  );
}
