import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArticleLayout, JsonLd } from "@openblog/components";
import { resolveFeatures, resolveOptionalComponents, resolvePostImageUrl } from "@openblog/core";

import { absoluteUrl, postPath } from "@/config/site";
import { config } from "@/lib/openblog-config";
import {
  buildBlogPostingJsonLd,
  buildBreadcrumbJsonLd,
  getArticleBreadcrumbItems,
} from "@/lib/schema";
import { getAdjacentPosts, getPostBySlug, getRelatedPosts } from "@/lib/posts";

const features = resolveFeatures(config);

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const { getAllPosts } = await import("@/lib/posts");
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {};
  }

  const canonical = absoluteUrl(postPath(post.slug));
  const ogImage = resolvePostImageUrl(post.coverImage, absoluteUrl);

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical },
    openGraph: {
      title: post.title,
      description: post.description,
      url: canonical,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      ...(features.authors && post.author ? { authors: [post.author] } : {}),
      ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 630 }] } : {}),
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title: post.title,
      description: post.description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const pageUrl = absoluteUrl(postPath(post.slug));
  const optional = resolveOptionalComponents(config);
  const relatedPosts = optional.relatedPosts ? getRelatedPosts(post) : [];
  const adjacentPosts = optional.prevNext ? getAdjacentPosts(slug) : { prev: null, next: null };
  const breadcrumbs = getArticleBreadcrumbItems(
    post.title,
    post.slug,
    post.category,
    post.categorySlug,
  );

  return (
    <>
      <JsonLd
        data={[
          buildBlogPostingJsonLd(post),
          buildBreadcrumbJsonLd(breadcrumbs),
        ]}
      />
      <ArticleLayout
        post={post}
        pageUrl={pageUrl}
        relatedPosts={relatedPosts}
        adjacentPosts={adjacentPosts}
      />
    </>
  );
}
