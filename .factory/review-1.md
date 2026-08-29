# Adversarial first-read review 1 — FAIL

Reviewed: 2026-08-29 UTC  
Live URL: <https://data-change-impact-card.sociobot.in>  
Candidate: `5d5f1257736906a738543538764703e2c4ea8f69`  
Viewports: fresh Chromium contexts at 390×844 and 1440×900

## Verdict

**FAIL.** The cold landing screen is clear, the CLI works, all nine registered
claim commands pass, and the site has a distinct visual identity. The required
one-click demo does not show the product result in its first screen. The public
claim registry also still leaves specific CLI behavior unlisted or only partly
asserted. Those are blocking under this review contract. There are 21 findings
in total.

## Cold first read, before scrolling

The answer was the same at 390×844 and 1440×900:

- What it does: traces a declared upstream data change to stale assets and a
  recomputation order.
- For whom: data engineers.
- What to click first: **Try it with sample data**.

The exact first-screen copy that supplied those answers was “Trace data changes
before recomputing,” “For data engineers…,” and “Try it with sample data.” This
gate passes. The mobile action appeared at y=410 and the desktop action at
y=551, without scrolling.

## Findings

### Blocking

#### F-1-1 — The one-click demo opens instructions, not the product in use

- Exact location: `/demo/?demo=1`, first 844/900 pixels after activating
  **Try it with sample data**.
- Exact copy shown: “Run sample lineage data,” `dcic demo`, and “What the sample
  does.” The realistic result (“2 stale assets, 7 known minutes, 0 unknown
  edges”) and the impact card are below the first viewport.
- Why this fails: a visitor has clicked “Try it,” but receives a command to run
  later. No realistic input, terminal run, or generated card is visible on the
  first screen. This also regresses the earlier handoff/verification assertion
  that the first demo screen shows the two-stale-asset result.
- Concrete fix: place a captioned recording of the real `dcic demo` run and its
  generated impact card immediately below the persistent demo banner. Keep the
  command, sample input, two stale assets, seven-minute order, and zero unknown
  edges visible at 390×844 without another action or scroll. Move instructions
  after that result. Add a viewport assertion for the result and card.

#### F-1-2 — The earlier “all public claims are registered” repair is incomplete

- Exact locations and uncovered statements:

  | Location | Public statement | Missing proof |
  | --- | --- | --- |
  | Landing install; README Install | “Build from source today.” / “Build the single executable from source.” | No registered clean-consumer install claim tests the displayed `cargo install --git …` command. |
  | README Usage | “`--format json` and `--json` are equivalent.” | No claim entry or tagged assertion. |
  | README Usage | “Either input may be `-` for stdin, but not both.” | No claim entry or tagged assertion for single and dual stdin. |
  | README Usage | “Exit codes are `0` for success, `1` for file or serialization errors, and `2` for invalid manifest or change data.” | No registered test asserts the complete exit-code table. |
  | README Usage | “Run `dcic --help` or `dcic analyze --help` for all options.” | No claim entry or tagged assertion. |
  | README Input contract | “Node identifiers must be unique and non-empty.” | No claim entry or tagged assertion. |
  | README Input contract | “Impacted nodes follow topological order and evidence is sorted.” | `core-impact-card` checks one path and one order, not evidence sorting. |
  | Landing contract | “Known-minute total and missing estimates.” | `core-impact-card` checks the known total, not a missing estimate. |
  | Landing failure mode | “The CLI exits with code 2 and names the cycle.” | `uncertain-lineage` checks `/cycle/i`, not that the cycle's node names are printed. |
  | Landing/README | “Stable aliases for redacted exports.” | `input-output-contract` checks one `NODE-001`, not stability across repeated exports. |
  | Landing | “Every card repeats whether lineage is complete or partial. Missing dependencies stay visible.” | The tagged claim tests do not assert a rendered partial card with its completeness and missing dependency. |
  | README demo | “It writes bundled `lineage.yaml`, `changes.yaml`, and `impact.md` into a unique temporary `dcic-demo-*` directory…” and “The demo does not read your project…” | `bundled-cli-demo` runs from the repository, once, and asserts only `impact.md`; it does not prove two unique runs, both input files, or isolation from a bait project. |
  | README/privacy scope | “The static site has no analytics, cookies, accounts, or third-party runtime requests.” | The tagged test observes only `/demo`; it does not visit the scripted home page and all public routes. |
  | Claims entry `input-output-contract` | “Accepts YAML or JSON input…” | Its tagged test supplies JSON only. YAML happens to be exercised by a different claim test, not this claim's test. |

