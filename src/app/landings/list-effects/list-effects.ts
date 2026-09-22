import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  signal,
} from '@angular/core';

/**
 * List effects: a training ground for list / listing entrance effects.
 *
 * One generic keyframe (`fx` in list-effects.css) animates each item's inner element from a
 * per-effect "from" state (opacity / transform / filter / clip-path, handed over as custom
 * properties on the list) to its natural state. Effects are data (FX below), so the stage, the
 * on-scroll sections and the CSS snippet all read the same definitions. Items are re-created on
 * every run (the run counter is part of the @for key), which is what restarts a CSS animation.
 */

type Layout = 'rows' | 'cards' | 'lines' | 'table' | 'chips';
type Order = 'forward' | 'reverse' | 'center' | 'edges' | 'random';
type Phase = 'in' | 'out';

interface From {
  opacity?: number;
  transform?: string;
  filter?: string;
  /** [from, to] clip-path on the animated element */
  clip?: [string, string];
  /** static clip on the item itself, so the inner element rises out of a mask */
  mask?: boolean;
}

interface Fx {
  id: string;
  label: string;
  group: string;
  /** easing preset applied when the effect is picked (EASES id) */
  ease: string;
  origin?: string;
  /** start state as a function of the amplitude multiplier */
  from: (a: number) => From;
}

const r = (v: number) => Math.round(v * 10) / 10;
const deg = (v: number) => r(Math.max(-89, Math.min(89, v)));

const FX: Fx[] = [
  { id: 'fade', label: 'Fade', group: 'Basic', ease: 'out', from: () => ({ opacity: 0 }) },
  { id: 'fade-up', label: 'Fade up', group: 'Basic', ease: 'out', from: (a) => ({ opacity: 0, transform: `translateY(${r(24 * a)}px)` }) },
  { id: 'fade-down', label: 'Fade down', group: 'Basic', ease: 'out', from: (a) => ({ opacity: 0, transform: `translateY(${r(-24 * a)}px)` }) },
  { id: 'slide-left', label: 'From left', group: 'Basic', ease: 'expo', from: (a) => ({ opacity: 0, transform: `translateX(${r(-40 * a)}px)` }) },
  { id: 'slide-right', label: 'From right', group: 'Basic', ease: 'expo', from: (a) => ({ opacity: 0, transform: `translateX(${r(40 * a)}px)` }) },

  { id: 'scale', label: 'Scale', group: 'Scale', ease: 'out', from: (a) => ({ opacity: 0, transform: `scale(${r(Math.max(0.05, 1 - 0.15 * a))})` }) },
  { id: 'pop', label: 'Pop', group: 'Scale', ease: 'back', from: (a) => ({ opacity: 0, transform: `scale(${r(Math.max(0.05, 1 - 0.6 * a))})` }) },
  { id: 'drop', label: 'Drop', group: 'Scale', ease: 'bounce', from: (a) => ({ opacity: 0, transform: `translateY(${r(-64 * a)}px)` }) },
  { id: 'zoom-out', label: 'Zoom out', group: 'Scale', ease: 'out', from: (a) => ({ opacity: 0, transform: `scale(${r(1 + 0.2 * a)})`, filter: `blur(${r(8 * a)}px)` }) },
  { id: 'stretch', label: 'Stretch', group: 'Scale', ease: 'expo', origin: 'left center', from: () => ({ transform: 'scaleX(0)' }) },
  { id: 'unfold', label: 'Unfold', group: 'Scale', ease: 'expo', origin: 'center top', from: () => ({ transform: 'scaleY(0)' }) },

  { id: 'blur', label: 'Blur', group: 'Depth', ease: 'out', from: (a) => ({ opacity: 0, filter: `blur(${r(14 * a)}px)` }) },
  { id: 'flip-x', label: 'Flip X', group: 'Depth', ease: 'out', origin: 'center top', from: (a) => ({ opacity: 0, transform: `perspective(900px) rotateX(${deg(-75 * a)}deg)` }) },
  { id: 'flip-y', label: 'Flip Y', group: 'Depth', ease: 'out', origin: 'left center', from: (a) => ({ opacity: 0, transform: `perspective(900px) rotateY(${deg(60 * a)}deg)` }) },
  { id: 'swing', label: 'Swing', group: 'Depth', ease: 'back', origin: 'center top', from: (a) => ({ opacity: 0, transform: `perspective(900px) rotateX(${deg(-40 * a)}deg) translateY(${r(24 * a)}px)` }) },

  { id: 'skew', label: 'Skew', group: 'Shape', ease: 'expo', from: (a) => ({ opacity: 0, transform: `translateX(${r(-30 * a)}px) skewX(${deg(-12 * a)}deg)` }) },
  { id: 'spin', label: 'Spin', group: 'Shape', ease: 'back', from: (a) => ({ opacity: 0, transform: `rotate(${deg(-8 * a)}deg) scale(0.9)` }) },
  { id: 'wipe', label: 'Wipe', group: 'Shape', ease: 'in-out', from: () => ({ clip: ['inset(0 100% 0 0)', 'inset(0)'] }) },
  { id: 'curtain', label: 'Curtain', group: 'Shape', ease: 'in-out', from: () => ({ clip: ['inset(0 0 100% 0)', 'inset(0)'] }) },
  { id: 'rise', label: 'Mask rise', group: 'Shape', ease: 'expo', from: () => ({ transform: 'translateY(110%)', mask: true }) },
];

