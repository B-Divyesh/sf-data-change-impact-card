# Adversarial first-read review 2 — FAIL

Reviewed: 2026-08-29 UTC  
Live URL: <https://data-change-impact-card.sociobot.in>  
Candidate reviewed: `f515f31bf6dde3de9da4dcbd10bf1fc4a580fc03`  
Contexts: fresh Chromium at 390×844 and 1440×900; fresh clean clone at
`/tmp/dcic-review-2-claims.CuOO45/repo`

## Verdict

**FAIL.** One public price claim is neither registered in
`.factory/claims.json` nor proven by a tagged test. All other checks below,
including the repaired one-click demo, pass. The verdict cannot be PASS while
this finding remains, because the claims contract requires every claim a visitor
could rely on to be registered and sandbox-tested.

## Cold first read

Before scrolling, at both widths:

| Question | Answer from the first screen | Exact text that supplied it |
| --- | --- | --- |
| What does it do? | It traces declared data changes to stale assets and an order for recomputing them. | “Trace data changes before recomputing.” |
| For whom? | Data engineers. | “For data engineers, it lists stale assets, evidence paths, and a safe recomputation order from your declared lineage.” |
| What should I click first? | Try the sample. | “Try it with sample data” and “Opens the bundled command and sample result.” |

This gate passes. The primary action is visible at y=410 on the 390px screen
and y=551 on desktop. The 390px first screen has no horizontal overflow.

## Findings

### Blocking

#### F-2-1 — Reopened F-1-2: the public “Free” claim has no registered proof

- Exact location: landing hero fact, “**Free** MIT licensed”; Terms page,
  “Data Change Impact Card is free, open-source software provided under the MIT
  License.”
- Why this fails: `mit-license` proves that `LICENSE` and `Cargo.toml` say MIT.
  It does not prove that this product is free of charge, has no paid tier, or
  will remain free. No other entry in `.factory/claims.json` covers price. This
  is a visitor-relevant claim and reopens the earlier all-public-claims finding.
  An MIT license permits charging for copies, so it is not proof of “Free.”
- Concrete fix: remove “Free” and “free” from the public copy, leaving the
  separately tested “MIT licensed” statement; or add an exact, supportable
  price statement and a distinct `claims.json` entry with a sandbox test that
  proves the observable no-payment/no-paid-feature behavior.

No other findings were identified.

## Copy audit

Method: whitespace-delimited words; code blocks and commands are excluded from
sentence counts. The landing audit was checked against the live DOM and
`site/index.html`; the README audit was checked against `README.md`. No listed
sentence exceeds 22 words. No banned marketing adjective appears. Headings are
direct, result-naming controls are present, and terminology is consistent
(`declared lineage`, `impact card`, `stale asset`, `recomputation order`, and
`bundled sample`). The one exception is the unproven price wording in F-2-1.

### Landing-page sentences

| Location | Sentence | Words |
| --- | --- | ---: |
| Hero h1 | Trace data changes before recomputing. | 5 |
| Hero lead | For data engineers, it lists stale assets, evidence paths, and a safe recomputation order from your declared lineage. | 18 |
| Hero action hint | Opens the bundled command and sample result. | 7 |
| Hero alt | A schema change connects to four data assets; two are stale and the last is verified. | 16 |
| Hero caption | One declared change, traced through known lineage. | 7 |
| Limits | It reads only the files you name. | 7 |
| Limits | It makes no network request and runs no recompute command. | 10 |
| Limits | Every result depends on the lineage you supply. | 8 |
| Limits | Partial lineage stays marked for review. | 6 |
| Sample | Run the bundled sample with `dcic demo`. | 7 |
| Sample | It writes an impact card in a temporary folder and prints the path. | 13 |
| Sample status | Sample: 1 change declared. | 4 |
| Sample change | `currency_code` became required. | 3 |
| Contract | You declare what the tool may know. | 7 |
| Contract | Every card repeats whether lineage is complete or partial. | 9 |
| Contract | Missing dependencies stay visible. | 4 |
| Failure mode | The order is marked “review required.” | 6 |
| Failure mode | Missing lineage never becomes a green check. | 7 |
| Failure mode | The CLI exits with code 2 and names the cycle. | 10 |
| Failure mode | It will not invent a safe order. | 7 |
| Failure mode | The card says “no impact” and still states input completeness, instead of producing an empty file. | 16 |
| Install | Build from source today. | 4 |
| Install | The release package includes the binary built on its packaging host. | 11 |
| Footer | Local impact cards for declared data lineage. | 7 |
| Footer | Version 0.1.0 · Built by Param Factory. | 7 |

