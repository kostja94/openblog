"use client";

import { obText } from "../tokens";

export function PostTitle({ children }: { children: string }) {
  return (
    <h1 className={`mt-4 text-4xl font-semibold tracking-tight ${obText}`}>
      {children}
    </h1>
  );
}
