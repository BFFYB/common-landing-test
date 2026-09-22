import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map } from 'rxjs';
import { DEVICE_GROUPS, Devices, EMBEDDED } from '../devices/devices';
import { LANDINGS } from '../landings/registry';

/**
 * Floating HUD shown on every landing. Keys work everywhere (incl. gallery
 * and inside the device preview frame):
 *   [ / ]   previous / next landing
 *   { / }   previous / next form factor (native → phones → tablets → laptops → custom)
 *   r       rotate the form factor
 *   `       hide / show the HUD
 *   Esc     close the list
 */
@Component({
  selector: 'app-switcher',
  imports: [RouterLink],
  templateUrl: './switcher.html',
  styleUrl: './switcher.css',
  host: {
    '(document:keydown)': 'onKey($event)',
    '(window:message)': 'onMessage($event)',
  },
})
export class Switcher {
  private readonly router = inject(Router);
  readonly devices = inject(Devices);
  readonly landings = LANDINGS;
  readonly groups = DEVICE_GROUPS;
  readonly embedded = EMBEDDED;

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

  readonly panel = signal<'landings' | 'devices' | null>(null);
  readonly hidden = signal(false);

  toggle(p: 'landings' | 'devices') {
    this.panel.update((v) => (v === p ? null : p));
  }

  go(offset: number) {
    const n = this.landings.length;
    if (!n) return;
    const i = this.index() < 0 ? 0 : (this.index() + offset + n) % n;
    this.panel.set(null);
    void this.router.navigate(['/', this.landings[i].slug]);
  }

  pick(id: string | null) {
    this.devices.select(id);
    this.panel.set(null);
  }

  setCustom(side: 'width' | 'height', e: Event) {
    this.devices.setCustom(side, (e.target as HTMLInputElement).valueAsNumber);
  }

  onKey(e: KeyboardEvent) {
    const t = e.target as HTMLElement | null;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    // Inside the preview frame there is no HUD: hand the key to the outer page.
    if (this.embedded) {
      window.parent.postMessage({ type: 'landing-key', key: e.key }, location.origin);
      return;
    }
    this.handle(e.key);
  }

  onMessage(e: MessageEvent) {
    if (e.origin === location.origin && e.data?.type === 'landing-key') this.handle(e.data.key);
  }

  private handle(key: string) {
    switch (key) {
      case '[':
        this.go(-1);
        break;
      case ']':
        this.go(1);
        break;
      case '{':
        this.devices.cycle(-1);
        break;
      case '}':
        this.devices.cycle(1);
        break;
      case 'r':
        this.devices.rotate();
        break;
      case '`':
        this.hidden.update((v) => !v);
        break;
      case 'Escape':
        this.panel.set(null);
        break;
    }
  }
}
