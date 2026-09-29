# grask-6-mono · JetBrains Mono as the display face

grask-6 duplicated on 2026-09-29 (one of the display-face series; slug `grask-6-mono`, root class `.grask-6-mono-lp`,
prefix `glp6-mono-`). The experiment: the guide's own code face, JetBrains Mono, promoted from transcripts to the display role.
The idea is the product itself: a transcript is what the instructor gets back, so the headline reads like one. Golos Text stays
for everything under 28px, the palette is untouched, and everything after the hero is grask-6.

## Loading

`grask-6-mono.type.css`: `@import url("https://fonts.googleapis.com/css2?family=Golos+Text:wght@400..600&family=JetBrains+Mono:wght@400..800&display=swap")`
(Piazzolla dropped, the mono range widened to 800 for the display weights). Fallback `"JetBrains Mono Fallback"` is local Menlo /
Courier New at size-adjust 99%. `--font-display` is the mono stack; `--font-mono` is unchanged, so `.t-code` still reads the same face.

## Display tokens (re-drawn for a monospace: every glyph is 0.6em, so the sizes sit below the guide's and the tracking is tighter)

| token | weight | size | leading | tracking | worn by |
| --- | --- | --- | --- | --- | --- |
| display-xl | 700 | clamp(30px, 0.7rem + 4vw, 56px) | 1.1 | -0.04em | the h1 (two lines in the 1200px column at 56px) |
| display-lg | 700 | clamp(28px, 1.2rem + 1.4vw, 36px) | 1.15 | -0.03em | every h2 |
| display-md | 500 | 28px | 1.25 | -0.02em | the statement, the rail's grade number |
| wordmark | 700 | 28px (header, footer) | 1 | -0.04em | the two lockups and the giant footer wordmark |

`font-variant-ligatures: none` on all of them. Kit names in `grask-6-mono.tokens.css` follow these values.

## The hero ("transcript")

Left-aligned. A Golos caption above the headline set like a time readout (`00:00 · Oral check · Transcript`: t-caption, uppercase,
.04em, tabular figures, secondary colour). The headline is unbalanced so it fills its 1000px measure like a line of text; after
the last word a block caret in petrol (`.caret`, .5em × .95em) that is hidden until the last word has landed at 1.4s and then blinks
once a second with `steps(1)`, as a terminal's does; solid under reduced motion. The highlighter under "the hours." is a selection
block instead of an underline: the tint covers the whole line box, `box-decoration-break: clone` keeps the padding on both lines
when it wraps (it does on phones), and the sweep-in keyframes grow it to full height. Lead 600px and button left-aligned.

## Deviations from the guide

The display face is not Piazzolla and not a serif; sizes are below the guide's display-xl / -lg (a mono at 72px would not fit
the headline on two lines); the caret is an addition. Everything else (the 28px floor, no italics, sentence case) holds.

## Giant footer wordmark

`font-size: 37cqw; line-height: 0.8; margin: 0.02em 0.04em -0.128em 0`, derived from measured metrics (ink 2.737em wide, caps 0.73em,
ascent 1.02em, descent 0.30em); the derivation is in the comment above `.giant` in `grask-6-mono.css`.

## What to look at

The hero at 1440 and 390 (the block highlight wrapping on the phone), the h2 "What an oral check looks like" against the Golos
card titles beside it (two faces, close in colour: does the mono still read as the voice?), the statement at 28px 500, the rail's
grade number, and the footer wordmark. The lead tryout panel (from grask-4) is still there: `,` `.` faces, `t` hides it.
