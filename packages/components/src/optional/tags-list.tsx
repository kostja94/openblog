"use client";

import { obBorderT, obCodeBg, obMuted, obText } from "../tokens";
import { useOpenBlog } from "../provider";

export function TagsList({ tags }: { tags: string[] }) {
  const { features } = useOpenBlog();

  if (!features.tags || !tags.length) {
    return null;
  }

  return (
    <section aria-label="Tags" className={`mt-10 pt-8 ${obBorderT}`}>
      <h2 className={`text-sm font-medium uppercase tracking-[0.15em] ${obMuted}`}>
        Tags
      </h2>
      <ul className="mt-3 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <li key={tag}>
            <span className={`rounded-full px-3 py-1.5 text-sm ${obCodeBg} ${obText}`}>
              {tag}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
