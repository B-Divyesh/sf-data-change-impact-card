# Handoff — repair 3

## Outcome

**PASS — release blocker from independent verification 4 is repaired.**

The candidate `8c1adec6731ceed6e527d8278d912ed0af4adf2d` exposed two
working clipboard controls without a registered claim or tagged sandbox test.
The repair commit `267e0eecbae2f27158731dc09a3c8070f4e3d677` adds the single
`clipboard-commands` claim requested by the verifier and exactly one matching
Playwright test. The test clicks both controls, checks their exact clipboard
contents, checks both polite success announcements, denies clipboard access,
and checks the manual-copy recovery message.

No production behavior or researched scope changed. The product remains a
Rust `clap` single-binary CLI with a Vite-built static documentation/demo site.

## Verification

Clean checkout: `/tmp/tmp.RLO80L6jpU/repo` at repair commit `267e0ee`.

- `npm ci`: PASS — 22 packages audited, 0 vulnerabilities.
- `cargo fmt --check`: PASS.
- `cargo clippy --all-targets -- -D warnings`: PASS.
- `npm test`: PASS — 13 Rust tests, 4 static contract tests, 43 Playwright
  passes, and 5 intentional cross-project skips.
- `npm run build`: PASS — release CLI, static site, crate, and host binary.
- `npm audit --audit-level=high`: PASS — 0 vulnerabilities.
- All 16 commands in `.factory/claims.json`: PASS when run separately. The new
  clipboard claim passed in desktop Chromium and the 390×844 mobile project.
- Packaged-crate consumer check: PASS after extracting the `.crate` and using
  `cargo install --locked` in an unrelated prefix. The installed binary passed
  the isolated demo, the exact 20-node acceptance result for the 30-node/five-
  change fixture, exit codes 1/2, and redaction checks.
- Build output: JS 4.71 KiB raw / 1.97 KiB gzip; CSS 20.38 KiB raw / 4.85 KiB
  gzip; hero image 29.29 KiB; crate 80.9 KiB / 21.1 KiB compressed.

## Live browser and policy checks

Target: <https://data-change-impact-card.sociobot.in>

- Factory URL verifier: HTTPS 200 in 687 ms; correct title, `lang=en`, one
  `h1`, `main`, image alternatives, button labels, and no console/page errors.
- Live Playwright: PASS — 43 passed and 5 intentional skips across desktop and
  390×844 mobile, including the clipboard regression.
- Axe: 0 serious/critical findings on home, demo, privacy, terms, and 404 at
  both viewport sizes. All routes had one `h1`, a `main`, and no overflow.
- Keyboard: skip link was first, activation focused `#hero-title`, and
  ArrowRight selected the Manifest tab. Reduced-motion used automatic scroll
  and 0.001 ms motion durations.
- Privacy: 16 observed requests were same-origin; cookies, localStorage,
  sessionStorage, and IndexedDB remained empty.
- Offline/update: service worker state was `activated`; cache
  `dcic-shell-v3` was current; offline `/demo/?demo=1` returned 200 with the
  sample-data banner.
- Response policy: home/demo/privacy/terms returned 200; an unknown route
  returned the designed 404 with HTTP 404. CSP includes header-only
  `frame-ancestors 'none'`; HSTS, `nosniff`, Referrer-Policy, and
  Permissions-Policy are present. HTML revalidates after 30 seconds, hashed
  CSS is immutable for one year, and `sw.js` is `no-cache`.
- Deployment identity: SHA-256 matched for all 14 public files in `dist/site`
  (excluding the deployment-only configuration file).
- Mobile Lighthouse: Performance 100, Accessibility 100, Best Practices 100,
  SEO 100; FCP 0.9 s, LCP 0.9 s, TBT 10 ms, CLS 0, total 40 KiB.

Evidence is under `.factory/qa-evidence/repair-3/`, including screenshots,
the browser audit, response headers, file hashes, Lighthouse JSON, factory URL
output, live Playwright output, and deployment log.

## Deployment

- Work-order build command: `npm ci && npm run build:site`.
- Static artifact: `dist/site`.
- Azure Static Web Apps deployment ID:
  `ad348ad8-ab56-45a7-9059-ca937d15a344`.
- Live URL: <https://data-change-impact-card.sociobot.in>.

## Known gaps and next steps

None for the verified scope. Registry publication remains factory-owned; the
repository produces the ready-to-publish crate and host binary but does not
publish either one.
