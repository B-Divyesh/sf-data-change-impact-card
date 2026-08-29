# Independent verification 4 — FAIL

- **Candidate:** `8c1adec6731ceed6e527d8278d912ed0af4adf2d`
- **Live URL:** <https://data-change-impact-card.sociobot.in>
- **Verified:** 2026-08-29 UTC from the clean candidate checkout after `npm ci`.
- **Product code modified:** no.

## Release decision

**FAIL — do not release this candidate.** The product and deployment work end
to end, but the required claims registry is incomplete. The claims contract
states that any public claim-like sentence without a registry entry and tagged
sandbox test fails verification.

### Release-blocking / high

1. **Two public clipboard actions are unlisted claims.** The landing page offers
   **Copy command** and **Copy install command**. Neither behavior is listed in
   `.factory/claims.json`, and `rg` finds no clipboard/copy assertion in the test
   suite. Both controls did copy the exact command and announce “Copied to
   clipboard.” in a manual live Playwright check, so this is not a broken-control
   defect. It is still release-blocking under the supplied claims acceptance
   contract. Add one registered claim with exactly one tagged test that clicks
   both controls, verifies clipboard contents, and verifies the announced result
   (including the unavailable-clipboard recovery), or remove the controls.

No other high, medium, or low product defects were found.

## Mandatory first-read and demo gate — PASS

A cold live visit answers all three questions in the first screen:

- **What:** “Trace data changes before recomputing.”
- **For whom:** “For data engineers,” followed by stale assets, evidence paths,
  and safe declared recomputation order.
- **What to do first:** **Try it with sample data**, next to “Opens the bundled
  command and sample result.”

One click opened `/demo/?demo=1`, displayed the finished sample card, and kept
the **Demo — sample data, nothing is saved** banner visible with **Reset demo**
and **Start for real**. This passed at 1440 px and 390×844.

## Registered claims — PASS, but incomplete registry

`.factory/claims.json` exists. After `npm ci`, every listed command was run
verbatim and the aggregate exit status was 0. The initial pre-install invocation
stopped at the expected missing local `vite` executable; the clean installed
rerun below is the release evidence.

| Claim | Result |
| --- | --- |
| `bundled-cli-demo` | PASS — 2 projects |
| `offline-docs` | PASS — desktop pass, intentional mobile skip |
| `no-third-party-runtime-requests` | PASS — 2 projects |
| `core-impact-card` | PASS — 2 projects |
| `input-output-contract` | PASS — 2 projects |
| `uncertain-lineage` | PASS — 2 projects |
| `local-read-only-analysis` | PASS — 2 projects |
| `mit-license` | PASS — 2 projects |
| `host-platform-package` | PASS — desktop pass, intentional mobile skip |
| `source-install` | PASS — desktop pass, intentional mobile skip |
| `format-alias` | PASS — 2 projects |
| `stdin-input` | PASS — 2 projects |
| `exit-codes` | PASS — 2 projects |
| `help-output` | PASS — 2 projects |
| `node-id-validation` | PASS — 2 projects |

The failure is the cross-check after those tests: the two clipboard actions have
no corresponding registry entry or tagged test.

## Clean build and automated gates — PASS

- `npm ci`: PASS; 22 packages audited, zero vulnerabilities.
- `cargo fmt --check`: PASS.
- `cargo clippy --all-targets -- -D warnings`: PASS.
- `npm test`: PASS — 13 Rust tests, 4 static contract tests, 41 Playwright
  passes, and 5 intentional cross-project skips.
- `npm run build`: PASS — release binary, `dist/site/`, 79.6 KiB crate (20.8
  KiB compressed), and 1,027,688-byte Linux x64 binary.
- `npm audit --audit-level=high`: PASS, zero vulnerabilities.
- There is no separate repository typecheck or lint script beyond the Vite
  production build, Rust formatting, and Clippy checks above.

## CLI and package exercise — PASS