- Why this fails: verification 2 previously classified incomplete public-claim
  registration as a blocker. Nine broad entries were added, but their tagged
  tests do not cover all observable details still stated publicly. Passing test
  names are not evidence for assertions the tests never make.
- Concrete fix: remove the extra statements or add narrowly worded entries and
  one tagged sandbox test per entry. The demo test must run the packaged CLI
  from an unrelated temporary working directory. The privacy test must record
  requests and storage across every public route.

#### F-1-3 — The completed copy audit miscounts a 23-word sentence as 22

- Exact location: landing hero image alt text and
  `.factory/copy-audit.md`: “A coral schema change slip connects across a
  blueprint to four layered data asset cards, two stamped stale and the last
  stamped verified.”
- Why this fails: it contains 23 whitespace-delimited words, above the hard cap.
  The existing audit records 22 and marks it Pass. This makes the earlier
  incomplete-copy-audit repair only partial.
- Concrete fix: use “A schema change connects to four data assets; two are
  stale and the last is verified.” (15 words), then regenerate the count.

#### F-1-4 — The host-platform repair remains ambiguous on the live page

- Exact location: landing Install section: “The release package includes the
  binary built on this system.” README says “its packaging host.”
- Why this fails: on a static public page, “this system” can mean the visitor's
  device or the web host. It does not state the tested packaging-host behavior
  and is inconsistent with the README. The earlier unsupported-platform repair
  is therefore only half-fixed.
- Concrete fix: use the README sentence verbatim: “The release package includes
  the binary built on its packaging host.”

### Major

#### F-1-5 — The process strip implies that the read-only CLI recomputes data

- Exact location: landing process strip: “Recompute — In safe order.”
- Why this fails: the same first screen says “does not run jobs,” and the Terms
  say the tool does not execute recomputation. The process strip can be read as
  a fourth product action.
- Concrete fix: change it to “Use the order — Run jobs outside this CLI.”

#### F-1-6 — Route changes do not move focus to the new page heading

- Exact location: Home → Privacy, Privacy → Back, and direct `/#contract`.
- Evidence: after navigation and after Back, `document.activeElement` was
  `<body>`. No route-announcement live region exists on demo, privacy, terms, or
  404.
- Why this fails: keyboard and screen-reader users receive no programmatic cue
  that the page changed, despite the routing contract requiring heading focus
  and an announcement. URLs, deep links, scroll restoration, and Back otherwise
  work.
- Concrete fix: focus a `tabindex="-1"` h1 after document load/navigation and
  announce its text in a polite live region. Add forward/back focus tests.

#### F-1-7 — The designed 404 omits required canonical and social metadata

- Exact location: live `/does-not-exist` / `site/404.html`.
- Evidence: HTTP 404, title, description, h1, main, favicon, and footer exist;
  canonical, `og:title`, `og:image`, and Twitter card metadata are absent.
- Why this fails: route metadata is inconsistent, and shared 404 URLs lose the
  product's preview identity.
- Concrete fix: add a noindex canonical for `/404.html`, route-specific OG and
  Twitter title/description, and the existing 1200×630 product image. Extend
  `tests/site-contract.mjs` to include the 404.

#### F-1-8 — The landing skeleton has no plain privacy/limitations section

- Exact location: landing order after “How the tool works.” The page proceeds
  through sample, contract, failure modes, and install; privacy is only a header
  link and terse hero facts.
- Why this fails: the standard skeleton calls for a dedicated “what it does not
  do / privacy” section before pricing/install. A first-time visitor must leave
  the page to see the local-storage/network boundary.
- Concrete fix: add “Privacy and limits” after the workflow: reads named files,
  makes no network request, runs no recompute command, and depends on supplied
  lineage completeness. Link to Privacy for details.

### Minor copy and presentation

#### F-1-9 — “Small inputs. Explicit claims.” does not name its section

- Location: landing h2 above the manifest contract.
- Fix: “Input and output contract.”

#### F-1-10 — “Uncertainty stays on the page.” is a mood heading

- Location: landing failure section h2.
- Fix: “How the CLI reports uncertain lineage.”

