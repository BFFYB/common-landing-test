import { computed, signal } from '@angular/core';
import { EMBEDDED } from '../../devices/devices';

/**
 * The hero lead's type tryout, inherited from grask-4 (2026-09-25), where the lead ("Runs your oral checks by
 * voice…") felt unreadable in Urbanist. On grask-6-bodoni-moda (2026-09-29) the lead opens as the type guide sets it, the
 * hero subheadline role (.t-body-lg: Golos Text 400, 18px, 1.5, no tracking, a 60ch measure), and the panel at
 * the bottom left of the page is kept so the guide's choice can be compared against other faces, live: face,
 * weight, size, tracking, leading, measure and colour. The values are bound straight onto the <p class="lead">
 * in grask-6-bodoni-moda.html and kept in localStorage (LEAD_KEY, its own key, so grask-4's setting does not leak in), so
 * a reload, the device preview (which loads the page in an iframe) and a second tab all show the same setting.
 * The panel's look is grask-6-bodoni-moda.lead.css, which also imports the other faces from Google Fonts; the page's own
 * face comes from grask-6-bodoni-moda.type.css. `,` and `.` step through the faces (grask-6-bodoni-moda.ts forwards the keys).
 */
export interface LeadFace {
  name: string;
  /** The font-family value, fallbacks included. */
  family: string;
  group: 'page' | 'sans' | 'serif';
  /** The weights the file has, for the readout; a variable range unless the note says otherwise. */
  weights: string;
  note: string;
}

export const LEAD_FACES: readonly LeadFace[] = [
  { name: 'Golos Text', family: '"Golos Text", "Golos Text Fallback", system-ui, -apple-system, "Segoe UI", Arial, sans-serif', group: 'page', weights: '400–600 (the guide loads these)', note: "the guide's text face: the lead is its hero subheadline role" },
  { name: 'Inter', family: "'Inter', system-ui, sans-serif", group: 'sans', weights: '300–700', note: 'the screen workhorse: tall x-height, open apertures' },
  { name: 'Geist', family: "'Geist', system-ui, sans-serif", group: 'sans', weights: '300–700', note: "Vercel's; Inter-like, a tighter rhythm" },
  { name: 'Instrument Sans', family: "'Instrument Sans', system-ui, sans-serif", group: 'sans', weights: '400–700', note: "the kit's original UI face" },
  { name: 'Schibsted Grotesk', family: "'Schibsted Grotesk', system-ui, sans-serif", group: 'sans', weights: '400–700', note: "the kit's original display face, sturdy" },
  { name: 'Source Sans 3', family: "'Source Sans 3', system-ui, sans-serif", group: 'sans', weights: '300–700', note: 'humanist and narrow; long lines read well' },
  { name: 'Public Sans', family: "'Public Sans', system-ui, sans-serif", group: 'sans', weights: '300–700', note: 'Franklin-ish, very even, plain' },
  { name: 'Figtree', family: "'Figtree', system-ui, sans-serif", group: 'sans', weights: '300–700', note: 'friendly geometric with a real x-height' },
  { name: 'Onest', family: "'Onest', system-ui, sans-serif", group: 'sans', weights: '300–700', note: 'neutral, slightly soft' },
  { name: 'Manrope', family: "'Manrope', system-ui, sans-serif", group: 'sans', weights: '300–700', note: 'geometric and open; wide at 400' },
  { name: 'DM Sans', family: "'DM Sans', system-ui, sans-serif", group: 'sans', weights: '300–700', note: 'geometric, low contrast, calm' },
  { name: 'Plus Jakarta Sans', family: "'Plus Jakarta Sans', system-ui, sans-serif", group: 'sans', weights: '300–700', note: 'closest to Urbanist, but taller and looser' },
  { name: 'Albert Sans', family: "'Albert Sans', system-ui, sans-serif", group: 'sans', weights: '300–700', note: 'geometric grotesk, quiet' },
  { name: 'Hanken Grotesk', family: "'Hanken Grotesk', system-ui, sans-serif", group: 'sans', weights: '300–700', note: 'Swiss-ish grotesk, compact' },
  { name: 'Work Sans', family: "'Work Sans', system-ui, sans-serif", group: 'sans', weights: '300–700', note: 'wide grotesk; best at 400–500' },
  { name: 'Libre Franklin', family: "'Libre Franklin', system-ui, sans-serif", group: 'sans', weights: '300–700', note: 'Franklin Gothic revival, robust' },
  { name: 'Red Hat Text', family: "'Red Hat Text', system-ui, sans-serif", group: 'sans', weights: '300–700', note: 'drawn for paragraphs, roomy' },
  { name: 'Nunito Sans', family: "'Nunito Sans', system-ui, sans-serif", group: 'sans', weights: '300–700', note: 'rounded terminals, soft' },
  { name: 'Outfit', family: "'Outfit', system-ui, sans-serif", group: 'sans', weights: '300–700', note: "Urbanist's stack fallback; geometric, display-ish" },
  { name: 'Newsreader', family: "'Newsreader', Georgia, serif", group: 'serif', weights: '300–700', note: 'editorial text serif, reads like print' },
  { name: 'Source Serif 4', family: "'Source Serif 4', Georgia, serif", group: 'serif', weights: '300–700', note: 'transitional; sits under any grotesk' },
  { name: 'Literata', family: "'Literata', Georgia, serif", group: 'serif', weights: '300–700', note: 'built for long reading (Google Play Books)' },
  { name: 'Lora', family: "'Lora', Georgia, serif", group: 'serif', weights: '400–700', note: 'calligraphic roots, warm' },
  { name: 'Fraunces', family: "'Fraunces', Georgia, serif", group: 'serif', weights: '300–700', note: 'soft old-style; playful at 400' },
  { name: 'Instrument Serif', family: "'Instrument Serif', Georgia, serif", group: 'serif', weights: '400 only (static)', note: 'display serif, one weight; big and airy' },
];

