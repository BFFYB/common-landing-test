# grask-6-young-serif

grask-6 duplicated on 2026-09-29 to try another display face: **Young Serif** (Bastien Sozeau / Noirblanc, one weight) in place of Piazzolla.
A chunky, low-contrast serif with a large x-height, closer to a wood-type or Cooper feel than to a book face: the headline reads as friendly
and sturdy instead of literary. Golos Text below 28px, JetBrains Mono for code and the whole palette are grask-6's, untouched.

## Loading

`@import url("https://fonts.googleapis.com/css2?family=Young+Serif&family=Golos+Text:wght@400..600&family=JetBrains+Mono:wght@400..500&display=swap");`
(grask-6-young-serif.type.css). Young Serif is a static face: one weight, 400, no italic, no axes. `font-synthesis: none` on every display rule
so the browser never fakes a bold or an italic. Fallback `"Young Serif Fallback"` = local Georgia / Times at `size-adjust: 112%` (a starting
point, not measured).

## Display tokens (all weight 400)

| token | element | size | leading | tracking |
| --- | --- | --- | --- | --- |
| display-xl | h1 | clamp(2.5rem, 1rem + 5.4vw, 4.75rem) → 40–76px | 1.02 | -0.015em |
| display-lg | h2 | clamp(1.875rem, 1.4rem + 1.6vw, 2.5rem) → 30–40px | 1.1 | -0.01em |
| display-md | .statement, .rail .total b | 1.75rem (28px) | 1.2 | -0.005em |
| wordmark | .wordmark (lockups, giant) | 30px / 32px / 34.4cqw | 1 | -0.015em |

Piazzolla ran 700 / 700 / 600 at -0.02 / -0.015 / -0.01em; Young Serif's only weight is already heavier than Piazzolla 700, so the tracking
is a step looser everywhere and the headline gets a touch more leading (1.02, not 1.05: the face has short extenders and stacks tight).
The kit names in grask-6-young-serif.tokens.css (`--g-weight-display*`, `--g-tracking-display*`, `--g-leading-display`) carry the same values.

## Hero

Centred, as grask-6. The headline sits on two set lines, "Every student — heard." / "Without the hours.", by a `<br class="brk">` after
"heard." that is dropped under 560px so phones wrap freely (grask-6-young-serif.css). The highlighter under "the hours." is lower and thinner
(`background-position: 0 92%; background-size: 100% 34%`, was 86% / 56%) so it underlines the heavy letters instead of running through them;
the sweep-in keyframe matches. The lead opens at a 620px measure (LEAD_DEFAULT in grask-6-young-serif.lead.ts, was 650) to sit under the
two-line headline; the tryout panel still works.

## Giant footer wordmark

Re-derived for Young Serif 400 at -0.015em (canvas measureText in headless Chrome): `font-size: 34.4cqw; line-height: 0.8; margin: 0.06em 0.043em -0.15em 0`
(Piazzolla: 39.9cqw, -0.096em 0.067em -0.078em 0). Ink width of "Grask" 2.945em (Piazzolla 2.540em), ink 0.022em right of the box centre,
ascent 1.05em / descent 0.37em / cap 0.75em. The working is in the comment above `.giant` in grask-6-young-serif.css.
The reveal is now driven from the wordmark's overflow:hidden wrapper (`data-reveal="mask-wrap"`, grask-6-young-serif.motion.css): observed
directly, this face's box began below setupReveals' line (the bottom 8% of the viewport is excluded) even at the very bottom of the page, so
the wordmark never rose in.

## Deviations from the guide

Display weight 400 (the guide says 600–700; the face has nothing else). Nothing else: no italics, the display face stays at 28px and above.

## What to look at

The headline at 1440 and at 390; whether Young Serif's warmth fits an examiner product or reads as a bakery; the section titles at 40px, where
the face is at its best; the 28px statement, where its heaviness is most debatable; the footer wordmark's bleed.
