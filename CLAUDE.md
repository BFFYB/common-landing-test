# test-landing

Playground for landing pages. Each landing is a self-contained, lazy-loaded Angular component.
`/` is a gallery of all landings; a floating switcher on every landing jumps between them.

## Commands

- `npm start` — dev server at http://localhost:4200 (opens browser)
- `npm run new -- <slug> "<Title>"` — scaffold a landing and register it (the only way to add one)
- `npm run build` — prod build; run it to check nothing broke
- `npm run format` — prettier

## Layout

- `src/app/landings/registry.ts` — single source of truth (`LANDINGS`, newest first). Routes, gallery and switcher all derive from it. New entries go under the `// @new-landing` marker — the script does this.
  A landing can list extra `pages` (a form, a detail page): routed at `/<slug>/<path>`, component in `<slug>/<path>/`, not in the gallery or switcher.
- `src/app/landings/<slug>/<slug>.{ts,html,css}` — one landing. The html + css is where the work happens.
- `src/app/gallery/` — index page at `/`.
- `src/app/switcher/` — floating HUD. Keys: `[` `]` prev/next landing, `{` `}` prev/next form factor, `r` rotate, `` ` `` hide, `Esc` close list.
- `src/app/devices/` — form-factor preview. `devices.ts` is the device list (CSS px) + selection state; `stage` wraps the router outlet and, with a device picked, loads the same route in an iframe of that size (real media queries / dvh), scaled to fit. Inside the iframe the app renders without HUD and forwards keys to the parent.
- `src/styles.css` — tiny global reset only. Never put landing styles here.
- `public/landings/<slug>/` — images/assets for a landing, referenced as `/landings/<slug>/x.png`.

## Adding a landing

1. `npm run new -- <slug> "<Title>"`, then fill in `description` in the registry.
2. Write the page in `<slug>.html` + `<slug>.css`. Data (feature lists, plans, FAQ items) goes in the `.ts` as readonly arrays and is rendered with `@for`.
3. Keep everything inside the landing's folder. Styles are component-scoped (no leaking between landings). Web fonts via `@import url(...)` at the top of the landing's css. Design tokens as CSS custom properties on `:host`.
4. Keep `:host { display: block; min-height: 100dvh }` so the component participates in layout.
5. Copy, don't abstract. No shared components between landings unless the same thing is used 3+ times — then `src/app/shared/`.
6. Logic only where the landing needs it (a form, a toggle, a tab). Signals + `@if`/`@for`.

## Angular notes

Angular 22, standalone components. No `Component` suffix on classes and no `.component` in file
names (`example.ts` → `class Example`, selector `landing-example`). Use `inject()`, signals,
`host: {}` in the decorator instead of `@HostListener`/`@HostBinding`. Route `title` comes from the
registry.
