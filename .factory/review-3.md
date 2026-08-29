# Adversarial first-read review 3 — PASS

Reviewed: 2026-08-29 UTC

Live URL: <https://data-change-impact-card.sociobot.in>

Candidate: `914ed1f0bc9896211b0a261ec89ec4de2d5bec62`

Contexts: fresh Chromium at 390×844 and 1440×900; clean clone at
`/tmp/dcic-review3-clean.F8ILzq/repo`

## Verdict

**PASS.** There are zero findings of any severity and no untested claim. The
first screen is clear, the one-click CLI demo shows a realistic completed result,
all 16 registered claim commands pass from a clean clone, and every earlier
finding remains fixed in both the live site and source.

## Cold first read

The answers were available before scrolling in both fresh contexts:

| Question | First-read answer | Exact visible text |
| --- | --- | --- |
| What does it do? | Traces a declared data change to stale assets and an order for recomputing them. | “Trace data changes before recomputing.” |
| For whom? | Data engineers. | “For data engineers, it lists stale assets, evidence paths, and a safe recomputation order from your declared lineage.” |
| What should I click first? | Open the bundled sample. | “Try it with sample data” and “Opens the bundled command and sample result.” |

At 390×844 the primary action and all three short facts are visible without
scrolling. The page has no horizontal overflow. At 1440×900 the primary action,
facts, and explanatory illustration are all visible.

## Findings

None.

## Copy audit

Counting method: whitespace-delimited words; punctuation-only tokens such as
`—` and `·` count because they are separated by spaces. Code blocks are not
sentences and are inventoried by purpose below. Every sentence is at most 22
words. No banned marketing adjective, unnecessary metaphor, mood heading,
unexplained slogan, inconsistent product term, or non-result-naming action was
found.

The domain terms `CLI`, `lineage`, `YAML`, `JSON`, and `topological order` are
appropriate for the named data-engineer audience. The landing page explains
their operational meaning with the sample card and uses the plainer “dependency
order” in its checklist.

### Landing-page sentences

| # | Location | Exact sentence | Words |
| ---: | --- | --- | ---: |
| 1 | Offline notice | Offline copy — the docs and recorded example still work. | 10 |
| 2 | Hero h1 | Trace data changes before recomputing. | 5 |
| 3 | Hero lead | For data engineers, it lists stale assets, evidence paths, and a safe recomputation order from your declared lineage. | 18 |
| 4 | Hero action hint | Opens the bundled command and sample result. | 7 |
| 5 | Hero image alt | A schema change connects to four data assets; two are stale and the last is verified. | 16 |
| 6 | Hero caption | One declared change, traced through known lineage. | 7 |
| 7 | Limits h2 | Know what the CLI does not do. | 7 |
| 8 | Limits | It reads only the files you name. | 7 |
| 9 | Limits | It makes no network request and runs no recompute command. | 10 |
| 10 | Limits | Every result depends on the lineage you supply. | 8 |
| 11 | Limits | Partial lineage stays marked for review. | 6 |
| 12 | Sample h2 | Review a sample impact card. | 5 |
| 13 | Sample | Run the bundled sample with `dcic demo`. | 7 |
| 14 | Sample | It writes an impact card in a temporary folder and prints the path. | 13 |
| 15 | Sample status | Sample: 1 change declared. | 4 |
| 16 | Sample change | `currency_code` became required. | 3 |
| 17 | Contract h2 | Input and output contract. | 4 |
| 18 | Contract | You declare what the tool may know. | 7 |
| 19 | Contract | Every card repeats whether lineage is complete or partial. | 9 |
| 20 | Contract | Missing dependencies stay visible. | 4 |
| 21 | Failure h2 | How the CLI reports uncertain lineage. | 6 |
| 22 | Partial lineage | The order is marked “review required.” | 6 |
| 23 | Partial lineage | Missing lineage never becomes a green check. | 7 |
| 24 | Cycle | The CLI exits with code 2 and names the cycle. | 10 |
| 25 | Cycle | It will not invent a safe order. | 7 |
| 26 | No impact | The card says “no impact” and still states input completeness, instead of producing an empty file. | 16 |
| 27 | Install h2 | Install the CLI from source. | 5 |
| 28 | Install | Build from source today. | 4 |
| 29 | Install | The release package includes the binary built on its packaging host. | 11 |
| 30 | Footer | Local impact cards for declared data lineage. | 7 |
| 31 | Footer | Version 0.1.0 · Built by Param Factory | 7 |

### Landing headings, labels, and controls

