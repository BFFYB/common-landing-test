// Generates grask-flow.timeline.css from the spec below: every element's keyframes on one 48 s loop.
// Run from the repo root:  node src/app/landings/grask-flow/timeline.mjs
// Times are seconds; the loop is 48 s, six chapters of 8 s. See README.md here.
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const LOOP = 48;
const OUT = 'cubic-bezier(.16, 1, .3, 1)'; // confident arrival
const IN = 'cubic-bezier(.7, 0, .84, 0)'; // quick exit
const blocks = [];
const rules = [];

const pct = (t) => {
  const s = (t / LOOP * 100).toFixed(4).replace(/0+$/, '').replace(/\.$/, '');
  return s + '%';
};

/** frames: [t, css, timing][] with t in seconds; 0 and 48 are added from the first/last frame if missing. */
function anim(sel, name, frames, delay) {
  frames = [...frames].sort((a, b) => a[0] - b[0]);
  if (frames[0][0] > 0) frames.unshift([0, frames[0][1], null]);
  if (frames[frames.length - 1][0] < LOOP) frames.push([LOOP, frames[frames.length - 1][1], null]);
  blocks.push([name, frames]);
  rules.push([sel, name, delay]);
}

const HID = 'opacity: 0; transform: translateY(10px)';
const VIS = 'opacity: 1; transform: none';
const GONE = 'opacity: 0; transform: translateY(-6px)';

function window_(sel, name, tIn, tOut, { din = 0.45, dout = 0.4, hid = HID, vis = VIS, gone = GONE } = {}) {
  const f = [[0, hid, tIn === 0 ? OUT : null]];
  if (tIn > 0) f.push([tIn, hid, OUT]);
  f.push([tIn + din, vis, null], [tOut, vis, IN], [Math.min(LOOP, tOut + dout), gone, null]);
  anim(sel, name, f);
}
function appear(sel, name, t, { d = 0.4, hid = HID, vis = VIS, timing = OUT, delay } = {}) {
  anim(sel, name, [[0, hid, null], [t, hid, timing], [t + d, vis, null]], delay);
}
function typewrite(sel, name, t, d, steps) {
  anim(sel, name, [
    [0, 'clip-path: inset(0 100% 0 0)', null],
    [t, 'clip-path: inset(0 100% 0 0)', `steps(${steps}, end)`],
    [t + d, 'clip-path: inset(0 0 0 0)', null],
  ]);
}
function press(sel, name, t) {
  anim(sel, name, [
    [0, 'transform: scale(1)', null],
    [t, 'transform: scale(1)', 'ease-in'],
    [t + 0.09, 'transform: scale(.96)', 'ease-out'],
    [t + 0.22, 'transform: scale(1)', null],
  ]);
}
function swap(aSel, bSel, name, t, d = 0.25) {
  // a fades out over the first half, b fades in over the second: two texts in one place never overlap
  anim(aSel, name + '-out', [[0, 'opacity: 1', null], [t, 'opacity: 1', 'ease-in'], [t + d / 2, 'opacity: 0', null]]);
  anim(bSel, name + '-in', [[0, 'opacity: 0', null], [t + d / 2, 'opacity: 0', 'ease-out'], [t + d, 'opacity: 1', null]]);
}
function move(sel, name, t, d, a, b, { timing = OUT, delay } = {}) {
  anim(sel, name, [[0, a, null], [t, a, timing], [t + d, b, null]], delay);
}
function packet(sel, name, t, d, back = false) {
  const run = back ? 'translateX(calc(var(--run) * -1))' : 'translateX(var(--run))';
  anim(sel, name, [
    [0, 'opacity: 0; transform: translateX(0)', null],
    [t, 'opacity: 0; transform: translateX(0)', 'linear'],
    [t + 0.12, 'opacity: 1', 'linear'],
    [t + d - 0.12, 'opacity: 1', 'linear'],
    [t + d, `opacity: 0; transform: ${run}`, null],
  ]);
}
function words(sel, name, t, per = 0.075) {
  appear(sel, name, t, { d: 0.28, hid: 'opacity: 0; transform: translateY(4px)', delay: `calc(var(--i, 0) * ${per}s)` });
}

