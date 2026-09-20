# Grask landing page (capital G)

A copy of `src/app/landings/grask/`, made on 20 September 2026, with the brand name written **Grask** instead of the kit's lowercase **grask**, so the two can be compared side by side at `/grask` and `/grask-2`. Everything else is identical at the time of copying; edits to one do not affect the other.

What differs from `grask/`:

- Every mention of the name in the copy is `Grask` (the domain `grask.eu` and the "grasp + ask" line are unchanged).
- The kit's lockup and wordmark SVGs are outlined paths that spell "grask", so they are not used. The header and footer show the mark tile (`public/landings/grask-2/logo/grask-mark-tile.svg`) next to the name as live text in the display font (`.lockup`), and the giant footer wordmark is the name as text, edge to edge like Instructure's footer: sized in container units (`36.6cqw`, see the comment on `.giant` in `grask-2.css`) so it always fills the viewport width, with its bottom cropped by the page end.
- Scope class `.grask-2-lp`, keyframe/utility prefix `glp2-`, assets under `public/landings/grask-2/`, so nothing collides with `grask/` when both are loaded.

The rest of this file is the original's, with those names substituted.

## How it is put together

- **No leaks.** The component uses `ViewEncapsulation.None`, but every selector is scoped under `.grask-2-lp` and every keyframe is prefixed `glp2-`, so nothing touches the rest of your app.
- **Small stylesheets, split by job.** `grask.tokens.css`, `grask.fonts.css`, `grask.css` (base), `demo`, `demo-timeline`, `orbit`, `motion`, `glass`.
- **Brand kit (applied 2026-09-20).** Colours, fonts, radii and logos come from `bffyb/common/styling` (source of truth: its `tokens.json`). `grask.tokens.css` is a copy of the kit's `tokens.css`, scoped to `.grask-2-lp`, plus a few landing-only derived aliases (`--g-border-input`, `--g-ink-rgb`, `--g-on-accent-2`, `--g-text-faint`, `--g-tint-strong-rgb`) for things the kit has no token for yet. Every inline style references a `--g-*` alias, never a raw hex, so a palette change is a one-file edit. Logos are the kit's SVGs under `public/landings/grask-2/logo/` (lockup in header and footer, mark tile in the hero, wordmark in the footer). The brand name is written lowercase, as the kit does.
- **Self-hosted fonts.** Schibsted Grotesk (display, 700/800, 500 for editorial statements) and Instrument Sans (UI, 400/500/600), both variable, SIL Open Font License, licence texts in `fonts/`. The kit's README loads them from Google Fonts; this page keeps them local so it makes no third-party requests.
- **In-page links** go through `go($event)`, which scrolls with `scrollIntoView`. They work under any route and any `<base href>`.
- **Page motion** (added 2026-09-20, see `grask.motion.css`): scroll reveals on `data-reveal` elements (staggered with `data-delay="1".."6"`; `data-reveal="mask"` rises out of a clipped parent), a hero band of floating icon tiles joined by connector lines, scroll-driven parallax on the three "Where it fits" cards (`.drift`, `--dy`), hover lift on cards (`.lift`), and a nav shadow after 140px of scroll. The only JavaScript is an IntersectionObserver in `grask.ts` that adds `.glp2-js` to the root and toggles `.is-in` per element; without it nothing is hidden. Reveals replay: an element that drops back out below the viewport snaps hidden again and re-enters on the next scroll down (elements that leave through the top stay shown; flip `mirror` in `setupReveals()` to replay in both directions). Property ownership: reveal owns `transform`, drift owns `translate`, lift owns `scale`.
- **Liquid glass** (added 2026-09-20, see `grask.glass.css`): the sticky header pill is a port of React Bits' [GlassSurface](https://reactbits.dev/components/glass-surface) (MIT). Its `backdrop-filter` is an inline SVG filter: an `feImage` displacement map the size of the pill (edges are red/blue gradients, the centre is mid-grey, so the backdrop bends only at the rim) drives three `feDisplacementMap`s at slightly different scales, one per colour channel, for the chromatic fringe. `setupLiquidGlass()` in `grask.ts` builds the filter for every `[data-liquid-glass]` element, sizes the map to it and regenerates it on resize; the lens shape is the `LIQUID_GLASS` constant there, the by-eye tunables (`--glp2-glass-frost`, `--glp2-glass-blur`, `--glp2-glass-saturation`) are at the top of `grask.glass.css`. Chrome and Edge only, as in React Bits: Safari renders `url()` backdrop filters wrong and Firefox rejects them, so there (and without JS, and under `prefers-reduced-transparency`) the pill is the plain frosted blur. To glass another element, give it `class="glass" data-liquid-glass` and a `border-radius`.
- **Motion is CSS only.** Pause is a visually hidden checkbox plus a sibling selector. Under `prefers-reduced-motion` both loops stop on a complete, readable frame and the pause buttons disappear.

