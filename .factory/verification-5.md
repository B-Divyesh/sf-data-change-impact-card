# Independent verification 5 — PASS

- **Candidate:** `92d2e4eca5b6a8885761aca8a501d8606a023a8f`
- **Live URL:** <https://data-change-impact-card.sociobot.in>
- **Verified:** 2026-08-29 UTC from the clean candidate checkout after `npm ci`.
- **Product code modified:** no. This verification writes only this report and the handoff.

## Release decision

**PASS — release candidate accepted.** The CLI fulfills the researched job: it turns explicit changes and declared lineage into a local, reviewable impact card with stale descendants, evidence paths, recomputation order, cost, and uncertainty. The live deployment is byte-identical to the fresh candidate build for all 14 public files checked.

No blocker, high, medium, low, or informational product defects were found.

## Required first-read and demo gate

**PASS.** A cold live desktop visit showed “Trace data changes before recomputing.” The next sentence says it is for data engineers and names stale assets, evidence paths, and safe recomputation order. The first screen contains the one-click **Try it with sample data** link with “Opens the bundled command and sample result.”

The link opens `/demo/?demo=1`, which displays the real `dcic demo` sample result (`raw.orders v41 → v42`, two stale assets, seven minutes, zero unknown edges) and the persistent **Demo — sample data, nothing is saved** banner, **Reset demo**, and **Start for real**. The same was checked at 390×844.

## Claims contract — all required commands passed

`.factory/claims.json` exists and has 16 claims. Each declared command was run verbatim from the clean checkout after `npm ci`; all passed against the shipped demo/fixture entry points.

| Claim IDs | Result |
| --- | --- |
| `bundled-cli-demo`, `offline-docs`, `no-third-party-runtime-requests` | PASS |
| `core-impact-card`, `input-output-contract`, `uncertain-lineage` | PASS |
| `local-read-only-analysis`, `mit-license`, `host-platform-package` | PASS |
| `source-install`, `format-alias`, `stdin-input` | PASS |
| `exit-codes`, `help-output`, `node-id-validation`, `clipboard-commands` | PASS |

The static contract test also passed its check that every registered claim has exactly one `@claim:<id>` test.

## Local build, CLI, and consumer evidence

- `npm ci`: PASS — 21 packages installed; audit reported zero vulnerabilities.
- `npm test`: PASS — 6 Rust library tests, 7 Rust CLI integration tests, 4 static contract tests, and the 48-test Playwright matrix (43 pass, 5 intentional project-specific skips).
- `npm run build`: PASS — release Rust binary, `dist/site/`, packaged crate, and Linux x64 host binary created.
- `cargo fmt --check` and `cargo clippy --all-targets --all-features -- -D warnings`: PASS. No separate TypeScript type/lint script is defined.
- The 30-node/five-change acceptance fixture passed: exactly 20 expected `chain.*` stale assets, no unrelated assets, 20 known minutes, and ready disposition.
- Extracted `dist/package/data-change-impact-card-0.1.0.crate` into a fresh consumer, installed it with `cargo install --locked`, then ran `dcic demo` and redacted analysis. Demo created its unique temporary sample directory; redaction emitted stable `NODE-###` aliases without raw names or free-text summary.
- Installed-CLI boundary/recovery checks: empty changes returned complete `no_impact`; duplicate identifiers and dual stdin returned code 2 with useful errors; absent input returned code 1. The normal fixture returned the two expected stale assets in dependency order and seven known minutes.

## Live deployment, accessibility, privacy, and performance

- Deployment parity: SHA-256 was identical for 14 fresh build/live public files: four HTML routes, JS, CSS, service worker, robots/sitemap, icons, and both WebP assets.
- Desktop and 390px mobile: all tested public routes had one `h1`, `main`, and zero horizontal overflow at 390px. Cold-load console and page errors were empty.
- Accessibility: independent Axe scans found zero serious/critical findings on live home and demo. The full live Playwright suite also passed its home, demo, privacy, terms, and 404 Axe tests. Keyboard traversal reached the skip link first and every sampled control had a visible cyan `3px` focus outline. ArrowRight switches the sample tab.
- Reduced motion: live `prefers-reduced-motion` matched, document scrolling computed to `auto`, there were no active animations, and transition duration computed to `0.001ms`.
- Privacy: Playwright recorded only `https://data-change-impact-card.sociobot.in` requests through the public flow. Cookies, localStorage, sessionStorage, and IndexedDB were empty; the only browser storage was the documented same-origin shell cache `dcic-shell-v3`.
- PWA: fresh live service worker was activated and controlling the page; `registration.update()` left no waiting worker. After first visit, an offline reload of `/demo/?demo=1` returned HTTP 200 with the Demo title, sample h1, and demo banner.
- Headers/caching: HTTPS responses include self-only CSP with header-only `frame-ancestors 'none'`, HSTS, `nosniff`, Referrer-Policy, and Permissions-Policy. HTML is `max-age=30, must-revalidate`; hashed JS/CSS are one-year immutable; `sw.js` is `no-cache`; an unknown URL produced the designed HTTP 404 page.
- Budget: Vite output is 4.71 KB JS (1.97 KB gzip), 20.38 KB CSS (4.85 KB gzip), and a 29.29 KB locally hosted hero image — below the applicable static-product budgets.

## Scope notes

This is a local CLI plus static documentation/PWA. It has no server-side product API, sign-in, payment/unlock endpoint, AI feature, or persistence service. Backend concurrency/rate-limit testing, Sociobot Entra tenant testing, and billing checks are not applicable. No production data connection or recompute execution was observed or implemented.
