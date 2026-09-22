import { Routes } from '@angular/router';
import { Gallery } from './gallery/gallery';
import { LANDINGS } from './landings/registry';

export const routes: Routes = [
  { path: '', component: Gallery, title: 'Landings' },
  ...LANDINGS.flatMap((l) => [
    { path: l.slug, loadComponent: l.load, title: l.title },
    ...(l.pages ?? []).map((p) => ({
      path: `${l.slug}/${p.path}`,
      loadComponent: p.load,
      title: p.title,
    })),
  ]),
  { path: '**', redirectTo: '' },
];
