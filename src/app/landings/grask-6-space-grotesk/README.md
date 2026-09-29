# grask-6-space-grotesk

grask-6 duplicated on 2026-09-29 with **Space Grotesk** as the display face instead of Piazzolla. One of the
eleven display-face variants of grask-6 (`grask-6-*`); the palette, Golos Text for everything under 28px,
JetBrains Mono for code and every section after the hero are grask-6's, unchanged.

## The face

Space Grotesk (Florian Karsten, Google Fonts): a geometric grotesk with odd details at display size, the
single-storey `a`, the round `y`, the open `k`. A sans voice over a sans text face: the contrast comes from
weight, size and tracking, not from serif against grotesk. The face is wide and loosely spaced by default,
so every display token tracks tighter than the guide's Piazzolla values.

- Import: `family=Space+Grotesk:wght@300..700` (in the one `@import` in `grask-6-space-grotesk.type.css`, next to
  Golos Text 400–600 and JetBrains Mono 400–500). Fallback: local Arial/Helvetica at `size-adjust: 106%`.
- `--font-display: "Space Grotesk", "Space Grotesk Fallback", system-ui, Arial, sans-serif`.

## Display tokens (this variant)

| token | use | weight | size | leading | tracking |
| --- | --- | --- | --- | --- | --- |
| display-xl (h1) | hero headline | 700 | clamp(2.75rem, 1rem + 5.6vw, 5rem) → 44–80px | .98 | -0.035em |
| display-lg (h2) | section titles | 700 | clamp(2rem, 1.5rem + 1.8vw, 2.75rem) → 32–44px | 1.05 | -0.025em |
| display-md | statement, rail grade number | 500 | 28px | 1.2 | -0.015em |
| wordmark | lockups, giant footer | 700 | 30px / 40.5cqw | 1 / .8 | -0.035em |

The tokens live in `grask-6-space-grotesk.type.css`; `grask-6-space-grotesk.css` repeats them for h1 / h2 / .wordmark,
`grask-6-space-grotesk.tokens.css` mirrors them in the kit names, `grask-6-space-grotesk.rail.css` sets the rail's grade number to 500.

## The hero: "product grid"

Two columns (`.hero-grid`): the headline left in the flexible column, the lead and the button stacked in a
400px column to its right, both columns bottom-aligned so the button sits on the headline's last line. Left-aligned
text throughout (grask-6 centred everything). The headline runs three lines at 1440px (80px; 88px made it four).
One column under 900px, the side under the headline. The highlighter under "the hours." sits at 90% instead of
86%: the sans's letters sit lower in the em. The recording strip and everything after it are grask-6's.

## Footer wordmark

Re-derived for Space Grotesk 700 at -0.035em: `font-size: 40.5cqw; line-height: .8; margin: 0 .071em -.138em 0`
(ink width 2.504em, ink 0.036em right of centre, ascent .984 / descent .292, cap height .700). The comment above
`.giant` in `grask-6-space-grotesk.css` has the derivation.

## Deviations from the type guide

- The display face is a grotesk, not the guide's serif; the guide's other rules hold (28px floor, no italics, short strings).
- Tracking is tighter than the guide's at every display size (-0.035 / -0.025 / -0.015em against -0.02 / -0.015 / -0.01em).
- display-md is 500, not 600: Space Grotesk 600 at 28px looked heavier than the guide's Piazzolla 600.

## What to look at

The three-line headline against the lead in the right column; the `y` and `a` in "Every" and "heard."; section
titles at 44px on the tint and petrol plates; the giant footer wordmark's bleed and crop.
