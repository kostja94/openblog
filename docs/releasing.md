# Public release checklist

Use when making the OpenBlog GitHub repo public.

## Recommended: sync npm publish

**Yes — publish `create-openblog` the same day as the public GitHub launch.**

Reason: README lists `npx create-openblog` for the “try it first” path. If npm is empty, first-time visitors hit a broken command.

### Pre-publish

```bash
npm run test
npm run test:scaffold
npm run build
npm run bundle-scaffold --workspace=create-openblog
```

### Publish `create-openblog`

```bash
cd packages/create-openblog
npm publish --access public
```

Verify:

```bash
npx create-openblog@latest my-test-blog --no-install
```

### GitHub

1. Push repo (ensure root `.gitignore` excludes `node_modules/`, `.next/`, `audit-test-blog/`)
2. Tag release (e.g. `v0.3.0`)
3. GitHub Release notes: highlight **INTEGRATION.md** as primary path + `npx create-openblog` for greenfield

## Primary vs secondary messaging

| Audience | Entry |
|----------|--------|
| Product teams (default) | [INTEGRATION.md](../INTEGRATION.md) |
| Try-first / greenfield | `npx create-openblog` |

Agents should ask which path applies — see [AGENTS.md](../AGENTS.md#agent-route-the-user-first).
