# grask-10 · the C8 hero row (on the C6 type)

grask-5 duplicated on 2026-10-01 (`cp -r` plus three literal renames: `grask-5` → `grask-10`, `glp5` → `glp10`, `Grask5` → `Grask10`,
so nothing is shared with the original) and two hero briefs applied in turn, both in `grask-10.hero.css`: the C6 brief put the C6
typography and copy on grask-5's centred hero; the C8 brief, later the same day, turned that centred stack into the two-column row of
`docs/design/hero-c8-reference.html`. That reference file is not in this repo, so the row is built from the brief's written values and the
choices it left open are listed below. The recording strip ("Watch a check run", `grask-10.strip.css`) is grask-5's, less the ticks; every
section below it is grask-5, untouched.

## The row (the C8 brief, 2026-10-01)

| Part | Now | Where |
|---|---|---|
| Container | The hero is a 1280px container, `margin: 0 auto`, 72px sides from 1100px up (`--glp10-pad`); below that the page's clamp(20px, 4vw, 40px). The header's inner container takes the same width and padding, so the logo, the headline and the card share one left edge (72px at a 1280px viewport). No minimum height. | `.hero.css`, `.html` |
| Row | A 12-column grid, 24px gutters, `align-items: end`: the headline in columns 1–8, the side block in 10–12, column 9 empty. 96px from the header to the row, 72px from the row to the strip. | `.hero.css` |
| Headline | Fraunces 300 at opsz 144 / SOFT 50, clamp(44px, 7.2vw, 92px), 0.96 leading, -0.03em, left-aligned, no max-width. Three set lines, "Every student" / "gets heard." / "Without the hours.", as `.hero-line` spans that are blocks from 600px up and inline below, so a phone wraps the text on its own. "heard." is the face's italic, petrol. The word-by-word entrance stays. | `.html`, `.hero.css` |
| Side block | Left-aligned, 8px bottom padding so its last line sits a touch above the headline's: kicker (DM Mono 12px, capitals, 0.06em, petrol) → 18px → subhead (Instrument Sans 16px on 1.5, #454A4D, the column's width) → 18px → the calls to action stacked: "Book a demo" (solid #131516, 6px corners, 600 15px, 14px 24px) over the text link "Or try a three-minute check yourself →", 10px apart. | `.html`, `.hero.css` |
| Strip | Spans the container (grask-5 centred it at 1080px); its own 12px top margin is folded into the row's 72px. The ✓ ticks that popped in after a criterion's name once the playhead left it are gone (the SVG in the template and the `.seg-check` rule); the active criterion is marked by the petrol colour alone. Nothing else inside it changed. | `.hero.css`, `.html`, `.strip.css` |
| Below 1100px | One column: the side block under the headline, 560px at most, left-aligned, the calls to action still stacked. | `.hero.css` |

### Choices where the brief is silent

- **Above and below the row under 1100px**: 64px and 56px (48px and 40px under 600px), against 96px and 72px on the row.
- **Between the headline and the side block** once the block drops under it: 36px.
- **The text link stays on one line** (`white-space: nowrap`): in the three columns it is a few pixels wider than the column at 1280px and
  runs into the right padding rather than breaking after "check".
- **The header's container** changed to match the hero's (1280px, 72px sides): the brief says the hero's sides match the nav's left edge and
  checks that the logo, the headline and the card align at 72px, which grask-5's 1200px header (its logo at 80px at a 1280px viewport)
  could not give. Nothing else in the header changed.

## Before the row (the C6 brief, 2026-10-01)

Kept from that pass: Fraunces (the brief's tag verbatim) and DM Mono 400 as two `<link>`s at the top of the template, Instrument Sans 400–700 as
the `@import` at the top of `grask-10.hero.css` (Angular keeps an absolute-URL stylesheet link in a template as a plain element); the page's own
faces (Piazzolla, Golos Text, JetBrains Mono, `grask-10.type.css`) carry everything below the hero. The copy: the kicker "Oral exams, run by
voice", the headline without the em dash or the highlighter (`.mark`, `.mark-in`, `glp10-mark-in` removed from `grask-10.css`), the subhead
"Grask holds a short oral check with each student by voice, following your rubric. You get the recording, the transcript organised by
criterion, and an evidence report. You grade.", the near-black "Book a demo" (the petrol pill is gone) and the text link to grask.eu.
"grade recommendation" is gone from this landing (the old lead and the comments in `.type.css` and `.rail.css`). The hero lead's type tryout
panel (grask-4 → grask-5: `.lead.ts`, `.lead.css`, the `,` `.` `t` keys, the localStorage sync) is removed: the briefs fix the subhead's type.
The header's outlined "Book a demo" takes the hero button's box (48px, 6px corners, Instrument Sans 600 15px on 20px, 24px sides; its 1.5px
outline is an inset box-shadow, not a border, so both buttons are the same width at every pixel density).

## Left alone on purpose

- **The card's stylesheet** differs from `grask-5.strip.css` only by the `glp5-` → `glp10-` prefix and the removed `.seg-check` rule.
- **The other landings** (grask-3, -4, -5, -6 and the grask-6-* variants) still say "grade recommendation" in their hero lead and comments;
  they are separate snapshots and were not edited.

## What to look at

1280 (the headline at 92px on three lines in eight columns, the side block bottom-aligned to it, the logo, the headline and the card on one
left edge at 72px, the strip across the container), 1100 (the row at its narrowest: the link a little wider than its three columns), 900
(the side block under the headline), 390 (the headline at 44px wrapping on its own, the stacked calls to action, the card as on `/grask-5`).
