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
 * Grask landing page — imported from a design-canvas export (2026-09-20). See README.md here.
 *
 * Static markup and CSS: the demo timeline, LMS orbit and hero float are pure CSS. The only
 * runtime piece is an IntersectionObserver that marks [data-reveal] elements as they scroll in
 * (see grask.motion.css). Styles are global on purpose (ViewEncapsulation.None) but every
 * selector is scoped under .grask-lp and every keyframe is prefixed glp-, so nothing leaks.
 */
@Component({
  selector: 'landing-grask',
  templateUrl: './grask.html',
  styleUrls: [
    './grask.tokens.css',
    './grask.fonts.css',
    './grask.css',
    './grask.demo.css',
    './grask.demo-timeline.css',
    './grask.orbit.css',
    './grask.motion.css',
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display: block' },
})
export class Grask {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => this.setupReveals());
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
   * Scroll reveals. Adds .glp-js to the root (which is what lets the CSS hide [data-reveal]
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
    const root = this.host.nativeElement.querySelector<HTMLElement>('.grask-lp');
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
    root.classList.add('glp-js');
    targets.forEach((el) => io.observe(el));
    this.destroyRef.onDestroy(() => io.disconnect());
  }
}
