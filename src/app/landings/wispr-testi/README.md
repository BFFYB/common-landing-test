# Wispr testimonial orbit

A port of the "From the first people to use it" case-study deck on [wisprflow.ai](https://wisprflow.ai/), extracted on 22 September 2026 from the live page (Webflow markup, the site stylesheet and an inline script). Photos, logos and copy are Wispr Flow's, kept as placeholder content so the port can be compared with the original; swap them before reusing the section anywhere.

## How the original is built

Markup (Webflow, class names theirs):

```
section.section_new-testi[data-corners=80]      dark, rounded, overflow: clip
  .testiv2_height                                 min-height 350vh, position: relative   ← the runway
    .testiv2_wrap                                 sticky top 0, min-height 100vh, flex-centred, perspective set by JS   ← the stage
      .testi_card.landscape  × 3  (46.25rem × 28.75rem, grid 1.1fr 1fr: text | photo + stats overlay)
      .testi_card.square     × 3  (26rem × 28.75rem)
```

Script (inline, GSAP 3.15 + ScrollTrigger), per build:

1. **Measure.** Every card's `offsetWidth` × deck scale. Deck scale is 1 up to 1920px, then `1 + (vw/1920 − 1) × 0.55`, capped at 2. Median width `medW` drives everything else.
2. **Track.** Cards get a running offset: `x[j] = x[j−1] + (w[j−1] + w[j]) / 2 + gap`, gap = 14% of `medW` clamped to 32–160px (22% below 768px). The span is the last offset.
3. **Pivot and perspective.** Every card gets `transform-origin: 50% 50% −orbit` with orbit = max(220px, 65% of `medW`); the stage gets `perspective` = 260% of `medW`.
4. **Render(head).** For card j: `sx = head − x[j]`; `rot = −50° + 100° × power1.inOut(clamp((sx + R) / 2R))` with R = 210% of `medW`; depth = orbit × (1 − cos rot); shrink `f = persp / (persp + depth)`; then `gsap.set(card, { x: sx / f, rotateX: rot })` on top of `xPercent: −50, yPercent: −50, scale: deckScale`. z-index is re-sorted by |sx| every frame.
5. **Scroll.** A proxy value `head` tweens 0 → span with `ease: none`, `scrollTrigger: { trigger: runway, start: 'top top', end: 'bottom bottom', scrub: 1.5 }` (scrub `true` under 768px). The runway height is set to `stageHeight + span × 0.85`.
6. Rebuilt on width change (debounced 200ms), on `load` and on `document.fonts.ready`.

So the cards travel left → right as you scroll down (card 0 starts centred, the rest wait off-screen left). A card left of centre has negative `rot`: its top tips toward you and, because the pivot is behind it, the whole card swings **down**; right of centre it tips back and swings **up**. Dividing `x` by the perspective shrink keeps the on-screen pitch even, which is why the deck reads as a flat carousel with tilted cards instead of a wheel.

A separate module (`data-corners`) scrubs the section's border radius: each edge's radius is that edge's distance to the viewport edge, capped at 80px (40px ≤ 991px), smoothed by 16% a frame.

The script also had `data-spacing` modes `gap` and `scale` that stretch the track by the shrink factor via a numeric integration; the live page uses the default `pitch` mode, where that is the identity, so the port leaves it out.

## This port

- `wispr-testi.ts`: the same constants (`K`, same names), `build()` / `render()` as above, and one `requestAnimationFrame` ticker that (a) follows the scroll target with the per-frame decay of an expo.out of 1.5s, which is what GSAP's numeric scrub is, and (b) does the corner scrub. No GSAP. The ticker sleeps when nothing is moving and wakes on scroll / resize / image load / fonts ready.
- `wispr-testi.html`: the six cards from a `readonly Card[]`, one `<ng-template>` for the body (`<a>` for case-study cards, `<article>` otherwise). A lead screen above and a "How it moves" note below give the sticky section something to scroll against.
- `wispr-testi.css`: the site's `.testi_card*` rules with effective values written out (several widths were overridden by a per-page embed), tokens as `--vast`, `--lumen`, `--dawn`, `--glow`, `--flare`, EB Garamond + Figtree from Google Fonts, breakpoints at 991 / 767 / 479 as on the site.
- Assets in `public/landings/wispr-testi/`.

Under `prefers-reduced-motion` the head follows the scroll directly (no 1.5s catch-up); the swing itself is scroll-driven and stays.
