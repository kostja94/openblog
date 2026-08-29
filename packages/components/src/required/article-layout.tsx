"use client";

import { extractToc, type AdjacentPosts, type Post, type PostMeta } from "@openblog/core";

import { useOpenBlog, useSiteHelpers } from "../provider";
import { obBorderB, obBorderT, obText } from "../tokens";
import { AuthorBox } from "../optional/author-box";
import { PrevNext } from "../optional/prev-next";
import { ShareBar } from "../optional/share-bar";
import { TagsList } from "../optional/tags-list";
import { TldrBlock } from "../optional/tldr-block";
import { Toc } from "../optional/toc";
import { BlogShell } from "./blog-shell";
import { Breadcrumbs } from "./breadcrumbs";
import { CategoryBadge } from "./category-badge";
import { FeaturedImage } from "./featured-image";
import { MarkdownContent } from "./markdown-content";
import { PostCard } from "./post-card";
import { PostDek } from "./post-dek";
import { PostMetaRow } from "./post-meta";
import { PostTitle } from "./post-title";

type ArticleLayoutProps = {
  post: Post;
  pageUrl: string;
  relatedPosts?: PostMeta[];
  adjacentPosts?: AdjacentPosts;
};

export function ArticleLayout({
  post,
  pageUrl,
  relatedPosts = [],
  adjacentPosts = { prev: null, next: null },
}: ArticleLayoutProps) {
  const { optional, required, features } = useOpenBlog();
  const site = useSiteHelpers();
  const tocItems = optional.toc ? extractToc(post.content) : [];

  const breadcrumbItems = [
    { name: "Blog", href: site.blogPath() },
    ...(features.categories && post.category && post.categorySlug
      ? [{ name: post.category, href: site.categoryPath(post.categorySlug) }]
      : []),
    { name: post.title },
  ];

  return (
    <BlogShell className="py-10 lg:py-14">
      <article>
        {required.breadcrumbs ? <Breadcrumbs items={breadcrumbItems} /> : null}

        <header className={`mt-6 max-w-3xl pb-8 ${obBorderB}`}>
          {features.categories && post.category ? (
            <CategoryBadge category={post.category} />
          ) : null}
          {required.postTitle ? <PostTitle>{post.title}</PostTitle> : null}
          {required.postDek ? <PostDek>{post.description}</PostDek> : null}
          {required.postMeta ? (
            <PostMetaRow
              author={post.author}
              showAuthor={features.authors}
              date={post.date}
              updated={post.updated}
              readingMinutes={post.readingMinutes}
            />
          ) : null}
          {required.featuredImage && post.coverImage ? (
            <FeaturedImage src={post.coverImage} alt={post.title} />
          ) : null}
        </header>

        {optional.tldr && post.tldr ? (
          <div className="max-w-3xl">
            <TldrBlock summary={post.tldr} />
          </div>
        ) : null}

        {optional.toc && tocItems.length > 0 ? (
          <aside className="mt-8 max-w-3xl">
            <Toc items={tocItems} />
          </aside>
        ) : null}

        <div className="mt-10 max-w-3xl">
          {required.markdown ? (
            <MarkdownContent content={post.content} />
          ) : null}
        </div>

        {optional.tagsList ? <TagsList tags={post.tags} /> : null}

        {optional.shareBar ? (
          <ShareBar url={pageUrl} title={post.title} />
        ) : null}

        {optional.authorBox && post.author ? (
          <AuthorBox author={post.author} />
        ) : null}

        {optional.prevNext ? (
          <PrevNext prev={adjacentPosts.prev} next={adjacentPosts.next} />
        ) : null}

        {optional.relatedPosts && relatedPosts.length > 0 ? (
          <section className={`mt-16 pt-10 ${obBorderT}`}>
            <h2 className={`text-2xl font-semibold tracking-tight ${obText}`}>
              Related posts
            </h2>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {relatedPosts.map((related) => (
                <PostCard key={related.slug} post={related} />
              ))}
            </div>
          </section>
        ) : null}

        <p className="sr-only">{pageUrl}</p>
      </article>
    </BlogShell>
  );
}
