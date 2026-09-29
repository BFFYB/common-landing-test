# grask-6-archivo · Grask with Archivo Condensed as the display face

One of the display-face variants of grask-6 (2026-09-29). Everything under 28px is the guide's Golos Text, the palette and every
section after the hero are grask-6's. Only the display face, its tokens, the hero layout, the highlighter and the footer wordmark change.

## The face
**Archivo**, Omnibus-Type's grotesk, used at width 75 (`font-stretch: 75%`, "condensed") and weight 900 for the headline and the wordmark,
800 for section titles, and semi-condensed (`87.5%`) 700 for the display-md role. A condensed black grotesk is the opposite of Piazzolla:
a poster voice, not a book voice. Google Fonts serves the width axis as six named instances (62.5 / 75 / 87.5 / 100 / 112.5 / 125%), so
`font-stretch` must name one of those exactly (85% falls back to 75%).

Import (grask-6-archivo.type.css):
`https://fonts.googleapis.com/css2?family=Archivo:ital,wdth,wght@0,62..125,100..900;1,62..125,100..900&family=Golos+Text:wght@400..600&family=JetBrains+Mono:wght@400..500&display=swap`

Fallback: "Archivo Fallback" = local Arial Narrow / Arial / Helvetica at size-adjust 96%.

## Display tokens (this variant)
| token | use | setting |
| --- | --- | --- |
| display-xl | h1 | 900, 75%, capitals, clamp(3rem, 1rem + 8.4vw, 8rem) = 48 → 128px, line-height .9, -0.01em |
| display-lg | h2 | 800, 75%, clamp(2rem, 1.4rem + 2.4vw, 3rem) = 32 → 48px, line-height .98, 0em |
| display-md | statement, rail grade | 700, 87.5%, 30px, line-height 1.15, 0em |
| wordmark | lockups, giant footer | 900, 75%, -0.01em; 32px in the header |

## The hero
A left-aligned poster: the headline in capitals runs across the whole 1200px column (three lines at 1440px, five at 390px), the lead
(560px measure) and the "Book a demo" button share one row beneath it, the button on the right on the same baseline (`.hero-row`,
wraps on narrow screens). "THE HOURS." sits on a solid tint block (`--g-accent-soft-2`, `box-decoration-break: clone`) instead of the
underline; the sweep-in keyframe animates the block's width. The word-drop animation and the recording strip are grask-6's.

## Footer wordmark
Re-derived from measured metrics (see the comment above `.giant` in grask-6-archivo.css): 41.8cqw, line-height .8,
margin 0 0.041em -0.149em 0. Ink of "Grask" is 2.427em wide per em; caps 0.688em; baseline 0.7335em below the top of the .8 line box.

## Deviations from the guide
- The hero headline is set in capitals (the only uppercase display string; h2 and the statement stay sentence case).
- display-md is 30px rather than 28px and semi-condensed, so the statement does not read as squeezed body text.
- The section titles go to 48px (the guide caps display-lg at 40px): a condensed face needs the height to carry a title.

## What to look at
The poster headline against the quiet Golos lead; whether the capitals feel like Grask or like a sports brand; the h2s at 48px condensed
next to the 20px card titles; the statement at 30px semi-condensed in the pinned track; the rail's grade number; the giant "Grask".
