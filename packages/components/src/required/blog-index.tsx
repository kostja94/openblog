"use client";

import Link from "next/link";

import type { BlogIndexData } from "@openblog/core";

import { useOpenBlog, useSiteHelpers } from "../provider";
import {
  obBorder,
  obHoverBorder,
  obHoverText,
  obMuted,
  obText,
} from "../tokens";
import { FeaturedPost } from "./featured-post";
import { PostCard } from "./post-card";

export function BlogIndex({ data }: { data: BlogIndexData }) {
  const { config, features } = useOpenBlog();
  const site = useSiteHelpers();

  return (
    <div className="space-y-12">
      <header className="max-w-3xl">
        <p className={`text-sm font-medium uppercase tracking-[0.2em] ${obMuted}`}>
          {config.site.name}
        </p>
        <h1 className={`mt-3 text-4xl font-semibold tracking-tight ${obText}`}>
          Blog
        </h1>
        <p className={`mt-4 text-lg leading-8 ${obMuted}`}>
          {config.site.description}
        </p>
      </header>

      {data.featured ? <FeaturedPost post={data.featured} /> : null}

      <section>
        <h2 className={`text-2xl font-semibold tracking-tight ${obText}`}>
          Latest articles
        </h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {data.latest.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      {features.categories && data.categories.length > 0 ? (
        <section>
          <h2 className={`text-2xl font-semibold tracking-tight ${obText}`}>
            Categories
          </h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {data.categories.map((category) => (
              <Link
                key={category.slug}
                href={site.categoryPath(category.slug)}
                className={`rounded-full border px-4 py-2 text-sm ${obBorder} ${obText} ${obHoverBorder} ${obHoverText}`}
              >
                {category.name} ({category.count})
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
