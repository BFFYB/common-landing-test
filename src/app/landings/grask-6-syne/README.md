# grask-6-syne · Grask with Syne as the display face

grask-6 duplicated on 2026-09-29 as one of a series that keeps the Grask type guide's text face (Golos Text for everything
under 28px), the palette and the whole page, and swaps only the display face. Here it is **Syne** (Bonjour Monde; an
extra-wide geometric with an art-school edge, weights 400–800): the opposite temperament to Piazzolla, to see how far a
wide, loud sans can go on this page before the copy fights it.

## Loading

`@import url("https://fonts.googleapis.com/css2?family=Syne:wght@400..800&family=Golos+Text:wght@400..600&family=JetBrains+Mono:wght@400..500&display=swap");`
in `grask-6-syne.type.css`, with a `"Syne Fallback"` @font-face on local Arial Black / Helvetica at size-adjust 118% (a starting point).

## Display tokens (re-cut for the width of the face)

| token | where | Syne | size | leading | tracking |
| --- | --- | --- | --- | --- | --- |
| display-xl | h1 | 800 | clamp(2.25rem, 0.8rem + 4.6vw, 4.25rem) · 36 → 68px | 1.0 | -0.02em |
| display-lg | h2 | 700 | clamp(1.75rem, 1.3rem + 1.4vw, 2.25rem) · 28 → 36px | 1.1 | -0.01em |
| display-md | statement, rail grade number | 600 | 1.75rem (the guide's 28px floor) | 1.2 | -0.005em |
| wordmark | header 26px, footer lockup 28px, giant footer | 800 | — | 1 | -0.02em |

Everything sits below the guide's Piazzolla sizes because Syne 800 is roughly a third wider; at the guide's 72px the six-word
headline would run to three lines on a laptop.

## Hero

Centred, as grask-6: h1 at max-width 1120px, lead at 640px, one button, the recording strip. The one change beside the face:
"the hours." no longer carries the underline highlighter but sits on a solid block of the same tint (`--g-accent-soft-2`,
`background-size: 100% 100%`, control radius, `box-decoration-break: clone` so it survives a line break), which reads as a label
and suits a face this square. The `.mark-in` sweep still animates the block in (its keyframes now go 0% → 100% at full height).

## Footer wordmark

The giant "Grask" was re-derived for Syne the way grask-6 did it for Piazzolla (canvas ink bounds + a baseline probe in headless
Chrome): `font-size: 22cqw; line-height: 0.8; margin: -0.035em 0.075em -0.152em 0`. Syne's "Grask" is 4.605em of ink against
Piazzolla's 2.540em, hence 22cqw instead of 39.9cqw for the same 101.4% bleed; the numbers and their derivation are in the comment
above `.giant` in `grask-6-syne.css`.

## Deviations from the guide

- Display face is not Piazzolla. Display-xl at 800 (the guide says 600–700). Display sizes below the guide's.
- Nothing else: no italics (Syne has none), display never below 28px, Golos and the palette untouched.

## Look at

The headline against the recording strip; the section titles at 36px next to 20px Golos card titles (do they still lead?);
the statement at 28px 600, which is where a wide face starts to feel like a slogan; the footer wordmark.

## Phone header (2026-09-29)

Syne 800 "Grask" at the header's 26px is about 120px of ink, 40px more than Piazzolla's, which pushed the header's button past the right edge at 390px (the page scrolled sideways to 408px). Under 480px the header lockup drops to 20px (`grask-6-syne.css`, next to the `.wordmark` rule); the footer lockup and the giant are unchanged.
