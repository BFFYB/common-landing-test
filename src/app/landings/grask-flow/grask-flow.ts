import {
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * Grask flow demo: the whole product flow as one 48-second film, on a single clock, for testing
 * the animations a "how it works" demo needs. See README.md here.
 *
 * Two devices sit on the stage, the instructor's screen and the student's phone, and every
 * element on them is a CSS animation on the same 48 s loop (grask-flow.timeline.css, generated
 * from the spec in its header). The four rubric criteria are the through-line: they are typed in
 * as a rubric, ticked off during the call, quoted in the evidence report, weighed in the grade and
 * charted on the dashboard. The only JavaScript is the transport: play/pause, speed, scrub, chapter
 * jumps and the playhead, all done by moving every animation's currentTime together (Web
 * Animations API), the way grask-3's seek() does. Under prefers-reduced-motion the film is paused
 * at the end of a chapter and the chapter chips step through the finished states.
 *
 * Below the film, separate from it and its clock, sits Threadline: a page effect that stitches one
 * thread down through the six steps of the flow as the reader scrolls. Its motion is plain CSS
 * keyframes, sequenced as if it played on its own; setupThread() pauses them and scrubs their
 * currentTime from the scroll position (the Web Animations API, since Firefox has no
 * animation-timeline), and lays the stations out in px from the stage's width.
 */

export interface Chapter {
  id: string;
  /** Chip label. */
  name: string;
  /** Caption title. */
  title: string;
  /** Caption sentence: what happens in the product. */
  note: string;
  /** What to watch on the instructor's screen. */
  screen: string;
  /** What to watch on the phone. */
  phone: string;
  /** Start, in seconds of the loop. */
  start: number;
}

export interface Criterion {
  name: string;
  weight: number;
}

export interface Line {
  who: 'agent' | 'student';
  words: string[];
}

export interface Evidence {
  criterion: string;
  words: string[];
  status: 'demonstrated' | 'partial' | 'missing';
}

export interface Student {
  name: string;
  state: 'live' | 'done' | 'waiting';
  time: string;
}

export interface Bar {
  name: string;
  pct: number;
}

/** A stop of the Threadline effect: what its bubble says. */
export interface Station {
  /** Short label, after the step number. */
  name: string;
  title: string;
  note: string;
  points: string[];
}

interface Point {
  x: number;
  y: number;
}

/** Threadline's geometry for one stage width, in px. */
interface ThreadGeo {
  height: number;
  /** The stations. */
  pts: Point[];
  /** One cubic per hop, vertical at both ends so the thread runs smoothly through every knot. */
  hops: string[];
  /** The whole route as one path, for the dashed guide. */
  guide: string;
  /** A bubble per station, beside its knot, on the outer side (all on the right when narrow). */
  labels: { side: 'left' | 'right'; top: number; left: number | null; right: number | null; width: number }[];
}

/**
 * Lays the stations down the stage, alternating left and right of the centre, and the bubbles beside them.
 * The swing of the thread gives way to the bubbles: it narrows until each side keeps about 250 px for its bubble.
 */
function layoutThread(width: number, n: number): ThreadGeo {
  const narrow = width < 560;
  const step = 320;
  const top = 120;
  const gap = 26;
  const amp = narrow ? 22 : Math.max(24, Math.min(130, width / 2 - 250));
  const cx = narrow ? 44 : width / 2;
  const pts = Array.from({ length: n }, (_, i) => ({ x: cx + (i % 2 ? amp : -amp), y: top + i * step }));
  const hops = pts.slice(1).map((b, i) => {
    const a = pts[i];
    const dy = (b.y - a.y) / 2;
    return `M${a.x} ${a.y} C${a.x} ${a.y + dy} ${b.x} ${b.y - dy} ${b.x} ${b.y}`;
  });
  const guide = hops.map((d, i) => (i ? d.slice(d.indexOf('C')) : d)).join(' ');
  const labels = pts.map((p, i) =>
    narrow || i % 2
      ? { side: 'right' as const, top: p.y, left: p.x + gap, right: null, width: Math.min(320, width - p.x - gap - 8) }
      : { side: 'left' as const, top: p.y, left: null, right: width - p.x + gap, width: Math.min(320, p.x - gap - 8) },
  );
  return { height: top * 2 + (n - 1) * step, pts, hops, guide, labels };
}

