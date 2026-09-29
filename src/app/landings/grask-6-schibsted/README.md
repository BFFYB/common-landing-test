# grask-6-schibsted — Grask · Schibsted Grotesk (control)

grask-6 duplicated on 2026-09-29 as the **control** of the display-face series (grask-6-fraunces, -instrument-serif, -bodoni-moda,
-young-serif, -besley, -bricolage, -syne, -space-grotesk, -archivo, -mono). Every sibling redraws the hero around its face; this one
changes nothing but the face, so it answers the prior question: is a serif display face needed at all, or does the kit's original
grotesk carry the page once the type guide's sizes are on it?

## What changed against grask-6

- Display face: **Schibsted Grotesk** (the kit's original display face) instead of Piazzolla, in the display role only: h1, h2,
  `.t-display-md` (the statement, the rail's grade number), `.wordmark` (both lockups and the giant footer wordmark).
- Import (grask-6-schibsted.type.css): `family=Schibsted+Grotesk:ital,wght@0,400..900;1,400..900` next to the unchanged
  `Golos+Text:wght@400..600` and `JetBrains+Mono:wght@400..500`. Fallback: local Arial / Helvetica at size-adjust 103%.
- Display tokens (sizes are grask-6's, tracking a touch tighter because a grotesk needs it where a serif did not):
  - display-xl (h1): 700, `clamp(2.5rem, 1.2rem + 5.2vw, 4.5rem)` (40 → 72px), line-height 1.05, tracking -0.025em
  - display-lg (h2): 700, `clamp(2rem, 1.5rem + 1.6vw, 2.5rem)` (32 → 40px), line-height 1.1, tracking -0.02em
  - display-md (statement, rail total): 600, 1.75rem (28px), line-height 1.2, tracking -0.01em (unchanged)
  - wordmark: 700, -0.025em, 30px in the header, 32px in the footer lockup
- Giant footer wordmark, re-derived for the face (grask-6-schibsted.css, the comment above `.giant`): `font-size: 36.7cqw`,
  `margin: -0.006em 0.044em -0.125em 0` (ink width 2.760em, centre offset +0.022em, ascent .977 / descent .258, cap height .703).
- Hero layout, every other token, the palette, the lead tryout panel: untouched.

## What to compare against grask-6

- The hero headline and the section titles side by side: warmth and voice (Piazzolla) against neutrality and evenness (Schibsted).
- Two grotesks on one page (Schibsted display, Golos text): whether the contrast between the roles still reads at 28px, where the
  statement and the rail's grade number sit exactly on the guide's floor.
- The wordmarks: the header lockup at 30px and the giant footer "Grask".
