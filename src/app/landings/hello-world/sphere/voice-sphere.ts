import { Component, DestroyRef, ElementRef, effect, inject, input, signal } from '@angular/core';

/** What the examiner is doing right now. Drives colour, glow and motion. */
export type VoiceSphereState = 'idle' | 'speaking' | 'listening' | 'thinking';

/**
 * The examiner's presence: a petrol sphere that emits while speaking, gathers while listening
 * and turns inward while thinking. Purely visual — the page owns the status text next to it.
 *
 * Theme it from outside with one token: `voice-sphere { --sphere-color: var(--brand); }`.
 * Feed `level` (0–1, e.g. LiveKit `audioLevel`) and the sphere swells with the voice.
 */
@Component({
  selector: 'voice-sphere',
  templateUrl: './voice-sphere.html',
  styleUrl: './voice-sphere.css',
  host: {
    'aria-hidden': 'true',
    '[class]': '"is-" + state()',
    '[class.is-live]': 'level() !== null',
    '[class.is-offscreen]': '!visible()',
    '[style.--sphere-level]': 'shownLevel()',
    '[style.--sphere-size.px]': 'size()',
  },
})
export class VoiceSphere {
  readonly state = input<VoiceSphereState>('idle');
  /** Voice level 0–1. `null` = no live signal, the sphere breathes on its own. */
  readonly level = input<number | null>(null);
  /** Outer size in px (the ball itself is 60% of it). Defaults to the CSS `--sphere-size`. */
  readonly size = input<number>();

  /** Level after easing: fast attack so speech registers, slow release so it never flickers. */
  protected readonly shownLevel = signal(0);
  protected readonly visible = signal(true);

  private target = 0;
  private frame = 0;

  constructor() {
    const host = inject(ElementRef<HTMLElement>).nativeElement;
    const destroy = inject(DestroyRef);

    effect(() => {
      const raw = this.level();
      this.target = raw === null ? 0 : Math.min(1, Math.max(0, raw));
      if (typeof requestAnimationFrame === 'undefined') {
        this.shownLevel.set(this.target);
      } else if (!this.frame) {
        this.frame = requestAnimationFrame(this.follow);
      }
    });

    if (typeof IntersectionObserver !== 'undefined') {
      const io = new IntersectionObserver(([entry]) => this.visible.set(entry.isIntersecting));
      io.observe(host);
      destroy.onDestroy(() => io.disconnect());
    }
    destroy.onDestroy(() => cancelAnimationFrame(this.frame));
  }

  private readonly follow = (): void => {
    const current = this.shownLevel();
    const ease = this.target > current ? 0.45 : 0.12;
    const next = current + (this.target - current) * ease;
    const settled = Math.abs(next - this.target) < 0.004;
    this.shownLevel.set(settled ? this.target : next);
    this.frame = settled ? 0 : requestAnimationFrame(this.follow);
  };
}