/** Length of the loop in milliseconds; every timeline animation runs this long. */
export const LOOP_MS = 48_000;
/** Length of one chapter in milliseconds; six chapters make the loop. */
export const CHAPTER_MS = 8_000;

const words = (s: string) => s.split(' ');

@Component({
  selector: 'landing-grask-flow',
  imports: [RouterLink],
  templateUrl: './grask-flow.html',
  styleUrls: ['./grask-flow.fonts.css', './grask-flow.css', './grask-flow.timeline.css'],
  host: {
    '(keydown)': 'onKey($event)',
  },
})
export class GraskFlow {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  readonly chapters: readonly Chapter[] = [
    {
      id: 'rubric',
      name: 'Rubric',
      title: 'You set the rubric',
      note: 'Four criteria, weighted the way you grade. Grask asks about nothing else.',
      screen: 'The criteria type in one by one, each weight settles, Save presses and confirms.',
      phone: 'Idle. Nothing has reached the student yet.',
      start: 0,
    },
    {
      id: 'lms',
      name: 'LMS',
      title: 'It attaches to the assignment',
      note: 'One switch on the Moodle assignment. Students get the check where they hand in the report.',
      screen: 'The switch flips on and the details unfold beneath it.',
      phone: 'The link travels the wire; a notification drops in.',
      start: 8,
    },
    {
      id: 'call',
      name: 'Call',
      title: 'The student takes a six-minute voice call',
      note: 'The agent asks about their own report, follows up, and listens. You watch the cohort fill in.',
      screen: 'A row turns from in progress to done; the counter ticks up.',
      phone: 'Words arrive as they are spoken; criteria tick off as they are covered.',
      start: 16,
    },
    {
      id: 'evidence',
      name: 'Evidence',
      title: 'You receive the evidence, by criterion',
      note: 'A quote per criterion, lifted from the transcript, each with a status: demonstrated, partial or missing.',
      screen: 'Quotes arrive word by word, then a status lands on each.',
      phone: 'A tick draws itself; the student is thanked.',
      start: 24,
    },
    {
      id: 'grade',
      name: 'Grade',
      title: 'You grade',
      note: 'A recommendation with its reasons. You adjust it, confirm, and it lands in the gradebook.',
      screen: 'The recommendation appears with its reasons, the slider moves a notch, Confirm presses, a toast confirms.',
      phone: 'The result travels back; a card with the grade and feedback slides in.',
      start: 32,
    },
    {
      id: 'dashboard',
      name: 'Dashboard',
      title: 'The course learns too',
      note: 'Across the cohort one criterion stands out. That is the next lecture.',
      screen: 'Four bars grow; the low one is flagged with a suggestion.',
      phone: 'Quiet. The next check is announced.',
      start: 40,
    },
  ];

  readonly criteria: readonly Criterion[] = [
    { name: 'Hash function choice', weight: 20 },
    { name: 'Collision handling', weight: 30 },
    { name: 'Load factor and resizing', weight: 25 },
    { name: 'Complexity', weight: 25 },
  ];

  readonly transcript: readonly Line[] = [
    {
      who: 'agent',
      words: words(
        'Your report shows lookups slowing once the table is about 70% full. Why does that happen with linear probing?',
      ),
    },
    {
      who: 'student',
      words: words(
        'Clustering. Occupied slots form long runs, so a new key has to walk to the end of a run, and then it makes that run longer.',
      ),
    },
    { who: 'agent', words: words('What would you change to keep lookups fast at that load?') },
  ];

  readonly evidence: readonly Evidence[] = [
    {
      criterion: 'Hash function choice',
      words: words('“I hash the key’s bytes with FNV-1a and mask to the table size.”'),
      status: 'demonstrated',
    },
    {
      criterion: 'Collision handling',
      words: words('“Occupied slots form long runs, so a new key walks to the end of a run.”'),
      status: 'demonstrated',
    },
    {
      criterion: 'Load factor and resizing',
      words: words('“I resize when it’s… I think when it’s full?”'),
      status: 'partial',
    },
    {
      criterion: 'Complexity',
      words: words('“Average O(1), but the long runs make the worst case O(n).”'),
      status: 'demonstrated',
    },
  ];

