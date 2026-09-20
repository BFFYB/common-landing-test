# Grask landing page

Exported from the design canvas on 20 September 2026. Imported into this playground as `src/app/landings/grask/` (the `static/` HTML version of the export was not kept).

## How it is put together

- **No leaks.** The component uses `ViewEncapsulation.None`, but every selector is scoped under `.grask-lp` and every keyframe is prefixed `glp-`, so nothing touches the rest of your app.
- **Five small stylesheets.** Angular's default budget is 4 kB per component stylesheet, so the CSS is split by job: `grask.fonts.css`, `grask.css` (base), `demo`, `demo-timeline`, `orbit`.
- **Brand kit (applied 2026-09-20).** Colours, fonts, radii and logos come from `bffyb/common/styling` (source of truth: its `tokens.json`). `grask.tokens.css` is a copy of the kit's `tokens.css`, scoped to `.grask-lp`, plus a few landing-only derived aliases (`--g-border-input`, `--g-ink-rgb`, `--g-on-accent-2`, `--g-text-faint`, `--g-tint-strong-rgb`) for things the kit has no token for yet. Every inline style references a `--g-*` alias, never a raw hex, so a palette change is a one-file edit. Logos are the kit's SVGs under `public/landings/grask/logo/` (lockup in header and footer, mark tile in the hero, wordmark in the footer). The brand name is written lowercase, as the kit does.
- **Self-hosted fonts.** Schibsted Grotesk (display, 700/800, 500 for editorial statements) and Instrument Sans (UI, 400/500/600), both variable, SIL Open Font License, licence texts in `fonts/`. The kit's README loads them from Google Fonts; this page keeps them local so it makes no third-party requests.
- **In-page links** go through `go($event)`, which scrolls with `scrollIntoView`. They work under any route and any `<base href>`.
- **Page motion** (added 2026-09-20, see `grask.motion.css`): scroll reveals on `data-reveal` elements (staggered with `data-delay="1".."6"`; `data-reveal="mask"` rises out of a clipped parent), a hero band of floating icon tiles joined by connector lines, scroll-driven parallax on the three "Where it fits" cards (`.drift`, `--dy`), hover lift on cards (`.lift`), and a nav shadow after 140px of scroll. The only JavaScript is an IntersectionObserver in `grask.ts` that adds `.glp-js` to the root and toggles `.is-in` per element; without it nothing is hidden. Reveals replay: an element that drops back out below the viewport snaps hidden again and re-enters on the next scroll down (elements that leave through the top stay shown; flip `mirror` in `setupReveals()` to replay in both directions). Property ownership: reveal owns `transform`, drift owns `translate`, lift owns `scale`.
- **Motion is CSS only.** Pause is a visually hidden checkbox plus a sibling selector. Under `prefers-reduced-motion` both loops stop on a complete, readable frame and the pause buttons disappear.

## Where things live

| What | Angular | Static |
| --- | --- | --- |
| Design tokens | `grask.tokens.css` (from `styling/tokens.css`) | not in the static export |
| Demo timing | `grask.demo-timeline.css` | search `glp-cap0` in `landing.css` |
| LMS arc | `grask.orbit.css` | search `.orbit` in `landing.css` |
| Hero entrance and highlighter | `grask.css` (`glp-rise`, `glp-mark-in`) | same names in `landing.css` |
| Scroll reveals, hero float, parallax, lift, nav shadow | `grask.motion.css` + `setupReveals()` in `grask.ts` | not in the static export |

- **Demo timeline:** one 34 s loop. Every percentage is a moment in it (1 s = 2.94%). Captions (`cap0` to `cap5`), word-by-word reveal (`say0` to `say4`), evidence rows and highlights (`ev1` to `ev3`, `hl1` to `hl3`), the grade ring (`grade`) and the voice bars (`voice`) all share that clock, so they stay in sync when paused.
- **LMS arc:** one keyframe path through seven positions, `--glp-p0` to `--glp-p6` (`p3` is the centre). Six tiles run the same path, each offset by 2.6 s. `--u` is the size unit and shrinks at three breakpoints. To change the number of tiles, the loop length (tiles x 2.6 s), the delays and the keyframe percentages (one step = 100% / tiles) change together.
- **Layout** is inline styles, as exported from the canvas; colours in them are `--g-*` tokens. Mapping from the export: page → paper, black buttons → petrol, the blue "student voice" → petrol, the yellow highlighter → tint-strong, card tints → tint / tint-strong / petrol, the dark plate → ink. Status colours (demonstrated / partial / missing) are reserved for a real evidence report and are not used on this page.

## Before it goes public

Search the HTML for `[` to find every placeholder.

- `[Persona name]` and `[University]` in the demo and the disclosure quote.
- LMS section: the description sentence, six `[Available, in pilot or planned]` statuses, and the lettered tiles, which stand in for official logos (follow each vendor's brand guidelines).
- `[Hosting region]`, `[Sub-processors]`, `[Retention period]`, `[Data-processing agreement]`.
- `[Pilot scope: courses, students, weeks]`, `[What we ask in return]`, `[email address]`.
- `[Photo]`, `[Founder name]`, the two-line bio, `[Direct email]`, `[LinkedIn]`.
- Footer: `[Contact email]`, `[Legal entity and address]`, `© 2026 [Legal entity]`. "Privacy policy" and "Imprint" point to `#top` until those pages exist.
- The sandbox button points to `https://grask.eu`. Swap in the real sandbox URL.
- The pilot form is not wired to anything: the button is `type="button"`.
- The demo dialogue is scripted and says so on the page. Replace it with a real capture from the prototype when you have one.
