import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  ViewEncapsulation,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { LEAD_KEY, LeadTryout } from './grask-6-young-serif.lead';
import { RAIL, setupRail } from './grask-6-young-serif.rail';
import { setupButtonWave } from './grask-6-young-serif.wave';

/**
 * Grask 6 · Young Serif: grask-6 duplicated on 2026-09-29 to try another display face. Young Serif (chunky,
 * low-contrast, one weight that reads bold) replaces Piazzolla in the three display tokens (grask-6-young-serif.type.css,
 * the h1 / h2 / .wordmark roles in grask-6-young-serif.css); the hero stays centred but the headline sits on two set lines
 * with a lower, thinner highlighter. Golos Text below 28px and the palette are unchanged. See README.md here.
 *
 * Grask 5: grask-4 duplicated on 2026-09-29 with the Grask type guide applied (test-landing/font-styling.css,
 * carried here as grask-6-young-serif.type.css): Piazzolla for the display face at 28px and above, Golos Text for
 * everything else, JetBrains Mono for code. The tokens and the role rules are in grask-6-young-serif.tokens.css and
 * grask-6-young-serif.css; the lead opens as the guide's hero subheadline and its tryout panel (from grask-4) stays for
 * comparison. Everything else is grask-4. See README.md here.
 *
 * Grask 4: grask-3 (Uncut Sans / Urbanist) duplicated on 2026-09-25 to find a readable face for the hero
 * lead ("Runs your oral checks by voice…"). The lead's type is set live from a tryout panel at the bottom
 * left (grask-6-young-serif.lead.ts: faces, weight, size, tracking, leading, measure, colour; kept in localStorage;
 * grask-6-young-serif.lead.css: the panel and the Google Fonts imports). `,` and `.` step through the faces, `t` toggles
 * the panel (onKey).
 *
 * Static markup and CSS: the demo timeline, the recording strip in the hero (grask-6-young-serif.strip.css, on
 * the demo's clock), LMS orbit and the pinned scroll sections (grask-6-young-serif.scroll.css) are pure CSS. The
 * runtime pieces are an IntersectionObserver that marks [data-reveal] elements as they scroll in (see
 * grask.motion.css), the header bar that hides on the way down and returns on the way up
 * (setupHeaderHide), the statement's scroll-driven fill where the browser has no animation-timeline
 * (setupStatementFill), the button hover (grask-6-young-serif.wave.ts), seek(),
 * which moves the demo and the strip to a rubric criterion, the outcome rail after the demo (grask-6-young-serif.rail.ts:
 * the scroll scrub on a spring and the widgets' appearance; its look is grask-6-young-serif.rail.css), and the SVG
 * lens filter for [data-liquid-glass] elements (grask.glass.css; the header no longer uses it).
 * The pilot form is its own page, pilot/pilot.ts at /grask-6-young-serif/pilot; the "Book a demo" buttons and the
 * Pilot links are router links to it. The hero's "Watch a check run" is the strip's title, an in-page link to #how.
 * Styles are global on purpose (ViewEncapsulation.None) but every selector is scoped under .grask-6-young-serif-lp and
 * every keyframe is prefixed glp6-young-serif-, so nothing leaks.
 */
@Component({
  selector: 'landing-grask-6-young-serif',
  templateUrl: './grask-6-young-serif.html',
  styleUrls: [
    './grask-6-young-serif.tokens.css',
    './grask-6-young-serif.type.css',
    './grask-6-young-serif.css',
    './grask-6-young-serif.demo.css',
    './grask-6-young-serif.demo-timeline.css',
    './grask-6-young-serif.orbit.css',
    './grask-6-young-serif.motion.css',
    './grask-6-young-serif.scroll.css',
    './grask-6-young-serif.strip.css',
    './grask-6-young-serif.rail.css',
    './grask-6-young-serif.glass.css',
    './grask-6-young-serif.lead.css',
  ],
  imports: [RouterLink],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display: block', '(document:keydown)': 'onKey($event)' },
})
export class Grask6YoungSerif {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  /** The recording strip in the hero (see grask-6-young-serif.strip.css). */
  readonly bars = STRIP_BARS;
  readonly total = STRIP_TOTAL_S;
  readonly segments = STRIP_SEGMENTS;
  /** The outcome rail after the demo: card data for the template (see grask-6-young-serif.rail.ts). */
  readonly rail = RAIL;
  /** The hero lead's type tryout (see grask-6-young-serif.lead.ts); its values are bound onto <p class="lead">. */
  readonly lead = new LeadTryout();