  readonly statusLabel: Record<Evidence['status'], string> = {
    demonstrated: 'Demonstrated',
    partial: 'Partial',
    missing: 'Missing',
  };

  readonly students: readonly Student[] = [
    { name: 'Ana K.', state: 'live', time: '04:51' },
    { name: 'Ben O.', state: 'done', time: '05:48' },
    { name: 'Chloé D.', state: 'done', time: '06:02' },
    { name: 'Dev P.', state: 'waiting', time: '' },
  ];

  readonly bars: readonly Bar[] = [
    { name: 'Hash function', pct: 86 },
    { name: 'Collisions', pct: 41 },
    { name: 'Load factor', pct: 74 },
    { name: 'Complexity', pct: 79 },
  ];

  readonly speeds: readonly number[] = [0.5, 1, 2];

  /** Threadline: the six stations, top to bottom. The bubble copy is a starting point; replace it with the product's. */
  readonly stations: readonly Station[] = [
    {
      name: 'Rubric',
      title: 'You set the rubric',
      note: 'Four criteria, weighted the way you grade. Grask asks about nothing else.',
      points: ['A weight per criterion', 'Length of the check', 'Opens once the report is in'],
    },
    {
      name: 'LMS',
      title: 'It attaches to the assignment',
      note: 'One switch on the Moodle assignment. Students get the check where they hand in the report.',
      points: ['Moodle, Canvas, Brightspace', 'No new logins for students', 'Roster and due dates follow'],
    },
    {
      name: 'Call',
      title: 'The student takes a six-minute voice call',
      note: 'The agent asks about their own report, follows up, and listens.',
      points: ['Questions drawn from the report itself', 'Follow-ups when an answer is thin', 'Recorded and transcribed'],
    },
    {
      name: 'Evidence',
      title: 'You receive the evidence, by criterion',
      note: 'A quote per criterion, lifted from the transcript, each with a status.',
      points: ['Demonstrated, partial or missing', 'Each quote links to its moment in the recording', 'Own words, not the report’s'],
    },
    {
      name: 'Grade',
      title: 'You grade',
      note: 'A recommendation with its reasons. You adjust it, confirm, and it lands in the gradebook.',
      points: ['Reasons, not a black box', 'A notch up or down', 'Written back to the LMS'],
    },
    {
      name: 'Dashboard',
      title: 'The course learns too',
      note: 'Across the cohort one criterion stands out. That is the next lecture.',
      points: ['Cohort view per criterion', 'The weak spot flagged', 'A suggestion for the next lecture'],
    },
  ];
  /** Threadline's geometry, relaid on resize. Starts at the stage's widest so the first render has paths. */
  readonly threadGeo = signal<ThreadGeo>(layoutThread(920, this.stations.length));

  /** Playhead position in the loop, in milliseconds. */
  readonly time = signal(0);
  readonly playing = signal(false);
  readonly rate = signal(1);
  readonly reduced = signal(false);
  readonly chapter = computed(() => Math.min(5, Math.floor(this.time() / CHAPTER_MS)));

  readonly loopMs = LOOP_MS;

  /** Every animation on the film, all on the same clock. */
  private anims: Animation[] = [];
  private frame = 0;
  /** Threadline's animations, paused and scrubbed from scroll. */
  private threadAnims: Animation[] = [];
  private threadFrame = 0;

  constructor() {
    afterNextRender(() => {
      this.setupTransport();
      this.setupThread();
    });
  }

  /** "00:12" for 12.4 seconds. */
  tc(seconds: number): string {
    const s = Math.max(0, Math.floor(seconds));
    return `00:${String(s).padStart(2, '0')}`;
  }

  toggle(): void {
    this.playing() ? this.pause() : this.play();
  }

  play(): void {
    if (this.reduced()) {
      return; // reduced motion: the film is stepped with the chapter chips, never played
    }
    for (const a of this.anims) {
      a.play();
    }
    this.playing.set(true);
    this.tick();
  }