#### F-1-11 — “Add one read-only step before the expensive one.” hides the install section

- Location: landing install h2.
- Fix: “Install the CLI from source.”

#### F-1-12 — “Honest failure modes” uses a self-awarded marketing adjective

- Location: landing failure-section label.
- Fix: “Failure modes.”

#### F-1-13 — “spec / 01” is decorative brand lore

- Location: wordmark on every route.
- Fix: remove it or replace it with the useful version, “v0.1.0.”

#### F-1-14 — “/ change plan 01” is decorative numbering

- Location: landing hero label, after “Local-first CLI.”
- Fix: keep only “Local CLI.”

#### F-1-15 — “000 — 1200 px” is decorative measurement copy

- Location: visible annotation above the hero illustration.
- Fix: remove it; the illustration caption already explains the asset.

#### F-1-16 — “Fig. 01” is an unnecessary decorative label

- Location: hero illustration caption.
- Fix: use only “One declared change, traced through known lineage.”

#### F-1-17 — The sample action uses two different labels

- Exact locations: hero “Try it with sample data”; recorded example “Try sample
  data.”
- Why this fails: the same destination has inconsistent action copy.
- Fix: use “Try it with sample data” in both places.

#### F-1-18 — “Copy” does not name the result

- Location: visible install command button; only its accessible label says
  “Copy install command.”
- Fix: make the visible label “Copy install command.”

#### F-1-19 — “Topological order” is avoidable landing-page jargon

- Location: landing contract checklist.
- Fix: “Dependency order; cycles are rejected.” Keep “topological” in the
  technical README if needed.

#### F-1-20 — The 404 explanation uses the drafting metaphor instead of the error

- Exact location: 404: “The requested drafting sheet is not in this set.”
- Fix: “This page does not exist or may have moved.”

#### F-1-21 — “Serialization errors” is avoidable README jargon

- Location: README exit-code sentence.
- Fix: “Exit code `1` means a file or output-format error.” Keep the other exit
  codes as separate short sentences.

## Copy audit

Counting method: whitespace-delimited words; Markdown punctuation and inline
code markers do not add words. Commands and YAML/JSON blocks are code, not
sentences. All rendered prose sentences are listed below. Headings, labels, and
controls are inventoried separately because they are fragments rather than
sentences. The only sentence over 22 words is the hero image alt text.

### Landing-page sentences

| # | Sentence | Words | Result |
| ---: | --- | ---: | --- |
| 1 | Trace data changes before recomputing. | 5 | Pass |
| 2 | For data engineers, it lists stale assets, evidence paths, and a safe recomputation order from your declared lineage. | 18 | Pass |
| 3 | Opens the bundled command and sample result. | 7 | Pass |
| 4 | A coral schema change slip connects across a blueprint to four layered data asset cards, two stamped stale and the last stamped verified. | 23 | **Flag F-1-3** |
| 5 | One declared change, traced through known lineage. | 7 | Pass |
| 6 | Run the bundled sample with `dcic demo`. | 7 | Pass |
| 7 | It writes an impact card in a temporary folder and prints the path. | 13 | Pass |
| 8 | Sample: 1 change declared. | 4 | Pass |
| 9 | `currency_code` became required. | 3 | Pass |
| 10 | You declare what the tool may know. | 7 | Pass |
| 11 | Every card repeats whether lineage is complete or partial. | 9 | Claim flag F-1-2 |
| 12 | Missing dependencies stay visible. | 4 | Claim flag F-1-2 |
| 13 | The order is marked “review required.” | 6 | Pass |
| 14 | Missing lineage never becomes a green check. | 7 | Pass |
| 15 | The CLI exits with code 2 and names the cycle. | 10 | Claim flag F-1-2 |
| 16 | It will not invent a safe order. | 7 | Pass |
| 17 | The card says “no impact” and still states input completeness, instead of producing an empty file. | 16 | Pass |
| 18 | Build from source today. | 4 | Claim flag F-1-2 |
| 19 | The release package includes the binary built on this system. | 10 | **Flag F-1-4** |
| 20 | Local impact cards for declared data lineage. | 7 | Pass |
| 21 | Version 0.1.0 · Built by Param Factory. | 6 | Pass |

### Landing headings, controls, labels, and status fragments

