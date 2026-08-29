"use client";

import { obMuted } from "../tokens";

export function PostDek({ children }: { children: string }) {
  return (
    <p className={`mt-4 text-lg leading-8 ${obMuted}`}>{children}</p>
  );
}
