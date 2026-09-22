import { Component } from '@angular/core';
import { Stage } from './devices/stage';
import { Switcher } from './switcher/switcher';

@Component({
  selector: 'app-root',
  imports: [Stage, Switcher],
  template: `
    <app-stage />
    <app-switcher />
  `,
})
export class App {}
