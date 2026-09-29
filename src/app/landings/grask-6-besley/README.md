# grask-6-besley · Besley as the display face

grask-6 duplicated on 2026-09-29 (one of eleven display-face variants of grask-6). The only change: the display face is
**Besley** instead of Piazzolla, and the hero is laid out as a left-aligned poster to suit it. Golos Text below 28px, JetBrains
Mono for code, the palette, radii and everything after the hero are grask-6's.

## The face

Besley (Indestructible Type) is a Clarendon: a bracketed slab serif with a sturdy, Victorian poster feel. It is tried here as the
opposite of Piazzolla's bookish voice: heavier, wider, more "announcement" than "essay". Variable weight 100–900 with italics.

- Import: `https://fonts.googleapis.com/css2?family=Besley:ital,wght@0,400..900;1,400..900&family=Golos+Text:wght@400..600&family=JetBrains+Mono:wght@400..500&display=swap`
- `--font-display: "Besley", "Besley Fallback", "Clarendon", Georgia, serif` (`Besley Fallback` = local Georgia / Times at size-adjust 106%)
- No optical-size axis; `font-optical-sizing: auto` on the display tokens is inert.

## Display tokens (grask-6-besley.type.css, repeated by the h1 / h2 / .wordmark roles in grask-6-besley.css)

| token | weight | size | line-height | tracking |
| --- | --- | --- | --- | --- |
| display-xl (h1) | 800 | clamp(2.75rem, 1rem + 6vw, 5.75rem) = 44 → 92px | 1.0 | -0.02em |
| display-lg (h2) | 700 | clamp(2rem, 1.5rem + 1.8vw, 2.75rem) = 32 → 44px | 1.08 | -0.015em |
| display-md (statement, rail total) | 600 | 1.75rem | 1.2 | -0.01em |
| .wordmark (lockups) | 800 | 30px | 1 | -0.02em |

## Hero treatment: "Clarendon poster"

Left-aligned stack (the section's inline `align-items: flex-start; text-align: left; gap: 24px`): the headline rags in a 1000px
measure with no `text-wrap: balance`, so at 1440px it runs to three lines ("Every student — / heard. Without / the hours."); the
highlighted pair `.mark` is `white-space: nowrap` so "the hours." never splits across lines. The lead (600px, `text-wrap: pretty`)
and the button sit under the headline's left edge. The word-drop animation, the highlighter sweep and the recording strip are
unchanged. On phones (390px) the headline is 44px over four lines.

## Giant footer wordmark

Re-derived for Besley 800 at -0.02em by canvas measureText on the live page (grask-6's method): the ink of "Grask" is 3.337em wide
(Piazzolla: 2.540em), so `font-size: 30.4cqw` keeps the same 101.4% bleed; `margin: -0.013em 0.061em -0.078em 0` (ascent 1.25em,
descent 0.425em, caps 0.75em; baseline 0.0125em below the 0.8 line box; caps start 0.0625em below the top).

## Deviations from the guide

- Display weight 800 for the headline and the wordmark (the guide says 600–700 for Piazzolla; Besley 700 reads lighter than
  Piazzolla 700 at the same size, 800 is the Clarendon weight).
- h1 without `text-wrap: balance` and left-aligned; a ragged three-line headline is the point of the poster.

## What to look at

The hero at 1440px and 390px; the section titles at 44px (the dark rail title "What your course gets back" is a good test of
the slab serifs on dark); the statement at 28px 600; the footer wordmark's bleed and the crop of its bottom 12%.