export type LeadColor = 'lead' | 'primary' | 'secondary';

export interface LeadState {
  face: string;
  weight: number;
  /** Desktop size in px; phones get 3px less (see `fontSize`). */
  size: number;
  /** em */
  tracking: number;
  leading: number;
  /** max-width in px */
  width: number;
  color: LeadColor;
}

/** What grask-6-bodoni-moda opens with: the guide's hero subheadline (.t-body-lg), Golos Text 400, 18px, 1.5, no tracking, a 60ch measure (650px at 18px). */
export const LEAD_DEFAULT: LeadState = { face: 'Golos Text', weight: 400, size: 18, tracking: 0, leading: 1.5, width: 650, color: 'lead' };
/** The grask-4 lead, for a flip back: Inter 450 at clamp(17px, 1.5vw, 20px), -0.01em, 1.5, 760px, --g-text-lead. */
export const LEAD_ORIGINAL: LeadState = { face: 'Inter', weight: 450, size: 20, tracking: -0.01, leading: 1.5, width: 760, color: 'lead' };

export const LEAD_KEY = 'glp6-bodoni-moda-lead';

export class LeadTryout {
  readonly faces = LEAD_FACES;
  readonly groups: readonly { id: LeadFace['group']; label: string }[] = [
    { id: 'page', label: 'On the page' },
    { id: 'sans', label: 'Sans' },
    { id: 'serif', label: 'Serif' },
  ];
  readonly colors: readonly { id: LeadColor; label: string; token: string; hex: string }[] = [
    { id: 'lead', label: 'lead', token: '--g-text-lead', hex: '#444444' },
    { id: 'primary', label: 'primary', token: '--g-text-primary', hex: '#0D0D0D' },
    { id: 'secondary', label: 'secondary', token: '--g-text-secondary', hex: '#83848B' },
  ];

  readonly embedded = EMBEDDED;
  /** Open on a desktop page; a closed chip inside the device preview and on phone widths, where it would cover the lead. */
  readonly open = signal(!EMBEDDED && window.innerWidth >= 640);
  readonly copied = signal(false);