The checked landing fragments and controls are: “Impact card” (2), “v0.1.0”
(1), “Demo” (1), “Manifest” (1), “Install” (1), “Privacy” (1), “Local CLI”
(2), “Try it with sample data” (5), “Install dcic” (2), “Local reads named
files” (4), “Read-only does not run jobs” (5), “Free MIT licensed” (3;
F-2-1), “Declare version changes” (3), “Trace known descendants” (3), “Review
cost + unknowns” (4), “Use the order; run jobs outside this CLI” (8), “Privacy
and limits” (3), “Know what the CLI does not do” (7), “Read the privacy details”
(4), “Sample output / bundled fixture” (5), “Review a sample impact card” (5),
“Command” (1), “Manifest” (1), “JSON” (1), “Copy command” (2), “Impact card /
2026-08-28” (4), “orders.v42” (1), “Ready” (1), “Changed 1 source” (3), “Stale
2 assets” (3), “Estimate 7 min” (3), “Unknown 0 edges” (3), “Upstream change”
(2), “Safe recompute order” (3), “Lineage complete” (2), “Generated locally”
(2), “Open contract / schema v1” (5), “Input and output contract” (4), “YAML
or JSON in, Markdown or JSON out” (8), “Dependency order; cycles are rejected”
(5), “Stable aliases for redacted exports” (5), “Known-minute total and missing
estimates” (5), “Failure modes” (2), “How the CLI reports uncertain lineage”
(6), “Partial manifest” (2), “Cycle detected” (2), “No downstream impact” (3),
“MIT licensed / v0.1.0” (4), “Install the CLI from source” (5), and “Copy
install command” (3).

### README sentences

| # | Sentence | Words |
| ---: | --- | ---: |
| 1 | `dcic` turns declared lineage and version changes into a reviewable impact card. | 12 |
| 2 | For data engineers, it lists stale downstream assets, their evidence paths, and their declared recomputation order. | 16 |
| 3 | It reports incomplete lineage for review and never runs a recomputation command. | 12 |
| 4 | Live documentation. | 2 |
| 5 | Run the one-command demo before using your own files. | 9 |
| 6 | It writes bundled `lineage.yaml`, `changes.yaml`, and `impact.md` into a unique temporary `dcic-demo-*` directory, then prints the exact impact-card path. | 18 |
| 7 | The demo does not read your project or run a job. | 11 |
| 8 | See `examples/` and `.factory/demo.md` for the bundled sample and sandbox rules. | 11 |
| 9 | Build the single executable from source. | 6 |
| 10 | The release package contains the binary built on its packaging host. | 11 |
| 11 | Create `lineage.yaml`. | 2 |
| 12 | Then describe only the changes you intend to assess in `changes.yaml`. | 11 |
| 13 | Emit a Markdown card. | 4 |
| 14 | Emit machine-readable JSON or write a redacted card for a ticket. | 11 |
| 15 | The default format is Markdown. | 5 |
| 16 | `--format json` and `--json` are equivalent. | 6 |
| 17 | Either input may be `-` for stdin, but not both. | 10 |
| 18 | A partial manifest, a missing dependency, or a changed node absent from the manifest produces a review-required card. | 18 |
| 19 | Redaction replaces node identifiers with stable `NODE-001` aliases and omits free-text change summaries. | 13 |
| 20 | Exit code `0` means success. | 5 |
| 21 | Exit code `1` means a file or output-format error. | 9 |
| 22 | Exit code `2` means invalid manifest or change data. | 9 |
| 23 | Run `dcic --help` or `dcic analyze --help` for all options. | 10 |
| 24 | Both files accept YAML or JSON, selected from the filename or parsed automatically for stdin. | 14 |
| 25 | Node identifiers must be unique and non-empty. | 7 |
| 26 | A cycle is rejected. | 4 |
| 27 | Missing dependencies and changes naming an absent node are reported as unknown edges. | 13 |
| 28 | The output JSON has `schema_version: 1`. | 6 |
| 29 | Impacted nodes follow topological order and evidence is sorted. | 9 |
| 30 | Public behavior claims and their regression commands are declared in `.factory/claims.json`. | 11 |
| 31 | The factory deploys `dist/site/` as the static site. | 8 |
| 32 | `npm run pack:cli` prepares the crate and host-platform binary in `dist/package/`; publishing is not done from this repository. | 17 |
| 33 | The CLI runs the supplied analysis locally and does not execute declared recompute commands. | 14 |
| 34 | The static site has no analytics, cookies, accounts, or third-party runtime requests. | 11 |
| 35 | Its public shell can remain available offline after the first visit. | 10 |
| 36 | See the site’s privacy and terms pages for the public policy. | 9 |
| 37 | MIT. | 1 |
| 38 | See `LICENSE`. | 2 |