| Location | Copy | Words | Result |
| --- | --- | ---: | --- |
| Wordmark | Impact card | 2 | Pass |
| Wordmark | spec / 01 | 2 | **Flag F-1-13** |
| Header nav | Demo; Manifest; Install; Privacy | 4 | Pass |
| Hero label | Local-first CLI / change plan 01 | 5 | **Flag F-1-14** |
| Hero action | Try it with sample data | 5 | Pass |
| Hero action | Install dcic | 2 | Pass |
| Hero facts | Local — reads named files; Read-only — does not run jobs; Free — MIT licensed | 13 | Pass |
| Hero decoration | 000 — 1200 px | 3 | **Flag F-1-15** |
| Hero caption label | Fig. 01 | 2 | **Flag F-1-16** |
| Process | Declare — Version changes | 3 | Pass |
| Process | Trace — Known descendants | 3 | Pass |
| Process | Review — Cost + unknowns | 3 | Pass |
| Process | Recompute — In safe order | 4 | **Flag F-1-5** |
| Demo label | Sample output / bundled fixture | 4 | Pass |
| Demo h2 | Review a sample impact card | 5 | Pass |
| Tabs | Command; Manifest; JSON | 3 | Pass |
| Demo action | Try sample data | 3 | **Flag F-1-17** |
| Demo action | Copy command | 2 | Pass |
| Card | Impact card / 2026-08-28; orders.v42; Ready | 5 | Pass |
| Card summary | Changed 1 source; Stale 2 assets; Estimate 7 min; Unknown 0 edges | 12 | Pass |
| Card labels | Upstream change; Safe recompute order; Lineage complete; Generated locally | 9 | Pass |
| Contract label | Open contract / schema v1 | 5 | Pass |
| Contract h2 | Small inputs. Explicit claims. | 4 | **Flag F-1-9** |
| Contract items | YAML or JSON in, Markdown or JSON out | 8 | Pass |
| Contract item | Topological order with cycle rejection | 5 | **Flag F-1-19** |
| Contract item | Stable aliases for redacted exports | 5 | Claim flag F-1-2 |
| Contract item | Known-minute total and missing estimates | 5 | Claim flag F-1-2 |
| Failure label | Honest failure modes | 3 | **Flag F-1-12** |
| Failure h2 | Uncertainty stays on the page | 5 | **Flag F-1-10** |
| Failure cards | Partial manifest; Cycle detected; No downstream impact | 7 | Pass |
| Install label | MIT licensed / v0.1.0 | 4 | Pass |
| Install h2 | Add one read-only step before the expensive one | 9 | **Flag F-1-11** |
| Install action | Copy | 1 | **Flag F-1-18** |
| Footer nav | Demo; Privacy; Terms; GitHub | 4 | Pass |

No banned words from the attached plain-words list appear in the landing copy.

### README sentences

