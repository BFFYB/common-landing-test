/**
 * The outcome rail (added 2026-09-25): the section after the demo, in place of the "Where it fits first"
 * cards. Ported from src/app/landings/grask-rail/ (its README has the original's mechanics, worked out
 * from the outcomes section on getfluently.app). Only the motion is from there; the copy is Grask's, the
 * card art is CSS (grask-6-space-grotesk.rail.css) and the names and numbers on the cards are made up.
 *
 * The section is a runway: a sticky, full-height stage (.rail-stage) followed by a spacer (.rail-spacer).
 * While the spacer scrolls past, the card track (.rail-track) is scrubbed from x = 0 (first card flush
 * with the column's left edge) to x = -(track - column) (last card flush with its right edge). The track
 * does not jump to that target: it follows it on an overdamped spring (k 500, c 60, m 1), so a flick of
 * the wheel glides and a stop settles without overshoot. Each card's widget (.appear) waits 80px low and
 * transparent until it comes into view (in the viewport and not clipped by the stage), then rises once on
 * a bouncy CSS spring. Below 720px there is no runway: the cards run as a CSS marquee. Nothing here needs
 * animation-timeline, so Firefox gets the same motion as Chrome. Under prefers-reduced-motion the track
 * follows the scroll directly and the widgets fade in place (the CSS drops the springs).
 */

export interface RailCard {
  kind: 'live' | 'quote' | 'rubric' | 'bars' | 'team' | 'lms';
  /** Card heading; \n is a line break. */
  title: string;
  /** Background palette: glow at the bottom left, glow at the top right, base. */
  tone: readonly [string, string, string];
  /** Extra delay (s) before the widget rises, so neighbours do not move in lockstep. */
  delay: number;
}

/** Knobs. The runway length itself is the spacer's height in the css (135vh). */
const K = {
  /** Spring the track follows the scroll target with. Damping ratio c / (2 sqrt(k m)) = 1.34. */
  STIFFNESS: 500,
  DAMPING: 60,
  MASS: 1,
  /** Longest integration step (s); a frame after a stall does not fling the track. */
  MAX_STEP: 1 / 30,
  /** Integration sub-step (s). */
  SUB_STEP: 1 / 120,
  /** Within this many px (and px/s) of the target the spring snaps and the ticker sleeps. */
  REST: 0.5,
  /** The rail runs at this width and up; below it the css marquee takes over. */
  RAIL_MEDIA: '(min-width: 720px)',
  /** How far below the viewport a widget starts rising: its own drop, so it lands in view. */
  APPEAR_MARGIN: '0px 0px 80px 0px',
};

const CARDS: readonly RailCard[] = [
  {
    kind: 'live',
    title: 'Hear every student\nexplain their own work',
    tone: ['#1B8C99', '#3B5BDB', '#0B1B24'],
    delay: 0.15,
  },
  {
    kind: 'quote',
    title: 'Know the report\nis really theirs',
    tone: ['#C97B2A', '#7A3B1F', '#1C130D'],
    delay: 0.3,
  },
  {
    kind: 'rubric',
    title: 'Grade with evidence,\nnot a hunch',
    tone: ['#6D4BD8', '#1F6F8B', '#120F24'],
    delay: 0,
  },
  {
    kind: 'bars',
    title: 'Find the weak topic\nbefore the exam does',
    tone: ['#3E9B5A', '#C9A227', '#0E1A12'],
    delay: 0,
  },
  {
    kind: 'team',
    title: 'Check every teammate,\nnot just the presenter',
    tone: ['#C2415B', '#6B3FA0', '#1D0F16'],
    delay: 0.15,
  },
  {
    kind: 'lms',
    title: 'Stay inside the LMS\nyou already use',
    tone: ['#2F6FDB', '#0E5A66', '#0C1320'],
    delay: 0,
  },
];

/** Everything the rail's template renders. */
export const RAIL = {
  cards: CARDS,
  /** Two copies back to back: the phone marquee loops by sliding exactly one copy's width. The second is hidden on the rail. */
  loop: [...CARDS, ...CARDS],
  criteria: [
    { name: 'Hash function choice', pts: '4/4' },
    { name: 'Collision handling', pts: '5/6' },
    { name: 'Load factor and resizing', pts: '4/5' },
    { name: 'Complexity', pts: '3/5' },
  ],
  topics: [
    { name: 'Hash fn', pct: 86 },
    { name: 'Collisions', pct: 41 },
    { name: 'Load factor', pct: 74 },
    { name: 'Complexity', pct: 79 },
  ],
  team: [
    { initials: 'AK', state: 'done' },
    { initials: 'BO', state: 'done' },
    { initials: 'CD', state: 'flag' },
    { initials: 'DP', state: 'live' },
  ],
  /** Voice bars of the live-call widget: relative heights and a stagger index each. */
  bars: [0.35, 0.6, 0.9, 0.55, 1, 0.7, 0.45, 0.8, 0.5, 0.95, 0.65, 0.4, 0.75, 0.55, 0.3],
} as const;