  readonly faceName = signal(LEAD_DEFAULT.face);
  readonly weight = signal(LEAD_DEFAULT.weight);
  readonly size = signal(LEAD_DEFAULT.size);
  readonly tracking = signal(LEAD_DEFAULT.tracking);
  readonly leading = signal(LEAD_DEFAULT.leading);
  readonly width = signal(LEAD_DEFAULT.width);
  readonly color = signal<LeadColor>(LEAD_DEFAULT.color);

  readonly face = computed(() => this.faces.find((f) => f.name === this.faceName()) ?? this.faces[0]);
  readonly index = computed(() => this.faces.indexOf(this.face()));
  readonly fontSize = computed(() => `clamp(${(this.size() - 3).toFixed(1).replace(/\.0$/, '')}px, 1.5vw, ${this.size()}px)`);
  readonly colorValue = computed(() => `var(${this.colors.find((c) => c.id === this.color())!.token})`);
  readonly state = computed<LeadState>(() => ({
    face: this.faceName(),
    weight: this.weight(),
    size: this.size(),
    tracking: this.tracking(),
    leading: this.leading(),
    width: this.width(),
    color: this.color(),
  }));
  /** The declaration to paste once a setting is chosen. */
  readonly css = computed(() =>
    [
      `font-family: ${this.face().family};`,
      `font-weight: ${this.weight()};`,
      `font-size: ${this.fontSize()};`,
      `letter-spacing: ${round(this.tracking())}em;`,
      `line-height: ${round(this.leading())};`,
      `color: ${this.colorValue()};`,
      `max-width: ${this.width()}px;`,
    ].join('\n'),
  );

  constructor() {
    this.load();
  }

  pick(name: string): void {
    if (this.faces.some((f) => f.name === name)) {
      this.faceName.set(name);
    }
  }
  next(): void {
    this.faceName.set(this.faces[(this.index() + 1) % this.faces.length].name);
  }
  prev(): void {
    this.faceName.set(this.faces[(this.index() - 1 + this.faces.length) % this.faces.length].name);
  }
  reset(): void {
    this.apply(LEAD_DEFAULT);
  }
  original(): void {
    this.apply(LEAD_ORIGINAL);
  }
  apply(s: LeadState): void {
    this.faceName.set(s.face);
    this.weight.set(s.weight);
    this.size.set(s.size);
    this.tracking.set(s.tracking);
    this.leading.set(s.leading);
    this.width.set(s.width);
    this.color.set(s.color);
  }

  copy(): void {
    navigator.clipboard?.writeText(this.css()).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 1200);
    });
  }

  /** Reads the saved setting; used at start and when another window saves (the `storage` event). */
  load(): void {
    try {
      const raw = localStorage.getItem(LEAD_KEY);
      if (!raw) {
        return;
      }
      const s = JSON.parse(raw) as Partial<LeadState>;
      this.apply({
        face: typeof s.face === 'string' && this.faces.some((f) => f.name === s.face) ? s.face : LEAD_DEFAULT.face,
        weight: num(s.weight, LEAD_DEFAULT.weight),
        size: num(s.size, LEAD_DEFAULT.size),
        tracking: num(s.tracking, LEAD_DEFAULT.tracking),
        leading: num(s.leading, LEAD_DEFAULT.leading),
        width: num(s.width, LEAD_DEFAULT.width),
        color: s.color === 'primary' || s.color === 'secondary' ? s.color : 'lead',
      });
    } catch {
      /* private mode or blocked storage: keep the defaults */
    }
  }

  save(): void {
    try {
      localStorage.setItem(LEAD_KEY, JSON.stringify(this.state()));
    } catch {
      /* ignore */
    }
  }
}

/** Slider steps like 0.005 leave float noise (-0.015000000000000001); three decimals is all the readout needs. */
function round(v: number): number {
  return Number(v.toFixed(3));
}

function num(v: unknown, fallback: number): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}
