import { Routes } from '@angular/router';
import { Gallery } from './gallery/gallery';
import { LANDINGS } from './landings/registry';

export const routes: Routes = [
  { path: '', component: Gallery, title: 'Landings' },
  ...LANDINGS.map((l) => ({ path: l.slug, loadComponent: l.load, title: l.title })),
  { path: '**', redirectTo: '' },
];
