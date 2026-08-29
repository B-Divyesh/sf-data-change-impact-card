# Polish round 2 — cumulative finding closure

Reviewed sources: `.factory/review-1.md`, `.factory/polish-1.md`, and
`.factory/review-2.md`. Live checks target
<https://data-change-impact-card.sociobot.in> after deployment.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Kept the demo result directly below its persistent banner. The first phone viewport includes the recorded command, changed source, 2 stale assets, 7 minutes, 0 unknown edges, and generated card. Reset retains the isolated query and Start for real leaves it. | Tests `@claim:bundled-cli-demo` and `demo result and generated card are visible in the first mobile viewport`; screenshot `qa-evidence/polish-2/live/demo-cold-mobile390.png`; live `/demo/?demo=1` returned 200 and passed the cold first-viewport audit. |
| F-1-2 | Kept all public behavior in 16 narrowly scoped claim entries, each with exactly one tagged sandbox test. Strengthened `mit-license` to cover its public wording and reran every exact command from a clean clone. | Test `every registered public claim has exactly one tagged test`; all 16 commands passed in `/tmp/dcic-polish-2-clean.GaPz5P/repo`; screenshot `qa-evidence/polish-2/live/demo-cold-desktop.png`; live browser suite passed 43 tests. |
| F-1-3 | Retained the 16-word hero alternative and its corrected audit count. | Test `copy audit counts are accurate and catalog description is plain`; screenshot `qa-evidence/polish-2/live/home-cold-mobile390.png`; live `/` exposes the short alternative and returned 200. |
| F-1-4 | Retained the unambiguous packaging-host wording. | Test `@claim:host-platform-package`; screenshot `qa-evidence/polish-2/live/home-cold-desktop.png`; live `/` says the binary is built on its packaging host. |
| F-1-5 | Retained “Use the order — Run jobs outside this CLI,” so the process strip does not imply execution. | Test `@claim:local-read-only-analysis`; screenshot `qa-evidence/polish-2/live/home-cold-mobile390.png`; live `/` passed. |
| F-1-6 | Retained destination-heading focus and polite announcements for forward, Back, and fragment navigation. | Test `route changes focus and announce the destination heading`; screenshot `qa-evidence/polish-2/live/home-cold-desktop.png`; live audit records Privacy, home, and contract focus restoration. |
| F-1-7 | Retained the 404 canonical, noindex, Open Graph, Twitter, product image, touch icon, and real response override. | Test `all public pages ship canonical and social metadata`; screenshot `qa-evidence/polish-2/live/404-cold-desktop.png`; live `/does-not-exist` returned HTTP 404 with the route title. |
| F-1-8 | Retained the dedicated Privacy and limits section after the workflow. | Tests `@claim:local-read-only-analysis`, `@claim:no-third-party-runtime-requests`, and `@claim:uncertain-lineage`; screenshot `qa-evidence/polish-2/live/home-cold-mobile390.png`; live `/privacy/` returned 200. |
| F-1-9 | Retained the direct “Input and output contract” heading. | Test `copy audit counts are accurate and catalog description is plain`; screenshot `qa-evidence/polish-2/live/home-cold-desktop.png`; live `/#contract` focused that heading. |
| F-1-10 | Retained “How the CLI reports uncertain lineage.” | Copy-audit contract test; screenshot `qa-evidence/polish-2/live/home-cold-mobile390.png`; live `/` returned 200. |
| F-1-11 | Retained “Install the CLI from source.” | Test `@claim:source-install`; screenshot `qa-evidence/polish-2/live/home-cold-mobile390.png`; live `/#install` resolved. |
| F-1-12 | Retained the factual label “Failure modes.” | Copy-audit contract test; screenshot `qa-evidence/polish-2/live/home-cold-desktop.png`; live `/` returned 200. |
| F-1-13 | Retained useful `v0.1.0` text in place of decorative brand lore. | Test `navigation and demo controls meet the 44px target and keep the wordmark intact`; screenshot `qa-evidence/polish-2/live/demo-cold-mobile390.png`; live routes passed. |
| F-1-14 | Retained the direct hero label “Local CLI.” | Copy-audit contract test; screenshot `qa-evidence/polish-2/live/home-cold-mobile390.png`; live `/` returned 200. |
| F-1-15 | Kept the decorative pixel measurement removed. | Copy-audit contract test; screenshot `qa-evidence/polish-2/live/home-cold-desktop.png`; live `/` has no measurement copy. |
| F-1-16 | Kept the decorative figure number removed and retained the useful caption. | Copy-audit contract test; screenshot `qa-evidence/polish-2/live/home-cold-desktop.png`; live `/` shows the plain caption. |
| F-1-17 | Retained “Try it with sample data” for both sample actions. | Test `recorded sample details work with keyboard`; screenshot `qa-evidence/polish-2/live/home-cold-mobile390.png`; both live actions resolve to `/demo/?demo=1`. |
| F-1-18 | Retained the visible result-naming control “Copy install command.” | Test `@claim:clipboard-commands`; screenshot `qa-evidence/polish-2/live/home-cold-desktop.png`; live clipboard test passed. |
| F-1-19 | Retained “Dependency order; cycles are rejected” on the landing page. | Tests `@claim:core-impact-card` and `@claim:uncertain-lineage`; screenshot `qa-evidence/polish-2/live/home-cold-mobile390.png`; live `/` returned 200. |
| F-1-20 | Retained the direct 404 explanation, “This page does not exist or may have moved.” | Test `demo and not-found pages are semantic and accessible`; screenshot `qa-evidence/polish-2/live/404-cold-desktop.png`; live unknown route returned HTTP 404. |
| F-1-21 | Retained the three plain exit-code sentences and “file or output-format error.” | Test `@claim:exit-codes`; screenshot `qa-evidence/polish-2/live/home-cold-desktop.png`; live documentation and repository link checks passed. |
| F-2-1 | Removed the unsupported price wording. The hero now says “License — MIT licensed,” and Terms says the software is provided under the MIT License. Updated the claim registry and test to validate those exact public statements and reject a future standalone “free” claim. | Test `@claim:mit-license ships the MIT license and labels public pages accurately`; screenshots `qa-evidence/polish-2/live/home-cold-mobile390.png` and `qa-evidence/polish-2/live/home-cold-desktop.png`; live `/` and `/terms/` contain the new wording, return 200, and exactly match the deployed build hashes. |

## Final evidence

- Clean clone: all 16 claim commands passed.
- Full suite: 13 Rust, 4 contract, and 43 Playwright tests passed; 5 intentional
  project-specific skips.
- Live route audit: zero console errors and zero serious/critical Axe findings.
- Live Lighthouse: 100 Performance, 100 Accessibility, 100 Best Practices, and
  100 SEO; LCP 0.9 s, CLS 0, TBT 30 ms.
- Distinct visual identity preserved: deep-navy drafting grid, cyan rules,
  vellum impact sheets, serif/monospace pairing, and original local artwork.

No finding remains open.