const EASES = [
  { id: 'out', label: 'Ease out', value: 'cubic-bezier(0.2, 0.7, 0.2, 1)' },
  { id: 'expo', label: 'Expo out', value: 'cubic-bezier(0.16, 1, 0.3, 1)' },
  { id: 'in-out', label: 'In–out', value: 'cubic-bezier(0.65, 0, 0.35, 1)' },
  { id: 'back', label: 'Back (overshoot)', value: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
  {
    id: 'spring',
    label: 'Spring',
    value:
      'linear(0, 0.004, 0.016, 0.035, 0.063, 0.098, 0.141 13.6%, 0.25, 0.391, 0.563, 0.765, 1 45.4%, 1.11, 1.17 56.8%, 1.164, 1.13 68.2%, 1.076, 1.013 79.6%, 0.976, 0.97 90.9%, 0.98, 1)',
  },
  {
    id: 'bounce',
    label: 'Bounce',
    value:
      'linear(0, 0.063, 0.25, 0.563, 1 36.4%, 0.812, 0.75 54.5%, 0.813, 1 72.7%, 0.953, 0.938, 0.953, 1 90.9%, 0.984, 1)',
  },
  { id: 'linear', label: 'Linear', value: 'linear' },
];

interface Listing {
  id: string;
  title: string;
  meta: string;
  tag: string;
  value: string;
  hue: number;
}

const LISTINGS: Listing[] = [
  { id: 'lis', title: 'Lisbon', meta: 'Portugal · GMT+1', tag: 'Popular', value: '€1,120', hue: 24 },
  { id: 'cph', title: 'Copenhagen', meta: 'Denmark · GMT+2', tag: 'New', value: '€1,890', hue: 200 },
  { id: 'kyo', title: 'Kyoto', meta: 'Japan · GMT+9', tag: 'Quiet', value: '€1,340', hue: 340 },
  { id: 'mex', title: 'Mexico City', meta: 'Mexico · GMT−6', tag: 'Trending', value: '€760', hue: 150 },
  { id: 'cpt', title: 'Cape Town', meta: 'South Africa · GMT+2', tag: 'Deal', value: '€690', hue: 45 },
  { id: 'rey', title: 'Reykjavík', meta: 'Iceland · GMT+0', tag: 'Remote', value: '€2,050', hue: 190 },
  { id: 'bue', title: 'Buenos Aires', meta: 'Argentina · GMT−3', tag: 'Popular', value: '€540', hue: 280 },
  { id: 'tbs', title: 'Tbilisi', meta: 'Georgia · GMT+4', tag: 'New', value: '€480', hue: 10 },
  { id: 'mel', title: 'Melbourne', meta: 'Australia · GMT+10', tag: 'Quiet', value: '€1,610', hue: 120 },
  { id: 'yul', title: 'Montréal', meta: 'Canada · GMT−4', tag: 'Deal', value: '€1,050', hue: 220 },
  { id: 'sel', title: 'Seoul', meta: 'South Korea · GMT+9', tag: 'Trending', value: '€1,270', hue: 300 },
  { id: 'rak', title: 'Marrakech', meta: 'Morocco · GMT+1', tag: 'Remote', value: '€620', hue: 30 },
];

/** Deterministic shuffle of 0..n-1 (mulberry32), so a random order is stable within one run. */
function shuffled(n: number, seed: number): number[] {
  let s = seed | 0;
  const next = () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const a = [...Array(n).keys()];
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const DEFAULTS = { fx: FX[1], ease: EASES[0], dur: 600, stagger: 60, amp: 1, count: 8 };

@Component({
  selector: 'landing-list-effects',
  imports: [NgTemplateOutlet],
  templateUrl: './list-effects.html',
  styleUrl: './list-effects.css',
  host: { '(document:keydown)': 'onKey($event)' },
})
export class ListEffects {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  readonly groups = [...new Set(FX.map((f) => f.group))].map((name) => ({
    name,
    fx: FX.filter((f) => f.group === name),
  }));
  readonly eases = EASES;
  readonly layouts: { id: Layout; label: string }[] = [
    { id: 'rows', label: 'Rows' },
    { id: 'cards', label: 'Cards' },
    { id: 'lines', label: 'Lines' },
    { id: 'table', label: 'Table' },
    { id: 'chips', label: 'Chips' },
  ];
  readonly orders: { id: Order; label: string }[] = [
    { id: 'forward', label: 'Forward' },
    { id: 'reverse', label: 'Reverse' },
    { id: 'center', label: 'Center out' },
    { id: 'edges', label: 'Edges in' },
    { id: 'random', label: 'Random' },
  ];
  /** The on-scroll sections further down the page. */
  readonly wild: { layout: Layout; title: string; body: string }[] = [
    {
      layout: 'cards',
      title: 'A feature grid',
      body: 'The usual landing case: a grid that plays once it scrolls into view. Cards read best with small distances and a short stagger.',
    },
    {
      layout: 'table',
      title: 'A pricing table',
      body: 'Rows want a tight stagger and a flat, sideways or wipe effect. Anything 3D looks wrong on a table.',
    },
    {
      layout: 'lines',
      title: 'A headline, line by line',
      body: 'This is where Mask rise, Wipe and Blur earn their keep. Slow it down: 700–900 ms, 90 ms+ stagger.',
    },
    {
      layout: 'chips',
      title: 'A row of tags',
      body: 'Many small items: keep the stagger under 40 ms or the last chip arrives a full second late. Random order suits chips.',
    },
  ];

  readonly fx = signal<Fx>(DEFAULTS.fx);
  readonly layout = signal<Layout>('rows');
  readonly order = signal<Order>('forward');
  readonly ease = signal(DEFAULTS.ease);
  readonly dur = signal(DEFAULTS.dur);
  readonly stagger = signal(DEFAULTS.stagger);
  readonly amp = signal(DEFAULTS.amp);
  readonly count = signal(DEFAULTS.count);
  readonly phase = signal<Phase>('in');
  /** Bumped on every play; part of every item key, so items are re-created and animate again. */
  readonly run = signal(0);
  readonly loop = signal(false);
  readonly repeat = signal(true);
  readonly reducedMotion = signal(false);
  readonly copied = signal(false);
  readonly wildIn = signal<boolean[]>(this.wild.map(() => false));
  readonly wildRun = signal<number[]>(this.wild.map(() => 0));

  readonly from = computed(() => this.fx().from(this.amp()));

  /** Custom properties for the list: timing plus the effect's start state (see the `fx` keyframes). */
  readonly vars = computed(() => {
    const f = this.from();
    return {
      '--dur': `${this.dur()}ms`,
      '--stagger': `${this.stagger()}ms`,
      '--ease': this.ease().value,
      '--o0': String(f.opacity ?? 1),
      '--t0': f.transform ?? 'none',
      '--f0': f.filter ?? 'none',
      '--c0': f.clip?.[0] ?? 'none',
      '--c1': f.clip?.[1] ?? 'none',
      '--mask': f.mask ? 'inset(0)' : 'none',
      '--origin': this.fx().origin ?? 'center',
    };
  });

  /** The visible listings with their stagger slot (`--i`) for the current order. */
  readonly items = computed(() => {
    const n = this.count();
    const mode = this.order();
    const run = this.run();
    const c = (n - 1) / 2;
    const rand = mode === 'random' ? shuffled(n, run + 1) : null;
    return LISTINGS.slice(0, n).map((l, i) => {
      const fromCenter = Math.floor(Math.abs(i - c));
      const order =
        mode === 'forward' ? i
        : mode === 'reverse' ? n - 1 - i
        : mode === 'center' ? fromCenter
        : mode === 'edges' ? Math.floor(c) - fromCenter
        : rand![i];
      return { ...l, order, key: `${run}:${l.id}` };
    });
  });

  /** Items for each on-scroll section, keyed with the section's own run so it can re-arm on its own. */
  readonly wildItems = computed(() =>
    this.wildRun().map((run) => this.items().map((it) => ({ ...it, key: `${run}/${it.key}` }))),
  );

  readonly total = computed(
    () => this.dur() + this.stagger() * Math.max(...this.items().map((i) => i.order)),
  );
  readonly layoutLabel = computed(() => this.layouts.find((l) => l.id === this.layout())!.label);
  readonly orderLabel = computed(() => this.orders.find((o) => o.id === this.order())!.label);

  /** The current setup as plain CSS for a real landing (no lab plumbing). */
  readonly code = computed(() => {
    const fx = this.fx();
    const f = this.from();
    const name = `fx-${fx.id}`;
    const target = f.mask ? '.list > li > *' : '.list > li';
    const from = [
      f.opacity !== undefined && `opacity: ${f.opacity}`,
      f.transform && `transform: ${f.transform}`,
      f.filter && `filter: ${f.filter}`,
      f.clip && `clip-path: ${f.clip[0]}`,
    ]
      .filter(Boolean)
      .join('; ');
    const orderNote = {
      forward: '--i on each li: 0, 1, 2 …',
      reverse: '--i on each li: n-1 … 2, 1, 0',
      center: '--i on each li: floor(|index - (n-1)/2|)',
      edges: '--i on each li: floor((n-1)/2) - floor(|index - (n-1)/2|)',
      random: '--i on each li: a shuffle of 0 … n-1',
    }[this.order()];
    return [
      `/* ${fx.label} · ${this.orderLabel()} · ${this.count()} items · ${this.total()} ms total */`,
      `.list {`,
      `  --dur: ${this.dur()}ms;`,
      `  --stagger: ${this.stagger()}ms;`,
      `  --ease: ${this.ease().value};`,
      `}`,
      f.mask && `.list > li { clip-path: inset(0); } /* the mask */`,
      `${target} {`,
      `  animation: ${name} var(--dur) var(--ease) both;`,
      `  animation-delay: calc(var(--i) * var(--stagger)); /* ${orderNote} */`,
      fx.origin && `  transform-origin: ${fx.origin};`,
      `}`,
      `@keyframes ${name} {`,
      `  from { ${from}; }`,
      f.clip && `  to   { clip-path: ${f.clip[1]}; }`,
      `}`,
      `@media (prefers-reduced-motion: reduce) {`,
      `  ${target} { animation: none; }`,
      `}`,
      `/* on scroll: start with animation-play-state: paused, switch to running when the list is in view */`,
    ]
      .filter(Boolean)
      .join('\n');
  });

  private timer?: ReturnType<typeof setTimeout>;

  constructor() {
    this.destroyRef.onDestroy(() => clearTimeout(this.timer));
    afterNextRender(() => {
      this.reducedMotion.set(matchMedia('(prefers-reduced-motion: reduce)').matches);
      if (typeof IntersectionObserver === 'undefined') {
        this.wildIn.set(this.wild.map(() => true));
        return;
      }
      const io = new IntersectionObserver(
        (entries) => {
          for (const en of entries) {
            const i = Number((en.target as HTMLElement).dataset['wild']);
            if (en.isIntersecting) {
              this.wildIn.update((a) => a.map((v, j) => (j === i ? true : v)));
            } else if (this.repeat() && this.wildIn()[i]) {
              // reset while off screen: new items start paused at the "from" state
              this.wildIn.update((a) => a.map((v, j) => (j === i ? false : v)));
              this.wildRun.update((a) => a.map((v, j) => (j === i ? v + 1 : v)));
            }
          }
        },
        { threshold: 0.3 },
      );
      this.host.nativeElement.querySelectorAll<HTMLElement>('[data-wild]').forEach((el) => io.observe(el));
      this.destroyRef.onDestroy(() => io.disconnect());
    });
  }

  play(phase: Phase = 'in') {
    this.phase.set(phase);
    this.run.update((v) => v + 1);
  }
  replay() {
    this.play('in');
  }
  playOut() {
    this.play('out');
  }

  pick(fx: Fx) {
    this.fx.set(fx);
    this.ease.set(EASES.find((e) => e.id === fx.ease) ?? DEFAULTS.ease);
    this.replay();
  }
  step(d: number) {
    const i = FX.indexOf(this.fx());
    this.pick(FX[(i + d + FX.length) % FX.length]);
  }
  setLayout(l: Layout) {
    this.layout.set(l);
    this.replay();
  }
  setOrder(o: Order) {
    this.order.set(o);
    this.replay();
  }
  setEase(id: string) {
    this.ease.set(EASES.find((e) => e.id === id) ?? DEFAULTS.ease);
    this.replay();
  }
  reset() {
    this.fx.set(DEFAULTS.fx);
    this.ease.set(DEFAULTS.ease);
    this.dur.set(DEFAULTS.dur);
    this.stagger.set(DEFAULTS.stagger);
    this.amp.set(DEFAULTS.amp);
    this.count.set(DEFAULTS.count);
    this.order.set('forward');
    this.replay();
  }

  /** In → pause → out → pause → in … until switched off. */
  toggleLoop() {
    this.loop.update((v) => !v);
    clearTimeout(this.timer);
    if (this.loop()) this.cycle('in');
  }
  private cycle(phase: Phase) {
    this.play(phase);
    this.timer = setTimeout(() => {
      if (this.loop()) this.cycle(phase === 'in' ? 'out' : 'in');
    }, this.total() + 700);
  }

  copy() {
    navigator.clipboard?.writeText(this.code()).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 1500);
    });
  }

  /** Range/select value as a number. */
  n(e: Event) {
    return (e.target as HTMLInputElement).valueAsNumber;
  }

  onKey(e: KeyboardEvent) {
    const t = e.target as HTMLElement | null;
    if (t?.closest('input, select, textarea, button, [contenteditable]')) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    switch (e.key) {
      case ' ':
        e.preventDefault();
        this.replay();
        break;
      case 'ArrowDown':
        e.preventDefault();
        this.step(1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        this.step(-1);
        break;
      case 'l':
        this.toggleLoop();
        break;
    }
  }
}
