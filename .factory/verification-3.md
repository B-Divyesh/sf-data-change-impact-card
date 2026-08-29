# Independent verification 3 — PASS

**Candidate:** `4467e232750d0c3381c4781f70ac0ed3ab53c8eb`
**Live URL:** <https://data-change-impact-card.sociobot.in>
**Verified:** 2026-08-29 UTC from a clean checkout after `npm ci`. No product
code was modified.

## Release decision

**PASS — release candidate accepted.** The deployed static site matches the
candidate build and the Rust CLI performs the researched job end to end: it
turns explicit source/version changes plus declared lineage into a local,
reviewable Markdown or JSON impact card, including stale descendants, evidence
paths, recomputation order, cost, and uncertainty.

There are **no release-blocking, high, medium, or low defects** found in this
verification.

## First-read and demo gate

A cold live visit plainly answers all required first-screen questions:

- **What it does:** “Trace data changes before recomputing.”
- **For whom:** “For data engineers,” with stale assets, evidence paths, and a
  safe declared recomputation order named in the supporting sentence.
- **What to click first:** the visible **Try it with sample data** action,
  immediately explained as opening the bundled command and sample result.

One click reached `/demo/?demo=1`, showed `dcic demo`, the two-stale-asset
result, and the persistent **Demo — sample data, nothing is saved** banner with
**Reset demo** and **Start for real**. The same result held at 1440px and
390px. The CLI entry point `dcic demo` independently created a unique temporary
directory, wrote `lineage.yaml`, `changes.yaml`, and `impact.md`, and reported
two stale assets, seven known minutes, and zero unknown edges.

## Claims contract

`.factory/claims.json` exists and contains nine claims. After clean dependency
installation, every listed command was run verbatim. Each passed; a registry
cross-check found exactly one matching `@claim:<id>` test tag per claim.

| Claim | Result |
| --- | --- |
| `bundled-cli-demo` | PASS — 2 Playwright projects |
| `offline-docs` | PASS — desktop pass, intentional mobile skip |
| `no-third-party-runtime-requests` | PASS — 2 Playwright projects |
| `core-impact-card` | PASS — 2 Playwright projects |
| `input-output-contract` | PASS — 2 Playwright projects |
| `uncertain-lineage` | PASS — 2 Playwright projects |
| `local-read-only-analysis` | PASS — 2 Playwright projects |
| `mit-license` | PASS — 2 Playwright projects |
| `host-platform-package` | PASS — desktop pass, intentional mobile skip |

An initial offline-claim invocation encountered `ERR_CONNECTION_REFUSED` only
because the immediately preceding externally interrupted aggregate command had
left Playwright's reusable preview-port state stale. The clean standalone rerun
started its own preview server and passed; all final claim results above are
from standalone exact commands.

## CLI and package evidence

- `cargo fmt --check`, `cargo clippy --all-targets -- -D warnings`, and
  `cargo test` passed: 6 library tests and 7 CLI integration tests.
- The required 30-node/five-change fixture emitted exactly 20 stale
  `chain.*` assets, no unrelated assets, 20 known minutes, zero unknown edges,
  and `ready` disposition.
- Empty changes returned `no_impact` with complete input; an undeclared changed
  node returned `review_required`, one unknown edge, and an actionable warning.
- Redacted Markdown used stable `NODE-###` aliases and omitted source node
  identifiers, free-text summary, and recompute commands.
- Cycle input, identical versions, and dual stdin returned exit code 2; an
  unwritable output path returned exit code 1 with a useful error. Declared
  recompute commands were rendered only, never executed.
- `npm run build` passed and produced `dist/site/`, an 18,350-byte crate, and a
  1,027,688-byte Linux x64 host binary. A crate extracted into a fresh temporary
  consumer installed with `cargo install --locked`; its installed `dcic` binary
  successfully ran the bundled demo and analysis.

## Site, accessibility, privacy, and deployment evidence

- `npm test` passed: 13 Rust tests, 2 static contract tests, 27 Playwright
  passes, and 3 intentional project skips. `npm audit --audit-level=high`
  reported zero vulnerabilities.
- Live Playwright against the deployment also passed 27 tests with 3 intended
  skips. The required URL verifier passed: HTTPS 200, title, `lang=en`, one
  `h1`, `main`, image alt text, and no page or console errors on the home flow.
- Independent Axe runs found **0 serious/critical violations** on home, demo,
  privacy, terms, and 404 at both 1440px and 390px. All routes had one `h1` and
  `main`; mobile `scrollWidth` equaled 390px. Keyboard checks found the visible
  skip link, a 3px focus outline, and working Arrow-key tab selection.
- With reduced motion, the media query matched, scrolling computed to `auto`,
  and remaining animation durations were 0.001ms. The service worker updated to
  `activated`; after a first visit, a fully offline `/demo/?demo=1` reload kept
  the Demo title, sample heading, and demo banner.
- Full desktop and mobile browser flows made 18 requests each, all to
  `data-change-impact-card.sociobot.in`. Cookies, localStorage, sessionStorage,
  and IndexedDB were empty; the only storage was documented public shell cache
  `dcic-shell-v3`. There were no analytics or third-party runtime requests.
- Live response headers include a self-only CSP with `frame-ancestors 'none'`,
  HSTS, `nosniff`, Referrer-Policy, and Permissions-Policy. The root uses a
  short revalidation cache; hashed JS/CSS uses one-year immutable cache;
  `sw.js` is `no-cache`; `/does-not-exist` returned a real HTTP 404.
- SHA-256 matched the fresh `dist/site/` build and live response for home, demo,
  privacy, terms, 404, service worker, JS, CSS, hero, and social image.
- Measured output is well within budget: initial JS 3,349 bytes (1.51 KB gzip),
  CSS 17,652 bytes (4.37 KB gzip), and hero 29,288 bytes. Live mobile Lighthouse
  scored Performance 100, Accessibility 100, Best Practices 100, and SEO 100;
  FCP/LCP were 0.9s, TBT 30ms, and CLS 0.

## Scope notes

This is a local Rust CLI plus a static documentation/demo site. It has no
server-side product endpoint, sign-in, payment, persistence boundary, or AI
feature; rate-limit, Entra tenant, backend concurrency, and billing checks are
not applicable. The CLI deliberately does not infer arbitrary lineage, connect
to production, or run recompute jobs.

Evidence generated by the required URL verifier is in
`.factory/qa-evidence/verification-3/`.
