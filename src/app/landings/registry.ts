import { Type } from '@angular/core';

export interface LandingMeta {
  /** URL segment: http://localhost:4200/<slug> */
  slug: string;
  title: string;
  description: string;
  /** YYYY-MM-DD */
  created: string;
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
    slug: 'grask',
    title: 'Grask',
    description:
      'Design-canvas export on the grask brand kit (petrol / paper / Schibsted Grotesk, real logos). Pure-CSS demo + LMS orbit, scroll reveals, placeholders in [brackets].',
    created: '2026-09-20',
    load: () => import('./grask/grask').then((m) => m.Grask),
  },
  {
    slug: 'example',
    title: 'Example',
    description: 'Starter landing — hero, three features, CTA. Copy the pattern, not the code.',
    created: '2026-09-20',
    load: () => import('./example/example').then((m) => m.Example),
  },
];
