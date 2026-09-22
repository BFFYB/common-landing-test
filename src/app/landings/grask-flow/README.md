# Grask flow demo

A playground for the animations a "how it works" demo needs: the whole Grask flow as one 48-second film, made on 23 September 2026. Two devices sit on a stage, the instructor's screen and the student's phone, and the flow runs across both in six chapters of eight seconds: the rubric is set, it attaches to the LMS assignment, the student takes the call, the evidence arrives by criterion, the instructor grades, the course dashboard shows the weak spot. The four rubric criteria are the through-line: typed in as a rubric, ticked off during the call, quoted in the evidence report, weighed in the grade, charted on the dashboard. The copy is grask-3's; names, times and grades are synthetic and say so nowhere on the page, so replace them before this leaves the playground.

## One clock

Every element on the stage is a CSS animation of exactly `48s linear infinite`, with its own keyframes at the percentages of the loop where it moves (per-keyframe `animation-timing-function` carries the easing). Because they all share the loop, they all share a clock: `grask-flow.ts` collects them with `getAnimations({ subtree: true })` on the film and does the transport by moving them together (Web Animations API): `play()`/`pause()`, `playbackRate` for the speed buttons, `currentTime` for the scrubber and the chapter chips. The playhead, the clock readout and the active chip are read back from one animation's `currentTime` on each frame while playing. Keys: Space or `k` play/pause, `←`/`→` or `j`/`l` step chapters, `1`–`6` jump.

Staggered things (words of a transcript line, the reasons list, the dashboard bars) use one keyframes block and an `animation-delay` from `--i` on each element; seeking still works because every animation's `currentTime` counts from the same origin. The two short loops that ride along (the recording dot's pulse, the voice bars) are on their own durations; the transport moves them too, which is fine for a loop.

Under `prefers-reduced-motion` nothing plays: the film is paused at the end of the first chapter, with everything on it finished, and the chips, the table and the arrow keys step through the finished state of each chapter. The Play button is disabled and a note under the table says why.

## Where things live

- `grask-flow.ts`: the chapters (title, caption, what to watch on each device), the rubric, the transcript, the evidence rows, the students, the dashboard bars, and the transport.
- `grask-flow.html`: the stage. Six `.scr-k` screens stacked in the laptop, six `.ps-k` screens stacked in the phone, six `.cap-k` captions; the wire between the devices with three packets; the transport; the schedule table.
- `grask-flow.css`: tokens (grask-3's palette and type, copied), layout, the two devices, every static state, the transport, the notes, breakpoints. Moodle's orange on its mark is a third-party colour, deliberately not a token; the three status tints are derived from the status hues.
- `grask-flow.timeline.css`: generated, do not edit. `timeline.mjs` next to it holds the spec (times in seconds, one line per moment) and writes the file: `node src/app/landings/grask-flow/timeline.mjs`. Its header repeats the spec in prose.
- `grask-flow.fonts.css` + `fonts/`: Uncut Sans and Urbanist, self-hosted, copied from grask-3.
- `public/landings/grask-flow/logo/`: the Grask mark tile.

## Changing a scene

1. Edit the moment in `timeline.mjs`: `appear(selector, name, at)`, `move(selector, name, at, duration, from, to)`, `typewrite`, `swap`, `press`, `packet`, `words`. Times are seconds in the 48 s loop; keep a chapter's moments inside its eight seconds and leave the last second or so as a hold.
2. Run the script. It rewrites `grask-flow.timeline.css`.
3. New elements need a resting (hidden) state in `grask-flow.css` (`opacity: 0`, `clip-path`, `transform: scaleY(0)` and so on) so that nothing is visible before its moment and a failed script shows the page at rest, not mid-flight. Never use `display: none` for the hidden state: an element without a box has no animation for the transport to find.
4. To change the loop length or the chapter length, change `LOOP` and `CH` in the script and `LOOP_MS` / `CHAPTER_MS` in the `.ts` together.

## Before it goes anywhere

The dialogue, names (Ana K., Ben O., Chloé D., Dev P.), times, the 17 → 16 grade and the cohort percentages are scripted. The Moodle rows are a sketch of an assignment page, not a screenshot. The brand link in the header goes to `/grask-3`.