  pause(): void {
    for (const a of this.anims) {
      a.pause();
    }
    this.playing.set(false);
    cancelAnimationFrame(this.frame);
    this.readClock();
  }

  setRate(rate: number): void {
    this.rate.set(rate);
    for (const a of this.anims) {
      a.playbackRate = rate;
    }
  }

  /** Jumps to the start of a chapter (to the end of it under reduced motion, where the finished state is the point). */
  seek(index: number): void {
    const at = this.chapters[index].start * 1000 + (this.reduced() ? CHAPTER_MS - 600 : 0);
    this.seekTo(at);
  }

  seekTo(ms: number): void {
    const at = ((ms % LOOP_MS) + LOOP_MS) % LOOP_MS;
    for (const a of this.anims) {
      a.currentTime = at;
    }
    this.time.set(at);
  }

  onScrub(event: Event): void {
    this.seekTo(Number((event.target as HTMLInputElement).value));
  }

  onKey(event: KeyboardEvent): void {
    const el = event.target as HTMLElement | null;
    if (el?.closest('input[type="range"]') && ['ArrowLeft', 'ArrowRight'].includes(event.key)) {
      return; // the scrubber's own keys
    }
    if (event.key === ' ' || event.key === 'k') {
      event.preventDefault();
      this.toggle();
    } else if (event.key === 'ArrowRight' || event.key === 'l') {
      this.seek((this.chapter() + 1) % 6);
    } else if (event.key === 'ArrowLeft' || event.key === 'j') {
      this.seek((this.chapter() + 5) % 6);
    } else if (/^[1-6]$/.test(event.key)) {
      this.seek(Number(event.key) - 1);
    }
  }

  /**
   * Threadline: pauses its keyframes and scrubs them from scroll. Progress is where the reading line
   * (60% down the viewport) sits within the stage, 0 at its top and 1 at its bottom, mapped onto the
   * whole sequence; so the head of the thread runs with the reader, forwards and back.
   */
  private setupThread(): void {
    const stage = this.host.nativeElement.querySelector<HTMLElement>('.tl-stage');
    if (!stage) {
      return;
    }
    this.threadAnims = stage.getAnimations({ subtree: true });
    for (const a of this.threadAnims) {
      a.pause();
    }
    const end = Math.max(0, ...this.threadAnims.map((a) => Number(a.effect?.getComputedTiming().endTime ?? 0)));
    const layout = () => this.threadGeo.set(layoutThread(stage.clientWidth, this.stations.length));
    const scrub = () => {
      const r = stage.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (window.innerHeight * 0.6 - r.top) / r.height));
      for (const a of this.threadAnims) {
        a.currentTime = p * end;
      }
    };
    const onScroll = () => {
      cancelAnimationFrame(this.threadFrame);
      this.threadFrame = requestAnimationFrame(scrub);
    };
    const onResize = () => {
      layout();
      onScroll();
    };
    layout();
    scrub();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    this.destroyRef.onDestroy(() => {
      cancelAnimationFrame(this.threadFrame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    });
  }

  private setupTransport(): void {
    const film = this.host.nativeElement.querySelector<HTMLElement>('.film');
    if (!film) {
      return;
    }
    this.anims = film.getAnimations({ subtree: true });
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.reduced.set(reduce.matches);
    if (reduce.matches) {
      // no motion: rest at the end of the first chapter, with everything on it finished
      for (const a of this.anims) {
        a.pause();
      }
      this.seek(0);
    } else {
      this.seekTo(0);
      this.play();
    }
    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(this.frame);
      } else if (this.playing()) {
        this.tick();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    this.destroyRef.onDestroy(() => {
      cancelAnimationFrame(this.frame);
      document.removeEventListener('visibilitychange', onVisibility);
    });
  }

  private readClock(): void {
    const ref = this.anims[0];
    const t = typeof ref?.currentTime === 'number' ? ref.currentTime : 0;
    this.time.set(((t % LOOP_MS) + LOOP_MS) % LOOP_MS);
  }

  private tick = (): void => {
    this.readClock();
    if (this.playing()) {
      this.frame = requestAnimationFrame(this.tick);
    }
  };
}
