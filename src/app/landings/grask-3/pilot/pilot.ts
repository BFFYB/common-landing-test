import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  ViewEncapsulation,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { setupButtonWave } from '../grask-3.wave';

/**
 * The pilot application form of the grask-3 landing, on its own page at /grask-3/pilot (registered
 * under `pages` in the registry): the section that sat between "Students and data" and "Questions"
 * until 2026-09-21, unchanged, centred on a page of its own under a static header (lockup and a
 * "Back to Grask" link, both router links to the landing). The landing's "Book a demo" buttons and
 * its Pilot links point here.
 *
 * Same styles as the landing: the tokens, the fonts and grask-3.css (type roles, header bar, buttons,
 * the .rise entrance the two columns use instead of the scroll reveals, and the page scrollbar,
 * which needs .glp3-page on <html> the way the landing does it). Scoped under .grask-3-lp like the
 * landing, so nothing leaks. The button hover is the landing's (grask-3.wave.ts).
 */
@Component({
  selector: 'landing-grask-3-pilot',
  templateUrl: './pilot.html',
  styleUrls: ['../grask-3.tokens.css', '../grask-3.fonts.css', '../grask-3.css'],
  imports: [RouterLink],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display: block' },
})
export class Grask3Pilot {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      // Coming from the landing the window keeps its scroll position; the form is a new page.
      window.scrollTo({ top: 0 });
      const html = document.documentElement;
      html.classList.add('glp3-page');
      this.destroyRef.onDestroy(() => html.classList.remove('glp3-page'));
      const root = this.host.nativeElement.querySelector<HTMLElement>('.grask-3-lp');
      if (root) {
        setupButtonWave(root);
      }
    });
  }
}
