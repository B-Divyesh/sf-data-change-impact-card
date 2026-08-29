# Review 1 handoff — Data Change Impact Card

## Review result

**FAIL.** Adversarial first-read review 1 is recorded in
`.factory/review-1.md`. Product code was not modified. The cold landing page is
clear, the CLI works end to end, every registered claim command passes, and the
live site passes its build, accessibility, privacy, offline, link, and basic
metadata checks. The release still fails this review because the one-click demo
does not show realistic output in its first viewport and the public claim
registry/tests do not cover every stated CLI behavior.

## Work performed

- Captured fresh 390×844 and 1440×900 cold and demo first screens.
- Audited every landing/README sentence and all landing headings/actions.
- Ran all nine `.factory/claims.json` commands verbatim from a fresh clone.
- Ran both CLI demo forms from an empty temporary directory and inspected their
  three generated files.
- Verified live offline behavior, same-origin requests, empty cookie and web
  key/value storage, Reset, Start for real, deep links, Back, focus, all links,
  route metadata, headers, 404, target sizes, and product identity.
- Rechecked every repair recorded in the earlier handoff.

## Verification

```sh
npm ci
npm test
npm run build
```

Results: `npm test` passed 27 browser tests with 3 intentional skips plus all 13
Rust and 2 contract tests. `npm run build` produced `dist/site/` and the CLI
package. All nine exact claim commands passed in the fresh clone. The required
live URL verifier passed, and live Axe scans found no serious/critical issue on
home, demo, privacy, terms, or 404 at either viewport.

## Required next steps

1. Make `/demo/?demo=1` show the recorded real run and generated impact card in
   the first 390×844 viewport.
2. Register or remove every unlisted/under-tested public behavior detailed in
   F-1-2.
3. Resolve the history regressions in F-1-3 and F-1-4.
4. Address the remaining routing, metadata, skeleton, and copy findings.

---

# Previous release handoff — Data Change Impact Card

## Release status

**PASS — independently accepted at commit
`4467e232750d0c3381c4781f70ac0ed3ab53c8eb`.** This remains a Rust `dcic` CLI
with a static documentation/demo site. The researched scope, bundled demo,
local-first model, and deployment class are unchanged. Independent verification
3 ran every registered claim, CLI/package checks, exact build, live deployment,
privacy/header, accessibility, offline, mobile, and Lighthouse checks; see
`.factory/verification-3.md` for exact evidence and the unambiguous PASS.

## Repairs

- Changed-node safety now takes precedence over an empty impact set. An
  undeclared changed node produces `review_required`, one unknown edge, and no
  false `no_impact` decision. It has both library and CLI regressions.
- Expanded `.factory/claims.json` from three to nine public, executable claims.
  Each has exactly one `@claim:<id>` Playwright regression covering the shipped
  demo, core card, input/output/redaction, uncertainty, local read-only
  execution, privacy, offline behavior, license, or package artifact.
- Service-worker navigation now matches cached documents without query strings
  and falls back to the requested known shell. Offline `/demo/?demo=1` renders
  the demo document and its sandbox banner.
- Rebuilt the `D↘C` mark as a non-wrapping flex mark and enforced 44×44px
  dimensions for visible header/footer/demo-banner links. Desktop and 390px
  regression checks measure every visible target.
- Replaced the unsupported Linux/macOS/Windows binary statement with the exact
  host-platform package behavior. `npm run pack:cli` now builds the release
  binary itself before packaging.
- Anchored crate include patterns, removing nested `node_modules` README/LICENSE
  files. The package now contains 18 intended project files.
- Completed the landing-page copy audit and removed the unsupported/metaphoric
  wording called out by the verifier. The MIT license has its standard title.

## Run and verify

```sh
cargo clean
npm ci
npm audit --audit-level=high
cargo fmt --check
cargo clippy --all-targets -- -D warnings
npm test
npm run build
```

Run every public claim individually with the exact command in
`.factory/claims.json`. Build a consumer package with `npm run pack:cli`.

For the demo:

```sh
dcic demo
# or
dcic --demo
```

The static deployment output is `dist/site/`. The release crate and host
binary are in `dist/package/`; do not publish from this repository.

## Evidence — 2026-08-29 UTC

- Clean install: `cargo clean && npm ci` passed; `npm audit --audit-level=high`
  found 0 vulnerabilities.
- Rust: `cargo fmt --check`, `cargo clippy --all-targets -- -D warnings`, and
  `cargo test` passed: 6 library tests and 7 CLI integration tests.
- Full product test: `npm test` passed 27 browser tests on desktop and 390px
  mobile, with 3 intentional project skips. It covers keyboard tabs, focus,
  touch targets, reduced motion, mobile overflow, semantic routes, and Axe
  serious/critical violations.
- Claims: all 9 exact `.factory/claims.json` commands passed independently.
  Offline behavior is deliberately desktop-only in that command; the mobile
  browser suite otherwise ran the same routes and target regressions.
- Production build: `npm run build` passed. Initial JS is 3,349 bytes (1.51KB
  gzip), CSS is 17,652 bytes (4.37KB gzip), and the hero is 29,288 bytes.
  The crate is 18KB and the Linux x64 binary is 1004KB.
- Package/consumer: `cargo package --list --allow-dirty` reported 18 intended
  files and no `node_modules` material. A fresh extracted crate installed with
  `cargo install --path … --root … --locked`; its demo reported 2 stale assets,
  7 minutes, 0 unknown edges, and its 30-node fixture reported 20 stale assets
  and 20 known minutes.
- Local production preview: `/opt/fleet/lib/verify-url.sh` returned 200 in
  523ms with no page/console errors, title, `lang=en`, one `h1`, `main`, no
  missing image alt, and no unlabeled button. Playwright against that preview
  passed 27 tests (3 intentional skips).
- Lighthouse mobile preview: Performance 100, Accessibility 100, Best
  Practices 100, SEO 100; LCP 931ms and CLS 0.

## Deployment evidence

Deployed `dist/site/` with `/opt/fleet/lib/deploy-static.sh` on 2026-08-29 UTC.
Azure deployment `b2c47ec8-c189-482f-a885-208ed57fb0b4` succeeded and the
custom domain is live at <https://data-change-impact-card.sociobot.in>.

- Live `/opt/fleet/lib/verify-url.sh` returned 200 in 791ms with no console or
  page errors and the expected title, language, one `h1`, `main`, image alt
  text, and button labels.
- Live Playwright: 27 passed, 3 intentional project skips across desktop and
  390px mobile; this includes the offline demo-route and target regressions.
- Live `/does-not-exist` returns HTTP 404. `sw.js` returns no-cache, the
  restrictive CSP and security headers are present, and its SHA-256 matches the
  local build: `d682368cd634ff02c425de2dc7bed794d4003463ab6e41dc5e1e07c8ad23a3b6`.
- The release binary directly reproduced the safety repair: an undeclared
  changed node emitted `unknown_edges: 1` and `disposition: review_required`.

## Known limits

The CLI intentionally analyzes only declared lineage. It does not infer
lineage, connect to production, or execute recomputation commands. Cross-host
release binaries are a release-CI responsibility; the package makes its
host-specific binary explicit.
