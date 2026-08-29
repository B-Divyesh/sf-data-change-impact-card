# Independent verification 6 — PASS

- **Candidate:** `6c9c9ceef03bd6cd45fffa015c2273097beea733`
- **Live URL:** <https://data-change-impact-card.sociobot.in>
- **Verified:** 2026-08-29 UTC from the candidate checkout after `npm ci`
- **Product code modified:** no; this run changes only verification and handoff
  documentation.

## Release decision

**PASS — accept this candidate.** The CLI completes the researched job: given
declared lineage and explicit version changes, it produces a local Markdown or
JSON decision card containing the stale descendants, evidence paths, declared
recomputation order, known cost, missing estimates, unknown edges, and input
completeness. The live deployment is byte-identical to the candidate build for
all 14 public artifacts checked.

No blocker, high, medium, or low product defect was found.

## Mandatory first-read and one-click demo gate

**PASS.** A cold live visit showed:

- What: **“Trace data changes before recomputing.”**
- For whom and outcome: **“For data engineers, it lists stale assets, evidence
  paths, and a safe recomputation order from your declared lineage.”**
- What to click first: **“Try it with sample data”**, next to **“Opens the
  bundled command and sample result.”**

The action was visible without scrolling at y=551 on 1440×900 and y=410 on
390×844. One click opened `/demo/?demo=1`. The first phone viewport contained
the persistent **Demo — sample data, nothing is saved** banner, Reset demo,
Start for real, `raw.orders v41 → v42`, two stale assets, seven minutes, zero
unknown edges, and the finished card through y=702. Reset preserved the demo
query and Start for real returned home.

## Claims gate

`.factory/claims.json` exists and contains 16 claims. After the required
lockfile install, every listed command was run verbatim and exited 0:

| Claim | Result |
| --- | --- |
| `bundled-cli-demo` | PASS — 2 browser projects passed |
| `offline-docs` | PASS — desktop passed; mobile intentionally skipped |
| `no-third-party-runtime-requests` | PASS — 2 passed |
| `core-impact-card` | PASS — 2 passed |
| `input-output-contract` | PASS — 2 passed |
| `uncertain-lineage` | PASS — 2 passed |
| `local-read-only-analysis` | PASS — 2 passed |
| `mit-license` | PASS — 2 passed |
| `host-platform-package` | PASS — desktop passed; mobile intentionally skipped |
| `source-install` | PASS — desktop passed; mobile intentionally skipped |
| `format-alias` | PASS — 2 passed |
| `stdin-input` | PASS — 2 passed |
| `exit-codes` | PASS — 2 passed |
| `help-output` | PASS — 2 passed |
| `node-id-validation` | PASS — 2 passed |
| `clipboard-commands` | PASS — 2 passed |

The very first pre-install probe could not start Vite because a clean clone has
no `node_modules`; no test body ran. `npm ci` then installed the locked tools,
and the table above records the authoritative clean-checkout executions. The
contract test also confirmed each registered claim has exactly one matching
`@claim:<id>` test. Public landing, legal, and README statements were
cross-checked; no unlisted visitor-relevant claim was found.

## Clean-checkout gates and production build

- `npm ci`: PASS — 21 packages; zero audit vulnerabilities.
- `npm test`: PASS — 6 Rust library tests, 7 Rust CLI integration tests, 4
  static contract tests, and 43 Playwright passes; 5 project-specific skips.
- `npm run build`: PASS — release binary, `dist/site/`, packaged crate, and
  host binary produced.
- `cargo fmt --check`: PASS.
- `cargo clippy --all-targets --all-features -- -D warnings`: PASS.
- `npm audit --audit-level=high`: PASS — zero vulnerabilities.
- No separate TypeScript typecheck or lint script exists.

The exact Vite production output is 4.71 KB JavaScript (1.985 KB gzip), 20.383
KB CSS (4.853 KB gzip), and a 29.288 KB local hero WebP. These are well below
the 200 KB JS, 50 KB CSS, and 300 KB hero budgets. `dist/` exists.

## Independent CLI and package exercise

`dist/package/data-change-impact-card-0.1.0.crate` was extracted into a fresh
consumer directory with an isolated Cargo home and installed with
`cargo install --path ... --locked`. The installed executable reported
`dcic 0.1.0`, exposed useful root/analyze help, and completed these checks:

