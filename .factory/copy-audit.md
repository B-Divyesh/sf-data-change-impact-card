# Copy audit

Audit date: 2026-08-29. The cold first screen was checked against the
plain-words rules. No audited sentence exceeds 22 words and none uses a banned
marketing word.

| Location | Sentence | Words | Result |
| --- | --- | ---: | --- |
| Home h1 | Trace data changes before recomputing. | 5 | Pass |
| Home lead | For data engineers, it lists stale assets, evidence paths, and a safe recomputation order from your declared lineage. | 17 | Pass |
| Home action | Try it with sample data | 5 | Pass |
| Home action hint | Opens the bundled command and sample result. | 7 | Pass |
| Demo h1 | Run sample lineage data. | 4 | Pass |
| Demo lead | Use one command to create a temporary folder with sample input and a generated impact card. | 16 | Pass |
| Demo note | The command never reads your project. It does not connect to production or run a job. | 16 | Pass |

## Terminology

| Concept | Product term |
| --- | --- |
| Input graph | declared lineage |
| Result | impact card |
| Affected result | stale asset |
| Execution sequence | recomputation order |
| Shipped trial | bundled sample |