| Location | Exact copy | Words | Check |
| --- | --- | ---: | --- |
| Wordmark | Impact card; v0.1.0 | 3 | Useful name and version |
| Primary navigation | Demo; Manifest; Install; Privacy | 4 | Direct destinations |
| Hero label | Local CLI | 2 | Names the artifact |
| Hero actions | Try it with sample data; Install dcic | 7 | Result-naming verbs |
| Hero facts | Local reads named files; Read-only does not run jobs; License MIT licensed | 12 | Concrete facts |
| Process | Declare version changes; Trace known descendants; Review cost + unknowns; Use the order; Run jobs outside this CLI | 18 | Direct steps |
| Limits | Privacy and limits; Read the privacy details | 7 | Contextual and actionable |
| Sample | Sample output / bundled fixture | 5 | Names the section |
| Sample tabs/actions | Command; Manifest; JSON; Try it with sample data; Copy command | 10 | Controls identify their results |
| Sample card | Impact card / 2026-08-28; orders.v42; Ready | 6 | Concrete sample state |
| Sample facts | Changed 1 source; Stale 2 assets; Estimate 7 min; Unknown 0 edges | 12 | Numeric outcomes |
| Sample labels | Upstream change; Safe recompute order; Lineage complete; Generated locally | 9 | Names card fields |
| Contract | Open contract / schema v1 | 5 | Names schema and version |
| Contract facts | YAML or JSON in, Markdown or JSON out | 8 | Concrete formats |
| Contract fact | Dependency order; cycles are rejected | 5 | Concrete behavior |
| Contract fact | Stable aliases for redacted exports | 5 | Concrete behavior |
| Contract fact | Known-minute total and missing estimates | 5 | Concrete output |
| Failure section | Failure modes | 2 | Direct section name |
| Failure cards | Partial manifest; Cycle detected; No downstream impact | 7 | Direct states |
| Install label/control | MIT licensed / v0.1.0; Copy install command | 7 | Concrete status and result |
| Footer navigation | Demo; Privacy; Terms; GitHub | 4 | Direct destinations |

### README sentences

| # | Exact sentence | Words |
| ---: | --- | ---: |
| 1 | `dcic` turns declared lineage and version changes into a reviewable impact card. | 12 |
| 2 | For data engineers, it lists stale downstream assets, their evidence paths, and their declared recomputation order. | 16 |
| 3 | It reports incomplete lineage for review and never runs a recomputation command. | 12 |
| 4 | Run the one-command demo before using your own files. | 9 |
| 5 | It writes bundled `lineage.yaml`, `changes.yaml`, and `impact.md` into a unique temporary `dcic-demo-*` directory, then prints the exact impact-card path. | 19 |
| 6 | The demo does not read your project or run a job. | 11 |
| 7 | See `examples/` and `.factory/demo.md` for the bundled sample and sandbox rules. | 11 |
| 8 | Build the single executable from source. | 6 |
| 9 | The release package contains the binary built on its packaging host. | 11 |
| 10 | Create `lineage.yaml`. | 2 |
| 11 | Then describe only the changes you intend to assess in `changes.yaml`. | 11 |
| 12 | Emit a Markdown card. | 4 |
| 13 | Emit machine-readable JSON or write a redacted card for a ticket. | 11 |
| 14 | The default format is Markdown. | 5 |
| 15 | `--format json` and `--json` are equivalent. | 6 |
| 16 | Either input may be `-` for stdin, but not both. | 10 |
| 17 | A partial manifest, a missing dependency, or a changed node absent from the manifest produces a review-required card. | 18 |
| 18 | Redaction replaces node identifiers with stable `NODE-001` aliases and omits free-text change summaries. | 13 |
| 19 | Exit code `0` means success. | 5 |
| 20 | Exit code `1` means a file or output-format error. | 9 |
| 21 | Exit code `2` means invalid manifest or change data. | 9 |
| 22 | Run `dcic --help` or `dcic analyze --help` for all options. | 10 |
| 23 | Both files accept YAML or JSON, selected from the filename or parsed automatically for stdin. | 15 |
| 24 | Node identifiers must be unique and non-empty. | 7 |
| 25 | A cycle is rejected. | 4 |
| 26 | Missing dependencies and changes naming an absent node are reported as unknown edges. | 13 |
| 27 | The output JSON has `schema_version: 1`. | 6 |
| 28 | Impacted nodes follow topological order and evidence is sorted. | 9 |
| 29 | Public behavior claims and their regression commands are declared in `.factory/claims.json`. | 11 |
| 30 | The factory deploys `dist/site/` as the static site. | 8 |
| 31 | `npm run pack:cli` prepares the crate and host-platform binary in `dist/package/`; publishing is not done from this repository. | 18 |
| 32 | The CLI runs the supplied analysis locally and does not execute declared recompute commands. | 14 |
| 33 | The static site has no analytics, cookies, accounts, or third-party runtime requests. | 12 |
| 34 | Its public shell can remain available offline after the first visit. | 11 |
| 35 | See the site’s privacy and terms pages for the public policy. | 11 |
| 36 | MIT. | 1 |
| 37 | See `LICENSE`. | 2 |

