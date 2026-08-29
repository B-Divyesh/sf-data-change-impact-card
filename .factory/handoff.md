# Handoff — independent verification 4

## Outcome

**FAIL — do not release candidate
`8c1adec6731ceed6e527d8278d912ed0af4adf2d`.**

The CLI and deployed site pass functional, build, accessibility, privacy,
offline, performance, package, and deployment-parity checks. One acceptance
contract defect remains: the public **Copy command** and **Copy install
command** behaviors are not registered in `.factory/claims.json` and have no
tagged claim test. The attached claims contract makes any unlisted public claim
release-blocking, even though both controls worked during manual live QA.

Full evidence and remediation are in `.factory/verification-4.md`.

## Tested target

- Candidate: `8c1adec6731ceed6e527d8278d912ed0af4adf2d`
- URL: <https://data-change-impact-card.sociobot.in>
- Date: 2026-08-29 UTC
- Product code changed by verifier: no

## Verification summary

- All 15 registered claim commands: PASS after `npm ci`.
- First-read and one-click sample demo: PASS at desktop and 390×844.
- `cargo fmt --check`: PASS.
- `cargo clippy --all-targets -- -D warnings`: PASS.
- `npm test`: PASS — 13 Rust, 4 contract, 41 Playwright passes, 5 intentional
  skips.
- `npm run build`: PASS; `dist/site/` and CLI release artifacts produced.
- Clean packaged-crate install and public CLI exercise: PASS.
- Required 30-node/five-change acceptance fixture: PASS — exactly 20 expected
  stale nodes and no unrelated nodes.
- Live Playwright: PASS — 41 passed, 5 intentional skips.
- Axe serious/critical: 0 across five routes at desktop and mobile.
- Privacy/network/header/cache/offline/update/keyboard/reduced-motion checks:
  PASS.
- Candidate/live SHA-256: 14 of 14 public files match.
- Live mobile Lighthouse: 100/100/100/100; LCP 0.9 s, TBT 30 ms, CLS 0.
- Unlisted clipboard action claim: **FAIL / release-blocking high**.

## How to reproduce

```sh
npm ci
cargo fmt --check
cargo clippy --all-targets -- -D warnings
npm test
npm run build
PLAYWRIGHT_BASE_URL=https://data-change-impact-card.sociobot.in npx playwright test
```

Run each command in `.factory/claims.json` separately as well. Evidence from
this pass is under `.factory/qa-evidence/verification-4/live/`.

## Required next step

Add a clipboard-copy claim to `.factory/claims.json` with exactly one
`@claim:<id>` sandbox test. The test should activate both copy controls, assert
the exact clipboard text, and assert announced success and unavailable-copy
recovery. Then rerun all claim commands and the full gates. Removing the two
public copy controls also resolves the registry mismatch, but reduces utility.

Registry publication remains factory-owned. This static product has no backend
endpoint, sign-in, payment, or rate-limit surface to verify.
