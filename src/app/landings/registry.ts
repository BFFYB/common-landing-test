import { Type } from '@angular/core';

export interface LandingMeta {
  /** URL segment: http://localhost:4200/<slug> */
  slug: string;
  title: string;
  description: string;
  /** YYYY-MM-DD */
  created: string;
  load: () => Promise<Type<unknown>>;
  /** Extra pages of this landing (a form, a detail page), routed at /<slug>/<path>. Not in the gallery or the switcher. */
  pages?: LandingPage[];
}

export interface LandingPage {
  /** URL segment under the landing: http://localhost:4200/<slug>/<path> */
  path: string;
  title: string;
  load: () => Promise<Type<unknown>>;
}

/**
 * Single source of truth for all landings. Routes, the gallery and the
 * switcher are all derived from this list. Newest first.
 *
 * Add one with:  npm run new -- <slug> "<Title>"
 */
export const LANDINGS: LandingMeta[] = [
  // @new-landing
  {
    slug: 'grask-flow',
    title: 'Grask flow demo',
    description:
      'The whole Grask flow as one 48-second film on a single clock: the instructor\'s screen and the student\'s phone side by side through six chapters (rubric, LMS, call, evidence, grade, dashboard), every element a CSS animation on the loop. Play, pause, scrub, speed and chapter jumps move them all together. Below it, a separate page effect, Threadline: a thread stitched down through the six steps, drawn by scroll. A playground for the animations a "how it works" demo needs. See README.md.',
    created: '2026-09-23',
    load: () => import('./grask-flow/grask-flow').then((m) => m.GraskFlow),
  },
  {
    slug: 'wispr-testi',
    title: 'Wispr testimonial orbit',
    description:
      'Port of the case-study deck on wisprflow.ai: six cards on a sticky stage, scrubbed across the screen by scroll while each swings on a rotateX arc around a pivot behind it (upright at the centre, tipped and receding at the edges). Plain TS + CSS, no GSAP; the original script\'s knobs are at the top of the .ts. See README.md.',
    created: '2026-09-22',
    load: () => import('./wispr-testi/wispr-testi').then((m) => m.WisprTesti),
  },
  {
    slug: 'list-effects',
    title: 'List effects',
    description:
      'Training ground for list entrance effects: 20 keyframe effects, stagger order, duration / stagger / easing / amplitude, five layouts, replay, play-out and loop, on-scroll sections, and the CSS to copy.',
    created: '2026-09-21',
    load: () => import('./list-effects/list-effects').then((m) => m.ListEffects),
  },
  {
    slug: 'grask-3',
    title: 'Grask (Uncut Sans)',
    description:
      'grask-2 with one change, the type: Uncut Sans for headings, UI and body, Urbanist for descriptions, weights capped at 600, two text colours. Same layout, copy and motion, for a side-by-side with /grask-2.',
    created: '2026-09-21',
    load: () => import('./grask-3/grask-3').then((m) => m.Grask3),
    pages: [
      {
        path: 'pilot',
        title: 'Grask (Uncut Sans) · Pilot',
        load: () => import('./grask-3/pilot/pilot').then((m) => m.Grask3Pilot),
      },
    ],
  },
  {
    slug: 'grask-2',
    title: 'Grask (capital G)',
    description:
      'Copy of the grask landing with the brand name written Grask: text wordmark next to the mark tile instead of the SVG lockup, everything else identical. Runs side by side with /grask.',
    created: '2026-09-20',
    load: () => import('./grask-2/grask-2').then((m) => m.Grask2),
  },
  {
    slug: 'hello-world',
    title: 'Voice sphere',
    description:
      'Pulsing voice-sphere component for the student session: speaking / listening / thinking states, one brand token, optional live mic level. Built to be copied into the product.',
    created: '2026-09-20',
    load: () => import('./hello-world/hello-world').then((m) => m.HelloWorld),
  },
  {
    slug: 'grask',
    title: 'Grask',
    description:
      'Design-canvas export on the grask brand kit (petrol / paper / Schibsted Grotesk, real logos). Pure-CSS demo + LMS orbit, scroll reveals, placeholders in [brackets].',
    created: '2026-09-20',
    load: () => import('./grask/grask').then((m) => m.Grask),
  },
];
