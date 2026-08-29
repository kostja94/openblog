import type { ComponentType } from "react";

import type { OpenBlogConfig, RequiredComponentId } from "@openblog/core";
import {
  resolveOptionalComponents,
  resolveRequiredComponents,
  validateRequiredComponents,
} from "@openblog/core";

import { AuthorBox } from "./optional/author-box";
import { PrevNext } from "./optional/prev-next";
import { ShareBar, ShareButtons } from "./optional/share-bar";
import { TagsList } from "./optional/tags-list";
import { TldrBlock, AiSummary } from "./optional/tldr-block";
import { Toc } from "./optional/toc";
import { XEmbed } from "./optional/x-embed";
import { ArticleLayout } from "./required/article-layout";
import { BlogIndex } from "./required/blog-index";
import { BlogShell } from "./required/blog-shell";
import { Breadcrumbs } from "./required/breadcrumbs";
import { CategoryArchive } from "./required/category-archive";
import { TagArchive } from "./required/tag-archive";
import { CategoryBadge } from "./required/category-badge";
import { FeaturedImage } from "./required/featured-image";
import { FeaturedPost } from "./required/featured-post";
import { JsonLd } from "./required/json-ld";
import { MarkdownContent } from "./required/markdown-content";
import { PostCard } from "./required/post-card";
import { PostDek } from "./required/post-dek";
import { PostMetaRow } from "./required/post-meta";
import { PostTitle } from "./required/post-title";

/** Maps config `components.required` ids to article slot components. */
export const REQUIRED_COMPONENT_REGISTRY: Record<
  RequiredComponentId,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ComponentType<any>
> = {
  breadcrumbs: Breadcrumbs,
  "post-title": PostTitle,
  "post-meta": PostMetaRow,
  "post-dek": PostDek,
  "featured-image": FeaturedImage,
  markdown: MarkdownContent,
};

export interface ComponentRegistry {
  BlogIndex: typeof BlogIndex;
  ArticleLayout: typeof ArticleLayout;
  PostCard: typeof PostCard;
  FeaturedPost: typeof FeaturedPost;
  CategoryArchive: typeof CategoryArchive;
  TagArchive: typeof TagArchive;
  MarkdownContent: typeof MarkdownContent | null;
  BlogShell: typeof BlogShell;
  JsonLd: typeof JsonLd;
  Breadcrumbs: typeof Breadcrumbs | null;
  CategoryBadge: typeof CategoryBadge;
  FeaturedImage: typeof FeaturedImage | null;
  PostMetaRow: typeof PostMetaRow | null;
  PostTitle: typeof PostTitle | null;
  PostDek: typeof PostDek | null;
  Toc: typeof Toc | null;
  TldrBlock: typeof TldrBlock | null;
  ShareBar: typeof ShareBar | null;
  TagsList: typeof TagsList | null;
  AuthorBox: typeof AuthorBox | null;
  PrevNext: typeof PrevNext | null;
  XEmbed: typeof XEmbed | null;
}

export function resolveComponentRegistry(config: OpenBlogConfig): ComponentRegistry {
  const optional = resolveOptionalComponents(config);
  const required = resolveRequiredComponents(config);

  return {
    BlogIndex,
    ArticleLayout,
    PostCard,
    FeaturedPost,
    CategoryArchive,
    TagArchive,
    MarkdownContent: required.markdown ? MarkdownContent : null,
    BlogShell,
    JsonLd,
    Breadcrumbs: required.breadcrumbs ? Breadcrumbs : null,
    CategoryBadge,
    FeaturedImage: required.featuredImage ? FeaturedImage : null,
    PostMetaRow: required.postMeta ? PostMetaRow : null,
    PostTitle: required.postTitle ? PostTitle : null,
    PostDek: required.postDek ? PostDek : null,
    Toc: optional.toc ? Toc : null,
    TldrBlock: optional.tldr ? TldrBlock : null,
    ShareBar: optional.shareBar ? ShareBar : null,
    TagsList: optional.tagsList ? TagsList : null,
    AuthorBox: optional.authorBox ? AuthorBox : null,
    PrevNext: optional.prevNext ? PrevNext : null,
    XEmbed: optional.xEmbed ? XEmbed : null,
  };
}

export { validateRequiredComponents };

export {
  ArticleLayout,
  BlogIndex,
  BlogShell,
  Breadcrumbs,
  CategoryArchive,
  TagArchive,
  CategoryBadge,
  FeaturedImage,
  FeaturedPost,
  JsonLd,
  MarkdownContent,
  PostCard,
  PostDek,
  PostMetaRow,
  PostTitle,
  Toc,
  TldrBlock,
  AiSummary,
  ShareBar,
  ShareButtons,
  TagsList,
  AuthorBox,
  PrevNext,
  XEmbed,
};
