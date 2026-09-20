# test-landing

A test field for landing pages. Vibe-code a landing, open it, flip to the next one.

```bash
npm start                              # http://localhost:4200 — gallery of all landings
npm run new -- saas-pricing "SaaS Pricing"   # scaffold + register a new landing
```

Each landing lives in `src/app/landings/<slug>/` as a lazy Angular component with its own
`.html` / `.css` (component-scoped, so landings never bleed into each other). The list in
`src/app/landings/registry.ts` drives the routes, the gallery and the floating switcher.

**Switcher keys** (work on every page): `[` / `]` previous / next landing · `` ` `` hide the HUD
(clean screenshots) · `Esc` close the list · `⌂` back to the gallery.

See `CLAUDE.md` for conventions.
