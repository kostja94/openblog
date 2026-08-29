import { describe, expect, it } from "vitest";

import { resolveThemeConfig } from "./resolve";

describe("resolveThemeConfig", () => {
  it("infers vercel-geist from vercel.com reference URL", () => {
    const resolved = resolveThemeConfig({
      referenceUrl: "https://www.vercel.com/docs",
    });

    expect(resolved.preset).toBe("vercel-geist");
  });

  it("prefers explicit preset over domain inference", () => {
    const resolved = resolveThemeConfig({
      preset: "minimal",
      referenceUrl: "https://vercel.com",
    });

    expect(resolved.preset).toBe("minimal");
  });
});