## Where things live

| What | Angular | Static |
| --- | --- | --- |
| Design tokens | `grask.tokens.css` (from `styling/tokens.css`) | not in the static export |
| Demo timing | `grask.demo-timeline.css` | search `glp2-cap0` in `landing.css` |
| LMS arc | `grask.orbit.css` | search `.orbit` in `landing.css` |
| Hero entrance and highlighter | `grask.css` (`glp2-rise`, `glp2-mark-in`) | same names in `landing.css` |
| Scroll reveals, hero float, parallax, lift, nav shadow | `grask.motion.css` + `setupReveals()` in `grask.ts` | not in the static export |
| Liquid glass header | `grask.glass.css` + `setupLiquidGlass()` in `grask.ts` | not in the static export |

- **Demo timeline:** one 34 s loop. Every percentage is a moment in it (1 s = 2.94%). Captions (`cap0` to `cap5`), word-by-word reveal (`say0` to `say4`), evidence rows and highlights (`ev1` to `ev3`, `hl1` to `hl3`), the grade ring (`grade`) and the voice bars (`voice`) all share that clock, so they stay in sync when paused.
- **LMS arc:** one keyframe path through seven positions, `--glp2-p0` to `--glp2-p6` (`p3` is the centre). Six tiles run the same path, each offset by 2.6 s. `--u` is the size unit and shrinks at three breakpoints. To change the number of tiles, the loop length (tiles x 2.6 s), the delays and the keyframe percentages (one step = 100% / tiles) change together.
- **Layout** is inline styles, as exported from the canvas; colours in them are `--g-*` tokens. Mapping from the export: page → paper, black buttons → petrol, the blue "student voice" → petrol, the yellow highlighter → tint-strong, card tints → tint / tint-strong / petrol, the dark plate → ink. Status colours (demonstrated / partial / missing) are reserved for a real evidence report and are not used on this page.

## Before it goes public

Search the HTML for `[` to find every placeholder.

- `[Persona name]` and `[University]` in the demo and the disclosure quote.
- LMS section: the description sentence, six `[Available, in pilot or planned]` statuses, and the four remaining lettered tiles (Brightspace, Blackboard, ILIAS, itslearning), which stand in for official logos (follow each vendor's brand guidelines). Moodle and Canvas already use their official marks, cut from the vendors' wordmarks (via Wikimedia Commons) into `public/landings/grask-2/lms/`, in the vendors' own colours; those hexes are deliberately not `--g-*` tokens, since third-party logos must not follow the palette. Drop the other four in the same folder as `<img>` tiles: the tile rule fits wide marks by width and square ones by height.
- `[Hosting region]`, `[Sub-processors]`, `[Retention period]`, `[Data-processing agreement]`.
- `[Pilot scope: courses, students, weeks]`, `[What we ask in return]`, `[email address]`.
- Footer: `[Contact email]`, `[Legal entity and address]`, `© 2026 [Legal entity]`. "Privacy policy" and "Imprint" point to `#top` until those pages exist.
- The sandbox button points to `https://grask.eu`. Swap in the real sandbox URL.
- The pilot form is not wired to anything: the button is `type="button"`.
- The demo dialogue is scripted and says so on the page. Replace it with a real capture from the prototype when you have one.
