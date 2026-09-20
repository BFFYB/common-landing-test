import { Component } from '@angular/core';

@Component({
  selector: 'landing-example',
  templateUrl: './example.html',
  styleUrl: './example.css',
})
export class Example {
  readonly year = new Date().getFullYear();

  readonly features = [
    {
      icon: '▧',
      title: 'Isolated by default',
      body: 'Component-scoped CSS. Nothing from one landing leaks into another, so wild experiments stay contained.',
    },
    {
      icon: '⚡',
      title: 'Lazy routes',
      body: 'Each landing is its own chunk. The gallery stays instant no matter how many variants you pile up.',
    },
    {
      icon: '⇄',
      title: 'Switch with a key',
      body: 'Press [ and ] to flip between landings. Backtick hides the switcher for clean screenshots.',
    },
  ];
}
