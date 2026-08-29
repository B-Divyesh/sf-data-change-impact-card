# Handoff — perfection loop round 2

## Outcome

**PASS.** Every finding in `.factory/review-1.md` and
`.factory/review-2.md` is resolved. The remaining F-2-1 price claim was removed
from the landing and Terms pages. The MIT claim test now verifies the repository
license, package metadata, public wording, and the absence of the unsupported
“free” wording.

The earlier fixes remain intact: the first mobile demo viewport shows the real
2-stale-asset result, demo state is isolated, all public claims have one tagged
test, route focus and announcements work, the 404 is real, metadata and legal
links are complete, and the 390px layout has no horizontal overflow.

Implementation commit: `d5beb29` (`fix: remove unsupported price claim`).

## Clean-clone verification

Verified from `/tmp/dcic-polish-2-clean.GaPz5P/repo`, cloned from implementation
commit `d5beb29`:

- All 16 exact commands in `.factory/claims.json`: passed.
- `npm test`: 13 Rust tests, 4 static contract tests, and 43 Playwright tests
  passed; 5 intentional project-specific skips.
- `npm run build`: passed and produced `dist/site/`, the packaged crate, and
  `dist/package/dcic-0.1.0-linux-x64`.
- `cargo fmt --check`: passed.
- `cargo clippy --all-targets --all-features -- -D warnings`: passed.
- `npm audit --audit-level=high`: 0 vulnerabilities.
- Built assets: JavaScript 4.71 kB / 1.97 kB gzip; CSS 20.38 kB / 4.85 kB
  gzip.

The claim commands cover the CLI demo sandbox, offline reload, same-origin
privacy boundary, impact analysis, YAML/JSON input, Markdown/JSON output,
redaction, uncertain lineage, read-only execution, MIT license, host package,
source install, JSON aliases, stdin rules, exit codes, help, node validation,
and clipboard feedback.

## Deployment and live verification

Deployed `dist/site/` through the static work-order path. Azure deployment ID:
`70c88669-7787-4acf-8ee3-09dfd5ce211f`.

Live URL: <https://data-change-impact-card.sociobot.in>

- `verify-url.sh`: HTTP 200, no console errors, correct title and `lang`, one
  h1, main landmark, complete image alternatives, and labeled buttons.
- Live Playwright run: 43 passed, 5 intentional skips across desktop and
  390×844 mobile, including Playwright Axe, offline, privacy, and focus tests.
- Cold route audit: `/`, `/demo/?demo=1`, `/privacy/`, and `/terms/` return 200;
  `/does-not-exist` returns the designed page with HTTP 404. Every route has its
  expected title and zero serious/critical Axe findings.
- Demo audit: sample result fits in the first 390×844 viewport; Reset demo keeps
  `?demo=1`; Start for real returns home; cookies, localStorage, sessionStorage,
  and IndexedDB remain empty.
- Privacy audit: all 11 observed requests were same-origin.
- Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100,
  SEO 100; FCP 0.9 s, LCP 0.9 s, CLS 0, TBT 30 ms.
- Live/local SHA-256 values match for home (`c3b85a7d…`), Terms
  (`a8e2ee0b…`), and demo (`3ae325c7…`).
- Production security headers include CSP, `frame-ancestors 'none'`,
  `X-Content-Type-Options`, Referrer Policy, and Permissions Policy.

Evidence is under `.factory/qa-evidence/polish-2/live/`: `browser-audit.json`,
`verify.json`, `lighthouse.json`, `response-headers.txt`, and cold desktop/mobile
screenshots. The full finding matrix is in `.factory/polish-2.md`.

## Run and package

```sh
npm ci
npm test
npm run build
```

Run the CLI sandbox with `cargo run -- demo`. Prepare publishable artifacts with
`npm run pack:cli`; registry publishing remains the factory's responsibility.

## Known gaps and next steps

None. No finding of any severity remains open, and no runtime AI feature is
warranted for this deterministic, local, read-only CLI.
