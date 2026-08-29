"use client";

import type { Element } from "hast";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useMemo } from "react";

import { slugifyHeading } from "@openblog/core";

import { XEmbed } from "../optional/x-embed";
import { getParagraphXStatusUrl } from "../optional/x-markdown";
import { useOpenBlog } from "../provider";
import {
  obBorder,
  obCodeBg,
  obCodeFg,
  obMuted,
  obText,
} from "../tokens";
import { cn } from "../utils";

type MarkdownContentProps = {
  content: string;
  className?: string;
};

export function MarkdownContent({ content, className }: MarkdownContentProps) {
  const { optional } = useOpenBlog();
  const xEmbedEnabled = optional.xEmbed;

  const components = useMemo(
    () => ({
      h2: ({ children, ...props }: React.ComponentPropsWithoutRef<"h2">) => {
        const text = String(children);
        const id = slugifyHeading(text);
        return (
          <h2
            id={id}
            className={cn(
              "scroll-mt-24 mb-4 mt-10 text-2xl font-semibold tracking-tight",
              obText,
            )}
            {...props}
          >
            {children}
          </h2>
        );
      },
      h3: ({ children, ...props }: React.ComponentPropsWithoutRef<"h3">) => {
        const text = String(children);
        const id = slugifyHeading(text);
        return (
          <h3
            id={id}
            className={cn("scroll-mt-24 mb-3 mt-8 text-xl font-semibold", obText)}
            {...props}
          >
            {children}
          </h3>
        );
      },
      p: ({
        children,
        node,
        ...props
      }: React.ComponentPropsWithoutRef<"p"> & { node?: Element }) => {
        if (xEmbedEnabled) {
          const statusUrl = getParagraphXStatusUrl(node);
          if (statusUrl) {
            return <XEmbed url={statusUrl} />;
          }
        }

        return (
          <p className={cn("mb-4 text-[1.05rem] leading-7", obText)} {...props}>
            {children}
          </p>
        );
      },
      ul: ({ children, ...props }: React.ComponentPropsWithoutRef<"ul">) => (
        <ul className={cn("mb-4 list-disc space-y-2 pl-6", obText)} {...props}>
          {children}
        </ul>
      ),
      ol: ({ children, ...props }: React.ComponentPropsWithoutRef<"ol">) => (
        <ol className={cn("mb-4 list-decimal space-y-2 pl-6", obText)} {...props}>
          {children}
        </ol>
      ),
      a: ({
        href,
        children,
        ...props
      }: React.ComponentPropsWithoutRef<"a">) => {
        const isExternal = href?.startsWith("http");
        return (
          <a
            href={href}
            className={cn(
              "font-medium underline decoration-[var(--ob-color-border)] underline-offset-4 hover:decoration-[var(--ob-color-muted)]",
              obText,
            )}
            {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            {...props}
          >
            {children}
          </a>
        );
      },
      code: ({ children, ...props }: React.ComponentPropsWithoutRef<"code">) => (
        <code
          className={cn("rounded px-1.5 py-0.5 font-mono text-sm", obCodeBg, obCodeFg)}
          {...props}
        >
          {children}
        </code>
      ),
      pre: ({ children, ...props }: React.ComponentPropsWithoutRef<"pre">) => (
        <pre
          className={cn(
            "mb-4 overflow-x-auto rounded-xl border p-4 text-sm",
            obBorder,
            obCodeBg,
            obCodeFg,
          )}
          {...props}
        >
          {children}
        </pre>
      ),
      blockquote: ({
        children,
        ...props
      }: React.ComponentPropsWithoutRef<"blockquote">) => (
        <blockquote
          className={cn(
            "my-6 border-l-4 border-[var(--ob-color-border)] pl-4",
            obMuted,
          )}
          {...props}
        >
          {children}
        </blockquote>
      ),
    }),
    [xEmbedEnabled],
  );

  return (
    <div className={cn("markdown-content", className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
