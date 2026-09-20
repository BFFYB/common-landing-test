# Voice sphere

`sphere/voice-sphere.{ts,html,css}` is the examiner's presence for the student session, built
here so it can be copied into the product unchanged. This page (`hello-world.*`) is only its
showcase.

## Port it to the product

1. Copy `sphere/` to `src/app/shared/voice-sphere/` in `ai-frontend-session`.
2. In `exam-session.html`, replace the `.orb-container` block with
   `<voice-sphere [state]="orbState()" [size]="148" />`. The status and hint copy stay where
   they are: the sphere is `aria-hidden` and the page owns the text.
3. Theme it from the branding tokens: `voice-sphere { --sphere-color: var(--institution-accent); }`.
   Nothing else is needed; every tone derives from that one token. If a brand needs its own
   listening tone, set `--sphere-color-listening`.
4. When `LivekitService` exposes the active speaker's `audioLevel`, pass it as `[level]`
   (0–1, raw). Attack/release easing is inside the component.

## How it reads

| State | Colour | Motion |
| --- | --- | --- |
| `idle` | brand | faint breath, dim halo |
| `speaking` | brand | halo bright, rings emit outward, faster breath |
| `listening` | lighter brand tone | rings gather inward, calm breath; a live level swells the ball |
| `thinking` | brand | halo dim, light spots orbit fast inside the glass |

Under `prefers-reduced-motion` nothing moves; state is carried by halo strength, tone and one
still ring (dashed for listening). Loops pause while the sphere is offscreen.

## Requirements

`@property`, `color-mix()`, individual transform properties (`scale`, `rotate`). Relative colour
syntax (`oklch(from …)`) is a progressive enhancement behind `@supports`; without it the lighter
tones come from `color-mix` with white.
