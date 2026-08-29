# Independent verification — FAIL

**Candidate:** `cd5f800f3eecf47711cdc7e8150386ac54cf72ce` (`docs: finalize release handoff`)

**Live URL:** <https://data-change-impact-card.sociobot.in>

**Verified:** 2026-08-29 UTC, from a clean working tree. The live landing page,
JavaScript, stylesheet, and hero asset were byte-identical to a fresh production
build of this candidate (SHA-256 comparisons), so the findings apply to both the
candidate and deployment.

## Release decision

**FAIL — do not release.** The mandatory claims contract and the mandatory
one-click CLI demo sandbox are absent. The first cold screen also fails the
plain-words/demo acceptance gate.

## First-read result

A cold visit says that `dcic` is a local CLI that turns a lineage manifest and
version changes into an impact card. It does not plainly name its intended user
(data engineers) in the first screen. Its calls to action are **Install dcic**
and **See a recorded run**; there is no **Try it with sample data** action.
The recorded visual is not an executable, isolated CLI demo. Therefore a new
visitor cannot one-click a shipped sample to see where the output went.

## Required claims check — blocking

`.factory/claims.json` does not exist. Consequently there were no declared
claim tests to run from the demo entry point. This is an automatic release
blocker under the supplied claims contract. It also leaves public claims such as
"0 production connections", "0 jobs executed", "100% declared evidence",
"No telemetry", and the README privacy/offline claims without a matching,
observable demo test.

## Test evidence

| Check | Result | Evidence |
| --- | --- | --- |
| Clean install | PASS | `npm ci`: 21 packages, 0 vulnerabilities |
| Rust unit/integration | PASS | `cargo test`: 9 tests passed (including 30-node/five-change fixture) |
| Product test command | PASS | `npm test`: Rust tests plus 8 Playwright passes; 2 project-specific skips |
| Exact production build | PASS | `npm run build`: release binary, `dist/site/`, crate, and host binary produced |
| Formatting | PASS | `cargo fmt --check` |
| Available lint | FAIL | `cargo clippy --all-targets -- -D warnings`: `src/lib.rs:377` `clippy::needless_lifetimes` |
| Dependency audit | PASS | `npm audit --audit-level=high`: 0 vulnerabilities |
| Clean consumer install | PASS | Extracted `data-change-impact-card-0.1.0.crate`; `cargo install --path ... --root ... --locked` installed and ran `dcic` |
| Core CLI acceptance | PASS | Installed consumer binary emitted JSON with 20 stale `chain.*` assets, 0 unrelated assets, 20 known minutes |
| CLI recovery paths | PASS | Unknown changed node is reported as an unknown edge; same-version input and cycle exit 2 with useful errors; both stdin inputs exit 2 |
| CLI demo entry point | FAIL | `dcic demo` and `dcic --demo` both exit 2; no `examples/` directory or `.factory/demo.md` ships |
| Desktop + 390px | PASS | No horizontal overflow at 1440px or 390px; first Tab reaches skip link with `rgb(95,225,230) solid 3px` focus outline |
| Keyboard/reduced motion | PASS | Arrow tab selection works; recorded run moves focus to result; reduced-motion transition is `1e-06s` and run completes |
| Axe | PASS | Live desktop and 390px: 0 violations, including 0 serious/critical |
| Console/page errors | PASS | None on live cold load, interaction, offline reload, or verifier run |
| Privacy request log | PASS | Live cold page requested only same-origin document, hero, JS, CSS, and service worker; no analytics or third-party runtime request |
| Offline reload | PASS | Live service worker controlled the page; after setting offline, reload retained `main` and showed the offline notice |
| Header/cache check | PARTIAL | HSTS, nosniff, Referrer-Policy, Permissions-Policy present; hashed JS is `max-age=31536000, immutable`; `sw.js` is `no-cache`; CSP absent |
| Bundle budgets | PASS | JS 3.35 KB (1.51 KB gzip), CSS 15.56 KB (4.04 KB gzip), hero 29.29 KB; no web fonts |
| Deployment identity | PASS | Built/live SHA-256 matched for `index.html`, JS, CSS, and WebP |

`/opt/fleet/lib/verify-url.sh` succeeded against the live URL: HTTP 200, 767 ms
load, title/lang/one `h1`/`main`, image alt, and no console errors. Evidence was
written to `/tmp/tmp.pnokI0S1hi` during this disposable verification run.

## Defects

### Blocker

1. **No claims file or claim tests.** `.factory/claims.json` is missing, so the
   required claim suite could not be executed through a demo entry point. Every
   reliance claim is unlisted and unproved in the required sandbox.
2. **No actual one-click demo sandbox for the CLI.** The product has no
   `dcic demo`/`--demo`, bundled `examples/`, `.factory/demo.md`, landing-page
   **Try it with sample data** action, or persistent demo/reset/start-real
   treatment. The recorded browser animation is not a usable CLI demo.
3. **Cold first screen fails the acceptance gate.** It does not state who the
   product is for in plain words and offers installation/recording, rather than
   the required sample-data first action.

### High

1. **No Content-Security-Policy response header.** The live response headers
   and `site/public/staticwebapp.config.json` have no CSP, contrary to the site
   security-header contract. Add a restrictive CSP that permits only the
   actual self-hosted assets/workers.
2. **No real 404.** `https://data-change-impact-card.sociobot.in/does-not-exist`
   returns HTTP 200 and the home document, rather than a designed 404 response.
3. **Required route metadata is incomplete.** The landing page lacks canonical,
   Open Graph/Twitter card metadata, and apple-touch icon; no 1200×630 social
   image or real 404 page is shipped.
4. **Available lint check fails.** Clippy with warnings denied rejects the
   needless explicit lifetime in `topological_order`.

### Medium

1. **Documentation site structure is incomplete.** The home header does not
   expose the required Demo/Privacy navigation and footers omit the required
   Param Factory/build identity. Legal pages are not the same navigation
   skeleton as the home page.
2. **No `.factory/copy-audit.md`.** The mandatory plain-words copy audit and
   terminology record is missing. The hero headline is also not the required
   concise job-in-the-user's-words headline.

## Scope notes

This static CLI/documentation product has no server-side product endpoint,
sign-in, billing/unlock call, or API request allowance to test. No rate-limit
observation is applicable. The product is not an AI feature and no AI gateway
was involved.

## Re-run

```sh
npm ci
cargo test
npm test
npm run build
cargo fmt --check
cargo clippy --all-targets -- -D warnings
```

After repairs, run every explicit command in `.factory/claims.json` from the
documented CLI demo entry point, then repeat the live privacy/header/accessibility
checks above.
