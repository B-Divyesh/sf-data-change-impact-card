# Independent verification 2 — FAIL

**Candidate:** `806414bbe0642e720c9f914cbd23acfdc828921e`

**Live URL:** <https://data-change-impact-card.sociobot.in>

**Verified:** 2026-08-29 UTC from a clean checkout. No product code was
modified. SHA-256 checks matched the fresh build and live deployment for every
HTML route, the service worker, hashed JS/CSS, hero image, and social image.

## Release decision

**FAIL — do not release.** The repaired first-read/demo experience and all three
declared claim commands pass, but two release-blocking acceptance defects remain:

1. An undeclared changed node produces `unknown_edges: 1` and a warning that
   review is required, while the top-level disposition says `no_impact`. This is
   an unsafe answer for the product's core job.
2. `.factory/claims.json` lists only three claims. The landing page and README
   make many additional reliance claims without required `@claim:<id>` tests.
   The supplied claims contract explicitly makes any unlisted claim a failure.

## First-read and demo gate

**PASS.** On a cold 1440×900 and 390×844 visit, the first screen says:

- What it does: “Trace data changes before recomputing.”
- Who it is for: data engineers reviewing stale assets, evidence paths, and a
  recomputation order from declared lineage.
- What to click first: **Try it with sample data**, with the adjacent explanation
  “Opens the bundled command and sample result.”

One click opens `/demo/?demo=1`. The resulting first screen shows `dcic demo`,
the expected two-stale-asset result, and the persistent **Demo — sample data,
nothing is saved**, **Reset demo**, and **Start for real** controls.

Evidence:

- `.factory/qa-evidence/first-read-desktop.png`
- `.factory/qa-evidence/first-read-mobile390.png`
- `.factory/qa-evidence/demo-one-click-desktop.png`
- `.factory/qa-evidence/demo-one-click-mobile390.png`

## Mandatory claim commands

The commands were first invoked before dependency installation, as requested;
each stopped at `vite: not found`. After the required clean-lockfile install
(`npm ci`, 21 packages, 0 vulnerabilities), every command was rerun verbatim and
passed. The pre-install results are environment bootstrap failures, not product
test failures; the post-install executions are the acceptance results.

| Claim | Exact result | Evidence |
| --- | --- | --- |
| `bundled-cli-demo` | PASS — 2/2 Playwright projects | Command output; demo screenshots above |
| `offline-docs` | PASS — 1 desktop pass, 1 intentional mobile project skip | Fresh-context offline reload retained the styled page and displayed its offline notice; `.factory/qa-evidence/offline-first-reload-mobile390.png` |
| `no-third-party-runtime-requests` | PASS — 2/2 Playwright projects | Full live flow made 26 requests, all to `data-change-impact-card.sociobot.in`; no cookies |

## Release-blocking defects

### Blocker — unknown changed node is labeled “no impact”

Command:

```sh
printf 'schema_version: 1\nchanges:\n  - node: missing.source\n    from: v1\n    to: v2\n' \
  | dcic analyze -m tests/fixtures/lineage.yaml -c - --json
```

Observed exit `0` and summary:

```json
{
  "changes": 1,
  "stale_assets": 0,
  "unknown_edges": 1,
  "disposition": "no_impact"
}
```

The same output warns: `1 unknown edge(s) need review before relying on the
recomputation plan.` The branch at `src/lib.rs:336` chooses `NoImpact` whenever
`impacted` is empty before checking partial lineage or unknown edges. An absent
changed source is precisely where the tool cannot establish no impact. The
summary and warning therefore contradict each other, and the primary decision
can lead a user to skip review.

### Blocker — public claims are not registered or claim-tested

`.factory/claims.json` contains only the bundled demo, offline docs, and
same-origin browser-request claims. Representative unlisted claims include:

- Core impact analysis, stale reasons, safe topological order, and incomplete
  lineage reporting (`README.md:3-7`).
- Stable redaction, exact exit codes, YAML/JSON parsing, cycle rejection,
  unknown-edge behavior, and deterministic ordering (`README.md:81-99`).
- No CLI network access, telemetry, production connection, or command execution;
  no site analytics, cookies, or accounts (`README.md:127-130` and privacy page).
- Landing-page claims for YAML/JSON output, cycle rejection, stable aliases,
  estimates, partial-lineage status, and no-impact behavior
  (`site/index.html:138-168`).

Some behaviors have ordinary unit/integration coverage, but the acceptance
contract requires each visitor-facing claim to be listed with exactly one
`@claim:<id>` observable demo test. They are absent from the registry.

## Other defects

### Medium — offline demo URL returns the wrong document

From a fresh context, visit `/` once, wait for the service worker, go offline,
and activate **Try it with sample data**. The URL becomes `/demo/?demo=1`, but
the service worker returns cached `/index.html`: the title and h1 remain the
home page and the demo banner is absent. `SHELL` caches `/demo/`, while
`caches.match()` uses the query string and the navigation fallback always uses
`/index.html` (`site/public/sw.js:2,19-29`).

Evidence: `.factory/qa-evidence/offline-demo-route-wrong-page.png`.

### Medium — required 44×44px targets are undersized

Measured rendered hit boxes on desktop and 390px mobile:

- Header/footer **Demo** links: 34×44px.
- Footer **Terms** link: 42×44px.
- Demo banner **Reset demo** and **Start for real** links: 84×36px and 118×36px.

