# grask-6-space-grotesk-2 · Space Grotesk II, the type pass

grask-6-space-grotesk duplicated on 2026-09-30. The first Space Grotesk variant swapped the face and re-laid the hero; this one
re-tunes every weight and size on the page for the Space Grotesk + Golos Text pairing. The hero layout (two-column product grid),
Golos Text for everything under 28px, the palette and all the sections are unchanged.

## What changed, and why

Space Grotesk has a large x-height and wide letters, so at Piazzolla's sizes it looks a size bigger, and a single weight (700 for the
headline, the section titles and the wordmark) flattened the hierarchy into one voice at three sizes. The pass:

| Role | Was | Now | Where |
|---|---|---|---|
| display-xl, h1 | 700 · 44→80px · 0.98 · -0.035em | 700 · 44→76px · 1.0 · -0.03em | hero headline |
| display-lg, h2 | 700 · 32→44px · 1.05 · -0.025em | **600** · 30→40px · 1.1 · -0.02em | every section title |
| display-md | 500 · 28px · 1.2 · -0.015em | 500 · **28→32px** · 1.25 · -0.02em | the statement (#why) |
| grade number | 500 · 28px · -0.015em | 600 · 28px · -0.02em | `.rail .total b` |
| wordmark | 700 · 30px header / 28px footer · -0.035em | 700 · **28px** both · -0.03em | the two lockups (the giant is in cqw) |
| label-lg (new) | label, 14px | **500 · 16px** | "Book a demo" in the hero, "Open the sandbox" |
| lead on phones | 15px (desktop 18px minus 3) | **16px** (minus 2) | `LeadTryout.fontSize` in `.lead.ts` |

- The three display roles now step in weight as well as size: 700 → 600 → 500. The headline keeps 700 (Space Grotesk's Bold is its
  most characterful cut); the section titles at 600 stop competing with it, and on the dark and petrol bands 600 no longer looks smeared.
- Tracking tightens with size only: -0.03em on the headline, -0.02em below it. The old -0.035em closed the counters of "tt" and "rd".
- The statement sat exactly at the guide's 28px floor at every width and read as a bold paragraph rather than a statement; 32px on
  desktop (28px on phones, the floor) with 1.25 leading makes it the pause it is meant to be.
- The lockups drop to 28px: at 30px Space Grotesk's wide "Grask" was visibly bigger than the 34px mark next to it.
- The two tall calls to action (56px and 60px high) carried the 14px label token, which the grask-6 README already flagged as an open
  question for the guide; 16px at 500 fills the button. The header's 44px button keeps 14px.
- The lead tryout's phone rule took 3px off the desktop size, leaving the 18px lead at 15px on phones, under the 16px body it introduces;
  now 16px.

Unchanged on purpose: heading-sm (Golos 600 at 20px: card titles, FAQ questions), heading-xs, body / body-sm, label / label-sm, caption,
the nav at 15px, the giant footer wordmark (40.5cqw, derived from Space Grotesk's metrics in the first variant).

## Files

- `grask-6-space-grotesk-2.type.css`: the tokens (display block comment explains the pass; `.t-label-lg` is the one addition).
- `grask-6-space-grotesk-2.css`: the h1 / h2 / .wordmark roles repeat the tokens; a comment above h1 marks the pass.
- `grask-6-space-grotesk-2.tokens.css`: the kit names (`--g-weight-display-lg` added; tracking and leading values updated).
- `grask-6-space-grotesk-2.rail.css`: the grade number.
- `grask-6-space-grotesk-2.html`: the lockup size and the two `t-label-lg` buttons.
- `grask-6-space-grotesk-2.lead.ts`: the phone rule of the lead tryout.

## What to look at

Compare with `/grask-6-space-grotesk` side by side (`[` / `]` in the switcher): the section titles on the outcomes rail and the sandbox
band, the statement at 1440px, the header lockup against the mark, the hero button's label, and the lead on a phone.

## 2026-09-30, later

A hero brief (kicker, two-line 68px headline, marker on "Without the hours.", 20px subhead, second call to action, full-width strip,
the statement anchored above the fold) was applied and then reverted the same day at the author's request; this folder is the type pass as
described above.
