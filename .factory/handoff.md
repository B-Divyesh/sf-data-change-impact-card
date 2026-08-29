# Handoff — independent verification 2

## Release status

**FAIL — do not release.** Candidate
`806414bbe0642e720c9f914cbd23acfdc828921e` was tested against
<https://data-change-impact-card.sociobot.in> on 2026-08-29 UTC. The live site
is byte-identical to the candidate build, so the findings apply to both.

The cold first-read and one-click demo gates pass, and all three commands in
`.factory/claims.json` pass after `npm ci`. Release remains blocked because the
CLI labels an undeclared changed node as `no_impact` while also reporting an
unknown edge that requires review, and because numerous landing-page/README
claims are missing from the mandatory claims registry.

Full evidence and reproduction steps are in `.factory/verification-2.md`.

## Verification performed

```sh
npm ci
npm audit --audit-level=high
cargo fmt --check
cargo clippy --all-targets -- -D warnings
cargo test
npm test
npm run build
PLAYWRIGHT_BASE_URL=https://data-change-impact-card.sociobot.in npx playwright test
```

Each exact `.factory/claims.json` test command was also run independently. A
fresh crate was extracted and installed into an isolated `--root`; the installed
binary passed its demo and the 30-node/five-change acceptance fixture. Live QA
covered desktop, 390px mobile, keyboard-only operation, focus, reduced motion,
Axe, offline reload, service-worker update, request/storage privacy, headers,
caching, 404 behavior, links, metadata, deployment hashes, and Lighthouse.

## Key results

- Build/test/lint/package: pass.
- Declared claim commands: pass.
- First-read and one-click demo: pass.
- Core unknown-change safety result: fail.
- Claims inventory/coverage: fail.
- Lighthouse mobile: 100 performance, 100 accessibility, 100 best practices,
  100 SEO; LCP 1.1s, CLS 0.
- Axe: zero violations across all public routes at desktop and mobile widths.
- Privacy: only same-origin requests, no cookies/local storage/session storage/
  IndexedDB, and documented offline Cache Storage only.
- Deployment parity: all 10 sampled built/live files matched by SHA-256.

## Additional defects

- Offline navigation to `/demo/?demo=1` serves the cached home document.
- Several nav/footer links are 34–42px wide and demo-banner links are 36px tall,
  below the required 44×44px target.
- The boxed `D↘C` wordmark wraps its `C` below the border at both widths.
- The page claims Linux/macOS/Windows binaries, but the build produces only the
  current Linux x64 binary.
- The copy audit covers only seven rows, and the crate includes unrelated
  `node_modules` README/LICENSE files.

## Product changes

None. Only independent verification documentation and evidence were added.
