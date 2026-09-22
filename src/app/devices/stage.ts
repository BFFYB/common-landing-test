import {
  Component,
  ElementRef,
  afterRenderEffect,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';
import { LANDINGS } from '../landings/registry';
import { Devices, EMBEDDED } from './devices';

/** Bezel around the frame, CSS px before scaling. */
const BEZEL = 12;
/** Space kept clear around the frame: side gutters, the caption above, the HUD below. */
const GUTTER = { x: 48, top: 72, bottom: 88 };

/**
 * Where the landing renders. Normally just the router outlet; with a device
 * selected it loads the same route in an iframe of that size so media
 * queries, dvh units etc. behave exactly as on the device. Scaled down to fit.
 */
@Component({
  selector: 'app-stage',
  imports: [RouterOutlet],
  templateUrl: './stage.html',
  styleUrl: './stage.css',
  host: { '(window:resize)': 'measure()' },
})
export class Stage {
  private readonly router = inject(Router);
  readonly devices = inject(Devices);
  private readonly frame = viewChild<ElementRef<HTMLIFrameElement>>('frame');

  private readonly url = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map(() => this.router.url),
    ),
    { initialValue: this.router.url },
  );
  private readonly onLanding = computed(() => {
    const slug = this.url().split(/[?#]/)[0].split('/')[1];
    return LANDINGS.some((l) => l.slug === slug);
  });

  readonly active = computed(() => !EMBEDDED && this.onLanding() && !!this.devices.size());

  private readonly viewport = signal({ w: window.innerWidth, h: window.innerHeight });
  measure() {
    this.viewport.set({ w: window.innerWidth, h: window.innerHeight });
  }

  /** Frame size, its outer box with bezel, and the scale that fits it in the window. */
  readonly layout = computed(() => {
    const size = this.devices.size();
    if (!size) return null;
    const w = size.width + BEZEL * 2;
    const h = size.height + BEZEL * 2;
    const vp = this.viewport();
    const scale = Math.min(1, (vp.w - GUTTER.x * 2) / w, (vp.h - GUTTER.top - GUTTER.bottom) / h);
    return { ...size, w, h, scale, fitW: Math.round(w * scale), fitH: Math.round(h * scale) };
  });

  constructor() {
    // Load the current route into the frame. location.replace() keeps the frame's
    // navigations out of the browser history, so Back still works on the outer page.
    afterRenderEffect(() => {
      const win = this.frame()?.nativeElement.contentWindow;
      const url = this.url();
      if (!win || win.location.pathname + win.location.search === url) return;
      win.location.replace(url);
    });
  }
}