const CH = 8;
// ---- screens and captions: one window per chapter ----
for (let k = 0; k < 6; k++) {
  window_(`.scr-${k}`, `glf-scr-${k}`, k * CH, k * CH + 7.6);
  window_(`.ps-${k}`, `glf-ps-${k}`, k * CH, k * CH + 7.6);
  window_(`.cap-${k}`, `glf-cap-${k}`, k * CH + 0.15, k * CH + 7.5, {
    din: 0.5, dout: 0.35, hid: 'opacity: 0; transform: translateY(14px)', gone: 'opacity: 0; transform: translateY(-10px)',
  });
}

// ---- chapter 1 (0-8): the rubric ----
[20, 18, 24, 10].forEach((chars, i) => {
  const t = 0.9 + i * 1.0;
  typewrite(`.rub-${i} .rub-txt`, `glf-rub-txt-${i}`, t, 0.7, chars);
  appear(`.rub-${i} .rub-w`, `glf-rub-w-${i}`, t + 0.85, { d: 0.3, hid: 'opacity: 0; transform: scale(.6)', vis: 'opacity: 1; transform: scale(1)' });
});
press('.save', 'glf-save-press', 6.2);
swap('.save-a', '.save-b', 'glf-save', 6.42);

// ---- chapter 2 (8-16): the LMS ----
move('.tog', 'glf-tog', 10.0, 0.3, 'background-color: var(--line)', 'background-color: var(--petrol)', { timing: 'ease' });
move('.knob', 'glf-knob', 10.0, 0.3, 'transform: translateX(0)', 'transform: translateX(16px)');
appear('.lms-det', 'glf-lms-det', 10.6);
packet('.pk-1', 'glf-pk-1', 12.5, 0.9);
appear('.notif', 'glf-notif', 13.45, { d: 0.5, hid: 'opacity: 0; transform: translateY(-18px)' });

// ---- chapter 3 (16-24): the call ----
words('.tr-0 .w', 'glf-tr-0', 16.9);
words('.tr-1 .w', 'glf-tr-1', 19.3, 0.07);
words('.tr-2 .w', 'glf-tr-2', 22.0);
for (const [i, t] of [[0, 20.6], [1, 23.2]]) {
  move(`.cd-${i} i`, `glf-cd-${i}`, t, 0.25, 'background-color: transparent; border-color: var(--line); transform: scale(1)', 'background-color: var(--ok); border-color: var(--ok); transform: scale(1)', { timing: 'ease' });
  move(`.cd-${i}`, `glf-cd-txt-${i}`, t, 0.25, 'color: var(--text-2)', 'color: var(--text)', { timing: 'ease' });
}
swap('.stu-0 .st-live', '.stu-0 .st-done', 'glf-stu-0', 20.0);
swap('.c-a', '.c-b', 'glf-cnt', 20.15);
packet('.pk-2', 'glf-pk-2', 23.3, 0.7, true);

// ---- chapter 4 (24-32): the evidence ----
appear('.done', 'glf-done', 24.3, { d: 0.45 });
move('.done-path', 'glf-done-path', 24.7, 0.55, 'stroke-dashoffset: 40', 'stroke-dashoffset: 0', { timing: 'ease-out' });
for (let i = 0; i < 4; i++) {
  const t = 24.8 + i * 1.5;
  words(`.ev-${i} .w`, `glf-ev-${i}`, t, 0.07);
  appear(`.ev-${i} .ev-s`, `glf-ev-s-${i}`, t + 1.1, { d: 0.3, hid: 'opacity: 0; transform: scale(.7)', vis: 'opacity: 1; transform: scale(1)' });
}

