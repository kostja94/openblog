"use client";

import Link from "next/link";

import { obHoverText, obMuted, obText } from "../tokens";

export function Toc({
  items,
}: {
  items: { id: string; title: string; level: number }[];
}) {
  if (!items.length) {
    return null;
  }

  return (
    <nav aria-label="Table of contents" className="ob-toc p-4">
      <p className={`text-sm font-medium ${obText}`}>On this page</p>
      <ol className={`mt-3 space-y-2 text-sm ${obMuted}`}>
        {items.map((item) => (
          <li
            key={item.id}
            className={item.level === 3 ? "ml-4" : undefined}
          >
            <Link href={`#${item.id}`} className={obHoverText}>
              {item.title}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
