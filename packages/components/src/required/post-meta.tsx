"use client";

import Link from "next/link";

import { authorToSlug, formatPostDate } from "@openblog/core";

import { useOpenBlog, useSiteHelpers } from "../provider";
import { obHoverText, obMuted } from "../tokens";

export function PostMetaRow({
  author,
  date,
  updated,
  readingMinutes,
  showAuthor = true,
}: {
  author?: string;
  date: string;
  updated?: string;
  readingMinutes: number;
  showAuthor?: boolean;
}) {
  const { features } = useOpenBlog();
  const site = useSiteHelpers();

  return (
    <div className={`mt-4 flex flex-wrap items-center gap-3 text-sm ${obMuted}`}>
      {showAuthor && author ? (
        <>
          {features.authors ? (
            <Link
              href={site.authorPath(authorToSlug(author))}
              className={obHoverText}
            >
              {author}
            </Link>
          ) : (
            <span>{author}</span>
          )}
          <span aria-hidden="true">·</span>
        </>
      ) : null}
      <time dateTime={date}>{formatPostDate(date)}</time>
      {updated && updated !== date ? (
        <>
          <span aria-hidden="true">·</span>
          <span>Updated {formatPostDate(updated)}</span>
        </>
      ) : null}
      <span aria-hidden="true">·</span>
      <span>{readingMinutes} min read</span>
    </div>
  );
}
