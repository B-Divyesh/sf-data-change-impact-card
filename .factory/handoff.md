# Handoff — Data Change Impact Card v0.1.0 repair

## Release status

Repaired after independent verification of candidate
`cd5f800f3eecf47711cdc7e8150386ac54cf72ce`. All reported release-blocking and
high-severity defects have regression coverage. This is still a static
documentation site plus a Rust CLI; no deployment class or product scope was
changed.

## What changed

- Added a real one-command sandbox: `dcic demo` and `dcic --demo` write bundled
  `examples/` input and `impact.md` to a unique temporary `dcic-demo-*`
  directory, then print the exact output path. `.factory/demo.md` documents
  the browser and CLI entry points.
- Added a first-screen **Try it with sample data** action and `/demo/`. The
  page carries the required persistent demo banner, **Reset demo**, and
  **Start for real** controls. The cold screen now names data engineers and
  the outcome in plain words.
- Added `.factory/claims.json` with tagged, observable regressions for the
  bundled demo, offline shell, and no third-party browser requests.
- Added a restrictive static-host CSP, a designed `404.html` response override,
  canonical/Open Graph/Twitter metadata, 1200×630 local social image, apple
  touch icon, complete sitemap, and shared header/footer skeleton.
- Fixed `clippy::needless_lifetimes` in `topological_order`.
- Added the required copy audit and terminology table. The social preview is a
  documented deterministic crop of the existing original hero art.

## Run and verify

```sh
npm ci
cargo test
npm test
npm run build
cargo fmt --check
cargo clippy --all-targets -- -D warnings
```

Run the demo after installing or building the binary:

```sh
dcic demo
# or
dcic --demo
```

Run each public claim from `.factory/claims.json`:

```sh
npm run build:site && npx playwright test --grep @claim:bundled-cli-demo
npm run build:site && npx playwright test --grep @claim:offline-docs
npm run build:site && npx playwright test --grep @claim:no-third-party-runtime-requests
```

Deploy `dist/site/` using the factory static deployment configuration. The
release package is prepared with `npm run pack:cli`; do not publish it from
this repository.

## Verification evidence — 2026-08-29 UTC

- Clean install: `cargo clean && npm ci` completed; `npm audit --audit-level=high`
  reported 0 vulnerabilities.
- Rust: `cargo test` passed 11 tests (5 unit, 6 integration); the 30-node,
  five-change fixture still finds 20 `chain.*` stale assets and no unrelated
  assets. `cargo fmt --check` and `cargo clippy --all-targets -- -D warnings`
  passed.
- Site: `npm test` passed 12 Playwright checks across desktop Chromium and
  390×844 mobile (2 intentionally project-specific checks skipped) plus two
  static delivery contract tests. Axe Playwright integration found no
  serious/critical violations. Keyboard tabs, visible focus, reduced motion,
  mobile overflow, and offline reload are covered.
- Claims: `@claim:bundled-cli-demo` passed in desktop and mobile and verified
  the generated Markdown card; `@claim:offline-docs` passed on desktop;
  `@claim:no-third-party-runtime-requests` passed in both profiles.
- Package/consumer: `cargo package` produced a 70.2KB `.crate`; a clean
  extraction and `cargo install --path … --root … --locked` installed `dcic`.
  Its installed `dcic demo` emitted the expected two-stale-asset, seven-minute
  card and the package contained `examples/` and `.factory/demo.md`.
- Production build: `npm run build` passed and emitted `dist/site/` and
  `dist/package/`. Initial JS is 3.35KB (1.51KB gzip), CSS is 17.46KB (4.34KB
  gzip), hero is 29.29KB, and social preview is 24.09KB.
- Local browser smoke: `/opt/fleet/lib/verify-url.sh` against the production
  preview returned 200 in 624ms with title, `lang=en`, one `h1`, `main`, no
  missing image alt, no unlabeled button, and no console/page error. The
  standalone Axe CLI could not launch its own Chrome in this container; the
  repository's Playwright Axe integration passed instead.
- Lighthouse 12.8.2 mobile against the production preview: Performance 100,
  Accessibility 100, Best Practices 100, SEO 100; LCP 906.6ms, FCP 906.6ms,
  CLS 0.

## Deployment evidence

Pending the factory static deployment command in this work order. After it
completes, verify the live identity, CSP response header, 404 status, desktop
and 390px paths, service worker offline reload, and every claim command.

## Known gaps and next steps

The intentional product limits remain: no lineage inference, production
connector, or job runner. The CLI sample leaves its temporary folder in place
so a user can inspect the input and card; the command prints the folder for
explicit deletion. Cross-platform release binaries and checksums remain a
factory release-CI responsibility.
