"use client";

import Link from "next/link";

import {
  authorToSlug,
  formatPostDate,
  getPostExcerpt,
  type PostMeta,
} from "@openblog/core";

import { useOpenBlog, useSiteHelpers } from "../provider";
import { obHoverText, obMuted, obText } from "../tokens";

export function PostCard({ post }: { post: PostMeta }) {
  const { features } = useOpenBlog();
  const site = useSiteHelpers();

  return (
    <article className="ob-post-card p-6 shadow-sm transition">
      <div className={`flex flex-wrap items-center gap-2 text-sm ${obMuted}`}>
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
      <h2 className={`mt-3 text-xl font-semibold tracking-tight ${obText}`}>
        <Link href={site.postPath(post.slug)} className="hover:underline">
          {post.title}
        </Link>
      </h2>
      <p className={`mt-3 text-sm leading-6 ${obMuted}`}>
        {getPostExcerpt(post.description)}
      </p>
      <div className={`mt-4 flex items-center gap-3 text-sm ${obMuted}`}>
        {features.authors && post.author ? (
          <>
            <Link
              href={site.authorPath(authorToSlug(post.author))}
              className={obHoverText}
            >
              {post.author}
            </Link>
            <span>·</span>
          </>
        ) : null}
        <span>{post.readingMinutes} min read</span>
      </div>
    </article>
  );
}
