# Handoff — Data Change Impact Card v0.1.0

## What shipped

- A typed Rust CLI, `dcic`, with one intentionally small public command:
  `dcic analyze --manifest <YAML|JSON> --changes <YAML|JSON>`.
- Deterministic Markdown and schema-versioned JSON cards that report explicit
  changes, downstream stale assets with evidence paths, topological recompute
  order, known and unknown cost, missing recipes, unknown edges, and the input
  completeness declaration.
- Validation for schema versions, duplicate/empty identifiers, unchanged
  versions, cycles, unreadable files, and conflicting stdin inputs. Exit codes
  are `0` success, `1` I/O/serialization, and `2` invalid input.
- `--redact` replaces every exported node identifier with a stable alias and
  removes free-text summaries and recompute commands.
- A 30-node/five-change acceptance fixture. It returns all 20 expected
  downstream nodes and none of the five unrelated nodes.
- A responsive, keyboard-operable static documentation site with a recorded
  impact analysis, full manifest contract, honest empty/error cases, install
  instructions, privacy and terms pages, an offline service-worker shell, and
  immutable-cache configuration for hashed assets.
- An original blueprint drafting-table hero generated for this product. The
  exact prompt and provenance are in `.factory/design.md` and
  `.factory/lineage-drafting-hero.provenance.json`; the delivered 1200×800 WebP
  is 29KB.

## Build and deploy

From a clean clone with Rust 1.85+ and Node 22:

```sh
npm install
npm test
npm run build
```

`npm run build` compiles the release CLI, builds the site into `dist/site/`,
runs `cargo package`, and writes the current-host binary plus `.crate` archive
to `dist/package/`. Deploy `dist/site/` as the static root. Do not publish from
the worker; the factory owns release credentials.

## Verification on 2026-08-28

- `npm test`: passed — 5 Rust unit tests, 4 CLI/integration tests, and 8 browser
  checks across desktop Chromium and a 390×844 Chromium profile (2 irrelevant
  project combinations intentionally skipped).
- `npm run build`: passed; `dist/site/index.html` exists at the required root.
- Acceptance fixture: 30 declared nodes, 5 changes, 20/20 expected stale nodes,
  0 unrelated nodes.
- Playwright + Axe: no serious/critical violations, no browser console errors,
  correct keyboard tab behavior/result focus, no 390px horizontal overflow,
  and offline reload succeeds.
- `/opt/fleet/lib/verify-url.sh`: HTTP 200, 521ms local load, title and `lang`
  present, one `h1`, `main` present, 0 missing image alts, 0 unlabeled buttons,
  and 0 console/page errors.
- Lighthouse 12.8.2 mobile: Performance 100, Accessibility 100, Best Practices
  100, SEO 100; LCP 0.9s, FCP 0.9s, TBT 0ms, CLS 0.
- Initial payload assets: JS 3.35KB, CSS 15.56KB, hero WebP 29.29KB — all well
  below the 200KB / 50KB / 300KB budgets. No web fonts or runtime CDN assets.
- Release binary: 1,007,488 bytes. Crate archive: 70,430 bytes.
- `npm audit --audit-level=high`: 0 vulnerabilities.
- `git diff --check`, `cargo fmt --check`, and the documented CLI example pass.

## Known gaps and next steps

- Lineage inference, warehouse/orchestrator connections, and job execution are
  intentionally out of scope. Adapters can later produce this open manifest;
  they should not weaken completeness declarations.
- The website demo is a recorded deterministic fixture, not a WASM execution
  environment. The real CLI and its end-to-end fixture are tested separately.
- `npm run pack:cli` packages the current host binary only. The factory should
  build macOS, Windows, and additional Linux targets in release CI and attach
  checksums before publishing a GitHub release.