README headings (“Data Change Impact Card”, “Try the bundled sample”, “Install”,
“Usage”, “Input contract”, “Develop and verify”, “Deploy”, “Privacy and
security”, and “License”) are direct and contextual. The terms sentence “Data
Change Impact Card is free, open-source software…” is F-2-1; it is not a
README sentence and is therefore recorded in the finding rather than this table.

## Demo and sandbox

- One click from the hero reaches `/demo/?demo=1` in both fresh contexts.
- Its first 390px viewport contains the persistent “Demo — sample data,
  nothing is saved.” banner, Reset demo, Start for real, a recorded `dcic demo`
  run, `raw.orders v41 → v42`, 2 stale assets, 7 known minutes, 0 unknown
  edges, and the generated `orders.v42` impact card.
- Reset returns to `/demo/?demo=1#demo-result`; Start for real returns to `/`.
- A fresh demo context had no cookies, localStorage, sessionStorage, or
  IndexedDB databases. Its service-worker Cache Storage contains the documented
  public documentation shell only, not demo or account data.
- `dcic demo`, run from an empty temp directory, printed a new
  `/tmp/dcic-demo-*` directory, `impact.md`, and the expected 2/7/0 result. The
  working directory remained untouched.
- A live request log across home, demo, privacy, terms, and 404 contained only
  `https://data-change-impact-card.sociobot.in` requests. Offline documentation
  is independently covered by the registered browser test.

## Claims and clean-clone verification

All 16 exact commands from `.factory/claims.json` were run from the fresh clone
after `npm ci`; none failed. Their tagged tests cover bundled demo isolation,
offline docs, same-origin requests/storage, output, formats/redaction,
uncertainty, read-only analysis, license, host package, source installation,
format alias, stdin, exit codes, help, node IDs, and clipboard recovery.

`npm test` passed: 13 Rust tests, 4 contract tests, 43 Playwright passes, and 5
intentional project-specific skips. `npm run build`, `cargo fmt --check`, and
`cargo clippy --all-targets --all-features -- -D warnings` passed. The built
site JS is 1.97 kB gzip; no third-party font or script is loaded.

F-2-1 is an **unlisted claim**, not a failing listed command. It must be removed
or added to the registry with adequate proof before this section can support a
PASS verdict.

## Earlier findings

Every earlier review/polish/handoff document was read. Live-site and source
checks confirm that F-1-1 and F-1-3 through F-1-21 are fixed: the first demo
viewport now contains a realistic finished result; alt text/counts are correct;
copy and host wording are corrected; headings/controls are direct; focus and
announcements work through navigation and Back; the 404 has canonical/social
metadata; and the privacy/limits section exists. F-1-2 is not fully closed and
is reopened as F-2-1 above because the price statement is still outside the
claim registry.

## Structure, accessibility, and identity

- `/`, `/demo/?demo=1`, `/privacy/`, and `/terms/` return 200. An unknown URL
  returns the designed 404 with status 404 and a Return home action.
- Every inspected page has a route-specific title, description, canonical,
  Open Graph/Twitter image, favicon, `lang=en`, one h1, main, header, and
  footer. `robots.txt` and `sitemap.xml` are present.
- All crawled internal links and the GitHub link return 200. Header/footer
  navigation is consistent and includes Privacy and Terms in the footer.
- Home → Privacy and Back focus the destination h1 and update the polite route
  announcement. The home page produced no console errors; the expected 404
  network response is the only error emitted while deliberately loading an
  unknown route.
- The 390px layout, visible focus, keyboard tabs, reduced-motion rule, and Axe
  serious/critical checks pass in the browser suite.
- The deep-navy drafting grid, vellum impact sheet, cyan/amber/coral marks,
  monospace/serif pairing, and original locally served hero art match
  `.factory/design.md` and are distinct from a generic SaaS template.

## Missed leverage

No additional AI, sync, or import/export feature is warranted. The brief calls
for deterministic local lineage analysis; runtime AI or production sync would
conflict with the local, read-only boundary. YAML/JSON input and Markdown/JSON
output already meet the implied import/export need.

## What would make this perfect

Remove the unsupported “Free” wording or prove an exact price/no-paid-tier
statement through the claims registry. Then repeat this full review from a
fresh browser context and clean clone. No other product change is indicated by
this review.