  constructor() {
    effect(() => this.lead.save());
    afterNextRender(() => {
      this.syncLeadAcrossWindows();
      this.setupReveals();
      this.setupLiquidGlass();
      this.stylePageScrollbar();
      this.setupHeaderHide();
      this.setupStatementFill();
      this.syncStrip();
      const root = this.host.nativeElement.querySelector<HTMLElement>('.grask-6-young-serif-lp');
      if (root) {
        setupButtonWave(root);
        this.destroyRef.onDestroy(setupRail(root));
      }
    });
  }

  /** `,` and `.` step the lead's face back and forward, `t` opens and closes the panel; not while typing in a field. */
  onKey(event: KeyboardEvent): void {
    if (event.metaKey || event.ctrlKey || event.altKey || !(event.key in LEAD_KEYS)) {
      return;
    }
    const t = event.target as HTMLElement | null;
    if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) {
      return;
    }
    event.preventDefault();
    LEAD_KEYS[event.key](this.lead);
  }

  /**
   * The tryout's setting is saved to localStorage on every change (the effect in the constructor); this
   * picks up a save made by another window, the device preview's iframe or a second tab, so both show
   * the same lead.
   */
  private syncLeadAcrossWindows(): void {
    const onStorage = (e: StorageEvent) => {
      if (e.key === LEAD_KEY) {
        this.lead.load();
      }
    };
    window.addEventListener('storage', onStorage);
    this.destroyRef.onDestroy(() => window.removeEventListener('storage', onStorage));
  }

  /** Smooth-scrolls to an in-page section; works under any route and any <base href>. */
  go(event: Event): void {
    const link = event.currentTarget as HTMLAnchorElement;
    const id = (link.getAttribute('href') ?? '').slice(1);
    const target = id ? document.getElementById(id) : null;
    if (!target) {
      return;
    }
    event.preventDefault();
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  }

  /**
   * Jumps the example to the start of a rubric criterion: every animation in the demo stage and in
   * the strip (wave, labels, clock) is moved to that moment of their shared 34 s loop (the strip's clock
   * is described in grask-6-young-serif.strip.css). Under reduced motion nothing animates, so there is nothing to move.
   */
  seek(index: number): void {
    const at = (this.segments[index].from / STRIP_TOTAL_S) * STRIP_SWEEP_MS;
    for (const animation of clockAnimations('.stage, .wave, .segs, .strip-time')) {
      animation.currentTime = at;
    }
  }

  /**
   * Puts the strip on the demo's clock. CSS animations created in the same frame share a start time
   * anyway; this makes the alignment explicit by copying the demo's first caption animation's time.
   */
  private syncStrip(): void {
    const reference = document
      .getAnimations()
      .find((a) => 'animationName' in a && (a as CSSAnimation).animationName === 'glp6-young-serif-cap0');
    if (!reference || reference.currentTime === null) {
      return;
    }
    for (const animation of clockAnimations('.wave, .segs, .strip-time')) {
      animation.currentTime = reference.currentTime;
    }
  }

  /**
   * Scroll reveals. Adds .glp6-young-serif-js to the root (which is what lets the CSS hide [data-reveal]
   * elements at all) and toggles .is-in per element:
   *   - in view (≥12% or ≥120px of it)          → .is-in, entrance plays
   *   - scrolled back out below the viewport     → .is-in removed (snaps hidden), so scrolling
   *                                                down again replays it
   *   - out above the viewport                   → stays / becomes .is-in, so deep links and
   *                                                scrolling back up show settled content
   * Set `mirror` to true to also reset elements that leave through the top, i.e. replay when
   * scrolling back up too.
   */
  private setupReveals(): void {
    const mirror = false;
    const root = this.host.nativeElement.querySelector<HTMLElement>('.grask-6-young-serif-lp');
    if (
      !root ||
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const {
          target,
          isIntersecting,
          intersectionRatio,
          intersectionRect,
          boundingClientRect,
          rootBounds,
        } of entries) {
          const visible =
            isIntersecting && (intersectionRatio >= 0.12 || intersectionRect.height >= 120);
          const above = !isIntersecting && boundingClientRect.bottom <= (rootBounds?.top ?? 0);
          const below =
            !isIntersecting && boundingClientRect.top >= (rootBounds?.bottom ?? window.innerHeight);
          if (visible || (above && !mirror)) {
            target.classList.add('is-in');
          } else if (below || (above && mirror)) {
            target.classList.remove('is-in');
          }
        }
        // An instant jump (End key, scrollbar drag, hash change) can skip elements from "below" to
        // "above" without a callback of their own; settle them so scrolling back up shows content.
        if (!mirror) {
          for (const el of targets) {
            if (!el.classList.contains('is-in') && el.getBoundingClientRect().bottom <= 0) {
              el.classList.add('is-in');
            }
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: [0, 0.12] },
    );
    const targets = root.querySelectorAll('[data-reveal]');
    root.classList.add('glp6-young-serif-js');
    targets.forEach((el) => io.observe(el));
    this.destroyRef.onDestroy(() => io.disconnect());
  }

  /**
   * Hides the header bar on the way down and brings it back on the way up (states are .is-top and
   * .is-hidden on .bar, see grask-6-young-serif.css):
   *   - within 80px of the top it is shown, transparent and borderless (.is-top); scrollY <= 0 counts
   *     as the top, so iOS overscroll bounce never hides it
   *   - it hides only once the hero's content is completely above the viewport (its last element, the
   *     recording strip; the section itself is a full screen tall and its lower part is empty paper, so
   *     measuring the section kept the bar on an empty screen), and only after 10px of downward travel
   *     since the scroll last changed direction; 10px upward brings it back
   *   - never while something in it has keyboard focus (:focus-visible; focusin also forces it shown),
   *     or while a menu in it is open (a toggle with aria-expanded="true"; there is no mobile menu
   *     yet, so this is for when one is added)
   * The scroll listener is passive and coalesced to one update per frame. Hiding is a transform, so
   * the page never reflows; the 200ms transition, and its absence under reduced motion, is in the CSS.
   */
  private setupHeaderHide(): void {
    const root = this.host.nativeElement;
    const header = root.querySelector<HTMLElement>('header.bar');
    const hero = root.querySelector<HTMLElement>('.hero');
    if (!header || !hero) {
      return;
    }
    const heroContent = hero.lastElementChild ?? hero;
    const TOP = 80;
    const STEP = 10;
    let lastY = Math.max(0, window.scrollY);
    let turnY = lastY; // where the scroll last changed direction
    let down = false;
    let queued = false;
    const locked = () =>
      header.querySelector(':focus-visible') !== null ||
      header.querySelector('[aria-expanded="true"]') !== null;
    const update = () => {
      queued = false;
      const y = Math.max(0, window.scrollY);
      if (y !== lastY) {
        if (y > lastY !== down) {
          down = y > lastY;
          turnY = lastY;
        }
        lastY = y;
      }
      header.classList.toggle('is-top', y < TOP);
      const heroGone = heroContent.getBoundingClientRect().bottom <= 0;
      if (y < TOP || !heroGone || locked()) {
        header.classList.remove('is-hidden');
      } else if (Math.abs(y - turnY) > STEP) {
        header.classList.toggle('is-hidden', down);
      }
    };
    const onScroll = () => {
      if (!queued) {
        queued = true;
        requestAnimationFrame(update);
      }
    };
    const show = () => header.classList.remove('is-hidden');
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    header.addEventListener('focusin', show);
    this.destroyRef.onDestroy(() => {
      window.removeEventListener('scroll', onScroll);
      header.removeEventListener('focusin', show);
    });
  }

  /**
   * The statement's fill for browsers without scroll-driven animations (Firefox, as of 2026-09-22).
   * Where animation-timeline is supported the fill runs on the track's view timeline in
   * grask-6-young-serif.scroll.css and this does nothing. Elsewhere it writes the pinned scroll's progress, 0 at
   * the pin's first frame and 1 at its last (contain 0% to 100% of the track), to --glp6-young-serif-why-p on
   * the track on every scroll frame, and the CSS maps that onto the same ranges. Passive listener,
   * coalesced to one update per frame; nothing under prefers-reduced-motion, where the text is in ink.
   */
  private setupStatementFill(): void {
    const track = this.host.nativeElement.querySelector<HTMLElement>('.stop');
    if (
      !track ||
      CSS.supports('animation-timeline: scroll()') ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }
    let queued = false;
    const update = () => {
      queued = false;
      const rect = track.getBoundingClientRect();
      const travel = rect.height - window.innerHeight; // how far the page scrolls while the pin holds
      const progress = travel > 0 ? Math.min(1, Math.max(0, -rect.top / travel)) : 1;
      track.style.setProperty('--glp6-young-serif-why-p', progress.toFixed(4));
    };
    const onScroll = () => {
      if (!queued) {
        queued = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    this.destroyRef.onDestroy(() => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    });
  }

  /**
   * The page scrollbar lives on <html>, outside this component, so grask-6-young-serif.css reaches it through a
   * class that is only there while this landing is on screen (see "Page scrollbar" there).
   */
  private stylePageScrollbar(): void {
    const html = document.documentElement;
    html.classList.add('glp6-young-serif-page');
    this.destroyRef.onDestroy(() => html.classList.remove('glp6-young-serif-page'));
  }

  /**
   * Liquid glass on [data-liquid-glass] elements (the header pill). A port of React Bits'
   * GlassSurface: the element's backdrop-filter is an SVG filter whose feDisplacementMap is
   * driven by a generated image the size of the element (see displacementMap below), so the
   * backdrop bends at the edges of the pill and passes straight through in the centre. The map
   * is a data URI sized to the element, so it is regenerated whenever the element resizes.
   * Chrome/Edge only: Safari renders url() backdrop filters wrong and Firefox does not support
   * them, so there (and without JS) the pill keeps the plain blur in grask.glass.css.
   */
  private setupLiquidGlass(): void {
    const root = this.host.nativeElement.querySelector<HTMLElement>('.grask-6-young-serif-lp');
    if (!root || !supportsSvgBackdropFilter()) {
      return;
    }
    for (const el of root.querySelectorAll<HTMLElement>('[data-liquid-glass]')) {
      const id = `glp6-young-serif-glass-${++glassSeq}`;
      el.insertAdjacentHTML('afterbegin', glassFilter(id));
      const map = el.querySelector<SVGElement>(`#${id} feImage`)!;
      const update = () => map.setAttribute('href', displacementMap(el));
      update();
      el.style.setProperty('--glp6-young-serif-glass-filter', `url(#${id})`);
      el.classList.add('is-liquid');
      const ro = new ResizeObserver(() => requestAnimationFrame(update));
      ro.observe(el);
      this.destroyRef.onDestroy(() => ro.disconnect());
    }
  }
}