// ---- chapter 5 (32-40): the grade ----
appear('.gr-rec', 'glf-gr-rec', 32.7, { d: 0.45 });
appear('.why', 'glf-why', 33.4, { d: 0.35, delay: 'calc(var(--i, 0) * .4s)' });
move('.gr-fill', 'glf-gr-fill', 35.6, 0.7, 'transform: scaleX(.85)', 'transform: scaleX(.8)', { timing: 'ease-in-out' });
move('.gr-knob', 'glf-gr-knob', 35.6, 0.7, 'transform: translateX(0)', 'transform: translateX(-12px)', { timing: 'ease-in-out' });
swap('.g-a', '.g-b', 'glf-g', 35.95, 0.2);
press('.confirm', 'glf-confirm-press', 37.4);
appear('.toast', 'glf-toast', 37.8, { d: 0.4, hid: 'opacity: 0; transform: translateY(12px)' });
packet('.pk-3', 'glf-pk-3', 38.3, 0.8);
appear('.result', 'glf-result', 39.15, { d: 0.5, hid: 'opacity: 0; transform: translateY(-18px)' });

// ---- chapter 6 (40-48): the dashboard ----
move('.bar-fill', 'glf-bar-fill', 40.8, 0.9, 'transform: scaleY(0)', 'transform: scaleY(1)', { delay: 'calc(var(--i, 0) * .22s)' });
appear('.bar-pct', 'glf-bar-pct', 41.6, { d: 0.3, hid: 'opacity: 0; transform: translateY(6px)', delay: 'calc(var(--i, 0) * .22s)' });
appear('.flag', 'glf-flag', 43.2);
appear('.flag-sug', 'glf-flag-sug', 44.0, { d: 0.35, hid: 'opacity: 0; transform: translateY(6px)' });

// ---- emit ----
const out = [`/* Grask flow demo: the timeline. GENERATED by timeline.mjs in this folder (node src/app/landings/grask-flow/timeline.mjs);
   do not edit by hand: change the spec there and regenerate. Every animation here is \`48s linear infinite\` (per-keyframe timing
   functions carry the easing), so all of them share one clock and grask-flow.ts can pause, scrub and speed them together.
   Chapters are 8 s each: 1 rubric 0-8, 2 LMS 8-16, 3 call 16-24, 4 evidence 24-32, 5 grade 32-40, 6 dashboard 40-48.
   Word-by-word and staggered elements use one keyframes block plus an animation-delay from --i on the element; a delayed
   animation seeks correctly because currentTime counts from the same origin for all of them.

   Spec (seconds):
     screens .scr-k / .ps-k: in at 8k over .45 s, out at 8k+7.6 over .4 s; captions .cap-k: in 8k+.15 over .5, out 8k+7.5
     1  rubric:    row i text types at .9+i (0.7 s, steps = characters), weight pops at +.85; Save presses 6.2, label swaps 6.42
     2  LMS:       toggle 10.0 (0.3 s), details 10.6, packet L>R 12.5-13.4, notification 13.45
     3  call:      transcript lines 16.9 / 19.3 / 22.0 (75 / 70 / 75 ms per word), criteria tick 20.6 and 23.2,
                   Ana's row live>done 20.0, counter 12>13 at 20.15, packet R>L 23.3-24.0
     4  evidence:  phone thanks 24.3, tick draws 24.7; row i words at 24.8+1.5i (70 ms per word), status at +1.1
     5  grade:     recommendation 32.7, reasons 33.4 (+.4 s each), slider 17>16 at 35.6 (0.7 s), number swaps 35.95,
                   Confirm presses 37.4, toast 37.8, packet L>R 38.3-39.1, phone result 39.15
     6  dashboard: bars grow 40.8 (+.22 s each, 0.9 s), percentages 41.6 (+.22 s each), flag 43.2, suggestion 44.0 */
`];
for (const [sel, name, delay] of rules) {
  const d = delay ? ` animation-delay: ${delay};` : '';
  out.push(`${sel} { animation: ${name} 48s linear infinite;${d} }`);
}
out.push('');
for (const [name, frames] of blocks) {
  out.push(`@keyframes ${name} {`);
  for (const [t, css, timing] of frames) {
    const tf = timing ? ` animation-timing-function: ${timing};` : '';
    out.push(`  ${pct(t)} { ${css};${tf} }`);
  }
  out.push('}');
}
const here = dirname(fileURLToPath(import.meta.url));
writeFileSync(join(here, 'grask-flow.timeline.css'), out.join('\n') + '\n');
console.log(`${rules.length} animations, ${blocks.length} keyframes blocks`);