| # | Sentence | Words | Result |
| ---: | --- | ---: | --- |
| 1 | `dcic` turns declared lineage and version changes into a reviewable impact card. | 12 | Pass |
| 2 | For data engineers, it lists stale downstream assets, their evidence paths, and their declared recomputation order. | 16 | Pass |
| 3 | It reports incomplete lineage for review and never runs a recomputation command. | 12 | Pass |
| 4 | Live documentation. | 2 | Pass |
| 5 | Run the one-command demo before using your own files. | 9 | Pass |
| 6 | It writes bundled `lineage.yaml`, `changes.yaml`, and `impact.md` into a unique temporary `dcic-demo-*` directory, then prints the exact impact-card path. | 19 | Claim flag F-1-2 |
| 7 | The demo does not read your project or run a job. | 11 | Claim flag F-1-2 |
| 8 | See `examples/` and `.factory/demo.md` for the bundled sample and sandbox rules. | 11 | Pass |
| 9 | Build the single executable from source. | 6 | Claim flag F-1-2 |
| 10 | The release package contains the binary built on its packaging host. | 11 | Pass |
| 11 | Create `lineage.yaml`. | 2 | Pass |
| 12 | Then describe only the changes you intend to assess in `changes.yaml`. | 11 | Pass |
| 13 | Emit a Markdown card. | 4 | Pass |
| 14 | Emit machine-readable JSON or write a redacted card for a ticket. | 11 | Pass |
| 15 | The default format is Markdown. | 5 | Pass |
| 16 | `--format json` and `--json` are equivalent. | 6 | Claim flag F-1-2 |
| 17 | Either input may be `-` for stdin, but not both. | 10 | Claim flag F-1-2 |
| 18 | A partial manifest, a missing dependency, or a changed node absent from the manifest produces a review-required card. | 18 | Pass |
| 19 | Redaction replaces node identifiers with stable `NODE-001` aliases and omits free-text change summaries. | 13 | Claim flag F-1-2 |
| 20 | Exit codes are `0` for success, `1` for file or serialization errors, and `2` for invalid manifest or change data. | 20 | **Flags F-1-2, F-1-21** |
| 21 | Run `dcic --help` or `dcic analyze --help` for all options. | 10 | Claim flag F-1-2 |
| 22 | Both files accept YAML or JSON, selected from the filename or parsed automatically for stdin. | 15 | Claim flag F-1-2 |
| 23 | Node identifiers must be unique and non-empty. | 7 | Claim flag F-1-2 |
| 24 | A cycle is rejected. | 4 | Pass |
| 25 | Missing dependencies and changes naming an absent node are reported as unknown edges. | 13 | Pass |
| 26 | The output JSON has `schema_version: 1`. | 6 | Pass |
| 27 | Impacted nodes follow topological order and evidence is sorted. | 9 | Claim flag F-1-2 |
| 28 | Public behavior claims and their regression commands are declared in `.factory/claims.json`. | 11 | **Contradicted by F-1-2** |
| 29 | The factory deploys `dist/site/` as the static site. | 8 | Procedure |
| 30 | `npm run pack:cli` prepares the crate and host-platform binary in `dist/package/`; publishing is not done from this repository. | 18 | Procedure |
| 31 | The CLI runs the supplied analysis locally and does not execute declared recompute commands. | 14 | Pass |
| 32 | The static site has no analytics, cookies, accounts, or third-party runtime requests. | 12 | Claim coverage flag F-1-2 |
| 33 | Its public shell can remain available offline after the first visit. | 11 | Pass |
| 34 | See the site’s privacy and terms pages for the public policy. | 11 | Pass |
| 35 | MIT. | 1 | Pass |
| 36 | See `LICENSE`. | 2 | Pass |

README headings are direct and contextual: Data Change Impact Card; Try the
bundled sample; Install; Usage; Input contract; Develop and verify; Deploy;
Privacy and security; License. No README sentence exceeds 22 words and no
banned marketing word appears. “Serialization errors” is the one avoidable
jargon flag.

## Demo and sandbox evidence

- One click reaches `/demo/?demo=1` on both viewports.
- The persistent banner says “Demo — sample data, nothing is saved” and exposes
  Reset demo and Start for real.
- Reset returns to `/demo/?demo=1#sample`; Start for real returns to `/` and
  removes the banner.
- Cookies, localStorage, and sessionStorage remain empty.
- Live request logs for home and demo contain only
  `data-change-impact-card.sociobot.in` requests.
- After one online visit, fresh-context offline reloads of `/demo/?demo=1` and
  `/` both return the correct cached page; the home offline notice appears.
- Running `/work/repo/target/debug/dcic demo` and `dcic --demo` from the empty
  temporary working directory `/tmp/dcic-review-1-demo-cwd.ilCaol` leaves that
  directory untouched. Two runs created different `/tmp/dcic-demo-*`
  directories. Each contained `lineage.yaml`, `changes.yaml`, and `impact.md`
  and reported 2 stale assets, 7 known minutes, and 0 unknown edges.

The executable sandbox behavior itself passes. F-1-1 concerns what the claimed
one-click web demo shows, and F-1-2 concerns the permanent automated proof.

## Registered claims

All commands were run verbatim after `npm ci` in fresh clone
`/tmp/dcic-review-1-claims.vPQkA2/repo`.

