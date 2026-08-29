"use client";

import Link from "next/link";

import { formatPostDate, type PostMeta } from "@openblog/core";

import { useOpenBlog, useSiteHelpers } from "../provider";
import {
  obHoverText,
  obMuted,
  obPrimary,
  obPrimaryFg,
  obText,
} from "../tokens";

export function FeaturedPost({ post }: { post: PostMeta }) {
  const { features } = useOpenBlog();
  const site = useSiteHelpers();

  return (
    <section className="ob-featured p-8 sm:p-10">
      <p className={`text-sm font-medium uppercase tracking-[0.2em] ${obMuted}`}>
        Featured
      </p>
      <div className={`mt-4 flex flex-wrap items-center gap-2 text-sm ${obMuted}`}>
        {features.categories && post.category && post.categorySlug ? (
          <>
            <Link
              href={site.categoryPath(post.categorySlug)}
              className={`font-medium ${obText} ${obHoverText}`}
            >
              {post.category}
            </Link>
            <span>·</span>
          </>
        ) : null}
        <time dateTime={post.date}>{formatPostDate(post.date)}</time>
      </div>
      <h1 className={`mt-4 max-w-3xl text-3xl font-semibold tracking-tight ${obText} sm:text-4xl`}>
        <Link href={site.postPath(post.slug)} className="hover:underline">
          {post.title}
        </Link>
      </h1>
      <p className={`mt-4 max-w-2xl text-lg leading-8 ${obMuted}`}>
        {post.description}
      </p>
      <div className="mt-6">
        <Link
          href={site.postPath(post.slug)}
          className={`inline-flex items-center rounded-full px-5 py-2.5 text-sm font-medium ${obPrimary} ${obPrimaryFg} hover:opacity-90`}
        >
          Read article
        </Link>
      </div>
    </section>
  );
}
