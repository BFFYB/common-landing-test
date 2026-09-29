# grask-6-bodoni-moda — Grask · Bodoni Moda

grask-6 duplicated on 2026-09-29 to try another display face. One of a series of variants that keep grask-6's palette,
Golos Text for everything below 28px, and all of the page after the hero; only the display face and the hero change.
Root class `.grask-6-bodoni-moda-lp`, prefix `glp6-bodoni-moda-`, so its global styles never meet the siblings'.

## The face

**Bodoni Moda** (Indestructible Type; Google Fonts), a Didone with optical sizes: hairline serifs and a strong
vertical stress that get sharper as the size grows. Chosen as the high-contrast pole of the series: the most
"printed", fashion-magazine voice against Golos Text's plain grotesk. It only ever appears at 28px and above.

- Import (in `grask-6-bodoni-moda.type.css`):
  `family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..900;1,6..96,400..900` (with `Golos+Text:wght@400..600` and `JetBrains+Mono:wght@400..500`).
- `--font-display: "Bodoni Moda", "Bodoni Moda Fallback", "Didot", Georgia, serif`; the fallback is local Didot / Bodoni 72 / Georgia at `size-adjust: 97%`.
- `font-optical-sizing: auto` everywhere the face is used (opsz 6–96, so the headline gets the finest hairlines).

## Display sizes (this variant)

| token | weight | size | leading | tracking | worn by |
| --- | --- | --- | --- | --- | --- |
| display-xl | 700 | clamp(3rem, 1rem + 7vw, 6rem) = 48 → 96px | 0.98 | -0.02em | h1 |
| display-lg | 600 | clamp(2rem, 1.4rem + 2vw, 2.75rem) = 32 → 44px | 1.05 | -0.015em | every h2 |
| display-md | 500 | 1.875rem = 30px | 1.2 | -0.005em | the statement, the rail's grade number |
| wordmark | 700 | 32px in the lockups; 36.5cqw in the footer | 1 / 0.8 | -0.02em | `.wordmark` |

The tokens live in `grask-6-bodoni-moda.type.css`; `grask-6-bodoni-moda.css` repeats them for h1 / h2 / .wordmark,
`grask-6-bodoni-moda.tokens.css` mirrors them in the kit names, `grask-6-bodoni-moda.rail.css` sets the grade number.

## The hero: a masthead

Centred, as grask-6, but opening like a magazine front: above the headline a dateline between two hairlines
(`.dateline`: Golos label-sm in capitals, tracked .08em, secondary text colour, petrol middle dots; the rules are
`--g-line`), spanning the column. Then the headline at up to 96px (104px ran to three lines at 1440px; the guide allows two), leading .98, the highlighter still under
"the hours."; the lead at a 620px measure; the button centred. The dateline rises with the `.rise-5` delay (.36s),
before the words drop. The strip and everything after it are unchanged.

Footer wordmark, re-derived for Bodoni Moda 700 (measured with canvas `measureText` + a baseline probe):
`font-size: 36.5cqw; line-height: 0.8; margin: 0.04em 0.05em -0.13em 0` (ink width 2.780em, ink 0.025em right of
centre, caps 0.75em starting 0.010em below the top of the 0.8 box, baseline 0.04em above its bottom). Because that box is shorter
and cropped deeper than Piazzolla's, its mask reveal rises 45% instead of 55% (`grask-6-bodoni-moda.motion.css`); at 55% the
reveal observer never saw the 12% of the box it needs at the end of the page and the wordmark stayed hidden.

## Deviations from the guide

- display-md is 30px, not 28px: at the floor the Didone's hairlines close up on the statement's long lines.
- display-lg drops to weight 600 and display-md to 500: Bodoni Moda 700 below 48px is too black next to Golos.
- The face has no italics in use, sentence case, at most two lines: as the guide says.

## What to look at

Whether the hairlines survive on the paper background at 44px (the section titles) and at 30px (the statement);
whether the masthead dateline earns its place or reads as decoration; the wordmark next to the tile mark in the header.