The stylesheet sets only `min-height: 44px` on navigation links and explicitly
sets demo-banner links to 36px (`site/style.css:164-172,964-969`). This misses
the attached accessibility/design 44×44px requirement.

### Medium — the wordmark visibly breaks at both tested widths

The “C” in the boxed `D↘C` mark wraps below the 44px border. On the demo page it
overlaps the amber banner. This is visible in all four first-read/demo
screenshots and weakens the product-specific identity.

### Medium — unsupported cross-platform binary claim

The landing page says release binaries are prepared for Linux, macOS, and
Windows (`site/index.html:176`). The exact production build emits only
`dist/package/dcic-0.1.0-linux-x64`; `scripts/package.mjs:6-9` copies only the
current host binary. No repository release workflow or other platform artifacts
support the statement. The claim is also absent from `claims.json`.

### Low — the required copy audit is incomplete

`.factory/copy-audit.md` contains seven rows covering the cold hero and demo
intro, not every landing-page sentence as required. The live `<main>` has 103
nonblank text lines. It also leaves the metaphor-like “No inference theater”
copy unaudited.

### Low — source crate unintentionally includes `node_modules` documentation

`cargo package --list --allow-dirty` includes 36 third-party `node_modules`
LICENSE/README files because the unanchored `LICENSE` and `README.md` include
patterns match nested files. The crate still installs, but carries unrelated
site-development material.

## Passing evidence

| Check | Result |
| --- | --- |
| Clean install/security audit | `npm ci` PASS; `npm audit --audit-level=high` reports 0 vulnerabilities |
| Rust format/lint | `cargo fmt --check` PASS; `cargo clippy --all-targets -- -D warnings` PASS |
| Rust tests | 11 passed: 5 unit + 6 integration |
| Product test command | `npm test` PASS: Rust suite, 2 static contracts, 12 Playwright passes, 2 intentional project skips |
| Exact production build | `npm run build` PASS; emitted `dist/site/`, a 70.3KiB crate, and a 1,027,720-byte Linux x64 binary |
| 30-node/five-change acceptance | 20 `chain.*` stale assets, 0 unrelated assets, 20 known minutes, 0 unknown edges |
| Normal/demo output | `dcic demo` wrote its three files and reported 2 stale assets, 7 minutes, 0 unknown edges |
| Redaction | Markdown and JSON contained stable aliases and no node IDs, summary text, or recompute commands |
| Invalid/recovery paths | Cycles, duplicates, empty IDs, same versions, unsupported schema, malformed YAML, dual stdin, no command, missing file, and bad output path returned documented codes/messages |
| Read-only behavior | A manifest command that would create a marker was rendered but not executed |
| Boundary behavior | Empty changes returned no impact; partial/missing lineage returned review required; `u32` estimate sum saturated safely; negative estimate was rejected |
| Clean consumer | Extracted crate installed with `cargo install --path … --root … --locked`; installed CLI passed demo and 30-node fixture |
| Live suite | `PLAYWRIGHT_BASE_URL=https://data-change-impact-card.sociobot.in npx playwright test`: 12 passed, 2 intentional skips |
| Required URL verifier | PASS, 717ms: title, `lang=en`, one h1/main, alt text, labels, no home-page console/page errors |
| Axe | 0 violations (not only serious/critical) on home, demo, privacy, terms, and 404 at 1440px and 390px |
| Keyboard/focus | Skip link bypasses header; tablist arrows, copy action, demo/reset/start links work; focus is a visible 3px cyan outline |
| Responsive/reduced motion | No horizontal overflow at 1440, 640, or 390px; reduced motion computes to 0.001ms and smooth scrolling is disabled |
| Privacy | Full live flow used one origin, no cookies, empty local/session storage and IndexedDB; only documented `dcic-shell-v2` Cache Storage |
| Headers/404/cache | CSP, HSTS, nosniff, Referrer-Policy, Permissions-Policy present; real 404; hashed assets one-year immutable; `sw.js` no-cache |
| Links/metadata | Internal/external links and fragments resolve; route titles/lang/headings/landmarks pass; social image is 1200×630 |
| Performance | Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP/LCP 1.1s, TBT 0ms, CLS 0 |
| Bundles | JS 3,349 bytes (1.51KiB gzip), CSS 17,461 bytes (4.34KiB gzip), hero 29,288 bytes; no web fonts |
| Deployment identity | SHA-256 matched for 10 representative built/live documents and assets; `HEAD == origin/main == 806414b` before this report |

## Scope notes

This is a static documentation site and local CLI. It has no server-side
product or unlock endpoint, sign-in, payment flow, production persistence, or
AI feature. API rate-limit, Entra tenant, backend concurrency, and billing tests
are therefore not applicable. The AI missed-leverage check found no justified
AI step for deterministic lineage traversal.

## Required next steps

1. Return `review_required` whenever a changed node is undeclared, and add a
   regression test at both library and CLI levels.
2. Inventory every reliance claim in landing/legal/README copy, either remove
   it or add exactly one demo-sandbox `@claim:<id>` test and registry entry.
3. Make `/demo/?demo=1` resolve to the cached demo document offline.
4. Repair the wordmark wrap and all sub-44px hit targets.
5. Remove or prove the three-platform binary statement; complete the copy audit
   and tighten crate include globs.