README headings are “Data Change Impact Card” (4), “Try the bundled sample”
(4), “Install” (1), “Usage” (1), “Input contract” (2), “Develop and verify”
(3), “Deploy” (1), “Privacy and security” (3), and “License” (1). “Live
documentation” (2) is a direct link label. The fenced blocks contain the demo,
install, YAML, analysis, and verification commands; they contain no prose
sentence omitted from the table.

## Demo and sandbox

- One click from the hero reaches `/demo/?demo=1` on phone and desktop.
- The first 390×844 viewport includes the persistent demo banner, recorded
  `dcic demo` command, `raw.orders v41 → v42`, 2 stale assets, 7 known minutes,
  0 unknown edges, and the generated `orders.v42` card.
- **Reset demo** returns to the canonical finished-result anchor. The demo is an
  immutable recording, so there is no editable browser state to retain.
  **Start for real** returns to `/`.
- A `real:sentinel` localStorage value planted before entering the demo remained
  unchanged after entering, resetting, and leaving it. The demo itself created
  no cookies, localStorage, sessionStorage, or IndexedDB data.
- The service worker cached only same-origin public documentation assets. A
  live request log across home, demo, privacy, terms, and 404 contained only
  `https://data-change-impact-card.sociobot.in` requests.
- With the browser set offline after a first load, `/demo/?demo=1` reloaded with
  status 200, the correct title, result, and demo banner.
- Running the built `dcic demo` from `/tmp` created a unique
  `/tmp/dcic-demo-*` directory, printed the `impact.md` path and 2/7/0 result,
  and did not write into the working directory.

## Claims

All exact commands in `.factory/claims.json` were run separately after `npm ci`
in the clean clone. Every command exited 0.

| Claim id | Result | Observable coverage checked |
| --- | --- | --- |
| `bundled-cli-demo` | Pass | Two unique temp runs, three bundled files, output path/result, untouched bait project, and browser demo |
| `offline-docs` | Pass | New context, first load, offline demo reload, and offline home reload |
| `no-third-party-runtime-requests` | Pass | Every public route, same-origin request log, cookies, web storage, IndexedDB, and cache origins |
| `core-impact-card` | Pass | Stale assets, evidence sorting, dependency order, minutes, missing estimates, and no-impact completeness |
| `input-output-contract` | Pass | YAML/JSON input, JSON output, Markdown output, stable redaction aliases, and removed private text |
| `uncertain-lineage` | Pass | Missing edge, partial rendered card, review disposition, exit 2, and named cycle nodes |
| `local-read-only-analysis` | Pass | Named inputs, no command execution, only requested output write, and no network/process dependency |
| `mit-license` | Pass | License file, Cargo metadata, landing/terms wording, and absence of a standalone price claim |
| `host-platform-package` | Pass | Release archive contains the current host binary |
| `source-install` | Pass | Documented command installs and runs from an unrelated clean prefix |
| `format-alias` | Pass | `--format json` and `--json` return equivalent parsed output |
| `stdin-input` | Pass | Either single stdin works and dual stdin exits 2 |
| `exit-codes` | Pass | Success, missing file, output error, and invalid input return 0/1/2 as documented |
| `help-output` | Pass | Root commands and all documented analyze options appear |
| `node-id-validation` | Pass | Empty and duplicate identifiers are rejected with exit 2 |
| `clipboard-commands` | Pass | Both copied values, success announcements, and manual-copy recovery |

The live landing, demo, privacy, terms, and README copy was cross-checked against
the registry after the tests. Every claim-like statement maps to one of these
entries; there is no unlisted or untested claim.

## Earlier findings rechecked

Every earlier review, polish report, and handoff was read. Each prior finding
was checked in the live UI and corresponding source or test.