/**
 * Shape of the lens, React Bits' defaults. The map is a rounded rect: a red→transparent
 * gradient across, a blue→transparent gradient down, blended with `difference`, so each edge
 * pushes pixels inward in its own direction; a mid-grey (brightness 50%) inset rect on top
 * means "no displacement" in the centre, blurred so the band fades in. distortionScale is how
 * far the edge band bends the backdrop; the three channel offsets are the chromatic aberration.
 */
/** The tryout's keys (see onKey). The switcher HUD owns [ ] { } r ` and Escape. */
const LEAD_KEYS: Record<string, (lead: LeadTryout) => void> = {
  ',': (lead) => lead.prev(),
  '.': (lead) => lead.next(),
  t: (lead) => lead.open.set(!lead.open()),
};

const LIQUID_GLASS = {
  borderWidth: 0.07, // width of the lens band, as a fraction of the shorter side
  brightness: 50,
  opacity: 0.93,
  blur: 11, // px, softens the band → centre transition inside the map
  displace: 0, // px, blur on the filtered result
  distortionScale: -180,
  redOffset: 0,
  greenOffset: 10,
  blueOffset: 20,
  xChannel: 'R',
  yChannel: 'G',
  mixBlendMode: 'difference',
} as const;

/** The recording strip: a 6:12 check (372 s), swept by the playhead during the first 92.7% of the demo's 34 s loop. */
const STRIP_TOTAL_S = 372;
const STRIP_SWEEP_MS = 34_000 * 0.927;
const STRIP_SEGMENTS = [
  { name: 'Hash function choice', from: 0, to: 100, range: '00:00–01:40' },
  { name: 'Collision handling', from: 100, to: 205, range: '01:40–03:25' },
  { name: 'Load factor and resizing', from: 205, to: 290, range: '03:25–04:50' },
  { name: 'Complexity', from: 290, to: 372, range: '04:50–06:12' },
] as const;
/**
 * Bar heights for the strip, in % of its height: a fixed pseudo-random sequence (a small LCG with a
 * fixed seed, smoothed with its neighbours and shaped into phrases), so the waveform is identical on
 * every render.
 */
