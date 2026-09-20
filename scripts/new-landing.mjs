#!/usr/bin/env node
// Scaffold a new landing and register it.
//   npm run new -- <slug> ["Title"]
import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [slug, titleArg] = process.argv.slice(2);

if (!slug || !/^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(slug)) {
  console.error(
    'Usage: npm run new -- <slug> ["Title"]\n  slug must be kebab-case, e.g. saas-pricing-v2',
  );
  process.exit(1);
}

const words = slug.split('-').map((w) => w[0].toUpperCase() + w.slice(1));
const title = titleArg ?? words.join(' ');
const className = words.join('');
const dir = path.join(root, 'src/app/landings', slug);
const registryPath = path.join(root, 'src/app/landings/registry.ts');
const marker = '  // @new-landing';
const today = new Date().toLocaleDateString('sv'); // local YYYY-MM-DD

const exists = await access(dir).then(
  () => true,
  () => false,
);
if (exists) {
  console.error(`landing "${slug}" already exists at ${path.relative(root, dir)}`);
  process.exit(1);
}

const registry = await readFile(registryPath, 'utf8');
if (!registry.includes(marker)) {
  console.error(`marker "${marker.trim()}" not found in ${path.relative(root, registryPath)}`);
  process.exit(1);
}

const ts = `import { Component } from '@angular/core';

@Component({
  selector: 'landing-${slug}',
  templateUrl: './${slug}.html',
  styleUrl: './${slug}.css',
})
export class ${className} {}
`;

const html = `<main class="hero">
  <h1>${title}</h1>
  <p>Fresh landing. Edit <code>src/app/landings/${slug}/</code>.</p>
</main>
`;

const css = `:host {
  --bg: #ffffff;
  --fg: #111111;
  --muted: #6b6b73;
  --accent: #3b5bff;

  display: block;
  min-height: 100dvh;
  background: var(--bg);
  color: var(--fg);
  font-family:
    system-ui,
    -apple-system,
    sans-serif;
  line-height: 1.5;
}

.hero {
  max-width: 720px;
  margin: 0 auto;
  padding: 120px 24px;
  text-align: center;
}
.hero h1 {
  margin: 0 0 16px;
  font-size: clamp(2rem, 6vw, 3.5rem);
  font-weight: 800;
  letter-spacing: -0.03em;
}
.hero p {
  margin: 0;
  color: var(--muted);
}
code {
  padding: 2px 6px;
  border-radius: 6px;
  background: color-mix(in srgb, var(--fg) 6%, transparent);
  font-size: 0.9em;
}
`;

const entry = `  {
    slug: '${slug}',
    title: '${title.replace(/'/g, "\\'")}',
    description: '',
    created: '${today}',
    load: () => import('./${slug}/${slug}').then((m) => m.${className}),
  },`;

await mkdir(dir, { recursive: true });
await writeFile(path.join(dir, `${slug}.ts`), ts);
await writeFile(path.join(dir, `${slug}.html`), html);
await writeFile(path.join(dir, `${slug}.css`), css);
await writeFile(registryPath, registry.replace(marker, `${marker}\n${entry}`));

console.log(`✔ ${title}  →  http://localhost:4200/${slug}
  src/app/landings/${slug}/${slug}.html
  src/app/landings/${slug}/${slug}.css
  src/app/landings/${slug}/${slug}.ts
  registered in src/app/landings/registry.ts (fill in "description")`);
