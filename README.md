# Data Change Impact Card

`dcic` turns declared lineage and version changes into a reviewable impact card.
For data engineers, it lists stale downstream assets, their evidence paths, and
their declared recomputation order. It reports incomplete lineage for review and
never runs a recomputation command.

Live documentation: <https://data-change-impact-card.sociobot.in>

## Try the bundled sample

Run the one-command demo before using your own files:

```sh
dcic demo
# or: dcic --demo
```

It writes bundled `lineage.yaml`, `changes.yaml`, and `impact.md` into a unique
temporary `dcic-demo-*` directory, then prints the exact impact-card path. The
demo does not read your project or run a job. See `examples/` and
`.factory/demo.md` for the bundled sample and sandbox rules.

## Install

Build the single executable from source:

```sh
cargo install --path . --locked
```

The release package contains the binary built on its packaging host.

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
Either input may be `-` for stdin, but not both. A partial manifest, a missing
dependency, or a changed node absent from the manifest produces a review-required
card. Redaction replaces node identifiers with stable `NODE-001` aliases and
omits free-text change summaries.

Exit code `0` means success. Exit code `1` means a file or output-format error.
Exit code `2` means invalid manifest or change data. Run `dcic --help` or
`dcic analyze --help` for all options.

## Input contract

Both files accept YAML or JSON, selected from the filename or parsed
automatically for stdin. Node identifiers must be unique and non-empty. A cycle
is rejected. Missing dependencies and changes naming an absent node are reported
as unknown edges.

The output JSON has `schema_version: 1`. Impacted nodes follow topological
order and evidence is sorted.

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

Public behavior claims and their regression commands are declared in
`.factory/claims.json`.

## Deploy

The factory deploys `dist/site/` as the static site. `npm run pack:cli` prepares
the crate and host-platform binary in `dist/package/`; publishing is not done
from this repository.

## Privacy and security

The CLI runs the supplied analysis locally and does not execute declared
recompute commands. The static site has no analytics, cookies, accounts, or
third-party runtime requests. Its public shell can remain available offline
after the first visit. See the site’s privacy and terms pages for the public
policy.

## License

MIT. See [LICENSE](LICENSE).