- `dcic demo` wrote its three bundled files under a unique `/tmp/dcic-demo-*`
  directory, printed the impact-card path and 2/7/0 result, and left the empty
  consumer working directory unchanged.
- The normal YAML fixture returned only `clean.orders` then `mart.revenue`, two
  stale assets, seven known minutes, zero unknown edges, and `ready`.
- The 30-node/five-change acceptance fixture returned exactly 20 `chain.*`
  descendants, no unrelated node, 20 minutes, and `ready`.
- Empty changes returned zero stale assets and `no_impact` while retaining
  complete-lineage context.
- Partial lineage with one missing dependency and no estimate returned one
  stale asset, one missing estimate, one unknown edge, a review-required step,
  and `review_required`.
- Redacted Markdown contained stable aliases and no raw node name, change
  summary, or recompute command.
- Duplicate identifiers, dual stdin, unsupported schema version, and identical
  from/to versions returned code 2 with specific recovery text. A missing file
  returned code 1. Valid input returned code 0.

No command executed a declared recomputation recipe or contacted a data system.

## Live identity, routes, and links

SHA-256 matched between the fresh candidate build and live response for home,
demo, privacy, terms, 404, hashed JS, hashed CSS, service worker, robots,
sitemap, favicon, touch icon, hero image, and social image (14/14). Representative
hashes are home `c3b85a7d…`, demo `3ae325c7…`, JS `3cbfcf84…`, CSS
`9bbf165b…`, and service worker `d682368c…`.

Home, demo, privacy, and terms returned 200 with route-specific titles. An
unknown route returned the designed page with HTTP 404. All 14 discovered
internal/external link targets returned success, including the repository link.

## Accessibility and interaction

- Independent Axe scans on home, demo, privacy, terms, and 404 found zero
  serious or critical violations.
- Every route had `lang=en`, one `h1`, and one `main`; images had alternatives.
- The first Tab reached the skip link. Sequential keyboard traversal reached
  the page controls, each with a visible 3px cyan focus outline. ArrowRight
  moved the sample tab from Command to Manifest and updated the panel.
- The repository's live matrix also passed route-change/back-button focus,
  clipboard success and recovery, legal pages, and 44px target checks.
- At 390×844, home and demo were exactly 390 CSS px wide with no page overflow.
  A 200% zoom smoke test preserved the heading, action, and page width.
- With reduced motion, the media query matched, scroll behavior was `auto`,
  there were zero active animations, and the sample transition was effectively
  zero.
- `/opt/fleet/lib/verify-url.sh` passed: HTTP 200, no console errors, title,
  language, one `h1`, `main`, image alternatives, and button names all present.
  Ordinary routes had no page or console errors. The deliberate 404 navigation
  emitted only the browser's expected failed-resource message for the 404.

## Privacy, offline behavior, and headers

A fresh Playwright request log spanning home, demo, privacy, terms, the 404,
keyboard checks, and offline setup recorded 52 requests, all to
`https://data-change-impact-card.sociobot.in`; none went to a third party.
Cookies, localStorage, sessionStorage, and IndexedDB remained empty. The only
browser storage was the documented public shell cache `dcic-shell-v3`.

The live service worker was activated and controlling the page. An explicit
`registration.update()` left no waiting or installing worker. With the browser
then offline, `/demo/?demo=1` reloaded with HTTP 200, the Demo title, sample
heading, and demo banner.

HTML uses `public, must-revalidate, max-age=30`; hashed JS/CSS use one-year
immutable caching; `sw.js` uses `no-cache`. Live responses include HSTS,
`nosniff`, Referrer-Policy, Permissions-Policy, and a self-only CSP with
header-delivered `frame-ancestors 'none'`.

## Lighthouse and scope checks

Fresh throttled mobile Lighthouse 12.8.2, rerun without its optional full-page
screenshot after the browser screenshot artifact crashed, completed with no
runtime error: Performance 99, Accessibility 100, Best Practices 100, SEO 100;
FCP 1.0 s, LCP 1.0 s, CLS 0, TBT 90 ms.

This product has no server-side API, unlock/payment call, sign-in, production
persistence, or runtime AI. Rate-limit/429, concurrency, backend persistence,
Sociobot Entra authority, billing, and AI gateway tests are therefore not
applicable. The deterministic local analyzer does not have a justified missed
AI, sync, or adapter requirement in the stated smallest-useful-product scope.

## Findings by severity

- **Blocker:** none.
- **High:** none.
- **Medium:** none.
- **Low:** none.
