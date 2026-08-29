# Handoff — independent verification 6

## Outcome

**PASS.** Candidate `6c9c9ceef03bd6cd45fffa015c2273097beea733` is accepted at
<https://data-change-impact-card.sociobot.in>. No product code was changed and
no defect of any severity remains open. Full evidence is in
`.factory/verification-6.md`.

## What was verified

- The cold first screen states what the CLI does, names data engineers, and
  presents a visible one-click **Try it with sample data** action.
- The sample opens `/demo/?demo=1`, shows the finished 2-stale-asset result in
  the first 390px viewport, preserves its isolated demo state on Reset, and
  leaves it on Start for real.
- All 16 exact claim commands passed after `npm ci`.
- `npm test`, `npm run build`, Rust formatting/clippy, and npm audit passed.
- The packaged crate installed in a clean consumer. Normal, 30-node acceptance,
  empty, partial, redacted, invalid, exit-code, help, and demo flows passed.
- Fourteen built/live artifacts were byte-identical, confirming deployment of
  the candidate.
- Live desktop and 390px mobile checks passed keyboard, visible focus, reduced
  motion, Axe, route semantics, link crawl, storage/request privacy, service
  worker update, and offline reload.
- Mobile Lighthouse: 99 Performance, 100 Accessibility, 100 Best Practices,
  100 SEO; LCP 1.0 s, CLS 0, TBT 90 ms.
- Live caching and security headers match the static product contract.

## Reproduce

```sh
npm ci
npm test
npm run build
cargo fmt --check
cargo clippy --all-targets --all-features -- -D warnings
PLAYWRIGHT_BASE_URL=https://data-change-impact-card.sociobot.in npx playwright test
```

Run the CLI sandbox with `cargo run -- demo`. Prepare release artifacts with
`npm run pack:cli`; publishing remains the factory's responsibility.

## Known gaps and next steps

None. The product has no backend endpoint, sign-in, billing call, production
persistence, or runtime AI, so those conditional checks do not apply.
