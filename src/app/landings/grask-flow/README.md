# Grask flow demo

A playground for the animations a "how it works" demo needs: the whole Grask flow as one 48-second film, made on 23 September 2026. Two devices sit on a stage, the instructor's screen and the student's phone, and the flow runs across both in six chapters of eight seconds: the rubric is set, it attaches to the LMS assignment, the student takes the call, the evidence arrives by criterion, the instructor grades, the course dashboard shows the weak spot. The four rubric criteria are the through-line: typed in as a rubric, ticked off during the call, quoted in the evidence report, weighed in the grade, charted on the dashboard. The copy is grask-3's; names, times and grades are synthetic and say so nowhere on the page, so replace them before this leaves the playground.

## One clock

Every element on the stage is a CSS animation of exactly `48s linear infinite`, with its own keyframes at the percentages of the loop where it moves (per-keyframe `animation-timing-function` carries the easing). Because they all share the loop, they all share a clock: `grask-flow.ts` collects them with `getAnimations({ subtree: true })` on the film and does the transport by moving them together (Web Animations API): `play()`/`pause()`, `playbackRate` for the speed buttons, `currentTime` for the scrubber and the chapter chips. The playhead, the clock readout and the active chip are read back from one animation's `currentTime` on each frame while playing. Keys: Space or `k` play/pause, `←`/`→` or `j`/`l` step chapters, `1`–`6` jump.

Staggered things (words of a transcript line, the reasons list, the dashboard bars) use one keyframes block and an `animation-delay` from `--i` on each element; seeking still works because every animation's `currentTime` counts from the same origin. The two short loops that ride along (the recording dot's pulse, the voice bars) are on their own durations; the transport moves them too, which is fine for a loop.

Under `prefers-reduced-motion` nothing plays: the film is paused at the end of the first chapter, with everything on it finished, and the chips, the table and the arrow keys step through the finished state of each chapter. The Play button is disabled and a note under the table says why.

## Threadline (page effect)

Below the film, separate from it and its clock: one thread stitched down through the six steps of the flow, driven by scroll. Six stations sit down a tall stage (200 px apart), alternating left and right of the centre, each with its label on the outer side; under 560 px they all hug the left and the labels go right. The thread hops from station to station: each hop is a path with `pathLength="1"` drawn by `stroke-dashoffset`; a bead rides its head, a zero-length round-capped dash at the same offset on a copy of the path, with a soft halo behind it; a knot pops and the label slides in from the knot's side where the thread lands. A dashed guide shows the route underneath.

The keyframes in the css are sequenced with `--i` on the element and `--hop` / `--lead` on the section, as if the thing played on its own for about six seconds. It does not: `setupThread()` in the `.ts` pauses every animation on the stage and sets their `currentTime` from scroll, the way the film's transport seeks. Progress is where the reading line, 60% down the viewport, sits within the stage (0 at its top, 1 at its bottom), mapped onto the full sequence, so the head of the thread runs with the reader and back up again. This is the Web Animations API rather than `animation-timeline`, because Firefox has no scroll timelines. `layoutThread()` computes the geometry in px from the stage's width (on first render and on resize) and the template binds it. It lives in the `.tl` section of the html, the "Threadline" block of the css and, in the `.ts`, `Station`, `layoutThread()`, `stations`, `threadGeo` and `setupThread()`. Its animations are outside `.film`, so the transport never touches them.

## Where things live

- `grask-flow.ts`: the chapters (title, caption, what to watch on each device), the rubric, the transcript, the evidence rows, the students, the dashboard bars, the transport, and Threadline's stations and trigger.
- `grask-flow.html`: the stage. Six `.scr-k` screens stacked in the laptop, six `.ps-k` screens stacked in the phone, six `.cap-k` captions; the wire between the devices with three packets; the transport; the Threadline section; the schedule table.
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
