# Data Change Impact Card

`dcic` turns declared lineage and explicit version changes into a small,
reviewable impact card. It tells data engineers which downstream assets are
stale, why they are stale, the safe topological recomputation order, known cost,
and where the supplied lineage is incomplete. It never connects to a warehouse
or runs a job.

Live documentation: <https://data-change-impact-card.sociobot.in>

## Install

Download a release binary, or build the single executable from source:

```sh
cargo install --path .
```

Rust 1.85 or newer is supported. Version 0.1.0 is the initial public API.

## Usage

Create `lineage.yaml`:

```yaml
schema_version: 1
completeness: complete
nodes:
  - id: raw.orders
    kind: source
  - id: clean.orders
    kind: model
    depends_on: [raw.orders]
    recompute: dbt run --select clean.orders
    estimate_minutes: 2
  - id: mart.revenue
    kind: table
    depends_on: [clean.orders]
    recompute: dbt run --select mart.revenue
    estimate_minutes: 5
```

Then describe only the changes you intend to assess in `changes.yaml`:

```yaml
schema_version: 1
changes:
  - node: raw.orders
    from: v41
    to: v42
    summary: currency_code became required
```

Emit a Markdown card:

```sh
dcic analyze --manifest lineage.yaml --changes changes.yaml
```

Emit machine-readable JSON or write a redacted card for a ticket:

```sh
dcic analyze -m lineage.yaml -c changes.yaml --json
dcic analyze -m lineage.yaml -c changes.yaml --redact -o impact.md
```

The default format is Markdown. `--format json` and `--json` are equivalent.
Either input may be `-` for stdin, but not both. The manifest must declare
`completeness: complete` or `partial`; a partial declaration and every missing
dependency are preserved as warnings in the output. Redaction replaces node
identifiers with stable `NODE-001` aliases and omits free-text change summaries.

Exit codes are stable: `0` success, `1` file or serialization error, `2` invalid
manifest/change data. Run `dcic --help` or `dcic analyze --help` for all options.

## Input contract

Both files accept YAML or JSON, selected from the filename or parsed
automatically for stdin. Node identifiers must be unique and non-empty. A cycle
is rejected because no honest recomputation order exists. Dependencies absent
from `nodes` and change events naming an absent node are reported as unknown
edges rather than silently treated as known lineage.

The output JSON schema is versioned with `schema_version: 1`. Arrays are
deterministic: impacted nodes follow topological order and evidence is sorted.

## Develop and verify

```sh
cargo test
cargo build --release
npm install
npm test
npm run build          # CLI release build + site -> dist/
npm run build:site     # static site only -> dist/site/
npm run pack:cli       # release archives -> dist/package/
```

The test suite covers the documented example, validation, redaction, Markdown
and JSON output, stdin, the 30-node/five-change acceptance fixture, browser
accessibility, keyboard behavior, mobile layout, and offline fallback.

## Deploy

The factory deploys `dist/site/` as the static site. The `dist/package/`
archives are ready for release attachment; registry and release credentials are
intentionally not part of this repository.

## Privacy and security

The CLI is local-only: no network access, telemetry, production connections, or
job execution. The static site has no analytics, cookies, accounts, or external
runtime requests. See the site’s privacy and terms pages for the public policy.

## License

MIT. See [LICENSE](LICENSE).
