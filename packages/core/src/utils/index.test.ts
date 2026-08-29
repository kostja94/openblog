import { describe, expect, it } from "vitest";

import { extractToc, slugifyHeading } from "./index";

describe("slugifyHeading", () => {
  it("lowercases and hyphenates non-alphanumeric characters", () => {
    expect(slugifyHeading("Hello, World!")).toBe("hello-world");
  });
});

describe("extractToc", () => {
  it("extracts h2 and h3 headings with slug ids", () => {
    const content = `# Title

## Getting Started

Some intro.

### Install

Steps here.`;

    expect(extractToc(content)).toEqual([
      { id: "getting-started", title: "Getting Started", level: 2 },
      { id: "install", title: "Install", level: 3 },
    ]);
  });
});