| Earlier id | Current verification |
| --- | --- |
| F-1-1 | Fixed: the phone's first demo viewport shows the command, changed node, 2/7/0 result, and generated card. |
| F-1-2 | Fixed: 16 unique claim entries each have one tagged test; every exact command passed from the clean clone. |
| F-1-3 | Fixed: the image alternative is 16 words in live DOM and source. |
| F-1-4 | Fixed: live landing and README both use the unambiguous “packaging host” wording. |
| F-1-5 | Fixed: step four says “Use the order — Run jobs outside this CLI.” |
| F-1-6 | Fixed: Home → Privacy, Back, Forward, and `/#contract` focus and announce the destination heading. |
| F-1-7 | Fixed: the designed 404 has canonical, noindex, OG/Twitter metadata, icons, product art, and an actual 404 response for unknown URLs. |
| F-1-8 | Fixed: “Privacy and limits” appears immediately after the workflow. |
| F-1-9 | Fixed: the heading is “Input and output contract.” |
| F-1-10 | Fixed: the heading is “How the CLI reports uncertain lineage.” |
| F-1-11 | Fixed: the heading is “Install the CLI from source.” |
| F-1-12 | Fixed: the label is “Failure modes.” |
| F-1-13 | Fixed: the wordmark shows useful version `v0.1.0`; `spec / 01` is absent. |
| F-1-14 | Fixed: the hero label is “Local CLI”; the decorative plan number is absent. |
| F-1-15 | Fixed: the decorative pixel measurement is absent. |
| F-1-16 | Fixed: the decorative figure number is absent; the useful caption remains. |
| F-1-17 | Fixed: both sample links say “Try it with sample data.” |
| F-1-18 | Fixed: the visible control says “Copy install command.” |
| F-1-19 | Fixed: the landing checklist says “Dependency order; cycles are rejected.” |
| F-1-20 | Fixed: the 404 says “This page does not exist or may have moved.” |
| F-1-21 | Fixed: README uses three short exit-code sentences and “file or output-format error.” |
| F-2-1 | Fixed: the unsupported “Free” price wording is absent; public copy states only the tested MIT license. |

No earlier finding is unfixed, half-fixed, or regressed.

## Structure, accessibility, and identity

- `/`, `/demo/?demo=1`, `/privacy/`, and `/terms/` return 200. An unknown path
  returns the designed 404 with status 404 and a visible Return home action.
- Every route has `lang=en`, one h1, main/header/footer landmarks, a route title,
  a description under 155 characters, canonical URL, Open Graph/Twitter data,
  product-specific 1200×630 image, SVG favicon, and 180×180 touch icon.
- `robots.txt` and `sitemap.xml` are live. The sitemap lists every public route.
- Every crawled internal link and the GitHub link returned 200. The deliberate
  unknown-path request was the only browser console network error.
- Live forward, Back, and deep-link navigation restore focus and update the
  polite route announcement. The 390px pages have no horizontal overflow.
- Axe found zero serious or critical violations on home, demo, privacy, terms,
  direct 404, and unknown-path 404. Keyboard tab behavior, visible focus,
  44-pixel controls, reduced motion, and semantic landmarks are covered by the
  passing browser suite.
- `verify-url.sh` passed: HTTPS 200, title, `lang`, one h1, main, image alt text,
  labeled buttons, and zero console errors. Live load time in that check was
  563 ms.
- The deployed security headers include CSP as a response header,
  `frame-ancestors 'none'`, `nosniff`, Referrer-Policy, Permissions-Policy, and
  HSTS. The shipped JavaScript is 4.71 kB raw / 1.97 kB gzip.
- The navy drafting grid, vellum result sheet, cyan/amber/coral marks,
  serif/monospace pairing, and original local illustration match
  `.factory/design.md`. The layout is recognizably product-specific and is not
  a generic centered SaaS hero or feature-card template.

## Quality gates

- `npm test`: pass — 13 Rust tests, 4 contract tests, 43 Playwright passes, and
  5 intentional project-specific skips.
- `npm run build`: pass — CLI, static site, crate, and host package emitted
  under `dist/`.
- `PLAYWRIGHT_BASE_URL=https://data-change-impact-card.sociobot.in npx playwright test`:
  pass — 43 passes and 5 intentional project-specific skips.
- All 16 clean-clone claim commands: pass.

## Missed leverage

No missing AI, import/export, or sync feature is implied by the brief. The core
job is deterministic local graph analysis; runtime AI or production sync would
weaken the stated read-only boundary. YAML/JSON input, Markdown/JSON output,
stable redaction, and a host package already cover the obvious exchange needs.
No provider key or decorative AI feature is present.

## What would make this perfect

Nothing remains to change under this review contract. Preserve the current
copy, demo isolation, claim registry, route behavior, and regression coverage.