const STRIP_BARS: readonly number[] = (() => {
  let seed = 20260921;
  const next = () => (seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296;
  const raw = Array.from({ length: 120 }, next);
  return raw.map((v, i) => {
    const local = ((raw[i - 1] ?? v) + 2 * v + (raw[i + 1] ?? v)) / 4;
    const phrase = 0.55 + 0.45 * Math.abs(Math.sin(i / 6.5));
    return Math.round(16 + 84 * local * phrase);
  });
})();

/** The running animations whose target is inside one of `within` (a selector list), i.e. the ones on the demo's clock. */
function clockAnimations(within: string): Animation[] {
  return document.getAnimations().filter((a) => {
    const target = (a.effect as KeyframeEffect | null)?.target;
    return target instanceof Element && target.closest(within) !== null;
  });
}

let glassSeq = 0;

/** React Bits' check: Safari accepts url() backdrop filters but renders them wrong, Firefox rejects them. */
function supportsSvgBackdropFilter(): boolean {
  const ua = navigator.userAgent;
  if ((/Safari/.test(ua) && !/Chrome/.test(ua)) || /Firefox/.test(ua)) {
    return false;
  }
  return typeof CSS !== 'undefined' && CSS.supports('backdrop-filter', 'url(#glp6-young-serif-glass)');
}

/** The filter: one feDisplacementMap per colour channel, at slightly different scales, screened back together. */
function glassFilter(id: string): string {
  const g = LIQUID_GLASS;
  const channel = (name: string, offset: number, keep: string) =>
    `<feDisplacementMap in="SourceGraphic" in2="map" scale="${g.distortionScale + offset}" ` +
    `xChannelSelector="${g.xChannel}" yChannelSelector="${g.yChannel}" result="disp-${name}"/>` +
    `<feColorMatrix in="disp-${name}" type="matrix" values="${keep}" result="${name}"/>`;
  return (
    `<svg class="glp6-young-serif-glass-filter" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><defs>` +
    `<filter id="${id}" color-interpolation-filters="sRGB" x="0%" y="0%" width="100%" height="100%">` +
    `<feImage x="0" y="0" width="100%" height="100%" preserveAspectRatio="none" result="map"/>` +
    channel('red', g.redOffset, '1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0') +
    channel('green', g.greenOffset, '0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0') +
    channel('blue', g.blueOffset, '0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0') +
    `<feBlend in="red" in2="green" mode="screen" result="rg"/>` +
    `<feBlend in="rg" in2="blue" mode="screen" result="output"/>` +
    `<feGaussianBlur in="output" stdDeviation="${g.displace}"/>` +
    `</filter></defs></svg>`
  );
}

/** The displacement map for one element, as a data URI, sized to it and rounded like it. */
function displacementMap(el: HTMLElement): string {
  const g = LIQUID_GLASS;
  const rect = el.getBoundingClientRect();
  const w = rect.width || 400;
  const h = rect.height || 200;
  // SVG clamps rx and ry separately, which would turn a 999px pill radius into an ellipse; clamp both here.
  const r = Math.min(parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0, w / 2, h / 2);
  const edge = Math.min(w, h) * (g.borderWidth * 0.5);
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}"><defs>` +
    `<linearGradient id="r" x1="100%" y1="0%" x2="0%" y2="0%"><stop offset="0%" stop-color="#0000"/><stop offset="100%" stop-color="red"/></linearGradient>` +
    `<linearGradient id="b" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#0000"/><stop offset="100%" stop-color="blue"/></linearGradient>` +
    `</defs>` +
    `<rect width="${w}" height="${h}" fill="black"/>` +
    `<rect width="${w}" height="${h}" rx="${r}" fill="url(#r)"/>` +
    `<rect width="${w}" height="${h}" rx="${r}" fill="url(#b)" style="mix-blend-mode:${g.mixBlendMode}"/>` +
    `<rect x="${edge}" y="${edge}" width="${w - edge * 2}" height="${h - edge * 2}" rx="${r}" ` +
    `fill="hsl(0 0% ${g.brightness}% / ${g.opacity})" style="filter:blur(${g.blur}px)"/>` +
    `</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
