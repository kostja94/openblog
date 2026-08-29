import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CategoryArchive, JsonLd } from "@openblog/components";
import { resolveFeatures } from "@openblog/core";

import { absoluteUrl, categoryPath } from "@/config/site";
import { buildBreadcrumbJsonLd, getCategoryBreadcrumbItems } from "@/lib/schema";
import { getBlogIndexData, getPostsByCategory } from "@/lib/posts";
import { config } from "@/lib/openblog-config";

const features = resolveFeatures(config);

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  if (!features.categories) {
    return [];
  }

  const data = getBlogIndexData();
  return data.categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  if (!features.categories) {
    return {};
  }

  const { slug } = await params;
  const posts = getPostsByCategory(slug);

  if (!posts.length) {
    return {};
  }

  const categoryName = posts[0]?.category ?? slug;
  const canonical = absoluteUrl(categoryPath(slug));

  return {
    title: `${categoryName} | Blog`,
    description: `Articles in ${categoryName} on Open Blog.`,
    alternates: { canonical },
    openGraph: {
      title: `${categoryName} | Blog`,
      url: canonical,
      type: "website",
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  if (!features.categories) {
    notFound();
  }

  const { slug } = await params;
  const posts = getPostsByCategory(slug);

  if (!posts.length) {
    notFound();
  }

  const categoryName = posts[0]?.category ?? slug;
  const breadcrumbs = getCategoryBreadcrumbItems(categoryName, slug);

  return (
    <>
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbs)} />
      <CategoryArchive
        categoryName={categoryName}
        categorySlug={slug}
        posts={posts}
      />
    </>
  );
}
