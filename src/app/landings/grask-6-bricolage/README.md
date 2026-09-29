# grask-6-bricolage — Grask with Bricolage Grotesque as the display face

One of the display-face experiments duplicated from grask-6 on 2026-09-29. Everything below 28px is still Golos Text
(the guide's text face, untouched), JetBrains Mono is still the code face, and the palette, radii and motion are grask-6's.
Only the voice changes: the headline, the section titles, the statement, the grade number in the rail and the wordmarks.

## The face
Bricolage Grotesque (Mathieu Triay, Google Fonts): a grotesque with personality, variable on three axes: optical size 12–96,
width 75–100, weight 200–800. The large optical masters are the point: at headline size the letters get livelier (the tail of the
`y`, the single-storey-ish `a`, the wide `W`) while at 28px it stays a sober grotesk, so one face covers the whole display range.

- Import (`grask-6-bricolage.type.css`): `family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,200..800`
- `--font-display: "Bricolage Grotesque", "Bricolage Grotesque Fallback", system-ui, Arial, sans-serif` (fallback: local Arial, size-adjust 103%)
- Display rules: `font-optical-sizing: auto; font-stretch: 100%` (normal width; the condensed masters are not used)

## Display sizes
| token | role | weight | size | leading | tracking |
| --- | --- | --- | --- | --- | --- |
| display-xl | h1 | 800 | clamp(2.75rem, 1rem + 6.4vw, 6rem) = 44 → 96px | 0.96 | -0.03em |
| display-lg | h2 | 700 | clamp(2rem, 1.5rem + 1.8vw, 2.75rem) = 32 → 44px | 1.05 | -0.02em |
| display-md | statement, rail grade number | 600 | 28px | 1.2 | -0.01em |
| wordmark | lockups, giant footer | 800 | 30px inline / 41cqw footer | 1 / 0.8 | -0.03em |

## The hero
Left-aligned (grask-6 centres it). The headline spans the 1200px column on two set lines, "Every student — heard." / "Without the hours.",
with a `<br class="brk">` after "heard." that is dropped under 560px, where the words wrap on their own; `text-wrap: balance` is off so
the break holds. Under it the lead (560px measure, the tryout default in `grask-6-bricolage.lead.ts`, narrower than the guide's 60ch) and
the "Book a demo" button share one bottom-aligned row (`.hero-row`); on narrow screens the row wraps and both sit left. The highlighter
under "the hours." sits at 90% instead of 86% because the sans's x-height is higher than Piazzolla's. The recording strip and everything
after the hero are grask-6.

## The giant footer wordmark
Re-derived for Bricolage 800 at -0.03em (measured in headless Chrome, see the comment above `.giant` in `grask-6-bricolage.css`): 41cqw,
margin `-0.02em 0.044em -0.149em 0`, so "Grask" bleeds 101.4% of the footer width as on grask-6 and the bottom 12% of the caps is cropped.
Because that crop is deeper than Piazzolla's (Bricolage's baseline sits 0.07em above the box bottom), the wordmark rises 30% instead of
55% in its mask reveal (`grask-6-bricolage.motion.css`); at 55% too little of it entered the reveal observer's root and it never appeared.

## Deviations from the guide
- Display face is a grotesk, not a serif: two sans faces on the page. Bricolage's large optical masters keep it apart from Golos.
- display-xl goes to 96px (the guide stops at 72) and display-lg to 44px (the guide's 40); leading 0.96 under 1.05.

## What to look at
The `W` and `y` of "Without the hours." at 96px; whether the headline and Golos lead read as two voices or as a mismatch; the section
titles at 44px 700 next to the 20px Golos card titles; the giant footer wordmark.
