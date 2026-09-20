import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map } from 'rxjs';
import { LANDINGS } from '../landings/registry';

/**
 * Floating HUD shown on every landing. Keys work everywhere (incl. gallery):
 *   [ / ]   previous / next landing
 *   `       hide / show the HUD
 *   Esc     close the list
 */
@Component({
  selector: 'app-switcher',
  imports: [RouterLink],
  templateUrl: './switcher.html',
  styleUrl: './switcher.css',
  host: { '(document:keydown)': 'onKey($event)' },
})
export class Switcher {
  private readonly router = inject(Router);
  readonly landings = LANDINGS;

  private readonly url = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map(() => this.router.url),
    ),
    { initialValue: this.router.url },
  );

  readonly slug = computed(() => this.url().split(/[?#]/)[0].split('/')[1] ?? '');
  readonly index = computed(() => this.landings.findIndex((l) => l.slug === this.slug()));
  readonly current = computed(() => this.landings[this.index()]);
  readonly onLanding = computed(() => this.index() >= 0);

  readonly open = signal(false);
  readonly hidden = signal(false);

  go(offset: number) {
    const n = this.landings.length;
    if (!n) return;
    const i = this.index() < 0 ? 0 : (this.index() + offset + n) % n;
    this.open.set(false);
    void this.router.navigate(['/', this.landings[i].slug]);
  }

  onKey(e: KeyboardEvent) {
    const t = e.target as HTMLElement | null;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    switch (e.key) {
      case '[':
        this.go(-1);
        break;
      case ']':
        this.go(1);
        break;
      case '`':
        this.hidden.update((v) => !v);
        break;
      case 'Escape':
        this.open.set(false);
        break;
    }
  }
}
