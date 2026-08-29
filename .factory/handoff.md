# Handoff — polish round 1

## Outcome

All 21 findings in `.factory/review-1.md` are closed. The product remains a
Rust `clap` single-binary CLI with a Vite-built static documentation and demo
site. The navy drafting-sheet and vellum-card visual system is preserved.

The one-click URL is
<https://data-change-impact-card.sociobot.in/demo/?demo=1>. Its first 390×844
viewport now shows the sample command, `raw.orders` change, two stale assets,
seven known minutes, zero unknown edges, and the generated impact card. The
sticky demo banner provides Reset demo and Start for real. Browser demo state
exists only in `?demo=1`; it does not use browser key/value storage.

## Changes

- Rewrote every flagged heading, label, image alternative, host-package line,
  process step, install control, README exit-code sentence, and 404 message.
- Added the landing-page Privacy and limits section.
- Added heading focus and polite announcements for cross-document navigation,
  Back/forward restoration, and fragment routes without stealing focus on a
  cold home load.
- Completed 404 canonical, Open Graph, Twitter, social-image, and noindex data;
  completed route metadata on demo, privacy, and terms.
- Expanded `.factory/claims.json` from 9 to 15 claims. Each ID occurs in exactly
  one tagged test. Tests now cover every detail called out by the review.
- Updated `.factory/copy-audit.md`, `.factory/demo.md`, and the 100-character,
  verb-first `.factory/catalog-description.txt`.
- Added `.factory/polish-1.md` with finding-by-finding closure evidence.

## Verification

Final clean clone: `/tmp/dcic-polish-final.2x2zN3/repo`.

- Each of the 15 `test` commands in `.factory/claims.json`: PASS when executed
  separately after `npm ci`.
- `npm test`: PASS — 13 Rust tests, 4 static contracts, 41 Playwright passes,
  5 intentional cross-project skips.
- `npm run build`: PASS — `dist/site/`, 79.6 KiB crate (20.8 KiB compressed),
  and the host-platform binary.
- `cargo fmt --check`: PASS.
- `cargo clippy --all-targets -- -D warnings`: PASS.
- `npm audit --audit-level=high`: PASS, 0 vulnerabilities.
- Site payload: initial JS 4.71 KiB raw / 1.97 KiB gzip; CSS 20.38 KiB raw /
  4.85 KiB gzip; hero 29.3 KiB.
- Live Playwright: PASS — 41 passed, 5 intentional skips across desktop and
  390×844 mobile, including Axe, keyboard/focus, privacy, offline, routes, 404,
  and demo-first-viewport checks.
- `/opt/fleet/lib/verify-url.sh`: PASS — HTTP 200 in 666 ms, no console errors,
  correct title/lang/h1/main/alt/button labels.
- Live Lighthouse: Performance 100, Accessibility 100, Best Practices 100,
  SEO 100; FCP 1.1 s, LCP 1.1 s, TBT 0 ms, CLS 0.
- Live routes: `/`, `/demo/?demo=1`, `/privacy/`, `/terms/` returned 200;
  `/does-not-exist` returned the designed HTTP 404.
- Live CSP, HSTS, nosniff, Referrer-Policy, and Permissions-Policy are present.
  Local/live SHA-256 hashes matched for home and demo documents.

Evidence is under `.factory/qa-evidence/polish-1/`. The live verifier output is
`live/verify.json`; Lighthouse is `live/lighthouse.json`; cold screenshots cover
home, demo at both sizes, and the 404.

## Deployment

- Source repair commits pushed to `origin/main`: `801ee6d`, `3f066e0`.
- Work-order command: `npm ci && npm run build:site`.
- Static artifact: `dist/site`.
- Azure Static Web Apps deployment ID:
  `fc7a1cdc-55fb-4f02-8b69-ce8ffe1cdd1f`.
- Live URL: <https://data-change-impact-card.sociobot.in>.

## Known gaps and next steps

None for the reviewed scope. Registry publication remains factory-owned; the
repository produces the ready-to-publish crate and host binary but does not
publish either one.
