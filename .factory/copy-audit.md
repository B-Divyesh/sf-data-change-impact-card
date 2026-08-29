# Copy audit

Audit date: 2026-08-29. This is the complete visitor-facing copy inventory for
the landing page, including header, main content, and footer. Code samples,
version strings, identifiers, and image alt text are included when a visitor can
read them. No sentence exceeds 22 words. The unsupported cross-platform binary
statement and the metaphor-like “No inference theater” line were removed.

| Location | Copy | Words | Result |
| --- | --- | ---: | --- |
| Header | Impact card | 2 | Pass |
| Header | spec / 01 | 2 | Pass |
| Header nav | Demo; Manifest; Install; Privacy | 4 | Pass |
| Hero label | Local-first CLI / change plan 01 | 4 | Pass |
| Hero h1 | Trace data changes before recomputing. | 5 | Pass |
| Hero lead | For data engineers, it lists stale assets, evidence paths, and a safe recomputation order from your declared lineage. | 17 | Pass |
| Hero action | Try it with sample data | 5 | Pass |
| Hero hint | Opens the bundled command and sample result. | 7 | Pass |
| Hero action | Install dcic | 2 | Pass |
| Hero facts | Local reads named files; Read-only does not run jobs; Free MIT licensed | 13 | Pass |
| Hero image alt | A coral schema change slip connects across a blueprint to four layered data asset cards, two stamped stale and the last stamped verified. | 22 | Pass |
| Hero caption | Fig. 01; One declared change, traced through known lineage. | 9 | Pass |
| Process | Declare Version changes; Trace Known descendants; Review Cost + unknowns; Recompute In safe order | 15 | Pass |
| Sample label | Sample output / bundled fixture | 4 | Pass |
| Sample h2 | Review a sample impact card. | 5 | Pass |
| Sample copy | Run the bundled sample with dcic demo. | 7 | Pass |
| Sample copy | It writes an impact card in a temporary folder and prints the path. | 13 | Pass |
| Terminal tabs | Command; Manifest; JSON | 3 | Pass |
| Terminal controls | Try sample data; Copy command; Sample: 1 change declared. | 10 | Pass |
| Sample card | Impact card / 2026-08-28; orders.v42; Ready | 5 | Pass |
| Sample card facts | Changed 1 source; Stale 2 assets; Estimate 7 min; Unknown 0 edges | 13 | Pass |
| Sample card | Upstream change; currency_code became required | 5 | Pass |
| Sample card | Safe recompute order; model 2 min; table 5 min | 10 | Pass |
| Sample card | Lineage: complete; Generated locally | 4 | Pass |
| Contract label | Open contract / schema v1 | 5 | Pass |
| Contract h2 | Small inputs. Explicit claims. | 4 | Pass |
| Contract copy | You declare what the tool may know. | 8 | Pass |
| Contract copy | Every card repeats whether lineage is complete or partial. | 9 | Pass |
| Contract copy | Missing dependencies stay visible. | 4 | Pass |
| Contract facts | YAML or JSON in, Markdown or JSON out | 8 | Pass |
| Contract facts | Topological order with cycle rejection | 5 | Pass |
| Contract facts | Stable aliases for redacted exports | 5 | Pass |
| Contract facts | Known-minute total and missing estimates | 5 | Pass |
| Contract annotation | Required; Optional; LINEAGE / YAML | 5 | Pass |
| Failure label | Honest failure modes | 3 | Pass |
| Failure h2 | Uncertainty stays on the page. | 5 | Pass |
| Failure card | Partial manifest | 2 | Pass |
| Failure card | The order is marked “review required.” | 6 | Pass |
| Failure card | Missing lineage never becomes a green check. | 7 | Pass |
| Failure card | Cycle detected | 2 | Pass |
| Failure card | The CLI exits with code 2 and names the cycle. | 11 | Pass |
| Failure card | It will not invent a safe order. | 8 | Pass |
| Failure card | No downstream impact | 3 | Pass |
| Failure card | The card says “no impact” and still states input completeness, instead of producing an empty file. | 16 | Pass |
| Install label | MIT licensed / v0.1.0 | 4 | Pass |
| Install h2 | Add one read-only step before the expensive one. | 9 | Pass |
| Install copy | Build from source today. | 4 | Pass |
| Install copy | The release package includes the binary built on this system. | 10 | Pass |
| Install control | Copy | 1 | Pass |
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
