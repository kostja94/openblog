# create-openblog

Scaffold a new [OpenBlog](https://github.com/kostja94/openblog) site from the official Next.js template.

## Usage

```bash
# From npm (when published)
npx create-openblog my-blog

# From the OpenBlog monorepo
npm run create-openblog -- my-blog
```

## Options

| Flag | Description |
|------|-------------|
| `--dir <name>` | Project folder (default: first arg or `my-openblog`) |
| `--preset <preset>` | Theme preset (default: `vercel-geist`) |
| `--no-install` | Skip `npm install` |

## What it creates

- Next.js app from `templates/next/`
- Local `@openblog/*` packages under `packages/` (core, content, components, themes)
- Generated `openblog.config.ts` with site name, theme preset, and `features` block
- Sample post at `content/blog/hello-world.md`
- Optional `FEATURES.md` reference

## Template resolution

`create-openblog` resolves scaffold assets in this order:

1. **Monorepo checkout (development)** — reads from the OpenBlog repo root (`../../templates/next`, `../../packages/` relative to this package).
2. **Published npm package** — reads from the bundled `scaffold/` directory inside the package (populated by `prepublishOnly` before publish).

The generated project always uses the same relative paths (`templates/next`, `packages/`) regardless of which source was used.

## Publishing

Before `npm publish`, `prepublishOnly` runs `scripts/bundle-scaffold.ts`, which copies:

- `templates/next` (excluding `node_modules`, `.next`)
- `packages/*` except `create-openblog`
- `FEATURES.md` when present

The generated `scaffold/` directory is gitignored locally; it is included in the published tarball via the `files` field in `package.json`.

To refresh the bundle manually:

```bash
npm run bundle-scaffold --workspace=create-openblog
```

## Next steps after scaffolding

```bash
cd my-blog
npm install   # skipped if you omitted --no-install
npm run dev
```

Open `http://localhost:3000/blog`.
