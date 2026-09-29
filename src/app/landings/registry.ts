import { Type } from '@angular/core';

export interface LandingMeta {
  /** URL segment: http://localhost:4202/<slug> */
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
  /** URL segment under the landing: http://localhost:4202/<slug>/<path> */
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
    slug: 'grask-6-space-grotesk-2',
    title: 'Grask · Space Grotesk II (type pass)',
    description:
      'grask-6-space-grotesk duplicated on 2026-09-30 for a full type pass on the Space Grotesk + Golos Text pairing: the display roles step in weight with size (headline 700 at 76px, section titles 600 at 40px, the statement 500 at 32px, tracking -0.03em / -0.02em), the lockups drop to 28px, the two tall calls to action get a 16px label, the lead is 16px on phones. Same two-column hero; Golos Text and the palette unchanged.',
    created: '2026-09-30',
    load: () => import('./grask-6-space-grotesk-2/grask-6-space-grotesk-2').then((m) => m.Grask6SpaceGrotesk2),
    pages: [
      {
        path: 'pilot',
        title: 'Grask · Space Grotesk II (type pass) · Pilot',
        load: () => import('./grask-6-space-grotesk-2/pilot/pilot').then((m) => m.Grask6SpaceGrotesk2Pilot),
      },
    ],
  },
  {
    slug: 'grask-6-fraunces',
    title: 'Grask · Fraunces',
    description:
      'grask-6 duplicated on 2026-09-29 to try another display face: Fraunces (soft old-style, SOFT 100 / WONK 1, weight 600), warm and editorial; "heard." set in its italic as a deliberate exception to the guide. Centred hero as grask-6, headline up to 88px. Golos Text for everything below 28px and the palette unchanged.',
    created: '2026-09-29',
    load: () => import('./grask-6-fraunces/grask-6-fraunces').then((m) => m.Grask6Fraunces),
    pages: [
      {
        path: 'pilot',
        title: 'Grask · Fraunces · Pilot',
        load: () => import('./grask-6-fraunces/pilot/pilot').then((m) => m.Grask6FrauncesPilot),
      },
    ],
  },
  {
    slug: 'grask-6-instrument-serif',
    title: 'Grask · Instrument Serif',
    description:
      'grask-6 with Instrument Serif as the display face: one light weight, tall and airy, so the headline goes very large (up to 120px, line-height .95) and left-aligned, "heard." in italic; lead and button in a row beneath. Golos Text for everything below 28px and the palette unchanged.',
    created: '2026-09-29',
    load: () => import('./grask-6-instrument-serif/grask-6-instrument-serif').then((m) => m.Grask6InstrumentSerif),
    pages: [
      {
        path: 'pilot',
        title: 'Grask · Instrument Serif · Pilot',
        load: () => import('./grask-6-instrument-serif/pilot/pilot').then((m) => m.Grask6InstrumentSerifPilot),
      },
    ],
  },
  {
    slug: 'grask-6-bodoni-moda',
    title: 'Grask · Bodoni Moda',
    description:
      'grask-6 with Bodoni Moda (a Didone, optical sizes) as the display face: a masthead hero, a hairline and a small uppercase Golos dateline above the centred headline at up to 104px. Golos Text for everything below 28px and the palette unchanged.',
    created: '2026-09-29',
    load: () => import('./grask-6-bodoni-moda/grask-6-bodoni-moda').then((m) => m.Grask6BodoniModa),
    pages: [
      {
        path: 'pilot',
        title: 'Grask · Bodoni Moda · Pilot',
        load: () => import('./grask-6-bodoni-moda/pilot/pilot').then((m) => m.Grask6BodoniModaPilot),
      },
    ],
  },
  {
    slug: 'grask-6-young-serif',
    title: 'Grask · Young Serif',
    description:
      'grask-6 with Young Serif (chunky, low-contrast, one weight) as the display face: centred hero, the headline broken into two set lines, a lower, thinner highlighter under "the hours." Golos Text for everything below 28px and the palette unchanged.',
    created: '2026-09-29',
    load: () => import('./grask-6-young-serif/grask-6-young-serif').then((m) => m.Grask6YoungSerif),
    pages: [
      {
        path: 'pilot',
        title: 'Grask · Young Serif · Pilot',
        load: () => import('./grask-6-young-serif/pilot/pilot').then((m) => m.Grask6YoungSerifPilot),
      },
    ],
  },
  {
    slug: 'grask-6-besley',
    title: 'Grask · Besley',
    description:
      'grask-6 with Besley (a Clarendon: bracketed slab serifs) at weight 800 as the display face: a left-aligned poster hero, headline up to 92px. Golos Text for everything below 28px and the palette unchanged.',
    created: '2026-09-29',
    load: () => import('./grask-6-besley/grask-6-besley').then((m) => m.Grask6Besley),
    pages: [
      {
        path: 'pilot',
        title: 'Grask · Besley · Pilot',
        load: () => import('./grask-6-besley/pilot/pilot').then((m) => m.Grask6BesleyPilot),
      },
    ],
  },
  {
    slug: 'grask-6-bricolage',
    title: 'Grask · Bricolage Grotesque',
    description:
      'grask-6 with Bricolage Grotesque (a grotesque with personality, optical sizes) at weight 800 as the display face: left-aligned hero, headline on two set lines up to 96px, lead and button in a row beneath. Golos Text for everything below 28px and the palette unchanged.',
    created: '2026-09-29',
    load: () => import('./grask-6-bricolage/grask-6-bricolage').then((m) => m.Grask6Bricolage),
    pages: [
      {
        path: 'pilot',
        title: 'Grask · Bricolage Grotesque · Pilot',
        load: () => import('./grask-6-bricolage/pilot/pilot').then((m) => m.Grask6BricolagePilot),
      },
    ],
  },
  {
    slug: 'grask-6-syne',
    title: 'Grask · Syne',
    description:
      'grask-6 with Syne (extra-wide geometric) at weight 800 as the display face: centred hero, headline smaller because the face is so wide, "the hours." on a solid tint block instead of the underline. Golos Text for everything below 28px and the palette unchanged.',
    created: '2026-09-29',
    load: () => import('./grask-6-syne/grask-6-syne').then((m) => m.Grask6Syne),
    pages: [
      {
        path: 'pilot',
        title: 'Grask · Syne · Pilot',
        load: () => import('./grask-6-syne/pilot/pilot').then((m) => m.Grask6SynePilot),
      },
    ],
  },
  {
    slug: 'grask-6-space-grotesk',
    title: 'Grask · Space Grotesk',
    description:
      'grask-6 with Space Grotesk at weight 700 as the display face: a two-column product hero, headline left, lead and button right and bottom-aligned; tight tracking. Golos Text for everything below 28px and the palette unchanged.',
    created: '2026-09-29',
    load: () => import('./grask-6-space-grotesk/grask-6-space-grotesk').then((m) => m.Grask6SpaceGrotesk),
    pages: [
      {
        path: 'pilot',
        title: 'Grask · Space Grotesk · Pilot',
        load: () => import('./grask-6-space-grotesk/pilot/pilot').then((m) => m.Grask6SpaceGroteskPilot),
      },
    ],
  },
  {
    slug: 'grask-6-archivo',
    title: 'Grask · Archivo Condensed',
    description:
      'grask-6 with Archivo at width 75 and weight 900 as the display face: a poster hero, the headline in capitals up to 128px across the whole column, lead and button in a row beneath. Golos Text for everything below 28px and the palette unchanged.',
    created: '2026-09-29',
    load: () => import('./grask-6-archivo/grask-6-archivo').then((m) => m.Grask6Archivo),
    pages: [
      {
        path: 'pilot',
        title: 'Grask · Archivo Condensed · Pilot',
        load: () => import('./grask-6-archivo/pilot/pilot').then((m) => m.Grask6ArchivoPilot),
      },
    ],
  },
  {
    slug: 'grask-6-schibsted',
    title: 'Grask · Schibsted Grotesk (control)',
    description:
      'grask-6 with Schibsted Grotesk, the kit\'s original display face, at weight 700: the control of the series, the hero laid out exactly as grask-6, only the face changes. Golos Text for everything below 28px and the palette unchanged.',
    created: '2026-09-29',
    load: () => import('./grask-6-schibsted/grask-6-schibsted').then((m) => m.Grask6Schibsted),
    pages: [
      {
        path: 'pilot',
        title: 'Grask · Schibsted Grotesk (control) · Pilot',
        load: () => import('./grask-6-schibsted/pilot/pilot').then((m) => m.Grask6SchibstedPilot),
      },
    ],
  },
  {
    slug: 'grask-6-mono',
    title: 'Grask · JetBrains Mono',
    description:
      'grask-6 with JetBrains Mono, the guide\'s code face, at weight 700 as the display face: a transcript hero, a timestamp caption above a left-aligned headline, a blinking caret after it, "the hours." on a selection-style tint block. Golos Text for everything below 28px and the palette unchanged.',
    created: '2026-09-29',
    load: () => import('./grask-6-mono/grask-6-mono').then((m) => m.Grask6Mono),
    pages: [
      {
        path: 'pilot',
        title: 'Grask · JetBrains Mono · Pilot',
        load: () => import('./grask-6-mono/pilot/pilot').then((m) => m.Grask6MonoPilot),
      },
    ],
  },
  {
    slug: 'grask-6',
    title: 'Grask (type guide, in full)',
    description:
      'grask-5 duplicated on 2026-09-29 with the Grask type guide applied in full: the twelve tokens (display-xl / lg / md in Piazzolla; heading-sm / xs, body-lg / body / body-sm, label / label-sm, caption in Golos Text; code in JetBrains Mono) with the guide\'s sizes, line-heights, tracking and numerals, worn by the markup as .t-* classes and mapped per the guide\'s "Landing page" table, so no element sets a bare font size. grask-5 had only swapped the faces onto grask-4\'s canvas sizes. The questions the page raised for the guide (dark bands, the statement\'s length, button text at 14px) are in its README. The lead tryout panel stays.',
    created: '2026-09-29',
    load: () => import('./grask-6/grask-6').then((m) => m.Grask6),
    pages: [
      {
        path: 'pilot',
        title: 'Grask (type guide, in full) · Pilot',
        load: () => import('./grask-6/pilot/pilot').then((m) => m.Grask6Pilot),
      },
    ],
  },
  {
    slug: 'grask-5',
    title: 'Grask (Piazzolla + Golos)',
    description:
      'grask-4 duplicated on 2026-09-29 with the Grask type guide applied (test-landing/font-styling.css, scoped into grask-5.type.css): Piazzolla for the display face at 28px and above (headline, section titles, the statement, quotes, the wordmark, the grade number), Golos Text for everything else, JetBrains Mono for code. Kit names point at the guide\'s tokens; sizes stay as exported, except where the 28px floor lifted them. The lead opens as the guide\'s hero subheadline (Golos 400, 18px); the tryout panel stays for comparison.',
    created: '2026-09-29',
    load: () => import('./grask-5/grask-5').then((m) => m.Grask5),
    pages: [
      {
        path: 'pilot',
        title: 'Grask (Piazzolla + Golos) · Pilot',
        load: () => import('./grask-5/pilot/pilot').then((m) => m.Grask5Pilot),
      },
    ],
  },
  {
    slug: 'grask-4',
    title: 'Grask (lead type tryout)',
    description:
      "grask-3 duplicated on 2026-09-25 to try other faces for the hero lead (\"Runs your oral checks by voice…\"), which felt unreadable in Urbanist. The lead has its own type tryout: a panel at the bottom left with 26 faces, weight, size, tracking, leading and colour, kept in localStorage, with the CSS to copy. , and . step through the faces, t hides the panel. Everything else is grask-3.",
    created: '2026-09-25',
    load: () => import('./grask-4/grask-4').then((m) => m.Grask4),
    pages: [
      {
        path: 'pilot',
        title: 'Grask (lead type tryout) · Pilot',
        load: () => import('./grask-4/pilot/pilot').then((m) => m.Grask4Pilot),
      },
    ],
  },
  {
    slug: 'grask-rail',
    title: 'Grask outcome rail',
    description:
      "A dark sticky stage whose outcome cards slide sideways as you scroll down, the track chasing the scroll on a spring, each card's widget (live call, quote, rubric, cohort chart, team, LMS row) springing up as it comes into view; a marquee on phones. Motion after the outcomes section on getfluently.app, copy Grask's, card art in CSS. See README.md.",
    created: '2026-09-23',
    load: () => import('./grask-rail/grask-rail').then((m) => m.GraskRail),
  },
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
      "Port of the case-study deck on wisprflow.ai: six cards on a sticky stage, scrubbed across the screen by scroll while each swings on a rotateX arc around a pivot behind it (upright at the centre, tipped and receding at the edges). Plain TS + CSS, no GSAP; the original script's knobs are at the top of the .ts. See README.md.",
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
