import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LANDINGS } from '../landings/registry';

@Component({
  selector: 'app-gallery',
  imports: [RouterLink],
  templateUrl: './gallery.html',
  styleUrl: './gallery.css',
})
export class Gallery {
  readonly landings = LANDINGS;
}
