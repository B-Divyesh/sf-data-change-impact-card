# Visual thesis — the lineage drafting sheet

Data Change Impact Card uses the visual language of a blueprint being marked up
before work begins. The site is a deep-navy drafting table: a precise cyan grid,
registration marks, measurement ticks, and warm vellum cards. This fits the job
because the product is neither an orchestrator nor a live control room; it is a
reviewable plan assembled before an engineer approves recomputation.

## Palette

The visual system is intentionally single-mode. Painting the entire canvas as a
dark blueprint keeps the decision artifact distinct and avoids a decorative
theme toggle in a small documentation product.

| Token | Value | Use |
| --- | --- | --- |
| Blueprint | `#071b2e` | Page background |
| Blueprint raised | `#0d2942` | Terminal and navigation surfaces |
| Vellum | `#f1eddf` | Exported impact card |
| Ink | `#102a3a` | Text on vellum |
| Chalk | `#f6f4e9` | Primary text on blueprint |
| Muted chalk | `#b8cbd1` | Secondary text |
| Cyan rule | `#5fe1e6` | Focus, links, drafting lines |
| Amber pencil | `#ffc56e` | Stale/warning state |
| Coral pencil | `#ff9c81` | Errors and unknown edges |
| Green stamp | `#75d6a3` | Safe/verified state |

All body text combinations target WCAG AA (4.5:1). State always has an icon or
word as well as color.

## Type and spacing

- Drafting labels and code: the native monospace stack (`ui-monospace`, SFMono,
  Menlo, Consolas). Its even rhythm makes versions and node paths scannable.
- Explanatory copy and the vellum card: Georgia and its system serif fallbacks.
  The editorial face makes the impact card feel like a signed engineering note.
- The scale is 14 / 16 / 20 / 28 / clamp(40–72) px; body never falls below 16px.
- An 8px base rhythm governs layout, with 4px used only for inline optical
  adjustment. Reading measures stay below 72 characters.

## Interaction grammar

Controls resemble labeled drafting tools: square corners clipped with small
diagonal cuts, 44px minimum targets, cyan rules, and direct verb labels. The
primary flow is `Declare → Trace → Review → Recompute`. Terminal tabs switch
between the manifest and emitted card while preserving visible focus. The phone
layout drops ornamental measurements, stacks terminal controls, and keeps the
result ahead of secondary explanation.

## Depth and motion

The vellum result rises 8px above the drafting surface and shifts by 2px when a
demo is run, matching the physical act of placing a new sheet. Reveals last
180–240ms and animate only opacity/transform. Nothing loops. Under
`prefers-reduced-motion`, all transforms and smooth scrolling are disabled and
state changes are immediate.

## Original asset plan and provenance

The hero includes one original raster illustration: an oblique drafting-table
scene where a schema-change slip fans into a short, ordered chain of vellum
lineage cards. It explains propagation without depicting a generic analytics
dashboard. It will be generated specifically for this product using the factory
image generator, converted to WebP, kept below 300KB, and served locally with
explicit dimensions. No third-party icons, fonts, scripts, or stock assets are
used. Interface icons and drafting marks are handmade CSS/inline SVG.

Final generation prompt and output size are recorded here after generation.
