# grask-6-instrument-serif · Instrument Serif as the display face

grask-6 duplicated on 2026-09-29 (slug, `.grask-6-instrument-serif-lp` root class, `glp6-instrument-serif-` prefix and `Grask6InstrumentSerif`
class renamed so its global styles never clash with grask-6's). One thing changes: the display face is **Instrument Serif** instead of
Piazzolla. Golos Text below 28px, JetBrains Mono for code, the palette, the radii and everything after the hero are grask-6's.

## The face

Instrument Serif (Google Fonts): a display serif with one weight, 400, and an italic. Light strokes, tall ascenders, narrow set, a slight
condensed elegance: the opposite of Piazzolla's sturdy text-serif body. The test is whether the brand can carry a *light* voice.

Import (`grask-6-instrument-serif.type.css`):
`family=Instrument+Serif:ital@0;1&family=Golos+Text:wght@400..600&family=JetBrains+Mono:wght@400..500`

`--font-display: "Instrument Serif", "Instrument Serif Fallback", Georgia, serif`. Every display rule sets `font-synthesis: none` so no
faux bold is ever drawn where the kit's tokens still say 700. The metric fallback is Times New Roman at 96%.

## Display sizes (larger than the guide's, because the face is light and narrow)

| token | grask-6 (Piazzolla) | here (Instrument Serif 400) |
| --- | --- | --- |
| display-xl, the h1 | 700, 40 → 72px, 1.05, -0.02em | 400, 52 → 120px (`clamp(3.25rem, 1rem + 8vw, 7.5rem)`), 0.95, -0.02em |
| display-lg, every h2 | 700, 32 → 40px, 1.1, -0.015em | 400, 36 → 52px (`clamp(2.25rem, 1.5rem + 2.4vw, 3.25rem)`), 1.02, -0.015em |
| display-md, the statement and the rail's grade number | 600, 28px, 1.2 | 400, 32px, 1.15, -0.01em |
| wordmark (header / footer lockup) | 700, 30 / 28px | 400, 34 / 32px |

The kit names in `grask-6-instrument-serif.tokens.css` (`--g-weight-display*`, `--g-leading-display*`) follow.

## The hero: an airy poster

Left-aligned (section `align-items: stretch; text-align: left`). The h1 runs across the whole 1200px column with `text-wrap` balancing
off, so its two lines fall where the width puts them; **"heard." is set in the italic** (`.title .ital`), the one place this landing
italicises the display face and a deliberate exception to the guide's no-italics rule. The highlighter under "the hours." stays. Under
the headline, `.hero-row`: the lead on the left (the tryout panel still binds to it) and the button on the right, bottom-aligned
(`flex-wrap` stacks them on phones). The recording strip and everything below are unchanged.

## Giant footer wordmark

Re-derived from canvas metrics like grask-6 did for Piazzolla: ink width 1.859em → `font-size: 54.5cqw` keeps the 101.4% bleed;
`margin: 0.03em 0.06em -0.146em 0` (the derivation is in the comment above `.giant` in `grask-6-instrument-serif.css`).

## What to look at

- Does a single light weight hold the page together, or does it need the weight Piazzolla brought to the section titles?
- The h2s at 52px 400 on the dark rail band and on the petrol sandbox band: light strokes on dark.
- The italic "heard." next to the roman words; the wordmark at 34px next to the 34px mark tile.
- Known and pre-existing (identical in grask-6): at 390px the rail track and the strip's playhead measure wider than the viewport.
