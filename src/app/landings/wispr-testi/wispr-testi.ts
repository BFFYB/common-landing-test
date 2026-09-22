import { NgTemplateOutlet } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  viewChild,
  viewChildren,
} from '@angular/core';

/**
 * Wispr testimonial orbit: a port of the "From the first people to use it" case-study deck on
 * wisprflow.ai (extracted 2026-09-22). See README.md here for how the original is built.
 *
 * The section is a tall runway with a sticky, full-height stage inside. Six cards sit absolutely
 * at the stage centre and are laid out along a horizontal track (a running x offset per card).
 * Scrolling the runway moves a single "head" position along that track; each card's distance from
 * the head is its screen x, and that x also drives a rotateX whose pivot sits *behind* the card
 * (transform-origin z = -orbit), so a card entering from the left tips forward and swings down,
 * passes upright at the centre, then tips back and swings up as it leaves to the right. The
 * stage's perspective makes the tilted cards recede; the x is divided by that perspective shrink
 * so the on-screen spacing stays even. z-index is re-sorted by distance from centre every frame.
 *
 * The original runs on GSAP + ScrollTrigger (scrub 1.5). This port is plain TS: a scroll/resize
 * listener, one requestAnimationFrame ticker with an expo-out follow that matches GSAP's scrub,
 * and direct style writes. The knobs below are the original script's constants, same names.
 */

interface Stat {
  value: string;
  label: string;
}

interface Card {
  layout: 'landscape' | 'square';
  tone: 'purple' | 'lumen' | 'dark-lumen' | 'green' | 'red';
  quote: string;
  /** wordmark / company logo above the quote (case-study cards) */
  logo?: string;
  logoAlt?: string;
  /** round avatar next to the name (press cards) */
  avatar?: string;
  name?: string;
  role?: string;
  /** portrait in the right column (landscape) or full-bleed behind a bottom card (square) */
  photo?: string;
  bleed?: boolean;
  stats?: Stat[];
  href?: string;
}

/** The original script's constants (desktop / mobile), verbatim. */
const K = {
  /** gap between cards as % of the median card width, then clamped to [GAP_MIN, GAP_MAX] px */
  GAP_PCT: 14,
  GAP_PCT_MOBILE: 22,
  GAP_MIN_PX: 32,
  GAP_MAX_PX: 160,
  /** scroll px per track px: the runway is trackH + span * SCROLL_RATIO */
  SCROLL_RATIO: 0.85,
  /** pivot depth behind the card, % of median width (min px) */
  ORBIT_CARD_PCT: 65,
  ORBIT_MIN_PX: 220,
  /** stage perspective, % of median width */
  PERSP_CARD_PCT: 260,
  /** rotateX at the left edge of the rotation span and at the right edge */
  ROT_IN: -50,
  ROT_OUT: 50,
  /** the rotation runs over +-(median width * ROT_SPAN_PCT / 100) around the centre */
  ROT_SPAN_PCT: 210,
  /** deck scale grows past 1920px: 1 + (vw / 1920 - 1) * DECK_SCALE_GROW, capped */
  DECK_SCALE_GROW: 0.55,
  DECK_FROM_PX: 1920,
  DECK_SCALE_MAX: 2,
  /** below this width: mobile gap, no deck scale, no scrub smoothing */
  MIN_W: 768,
  /** GSAP scrub seconds: the head follows the scroll position with an expo.out of this duration */
  SCRUB: 1.5,
  /** section corners: scroll-scrubbed border radius, max px (desktop / <=991px) */
  CORNERS_MAX: 80,
  CORNERS_MAX_MOBILE: 40,
  CORNERS_SMOOTH: 0.16,
} as const;

const clamp = (v: number, lo: number, hi: number) => (v < lo ? lo : v > hi ? hi : v);
/** GSAP power1.inOut */
const easeInOut = (p: number) => (p < 0.5 ? 2 * p * p : 1 - 2 * (1 - p) * (1 - p));

