"use client";

import { obBg, obBorder, obMuted, obText } from "../tokens";

export function TldrBlock({ summary }: { summary: string }) {
  return (
    <aside className={`mt-8 rounded-xl border p-5 ${obBorder} ${obBg}`}>
      <p className={`text-sm font-semibold uppercase tracking-[0.12em] ${obMuted}`}>
        TL;DR
      </p>
      <p className={`mt-2 text-[1.05rem] leading-7 ${obText}`}>{summary}</p>
    </aside>
  );
}

/** @deprecated Use TldrBlock */
export function AiSummary({ summary }: { summary?: string }) {
  if (!summary) {
    return null;
  }

  return <TldrBlock summary={summary} />;
}
