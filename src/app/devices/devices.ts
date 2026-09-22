import { Injectable, computed, effect, signal } from '@angular/core';

export type DeviceKind = 'phone' | 'tablet' | 'laptop' | 'custom';

export interface Device {
  readonly id: string;
  readonly name: string;
  readonly kind: DeviceKind;
  /** Viewport in CSS px (logical, not physical). Portrait for phones/tablets, landscape for laptops. */
  readonly width: number;
  readonly height: number;
}

/**
 * Form factors for the preview stage. Laptop sizes are the screen's logical
 * resolution; a real browser viewport is ~110px shorter (menu bar + tabs + omnibox).
 */
export const DEVICES: readonly Device[] = [
  { id: 'iphone-se', name: 'iPhone SE', kind: 'phone', width: 375, height: 667 },
  { id: 'iphone-15', name: 'iPhone 15', kind: 'phone', width: 393, height: 852 },
  { id: 'iphone-16-pro-max', name: 'iPhone 16 Pro Max', kind: 'phone', width: 440, height: 956 },
  { id: 'pixel-8', name: 'Pixel 8', kind: 'phone', width: 412, height: 915 },
  { id: 'galaxy-s24', name: 'Galaxy S24', kind: 'phone', width: 360, height: 780 },
  { id: 'ipad-mini', name: 'iPad mini', kind: 'tablet', width: 744, height: 1133 },
  { id: 'ipad', name: 'iPad', kind: 'tablet', width: 820, height: 1180 },
  { id: 'ipad-pro-11', name: 'iPad Pro 11″', kind: 'tablet', width: 834, height: 1194 },
  { id: 'ipad-pro-13', name: 'iPad Pro 13″', kind: 'tablet', width: 1024, height: 1366 },
  { id: 'laptop-hd', name: 'Laptop HD', kind: 'laptop', width: 1366, height: 768 },
  { id: 'macbook-air-13', name: 'MacBook Air 13″', kind: 'laptop', width: 1440, height: 900 },
  { id: 'macbook-pro-14', name: 'MacBook Pro 14″', kind: 'laptop', width: 1512, height: 982 },
  { id: 'macbook-pro-16', name: 'MacBook Pro 16″', kind: 'laptop', width: 1728, height: 1117 },
  { id: 'desktop-1080p', name: 'Desktop 1080p', kind: 'laptop', width: 1920, height: 1080 },
];

export const DEVICE_GROUPS: readonly { kind: DeviceKind; label: string; items: Device[] }[] = (
  [
    ['phone', 'Phones'],
    ['tablet', 'Tablets'],
    ['laptop', 'Laptops'],
  ] as const
).map(([kind, label]) => ({ kind, label, items: DEVICES.filter((d) => d.kind === kind) }));

const CUSTOM = 'custom';
const STORAGE_KEY = 'landings.device';

/** True inside the preview iframe: no HUD, no stage, keys are forwarded to the parent. */
export const EMBEDDED = window.self !== window.top;

/** Which form factor the stage shows. `null` = native window size (no stage). */
@Injectable({ providedIn: 'root' })
export class Devices {
  readonly id = signal<string | null>(null);
  readonly rotated = signal(false);
  readonly custom = signal({ width: 1024, height: 768 });

  readonly current = computed<Device | null>(() => {
    const id = this.id();
    if (id === CUSTOM) return { id, name: 'Custom', kind: 'custom', ...this.custom() };
    return DEVICES.find((d) => d.id === id) ?? null;
  });

  /** Frame size in CSS px, after rotation. */
  readonly size = computed(() => {
    const d = this.current();
    if (!d) return null;
    return this.rotated()
      ? { width: d.height, height: d.width }
      : { width: d.width, height: d.height };
  });

  constructor() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null');
      if (saved) {
        this.id.set(saved.id ?? null);
        this.rotated.set(!!saved.rotated);
        if (saved.custom) this.custom.set(saved.custom);
      }
    } catch {}
    effect(() => {
      const state = { id: this.id(), rotated: this.rotated(), custom: this.custom() };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch {}
    });
  }

  select(id: string | null) {
    this.id.set(id);
  }

  /** Step through native → every device → custom → native. */
  cycle(offset: number) {
    const ids = [null, ...DEVICES.map((d) => d.id), CUSTOM];
    const i = Math.max(0, ids.indexOf(this.id()));
    this.id.set(ids[(i + offset + ids.length) % ids.length]);
  }

  rotate() {
    if (this.current()) this.rotated.update((v) => !v);
  }

  setCustom(side: 'width' | 'height', value: number) {
    if (!Number.isFinite(value) || value < 100) return;
    this.custom.update((c) => ({ ...c, [side]: Math.round(value) }));
    this.id.set(CUSTOM);
  }
}
