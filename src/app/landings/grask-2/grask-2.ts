import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  ViewEncapsulation,
} from '@angular/core';

/**
 * Grask 2: a copy of the grask landing with the brand name capitalised. See README.md here.
 *
 * Static markup and CSS: the demo timeline, LMS orbit, hero float, section snapping and the pinned
 * scroll sections (grask-2.scroll.css) are pure CSS. The runtime pieces are an IntersectionObserver
 * that marks [data-reveal] elements as they scroll in (see grask.motion.css) and the SVG lens filter
 * behind the header pill (see grask.glass.css). Styles
 * are global on purpose (ViewEncapsulation.None) but every selector is scoped under .grask-2-lp and
 * every keyframe is prefixed glp2-, so nothing leaks.
 */
@Component({
  selector: 'landing-grask-2',
  templateUrl: './grask-2.html',
  styleUrls: [
    './grask-2.tokens.css',
    './grask-2.fonts.css',
    './grask-2.css',
    './grask-2.demo.css',
    './grask-2.demo-timeline.css',
    './grask-2.orbit.css',
    './grask-2.motion.css',
    './grask-2.scroll.css',
    './grask-2.glass.css',
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display: block' },
})
export class Grask2 {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      this.setupReveals();
      this.setupLiquidGlass();
      this.stylePageScrollbar();
      this.setupHeroJump();
    });
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
   * Scroll reveals. Adds .glp2-js to the root (which is what lets the CSS hide [data-reveal]
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
    const root = this.host.nativeElement.querySelector<HTMLElement>('.grask-2-lp');
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
    root.classList.add('glp2-js');
    targets.forEach((el) => io.observe(el));
    this.destroyRef.onDestroy(() => io.disconnect());
  }

  /**
   * Makes the hero-to-demo jump start on the first wheel tick. The jump itself is native scroll
   * snapping (see "Snap" in grask-2.scroll.css), but a browser only snaps once the wheel gesture
   * ends, so on its own the page first creeps by the wheel delta and then jumps. Here, while the
   * page rests on the hero and the wheel turns down (or rests on the demo and the wheel turns up),
   * the tick is swallowed and the page is scrolled straight to the other side; further ticks are
   * swallowed until that scroll settles, so trackpad momentum cannot interrupt it. The arrow, page
   * and space keys get the same treatment. Everything else, including scrolling inside the roll, is
   * left to the browser, as is everything under 720px (proximity snap) and under reduced motion.
   */
  private setupHeroJump(): void {
    const demo = document.getElementById('how');
    if (!demo || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    const wide = window.matchMedia('(min-width: 720px)');
    const demoTop = () => demo.getBoundingClientRect().top + window.scrollY - 96; // its scroll-margin-top
    let busy = false;
    let release: ReturnType<typeof setTimeout> | undefined;
    const settle = () => {
      busy = false;
      clearTimeout(release);
    };
    /** Jumps if the page rests on one side of the gap and `down` points across it; true if it did. */
    const jump = (down: boolean): boolean => {
      if (!wide.matches) {
        return false;
      }
      const y = window.scrollY;
      const target = down && y < 2 ? demoTop() : !down && Math.abs(y - demoTop()) < 2 ? 0 : null;
      if (target === null) {
        return false;
      }
      busy = true;
      window.scrollTo({ top: target, behavior: 'smooth' });
      release = setTimeout(settle, 1200); // in case scrollend never comes
      return true;
    };
    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || event.deltaY === 0) {
        return; // pinch-zoom, horizontal
      }
      if (busy || jump(event.deltaY > 0)) {
        event.preventDefault();
      }
    };
    const onKey = (event: KeyboardEvent) => {
      const el = event.target as HTMLElement | null;
      if (
        event.altKey ||
        event.metaKey ||
        event.ctrlKey ||
        el?.closest('input, textarea, select, [contenteditable]')
      ) {
        return;
      }
      const down =
        ['ArrowDown', 'PageDown'].includes(event.key) || (event.key === ' ' && !event.shiftKey);
      const up = ['ArrowUp', 'PageUp'].includes(event.key) || (event.key === ' ' && event.shiftKey);
      if ((down || up) && (busy || jump(down))) {
        event.preventDefault();
      }
    };
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKey);
    window.addEventListener('scrollend', settle);
    this.destroyRef.onDestroy(() => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('scrollend', settle);
      clearTimeout(release);
    });
  }

  /**
   * The page scrollbar and scroll snapping live on <html>, outside this component, so grask-2.css
   * and grask-2.scroll.css reach them through a class that is only there while this landing is on
   * screen (see "Page scrollbar" and "Snap" there).
   */
  private stylePageScrollbar(): void {
    const html = document.documentElement;
    html.classList.add('glp2-page');
    this.destroyRef.onDestroy(() => html.classList.remove('glp2-page'));
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
    const root = this.host.nativeElement.querySelector<HTMLElement>('.grask-2-lp');
    if (!root || !supportsSvgBackdropFilter()) {
      return;
    }
    for (const el of root.querySelectorAll<HTMLElement>('[data-liquid-glass]')) {
      const id = `glp2-glass-${++glassSeq}`;
      el.insertAdjacentHTML('afterbegin', glassFilter(id));
      const map = el.querySelector<SVGElement>(`#${id} feImage`)!;
      const update = () => map.setAttribute('href', displacementMap(el));
      update();
      el.style.setProperty('--glp2-glass-filter', `url(#${id})`);
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

let glassSeq = 0;

/** React Bits' check: Safari accepts url() backdrop filters but renders them wrong, Firefox rejects them. */
function supportsSvgBackdropFilter(): boolean {
  const ua = navigator.userAgent;
  if ((/Safari/.test(ua) && !/Chrome/.test(ua)) || /Firefox/.test(ua)) {
    return false;
  }
  return typeof CSS !== 'undefined' && CSS.supports('backdrop-filter', 'url(#glp2-glass)');
}

/** The filter: one feDisplacementMap per colour channel, at slightly different scales, screened back together. */
function glassFilter(id: string): string {
  const g = LIQUID_GLASS;
  const channel = (name: string, offset: number, keep: string) =>
    `<feDisplacementMap in="SourceGraphic" in2="map" scale="${g.distortionScale + offset}" ` +
    `xChannelSelector="${g.xChannel}" yChannelSelector="${g.yChannel}" result="disp-${name}"/>` +
    `<feColorMatrix in="disp-${name}" type="matrix" values="${keep}" result="${name}"/>`;
  return (
    `<svg class="glp2-glass-filter" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><defs>` +
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