| Claim | Result | Observable evidence |
| --- | --- | --- |
| `bundled-cli-demo` | PASS — 2 tests | CLI produced an impact path and READY card; demo controls exist. Coverage gap: F-1-2. |
| `offline-docs` | PASS — 1 passed, 1 intentional project skip | Cached home and demo loaded offline. |
| `no-third-party-runtime-requests` | PASS — 2 tests | Demo requests were same-origin and browser key/value storage was empty. Coverage gap: F-1-2. |
| `core-impact-card` | PASS — 2 tests | Two expected stale nodes, evidence path, seven minutes, correct order, and no-impact output. |
| `input-output-contract` | PASS — 2 tests | JSON input/output and redacted default Markdown worked. Coverage gaps: YAML and alias stability in F-1-2. |
| `uncertain-lineage` | PASS — 2 tests | Missing changed node required review; partial lineage required review; cycle returned code 2. Coverage gap: named cycle in F-1-2. |
| `local-read-only-analysis` | PASS — 2 tests | A declared `touch` command was printed and not executed. |
| `mit-license` | PASS — 2 tests | Shipped LICENSE contains “MIT License.” |
| `host-platform-package` | PASS — 1 passed, 1 intentional project skip | Packaging produced the current `linux-x64` binary. Copy issue: F-1-4. |

No listed command failed. F-1-2 records public details that remain unlisted or
are not asserted by the tagged test assigned to the broader claim.

## History verification

No earlier `.factory/review-*.md` or `.factory/polish-*.md` files exist. The
earlier handoff and its referenced verification findings were checked against
the live site and code.

| Earlier item | Current result |
| --- | --- |
| Undeclared changed node must require review | Fixed. Registered claim and full tests pass. |
| Public claims must be registered and claim-tested | **Half-fixed; blocking again as F-1-2.** Registry expanded from 3 to 9, but specific public behavior remains unlisted or unasserted. |
| Offline demo URL must return the demo page | Fixed. Confirmed live in a fresh offline context. |
| 44×44px targets | Fixed. No visible home/demo link or button measured below 44×44 at either viewport. |
| Broken wordmark | Fixed. The mark remains 44×44 and does not wrap. |
| Unsupported cross-platform package wording | **Half-fixed; blocking again as F-1-4.** The three-platform claim is gone, but the live wording is still ambiguous and differs from README. |
| Incomplete copy audit | **Half-fixed; blocking again as F-1-3 and copy findings F-1-9–F-1-19.** The landing inventory expanded, but it miscounts the over-cap alt text and passes non-informative headings. |
| `node_modules` files in the crate | Fixed. Host-package claim produced the intended 18-file crate. |

## Structure, links, accessibility, and identity

Confirmed passing:

- `/`, `/demo/`, `/privacy/`, and `/terms/` return 200; an unknown route returns
  a designed HTTP 404.
- Every route has `lang=en`, one h1, main/header/footer landmarks, a descriptive
  title, description, favicon, and apple-touch icon. Public 200 routes have
  canonical, OG, Twitter, and the 1200×630 product social image.
- Every internal link and fragment resolves; the GitHub link returns 200.
  `robots.txt`, `sitemap.xml`, favicon, touch icon, and social image return 200.
- Deep links reach the requested section and Back restores the route and scroll
  vicinity. F-1-6 covers focus, not URL/history failure.
- Required security headers are live. Home has no page or console errors.
- The URL verifier passes. Axe reports zero serious/critical violations on
  home, demo, privacy, terms, and 404 at desktop and mobile sizes.
- No visible tested target is below 44×44px. The 390px pages do not overflow.
- Initial JS is 3.35KB raw / 1.51KB gzip.
- The navy drafting-sheet layout, vellum impact card, cyan rules, typography,
  original illustration, and restrained motion are distinct and match
  `.factory/design.md`; this is not a generic SaaS template.

Failures are F-1-6 through F-1-8 and F-1-20.

## Missed leverage

No additional AI feature, sync, or import/export finding is warranted. The job
is deterministic graph traversal; runtime AI would weaken trust. YAML/JSON
import and Markdown/JSON export already cover the brief's obvious exchange
paths. Production sync would conflict with the “do not connect to production by
default” constraint.

## Quality-gate evidence

- `npm test`: PASS — 13 Rust tests, 2 contract tests, 27 browser tests, 3
  intentional project skips.
- `npm run build`: PASS — release CLI, `dist/site/`, crate, and host package.
- Required live URL verifier: PASS, no home-page errors.
- Live Axe: zero serious/critical violations on five routes at both viewports.
- All nine exact claim commands: PASS, with the coverage defects stated above.

## What would make this perfect

Show the real sample run and generated card in the first demo viewport; close
every claim-registry/test gap; correct the host wording and copy audit; replace
decorative or vague copy; add heading focus/announcements, 404 social metadata,
and a plain privacy/limits section. Then repeat this entire review from fresh
contexts. There is no justified AI or sync feature to add.