The packaged crate was extracted and installed with `cargo install --locked`
into a clean unrelated prefix. The installed `dcic 0.1.0` binary then passed:

- `dcic demo` from an empty consumer directory: created a unique temporary
  sample directory, printed the card path, reported 2 stale assets / 7 minutes /
  0 unknown edges, and left the consumer directory empty.
- Required 30-node/five-change fixture: exactly 20 expected `chain.05` through
  `chain.24` stale nodes, 20 known minutes, zero unknown edges, no unrelated
  nodes, and `ready` disposition.
- Empty changes: `no_impact` with complete lineage.
- Undeclared changed node: `review_required` with one named unknown edge.
- Duplicate IDs, identical versions, and dual stdin: exit 2 with actionable
  errors. Missing input and an invalid output path: exit 1.
- A valid redacted run immediately after the errors succeeded and omitted raw
  node IDs, summaries, and commands.

## Live site, accessibility, privacy, and PWA — PASS

- Live Playwright suite: 41 passed, 5 intentional skips.
- Factory URL verifier: HTTPS 200 in 566 ms; correct title, `lang=en`, one `h1`,
  `main`, image alternatives, button labels, and zero root console/page errors.
- Independent Axe: zero serious/critical findings on home, demo, privacy, terms,
  and the real 404 at desktop and 390 px.
- Keyboard-only: the skip link was first, had a 3 px cyan focus outline, moved
  focus to the `h1`, the primary demo link opened after seven Tabs + Enter, and
  ArrowRight selected the Manifest tab.
- Mobile: no route overflow at 390 px; tested navigation/demo targets were at
  least 44 px tall. A 200% root-text resize retained headings and produced no
  horizontal page overflow on all public routes.
- Reduced motion: media query matched, scroll behavior was `auto`, no active
  animation remained, and durations were reduced to 0.001 ms.
- Service worker: `activated`, update succeeded, cache `dcic-shell-v3` was
  current, and a fully offline demo reload returned 200 with the sample banner.
- Desktop/mobile flows made only same-origin requests. Cookies, localStorage,
  sessionStorage, and IndexedDB were empty; only the documented public shell
  cache existed.
- Security headers include a self-only CSP with header-only
  `frame-ancestors 'none'`, HSTS, `nosniff`, Referrer-Policy, and
  Permissions-Policy. Root HTML revalidates after 30 seconds, hashed JS/CSS are
  immutable for one year, and `sw.js` is `no-cache`.
- All seven unique public links returned 200. `/does-not-exist` returned the
  designed document with HTTP 404. The expected browser resource message for
  that deliberate 404 was the only error in the combined missing-route crawl;
  successful routes had none.

## Performance and deployment identity — PASS

- Fresh output: JS 4.71 KiB raw / 1.97 KiB gzip; CSS 20.38 KiB raw / 4.85 KiB
  gzip; hero 29.29 KiB. All are far below the supplied budgets.
- Live mobile Lighthouse: Performance 100, Accessibility 100, Best Practices
  100, SEO 100; FCP 0.9 s, LCP 0.9 s, TBT 30 ms, CLS 0, total 40 KiB.
- SHA-256 matched the candidate production build for all 14 public files:
  home, demo, privacy, terms, 404, service worker, robots, sitemap, icons,
  hashed JS/CSS, hero, and social image.
- `origin/main` resolved to the tested candidate before this verification
  report commit.

## Scope notes

This is a local Rust CLI with a static documentation/PWA site. It has no product
backend, server endpoint, sign-in, billing, analytics, or AI feature. Backend
concurrency, persistence, request allowance/429, Retry-After, and Entra tenant
checks are not applicable. Deterministic declared-lineage analysis is the brief;
AI inference would conflict with its explicit non-goal of inferring arbitrary
lineage, so no missed AI leverage finding applies.

Evidence is in `.factory/qa-evidence/verification-4/live/`, including cold
desktop/mobile screenshots, `verify.json`, `browser-audit.json`, and the full
Lighthouse JSON.
