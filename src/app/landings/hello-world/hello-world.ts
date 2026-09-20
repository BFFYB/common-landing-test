import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { VoiceSphere, VoiceSphereState } from './sphere/voice-sphere';

interface StateOption {
  id: VoiceSphereState;
  label: string;
  /** Status line, in the product's own words. */
  status: string;
  hint: string;
}

interface Swatch {
  id: string;
  label: string;
  color: string;
}

type LevelSource = 'off' | 'simulated' | 'microphone';

/** One pass of an oral exam, in states and milliseconds. Loops while playing. */
const EXAM_SCRIPT: { state: VoiceSphereState; ms: number }[] = [
  { state: 'thinking', ms: 1400 },
  { state: 'speaking', ms: 4200 },
  { state: 'thinking', ms: 900 },
  { state: 'listening', ms: 5200 },
  { state: 'thinking', ms: 2200 },
  { state: 'speaking', ms: 3600 },
  { state: 'listening', ms: 4400 },
  { state: 'thinking', ms: 1800 },
];

@Component({
  selector: 'landing-hello-world',
  imports: [VoiceSphere],
  templateUrl: './hello-world.html',
  styleUrl: './hello-world.css',
  host: { '[class.dark]': 'dark()' },
})
export class HelloWorld {
  readonly states: readonly StateOption[] = [
    {
      id: 'idle',
      label: 'Idle',
      status: 'Connecting you with your examiner',
      hint: 'This takes a moment',
    },
    {
      id: 'speaking',
      label: 'Speaking',
      status: 'Examiner is speaking…',
      hint: 'Listen to the question, then answer out loud',
    },
    {
      id: 'listening',
      label: 'Listening',
      status: 'Listening to your answer…',
      hint: 'Take your time — speak clearly',
    },
    {
      id: 'thinking',
      label: 'Thinking',
      status: 'Processing…',
      hint: 'The examiner is considering your answer',
    },
  ];

  readonly swatches: readonly Swatch[] = [
    { id: 'petrol', label: 'grask petrol (default)', color: '#0E5A66' },
    { id: 'crimson', label: 'Institution crimson', color: '#9B1B30' },
    { id: 'navy', label: 'Institution navy', color: '#1E3A8A' },
    { id: 'forest', label: 'Institution forest', color: '#1B5E3B' },
    { id: 'plum', label: 'Institution plum', color: '#5B2A86' },
  ];

  readonly sources: readonly { id: LevelSource; label: string }[] = [
    { id: 'off', label: 'Off' },
    { id: 'simulated', label: 'Simulated' },
    { id: 'microphone', label: 'My microphone' },
  ];

  readonly state = signal<VoiceSphereState>('speaking');
  readonly color = signal(this.swatches[0].color);
  readonly size = signal(240);
  readonly dark = signal(false);
  readonly playing = signal(false);
  readonly source = signal<LevelSource>('off');
  readonly level = signal<number | null>(null);
  readonly micError = signal('');

  readonly current = computed(
    () => this.states.find((s) => s.id === this.state()) ?? this.states[0],
  );
  readonly isPreset = computed(() =>
    this.swatches.some((s) => s.color.toLowerCase() === this.color().toLowerCase()),
  );
  readonly snippet = computed(
    () =>
      `<voice-sphere state="${this.state()}"` +
      (this.source() === 'off' ? '' : ' [level]="level()"') +
      (this.size() === 160 ? '' : ` [size]="${this.size()}"`) +
      ' />',
  );

  private scriptTimer = 0;
  private scriptIndex = 0;
  private levelFrame = 0;
  private micStream: MediaStream | null = null;
  private audio: AudioContext | null = null;

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.stopScript();
      this.stopLevel();
    });
  }

  /* state ──────────────────────────────────────────────── */

  setState(id: VoiceSphereState): void {
    this.stopScript();
    this.state.set(id);
  }

  togglePlay(): void {
    if (this.playing()) {
      this.stopScript();
      return;
    }
    this.playing.set(true);
    this.scriptIndex = 0;
    this.runStep();
  }

  private runStep(): void {
    const step = EXAM_SCRIPT[this.scriptIndex];
    this.state.set(step.state);
    this.scriptIndex = (this.scriptIndex + 1) % EXAM_SCRIPT.length;
    this.scriptTimer = window.setTimeout(() => this.runStep(), step.ms);
  }

  private stopScript(): void {
    window.clearTimeout(this.scriptTimer);
    this.playing.set(false);
  }

  /* appearance ─────────────────────────────────────────── */

  setColor(value: string): void {
    this.color.set(value);
  }

  setSize(value: string): void {
    this.size.set(Number(value));
  }

  toggleDark(): void {
    this.dark.update((d) => !d);
  }

  /* voice level ────────────────────────────────────────── */

  setSource(id: LevelSource): void {
    this.stopLevel();
    this.source.set(id);
    if (id === 'simulated') {
      this.simulate();
    } else if (id === 'microphone') {
      void this.listen();
    }
  }

  /** A speech-like envelope: syllables inside phrases, only while someone is talking. */
  private simulate(): void {
    const tick = (now: number) => {
      const t = now / 1000;
      const talking = this.state() === 'speaking' || this.state() === 'listening';
      const syllable = Math.max(0, Math.sin(t * 9.1) * 0.6 + Math.sin(t * 5.3) * 0.4);
      const phrase = 0.55 + 0.45 * Math.sin(t * 0.9);
      const jitter = (Math.random() - 0.5) * 0.12;
      this.level.set(talking ? clamp(syllable * phrase + jitter) : 0);
      this.levelFrame = requestAnimationFrame(tick);
    };
    this.levelFrame = requestAnimationFrame(tick);
  }

  private async listen(): Promise<void> {
    this.micError.set('');
    try {
      this.micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      this.micError.set('Microphone blocked. Allow it in the address bar, then try again.');
      this.source.set('off');
      return;
    }
    this.audio = new AudioContext();
    const analyser = this.audio.createAnalyser();
    analyser.fftSize = 1024;
    this.audio.createMediaStreamSource(this.micStream).connect(analyser);
    const samples = new Float32Array(analyser.fftSize);

    const tick = () => {
      analyser.getFloatTimeDomainData(samples);
      let sum = 0;
      for (const s of samples) {
        sum += s * s;
      }
      const rms = Math.sqrt(sum / samples.length);
      this.level.set(clamp(rms * 7));
      this.levelFrame = requestAnimationFrame(tick);
    };
    this.levelFrame = requestAnimationFrame(tick);
  }

  private stopLevel(): void {
    cancelAnimationFrame(this.levelFrame);
    this.micStream?.getTracks().forEach((t) => t.stop());
    this.micStream = null;
    void this.audio?.close();
    this.audio = null;
    this.level.set(null);
  }
}

function clamp(n: number): number {
  return Math.min(1, Math.max(0, n));
}
