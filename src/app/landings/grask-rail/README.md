# Grask outcome rail

A dark section that pins to the screen while its cards slide sideways as you scroll down. Made on 23 September 2026. The motion follows the "Built for results" outcomes section on [getfluently.app](https://getfluently.app/), worked out from its live page (a Next.js build with a small hand-written scroll-scrub hook, no GSAP). Only the motion was taken. The code here is written from scratch; the copy is Grask's (the data-structures course from `grask-flow`); the card art is CSS gradients and grain, not photos. Names, grades and percentages on the cards are made up.

## How the original moves

- **Runway.** The section is 235vh tall: a sticky stage 100vh high, then a 135vh spacer. The stage holds the eyebrow, a two-line title and a 1200px column with six 440 × 400 cards (radius 40, gap 16) in a row that overflows to the right.
- **Scrub.** A scroll listener maps progress through the spacer to the row's `translateX`. Progress is 0 when the spacer's top meets the viewport's bottom (so the section's top at the viewport's top) and 1 once the spacer has scrolled past. The site hard-codes the travel per breakpoint (1480 / 1740 / 2000px).
- **Spring.** The row does not jump to the target: every frame it steps a spring (stiffness 500, damping 60, mass 1) toward it and sleeps once it is within half a pixel. The damping ratio is 1.34, so it trails the wheel and settles without overshoot. Under reduced motion it follows the scroll directly.
- **Appear.** Each card's widget starts transparent and 80px low. An IntersectionObserver (bottom margin 80px) flips it to rest once, the first time it is in view, and a CSS transition carries it there on a bouncy spring (0.8s, bounce 0.4), delayed 0, 0.15 or 0.3s. The stage clips the row, so cards still off to the right do not count as in view: their widgets pop as they slide on screen.
- **Phones (< 720px).** No runway, no scrub. The cards (320 × 320) run as a CSS marquee at 75px/s over a duplicated list.
- **Hover.** The widgets lift and scale slightly on a spring, on pointer devices only.

## This version

- `grask-rail.ts`: the knobs (`K`) at the top; `setupRail()` measures the geometry on layout changes only (resize, fonts), then each frame reads `scrollY`, steps the spring and writes one transform. The travel is computed rather than hard-coded: row width minus column width, so the last card always ends flush with the column's right edge at any width. The spring is integrated with semi-implicit Euler in sub-steps of at most 1/120s: at 30fps a single step of a spring this stiff is unstable. `setupAppear()` is the IntersectionObserver.
- `grask-rail.html`: lead screen, the rail, a "How it moves" note. The cards come from one `@for` over two copies of `cards`; the second copy is `display: none` except on phones, where the marquee needs it.
- `grask-rail.css`: tokens on `:host`, the two springs as `linear()` curves (generated from response + bounce with SwiftUI's definition, `omega = 2π / response`, `damping ratio = 1 - bounce`), the six widgets, the phone marquee (duration `n × 336 / 75` s, so 75px/s for any card count), reduced motion (no loops, widgets fade in place, the marquee turns into a swipeable, snapping row).
- `grask-rail.fonts.css` + `fonts/`: Uncut Sans and Urbanist, self-hosted, copied from grask-flow.

The runway length is the spacer's height in the css (135vh); the script reads it, so change it there only.

Checked in headless Chrome at 1600 × 900, 820 × 1180 and 390 × 844, and in headless Firefox at 1600 × 900. Nothing here needs `animation-timeline`, so Firefox gets the same motion as Chrome.
