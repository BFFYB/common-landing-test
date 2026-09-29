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
import { setupButtonWave } from '../grask-4.wave';

/**
 * The pilot application form of the grask-4 landing, on its own page at /grask-4/pilot (registered
 * under `pages` in the registry): the section that sat between "Students and data" and "Questions"
 * until 2026-09-21, unchanged, centred on a page of its own under a static header (lockup and a
 * "Back to Grask" link, both router links to the landing). The landing's "Book a demo" buttons and
 * its Pilot links point here.
 *
 * Same styles as the landing: the tokens, the fonts and grask-4.css (type roles, header bar, buttons,
 * the .rise entrance the two columns use instead of the scroll reveals, and the page scrollbar,
 * which needs .glp4-page on <html> the way the landing does it). Scoped under .grask-4-lp like the
 * landing, so nothing leaks. The button hover is the landing's (grask-4.wave.ts).
 */
@Component({
  selector: 'landing-grask-4-pilot',
  templateUrl: './pilot.html',
  styleUrls: ['../grask-4.tokens.css', '../grask-4.fonts.css', '../grask-4.css'],
  imports: [RouterLink],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display: block' },
})
export class Grask4Pilot {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      // Coming from the landing the window keeps its scroll position; the form is a new page.
      window.scrollTo({ top: 0 });
      const html = document.documentElement;
      html.classList.add('glp4-page');
      this.destroyRef.onDestroy(() => html.classList.remove('glp4-page'));
      const root = this.host.nativeElement.querySelector<HTMLElement>('.grask-4-lp');
      if (root) {
        setupButtonWave(root);
      }
    });
  }
}
