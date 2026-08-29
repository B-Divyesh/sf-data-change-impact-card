# Polish round 1 — cumulative finding closure

Date: 2026-08-29 UTC  
Reviewed report: `.factory/review-1.md` (no earlier review or polish files exist)  
Repair commits: `801ee6d`, `3f066e0`  
Live URL: <https://data-change-impact-card.sociobot.in>

Every finding is closed. The clean-clone run executed all 15 commands in
`.factory/claims.json` separately before the complete test and build suite.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Rebuilt `/demo/?demo=1` so the first mobile viewport contains the recorded `dcic demo` command, sample change, exact totals, and generated vellum card. Kept a sticky demo banner with Reset demo and Start for real. | `demo result and generated card are visible in the first mobile viewport`; `@claim:bundled-cli-demo`; [mobile screenshot](qa-evidence/polish-1/live/demo-cold-mobile390.png); live `/demo/?demo=1` returned 200. |
| F-1-2 | Expanded the registry from 9 to 15 narrow claims and strengthened earlier tests for two isolated demo runs, YAML and JSON, stable aliases, missing estimates, sorted evidence, named cycles, rendered partial cards, and every public site route. Added clean install, JSON alias, stdin, exit-code, help, and node-ID claim tests. | `every registered public claim has exactly one tagged test`; all 15 exact claim commands passed in `/tmp/dcic-polish-final.2x2zN3/repo`; live Playwright: 41 passed, 5 intentional skips; [live desktop](qa-evidence/polish-1/live/demo-cold-desktop.png). |
| F-1-3 | Replaced the 23-word image alternative with “A schema change connects to four data assets; two are stale and the last is verified.” and corrected its whitespace count to 16. | `copy audit counts are accurate and catalog description is plain`; [live home](qa-evidence/polish-1/live/home-cold-desktop.png); live `/` returned 200. |
| F-1-4 | Standardized the landing text to “The release package includes the binary built on its packaging host.” | `@claim:host-platform-package`; live `/` text check in Playwright; [live home](qa-evidence/polish-1/live/home-cold-desktop.png). |
| F-1-5 | Changed the final process step to “Use the order — Run jobs outside this CLI.” | Landing copy contract and `@claim:local-read-only-analysis`; [live home](qa-evidence/polish-1/live/screenshot-desktop.png); live `/` returned 200. |
| F-1-6 | Added same-origin route restoration state, destination-heading focus, delayed fragment focus, and a polite route announcement on every page. Cold loads still begin at the skip link. | `route changes focus and announce the destination heading` covers forward, Back, and `/#contract`; `home is semantic, accessible, and free of runtime errors`; live Playwright passed both viewports. |
| F-1-7 | Added canonical, noindex, Open Graph, Twitter, social image, touch icon, and shared route script to the styled 404. Extended the metadata contract to all five documents. | `all public pages ship canonical and social metadata`; live `/does-not-exist` returned HTTP 404; [404 screenshot](qa-evidence/polish-1/live/404-mobile390.png). |
| F-1-8 | Added a dedicated “Privacy and limits” section after the workflow, covering named files, network boundary, no job execution, and incomplete lineage. | `@claim:local-read-only-analysis`, `@claim:no-third-party-runtime-requests`, and `@claim:uncertain-lineage`; [live full page](qa-evidence/polish-1/live/screenshot-desktop.png); live `/privacy/` returned 200. |
| F-1-9 | Renamed the section “Input and output contract.” | Copy-audit contract; [live full page](qa-evidence/polish-1/live/screenshot-desktop.png); live `/#contract` focus check passed. |
| F-1-10 | Renamed the section “How the CLI reports uncertain lineage.” | Copy-audit contract; [live full page](qa-evidence/polish-1/live/screenshot-desktop.png); live `/` check passed. |
| F-1-11 | Renamed the section “Install the CLI from source.” | Copy-audit contract and `@claim:source-install`; [live full page](qa-evidence/polish-1/live/screenshot-desktop.png); live `/#install` resolved. |
| F-1-12 | Replaced “Honest failure modes” with “Failure modes.” | Copy-audit contract; [live full page](qa-evidence/polish-1/live/screenshot-desktop.png); live `/` check passed. |
| F-1-13 | Replaced decorative “spec / 01” on every route with useful `v0.1.0`. | `navigation and demo controls meet the 44px target and keep the wordmark intact`; [live demo](qa-evidence/polish-1/live/demo-cold-mobile390.png); all routes passed live. |
| F-1-14 | Replaced “Local-first CLI / change plan 01” with “Local CLI.” | Copy-audit contract; [mobile home](qa-evidence/polish-1/home-mobile390.png); live `/` passed. |
| F-1-15 | Removed the visible “000 — 1200 px” measurement annotation. | Copy-audit contract; [mobile home](qa-evidence/polish-1/home-mobile390.png); live `/` passed. |
| F-1-16 | Removed “Fig. 01” and retained the useful figure caption only. | Copy-audit contract; [live full page](qa-evidence/polish-1/live/screenshot-desktop.png); live `/` passed. |
| F-1-17 | Standardized both sample actions to “Try it with sample data.” | `recorded sample details work with keyboard`; [mobile home](qa-evidence/polish-1/home-mobile390.png); both live links resolve to `/demo/?demo=1`. |
| F-1-18 | Changed the visible install control from “Copy” to “Copy install command.” | `home is semantic, accessible, and free of runtime errors`; [live full page](qa-evidence/polish-1/live/screenshot-desktop.png); live button has the same visible and accessible name. |
| F-1-19 | Replaced landing jargon with “Dependency order; cycles are rejected.” | `@claim:core-impact-card` and `@claim:uncertain-lineage`; [live full page](qa-evidence/polish-1/live/screenshot-desktop.png); live `/` passed. |
| F-1-20 | Replaced the 404 metaphor with “This page does not exist or may have moved.” | `demo and not-found pages are semantic and accessible`; live `/does-not-exist` returned 404; [404 screenshot](qa-evidence/polish-1/live/404-mobile390.png). |
| F-1-21 | Rewrote the README as three plain exit-code sentences and replaced “serialization” with “file or output-format error.” | `@claim:exit-codes` asserts success, missing file, output write failure, and invalid input; clean-clone claim command passed. |

## Final verification

- Clean clone `/tmp/dcic-polish-final.2x2zN3/repo`: all 15 claim commands passed.
- `npm test`: 13 Rust tests, 4 static contract tests, 41 browser passes, and 5 intentional project skips.
- `npm run build`: emitted `dist/site`, the crate, and the host-platform binary.
- `cargo fmt --check`, `cargo clippy --all-targets -- -D warnings`, and `npm audit --audit-level=high`: passed; audit found 0 vulnerabilities.
- Live URL verifier: 200 in 666 ms; no console errors; title, `lang`, one h1, main, alt text, and button labels passed.
- Live Lighthouse: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP/LCP 1.1 s, TBT 0 ms, CLS 0. Report: `qa-evidence/polish-1/live/lighthouse.json`.
- Live deployment hashes exactly matched `dist/site/index.html` and `dist/site/demo/index.html`.
