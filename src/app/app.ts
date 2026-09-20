import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Switcher } from './switcher/switcher';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Switcher],
  template: `
    <router-outlet />
    <app-switcher />
  `,
})
export class App {}
