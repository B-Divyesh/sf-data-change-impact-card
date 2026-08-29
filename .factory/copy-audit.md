# Copy audit

Audit date: 2026-08-29. This inventory covers every rendered landing-page
sentence plus its headings, labels, controls, alt text, and footer. Counts use
whitespace-delimited words. Code blocks are inventoried by purpose. No sentence
exceeds 22 words, and no banned marketing word appears.

| Location | Copy | Words | Result |
| --- | --- | ---: | --- |
| Header | Impact card; v0.1.0 | 3 | Pass |
| Header nav | Demo; Manifest; Install; Privacy | 4 | Pass |
| Hero label | Local CLI | 2 | Pass |
| Hero h1 | Trace data changes before recomputing. | 5 | Pass |
| Hero lead | For data engineers, it lists stale assets, evidence paths, and a safe recomputation order from your declared lineage. | 18 | Pass |
| Hero action | Try it with sample data | 5 | Pass |
| Hero hint | Opens the bundled command and sample result. | 7 | Pass |
| Hero action | Install dcic | 2 | Pass |
| Hero facts | Local reads named files; Read-only does not run jobs; License MIT licensed | 12 | Pass |
| Hero image alt | A schema change connects to four data assets; two are stale and the last is verified. | 16 | Pass |
| Hero caption | One declared change, traced through known lineage. | 7 | Pass |
| Process | Declare Version changes; Trace Known descendants; Review Cost + unknowns; Use the order Run jobs outside this CLI | 18 | Pass |
| Limits label | Privacy and limits | 3 | Pass |
| Limits h2 | Know what the CLI does not do. | 7 | Pass |
| Limits copy | It reads only the files you name. | 7 | Pass |
| Limits copy | It makes no network request and runs no recompute command. | 10 | Pass |
| Limits copy | Every result depends on the lineage you supply. | 8 | Pass |
| Limits copy | Partial lineage stays marked for review. | 6 | Pass |
| Limits link | Read the privacy details | 4 | Pass |
| Sample label | Sample output / bundled fixture | 5 | Pass |
| Sample h2 | Review a sample impact card. | 5 | Pass |
| Sample copy | Run the bundled sample with dcic demo. | 7 | Pass |
| Sample copy | It writes an impact card in a temporary folder and prints the path. | 13 | Pass |
| Terminal tabs | Command; Manifest; JSON | 3 | Pass |
| Terminal controls | Try it with sample data; Copy command; Sample: 1 change declared. | 11 | Pass |
| Sample card | Impact card / 2026-08-28; orders.v42; Ready | 6 | Pass |
| Sample card facts | Changed 1 source; Stale 2 assets; Estimate 7 min; Unknown 0 edges | 12 | Pass |
| Sample card | currency_code became required. | 3 | Pass |
| Sample card labels | Upstream change; Safe recompute order; Lineage complete; Generated locally | 9 | Pass |
| Contract label | Open contract / schema v1 | 5 | Pass |
| Contract h2 | Input and output contract. | 4 | Pass |
| Contract copy | You declare what the tool may know. | 7 | Pass |
| Contract copy | Every card repeats whether lineage is complete or partial. | 9 | Pass |
| Contract copy | Missing dependencies stay visible. | 4 | Pass |
| Contract facts | YAML or JSON in, Markdown or JSON out | 8 | Pass |
| Contract facts | Dependency order; cycles are rejected | 5 | Pass |
| Contract facts | Stable aliases for redacted exports | 5 | Pass |
| Contract facts | Known-minute total and missing estimates | 5 | Pass |
| Contract annotation | Required; Optional; LINEAGE / YAML | 5 | Pass |
| Failure label | Failure modes | 2 | Pass |
| Failure h2 | How the CLI reports uncertain lineage. | 6 | Pass |
| Failure card | Partial manifest | 2 | Pass |
| Failure card | The order is marked “review required.” | 6 | Pass |
| Failure card | Missing lineage never becomes a green check. | 7 | Pass |
| Failure card | Cycle detected | 2 | Pass |
| Failure card | The CLI exits with code 2 and names the cycle. | 10 | Pass |
| Failure card | It will not invent a safe order. | 7 | Pass |
| Failure card | No downstream impact | 3 | Pass |
| Failure card | The card says “no impact” and still states input completeness, instead of producing an empty file. | 16 | Pass |
| Install label | MIT licensed / v0.1.0 | 4 | Pass |
| Install h2 | Install the CLI from source. | 5 | Pass |
| Install copy | Build from source today. | 4 | Pass |
| Install copy | The release package includes the binary built on its packaging host. | 11 | Pass |
| Install control | Copy install command | 3 | Pass |
| Footer | Local impact cards for declared data lineage. | 7 | Pass |
| Footer | Version 0.1.0 · Built by Param Factory | 7 | Pass |
| Footer nav | Demo; Privacy; Terms; GitHub | 4 | Pass |

## Terminology

| Concept | Product term |
| --- | --- |
| Input graph | declared lineage |
| Result | impact card |
| Affected result | stale asset |
| Execution sequence | recomputation order |
| Shipped trial | bundled sample |
| Missing relationship | unknown edge |