@Component({
  selector: 'landing-wispr-testi',
  templateUrl: './wispr-testi.html',
  styleUrl: './wispr-testi.css',
  imports: [NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WisprTesti {
  readonly cards: readonly Card[] = [
    {
      layout: 'landscape',
      tone: 'purple',
      logo: '/landings/wispr-testi/sb-logo.svg',
      logoAlt: 'Steven Bartlett',
      role: 'Host of Diary of a CEO',
      quote:
        '“The thought I have becomes my explanation. The gap between my thought and my delivery of my idea collapses.”',
      photo: '/landings/wispr-testi/steven.webp',
      stats: [
        { value: '90%', label: 'faster message output' },
        { value: '2', label: 'extra productive hours/day' },
      ],
      href: 'https://wisprflow.ai/case-study/steven-bartlett',
    },
    {
      layout: 'square',
      tone: 'lumen',
      quote:
        '“If you find it tiring to write long emails, or just need something quick to note down an idea in the heat of the moment — but typing it all feels like a drag — this app is a Godsend for you.”',
      avatar: '/landings/wispr-testi/slash-gear.png',
      name: 'Slash Gear',
    },
    {
      layout: 'square',
      tone: 'lumen',
      bleed: true,
      photo: '/landings/wispr-testi/alex.webp',
      quote: '“Wispr Flow is a top 3 favorite AI tool for me. I literally do not use my fingers to type anymore.”',
      name: 'Alex Lieberman',
      role: 'Co-founder of Morning Brew',
    },
    {
      layout: 'landscape',
      tone: 'green',
      quote: '“I feel like I have no time to type anymore. So I just talk to my phone and my laptop all the time.”',
      name: 'Elena Verna',
      role: 'Head of Growth at Lovable',
      photo: '/landings/wispr-testi/elena.webp',
    },
    {
      layout: 'square',
      tone: 'dark-lumen',
      quote:
        "“Wispr Flow just gets it right. It is consistently so much better than the standard voice input, it'll blow your mind.”",
      avatar: '/landings/wispr-testi/fast-company.png',
      name: 'Fast Company',
    },
    {
      layout: 'landscape',
      tone: 'red',
      logo: '/landings/wispr-testi/clay-dark.png',
      logoAlt: 'Clay',
      quote: '“Wispr Flow is a top 3 favorite AI tool for me. I literally do not use my fingers to type anymore.”',
      photo: '/landings/wispr-testi/clay-bg.webp',
      stats: [
        { value: '20%', label: 'more customer calls per day' },
        { value: '$3.08m', label: 'estimated cost savings per year' },
      ],
      href: 'https://wisprflow.ai/case-study/clay',
    },
  ];

  private readonly section = viewChild.required<ElementRef<HTMLElement>>('section');
  private readonly runway = viewChild.required<ElementRef<HTMLElement>>('runway');
  private readonly stage = viewChild.required<ElementRef<HTMLElement>>('stage');
  private readonly cardEls = viewChildren<ElementRef<HTMLElement>>('card');
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => this.setup());
  }

  private setup() {
    const section = this.section().nativeElement;
    const runway = this.runway().nativeElement;
    const stage = this.stage().nativeElement;
    const cards = this.cardEls().map((c) => c.nativeElement);
    if (!cards.length) return;

    const reduced = matchMedia('(prefers-reduced-motion: reduce)');

    // ---- layout (rebuilt on width change) ------------------------------------------------
    let offsets: number[] = []; // track x of each card, card 0 at 0
    let headEnd = 1;
    let deckScale = 1;
    let orbitPx = 0;
    let perspPx = 0;
    let rotHalf = 1;
    let mobile = false;

    const rotAt = (sx: number) =>
      K.ROT_IN + (K.ROT_OUT - K.ROT_IN) * easeInOut(clamp((sx + rotHalf) / (rotHalf * 2), 0, 1));
    /** perspective shrink of a card whose pivot swung it `rot` degrees back */
    const shrinkAt = (rot: number) => {
      const depth = orbitPx * (1 - Math.cos((rot * Math.PI) / 180));
      return perspPx / (perspPx + depth);
    };

    const build = () => {
      const vw = innerWidth;
      mobile = vw < K.MIN_W;
      const gapPct = mobile ? K.GAP_PCT_MOBILE : K.GAP_PCT;
      deckScale = mobile ? 1 : clamp(1 + (vw / K.DECK_FROM_PX - 1) * K.DECK_SCALE_GROW, 1, K.DECK_SCALE_MAX);

      // offsetWidth, not getBoundingClientRect: a rotated card's rect is its projected bbox.
      const widths = cards.map((c) => (c.offsetWidth || 1) * deckScale);
      const sorted = [...widths].sort((a, b) => a - b);
      const medW = sorted[Math.floor(sorted.length / 2)];
      const gapPx = clamp((medW * gapPct) / 100, K.GAP_MIN_PX, K.GAP_MAX_PX);

      offsets = [0];
      for (let i = 1; i < cards.length; i++) {
        offsets[i] = offsets[i - 1] + (widths[i - 1] + widths[i]) / 2 + gapPx;
      }
      headEnd = Math.max(1, offsets[offsets.length - 1]);

      orbitPx = Math.max(K.ORBIT_MIN_PX, (medW * K.ORBIT_CARD_PCT) / 100);
      perspPx = (medW * K.PERSP_CARD_PCT) / 100;
      rotHalf = (medW * K.ROT_SPAN_PCT) / 100;

      stage.style.perspective = `${perspPx}px`;
      for (const c of cards) c.style.transformOrigin = `50% 50% ${-orbitPx}px`;

      // the runway: one stage height, plus the head's travel at SCROLL_RATIO scroll px per track px
      const stageH = stage.offsetHeight || innerHeight;
      runway.style.height = `${Math.round(stageH + headEnd * K.SCROLL_RATIO)}px`;
    };

    const render = (head: number) => {
      const order: { el: HTMLElement; d: number }[] = [];
      for (let j = 0; j < cards.length; j++) {
        const sx = head - offsets[j];
        const rot = rotAt(sx);
        const f = shrinkAt(rot);
        cards[j].style.transform =
          `translate(-50%, -50%) translate3d(${sx / f}px, 0, 0) rotateX(${rot}deg) scale(${deckScale})`;
        order.push({ el: cards[j], d: Math.abs(sx) });
      }
      order.sort((a, b) => a.d - b.d);
      order.forEach((o, rank) => (o.el.style.zIndex = String(order.length - rank)));
    };

    // ---- ticker: scrub follow + section corners --------------------------------------------
    let head = 0;
    let target = 0;
    let cornerT = -1;
    let cornerB = -1;
    let raf = 0;
    let last = 0;

    const targetHead = () => {
      const r = runway.getBoundingClientRect();
      const dist = r.height - innerHeight;
      return dist > 0 ? clamp(-r.top / dist, 0, 1) * headEnd : 0;
    };

    const tick = (now: number) => {
      raf = 0;
      const dt = Math.min(0.1, (now - (last || now)) / 1000);
      last = now;
      let busy = false;

      // head: an expo.out of SCRUB seconds restarted on every scroll is, per frame, this decay.
      target = targetHead();
      if (mobile || reduced.matches) head = target;
      else head += (target - head) * (1 - Math.pow(2, (-10 * dt) / K.SCRUB));
      if (Math.abs(target - head) < 0.05) head = target;
      else busy = true;
      render(head);

      // corners: the section's radius is its distance to the viewport edge, capped and smoothed.
      const max = innerWidth <= 991 ? K.CORNERS_MAX_MOBILE : K.CORNERS_MAX;
      const r = section.getBoundingClientRect();
      const wantT = clamp(r.top, 0, max);
      const wantB = clamp(innerHeight - r.bottom, 0, max);
      const k = 1 - Math.pow(1 - K.CORNERS_SMOOTH, dt * 60);
      if (cornerT < 0) {
        cornerT = wantT;
        cornerB = wantB;
      } else {
        cornerT += (wantT - cornerT) * k;
        cornerB += (wantB - cornerB) * k;
        if (Math.abs(wantT - cornerT) < 0.1) cornerT = wantT;
        else busy = true;
        if (Math.abs(wantB - cornerB) < 0.1) cornerB = wantB;
        else busy = true;
      }
      section.style.borderRadius = `${cornerT}px ${cornerT}px ${cornerB}px ${cornerB}px`;

      if (busy) raf = requestAnimationFrame(tick);
      else last = 0;
    };
    const wake = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const relayout = () => {
      build();
      wake();
    };
    build();
    head = target = targetHead();
    render(head);
    wake();

    let lastW = innerWidth;
    let timer = 0;
    const onResize = () => {
      if (innerWidth === lastW) return wake(); // height only: phones fire this on URL-bar collapse
      lastW = innerWidth;
      clearTimeout(timer);
      timer = setTimeout(relayout, 200);
    };
    addEventListener('scroll', wake, { passive: true });
    addEventListener('resize', onResize);
    document.fonts?.ready.then(relayout);
    for (const img of stage.querySelectorAll('img')) img.addEventListener('load', wake, { once: true });

    this.destroyRef.onDestroy(() => {
      removeEventListener('scroll', wake);
      removeEventListener('resize', onResize);
      clearTimeout(timer);
      if (raf) cancelAnimationFrame(raf);
    });
  }
}