/**
 * Starts the rail inside `root` (the landing's element): the scroll scrub with its spring, and the
 * widgets' one-time appearance. Returns the teardown. Does nothing if the markup is not there.
 */
export function setupRail(root: HTMLElement): () => void {
  const rail = root.querySelector<HTMLElement>('.rail');
  const column = rail?.querySelector<HTMLElement>('.rail-column');
  const track = rail?.querySelector<HTMLElement>('.rail-track');
  const spacer = rail?.querySelector<HTMLElement>('.rail-spacer');
  if (!rail || !column || !track || !spacer) {
    return () => {};
  }
  const stopScrub = scrub(column, track, spacer);
  const stopAppear = appear(rail);
  return () => {
    stopScrub();
    stopAppear();
  };
}

/**
 * Scrub the track from scroll. Geometry is measured once per layout change (resize, fonts, images),
 * never per frame; each frame only reads scrollY, steps the spring and writes one transform. The
 * ticker sleeps when the track is at rest and wakes on scroll.
 */
function scrub(column: HTMLElement, track: HTMLElement, spacer: HTMLElement): () => void {
  const rail = matchMedia(K.RAIL_MEDIA);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');

  let from = 0; // scrollY where the spacer's top meets the viewport's bottom: travel starts
  let span = 1; // scroll distance over which the track travels (the spacer's height)
  let travel = 0; // px the track moves in total
  let x = 0;
  let v = 0;
  let last = 0;
  let raf = 0;

  const measure = () => {
    if (!rail.matches) {
      track.style.transform = '';
      x = v = travel = 0;
      return;
    }
    const r = spacer.getBoundingClientRect();
    from = r.top + scrollY - innerHeight;
    span = Math.max(1, r.height);
    travel = Math.max(0, track.scrollWidth - column.clientWidth);
  };
  const target = () => -travel * Math.min(1, Math.max(0, (scrollY - from) / span));
  const write = () => (track.style.transform = `translate3d(${x.toFixed(2)}px, 0, 0)`);

  const frame = (now: number) => {
    raf = 0;
    if (!rail.matches) return;
    const goal = target();
    if (reduced.matches) {
      x = goal;
      v = 0;
      last = 0;
      write();
      return;
    }
    const dt = last ? Math.min(K.MAX_STEP, (now - last) / 1000) : 1 / 60;
    last = now;
    // Semi-implicit Euler (velocity first, then position with the new velocity) in sub-steps of at
    // most SUB_STEP: one 1/30 s step of this stiff a spring is unstable, 1/120 s is smooth.
    const n = Math.ceil(dt / K.SUB_STEP);
    const h = dt / n;
    for (let i = 0; i < n; i++) {
      v += ((K.STIFFNESS * (goal - x) - K.DAMPING * v) / K.MASS) * h;
      x += v * h;
    }
    if (Math.abs(goal - x) < K.REST && Math.abs(v) < K.REST) {
      x = goal;
      v = 0;
      last = 0;
      write();
      return;
    }
    write();
    raf = requestAnimationFrame(frame);
  };
  const wake = () => {
    if (!raf) raf = requestAnimationFrame(frame);
  };
  // A layout change moves the target; the spring carries the track there like any scroll.
  const relayout = () => {
    measure();
    wake();
  };

  // First paint: start where the scroll already is (a reload mid-page), not at 0.
  measure();
  if (rail.matches) {
    x = target();
    write();
  }
  const ro = new ResizeObserver(relayout);
  ro.observe(document.documentElement);
  ro.observe(track);
  addEventListener('scroll', wake, { passive: true });
  rail.addEventListener('change', relayout);
  document.fonts?.ready.then(relayout);

  return () => {
    cancelAnimationFrame(raf);
    ro.disconnect();
    removeEventListener('scroll', wake);
    rail.removeEventListener('change', relayout);
  };
}

/**
 * Widgets rise once, the first time they come into view. The stage clips the track, so a card
 * waiting off to the right does not count as in view until it slides on screen. The margin
 * matches the widget's 80px drop, so it starts rising just as its resting place enters.
 */
function appear(rail: HTMLElement): () => void {
  const els = rail.querySelectorAll<HTMLElement>('.appear');
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    },
    { rootMargin: K.APPEAR_MARGIN },
  );
  els.forEach((el) => io.observe(el));
  return () => io.disconnect();
}
