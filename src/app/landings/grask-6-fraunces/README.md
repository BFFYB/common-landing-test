# grask-6-fraunces · the Grask landing with Fraunces as the display face

One of the display-face variants of grask-6 (2026-09-29). Everything under 28px is exactly grask-6: Golos Text for the
lead, body, labels, buttons and captions, JetBrains Mono for code, the palette and every `--g-*` token untouched. Only the
voice changes: **Fraunces** replaces Piazzolla in the display tokens.

## The face

Fraunces (Undercase Type, Google Fonts): a soft, slightly wonky old-style serif with a wide optical-size range. Chosen for
the "warm editorial" reading of the headline: rounder and friendlier than Piazzolla, still a book serif rather than a
display flourish, and it carries a true italic worth showing once.

- Import (grask-6-fraunces.type.css):
  `family=Fraunces:ital,opsz,wght,SOFT,WONK@0,9..144,300..900,0..100,0..1;1,9..144,300..900,0..100,0..1`
  (plus `Golos+Text:wght@400..600` and `JetBrains+Mono:wght@400..500`, as before).
- Every display rule sets `font-optical-sizing: auto` and `font-variation-settings: "SOFT" 100, "WONK" 1`: the rounded
  terminals and the wonky drawing that only appear at display sizes.
- Fallback: `"Fraunces Fallback"` = local Georgia / Times, size-adjust 102%.

## Display tokens (type.css, repeated by the h1 / h2 / .wordmark roles in grask-6-fraunces.css)

| token | weight | size | leading | tracking |
| --- | --- | --- | --- | --- |
| display-xl (h1) | 600 | clamp(2.75rem, 1.2rem + 6vw, 5.5rem) = 44 → 88px | 1.0 | -0.025em |
| display-lg (h2) | 600 | clamp(2rem, 1.5rem + 1.8vw, 2.75rem) = 32 → 44px | 1.08 | -0.02em |
| display-md (statement, rail total) | 500 | 28px | 1.2 | -0.01em |
| wordmark | 600 | as the logo | 1 | -0.02em |

Fraunces is dark at 700, so the display weight comes down to 600 (500 for display-md); the tokens file's `--g-weight-display*`,
`--g-tracking-display*` and `--g-leading-display*` say the same.

## Hero

Centred, as grask-6: headline up to 88px, lead measure 600px, one button, the recording strip. The word "heard." is set in
Fraunces italic (`.title .ital`) — a deliberate exception to the guide's "never italicise the display face" rule, made to
see whether one italic word earns its place. The highlighter under "the hours." is unchanged.

## Footer wordmark

Re-tuned by eye at 1440px (comment above `.giant` in grask-6-fraunces.css): `font-size: 43cqw; line-height: 0.8;
margin: -0.02em 0.03em -0.078em 0`. At Piazzolla's numbers the ink covered 94% of the footer and sat left of centre.

## What to look at

- The hero headline and whether the italic "heard." reads as a voice or as a decoration.
- The section titles at 44px (What an oral check looks like, Works with the LMS, Questions, the sandbox band).
- The statement at 28px / 500: Fraunces' lightest display setting on this page.
- Compare with `/grask-6` (Piazzolla) and the sibling `grask-6-*` variants via the switcher (`[` / `]`).
