# Contributing to OpenBlog

OpenBlog is open source (MIT). **Anyone may use, fork, and integrate it** into their own product sites under the license.

**Upstream contributions to this repository are enterprise-only.** We do **not** accept pull requests or design submissions from individual contributors.

---

## Why this policy

OpenBlog’s upstream repo is **curated by design**. What merges here — especially **theme presets**, **platform adapters**, and **catalog / README attribution** — becomes something users read as *official*. That kind of visibility is legitimate value for contributors; in open source it also means many PRs (from individuals and vendors alike) arrive with **product promotion or backlink goals** alongside — or instead of — a commitment to maintain the change.

We are not against partners getting credit. We prefer a **clear, reviewable path** so maintainers can:

- Confirm trademark, license, and brand permission before a preset ships
- Expect **ongoing maintenance** for integrations, not one-off listings
- Keep preset and adapter quality aligned with production sites
- Leave **feedback and bug reports** open to everyone via Issues / Discussions, while reserving **official ecosystem listings** for approved enterprise contributions

**Using OpenBlog does not require upstream contribution.** Forking, integrating on your own site, and private customization under MIT are always fine — this policy applies only to **merging into this repository**.

---

## Who we accept

Contributions must come from an **organization** (company, design studio, platform vendor) with a named contact and legal entity. Individual hobbyists, freelancers acting alone, and anonymous PRs are **out of scope**.

We welcome **two categories** of enterprise contribution:

### 1. Design token partners

Distinct, production-grade product sites willing to contribute **design tokens** and theme references into OpenBlog’s preset system.

**Examples of what you contribute:**

- CSS / design-token exports (`--color-*`, typography, radius, spacing)
- Documented brand axis (light/dark, editorial vs developer prose, etc.)
- Permission to ship an **exemplar preset** (e.g. `your-brand-preset`) in `packages/themes/presets/`
- Optional: public case study link (site URL or anonymized pattern description)

**Bar:** The site must be a **real, shipped product** with a cohesive visual system — not a mockup or student project.

### 2. Component & platform partners

Vendors whose users benefit from OpenBlog + their stack, contributing **component patterns or official adapters** — enterprise-grade only.

**Examples (illustrative, not exhaustive):**

- CSS / styling platforms (e.g. Tailwind-style token or plugin integration)
- Git-based or headless CMS vendors (official content adapter or chrome patterns)
- Vibe-coding / AI app builders (scaffold or deploy integration)
- Design & UI platforms (Figma, 21st.dev, shadcn-style libraries — licensed component kits mapped to Blog Chrome)

**Bar:** Maintained product, documented API, and a commitment to keep the integration updated across OpenBlog minor releases.

---

## What we do not accept

- PRs from **individual** developers (non-enterprise)
- Drive-by typo fixes, dependency bumps, or feature requests via PR (use **Issues** or **Discussions** for feedback)
- Marketing-page or whole-site templates (OpenBlog is **blog module only**)
- Scraped or unauthorized third-party brand assets
- Presets copied from sites without explicit permission from the brand owner

---

## How to propose an enterprise contribution

1. **Open a Discussion** or email the maintainer with:
   - Company name and website
   - Category (design tokens **or** component/platform)
   - What you propose to contribute (preset slug, adapter name, or integration scope)
   - License / trademark clearance for assets you ship
2. Wait for **written approval** before opening a PR.
3. PRs must:
   - Come from a **company GitHub org** or a maintainer-invited collaborator
   - Include attribution in `packages/themes/catalog.json` or adapter docs
   - Pass `npm run test`, `npm run validate:posts`, and `npm run build`

We may offer a **Partner** or **Preset credit** line in README / preset metadata for approved contributions.

---

## Using OpenBlog without contributing

You do **not** need to contribute upstream to use OpenBlog:

- Integrate on your product site → [INTEGRATION.md](./INTEGRATION.md)
- Scaffold a project → `create-openblog`
- Fork and customize privately under MIT

Forking for internal use is always allowed. **Merging back** to this repo follows the enterprise policy above.

---

## Maintainers

Day-to-day development of OpenBlog is maintained by the project owner and invited maintainers only. Local development:

```bash
npm install
npm run dev
```

Public release checklist: [docs/releasing.md](./docs/releasing.md).
