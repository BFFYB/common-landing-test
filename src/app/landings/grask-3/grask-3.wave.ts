/**
 * The wisprflow.ai button hover, shared by the landing and its pilot page (grask-3.ts, pilot/pilot.ts):
 * on every .btn-dark / .btn-light / .btn-on-accent, on the header nav links, the header's "Try it out"
 * text link (.bar-link) and the strip's "Watch a check run" title (.strip-cta) under `root` (the press
 * to .98 on the buttons is CSS, see "Buttons" in grask-3.css). The label, the <span> inside the button
 * or link, is split into one .char per letter (splitChars below) and on mouseenter each letter runs the
 * same 1s linear ripple, 60ms after the one before it: up 20% of its height and tilted -5°, down 20%
 * and +5°, back to rest. Leaving cancels whatever is still running and eases every letter back in
 * 200ms from wherever it is. Entering again restarts the ripple. Pointer devices only (hover: hover)
 * and nothing under reduced motion; then the label stays whole.
 */
export function setupButtonWave(root: HTMLElement): void {
  if (
    !window.matchMedia('(hover: hover)').matches ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    return;
  }
  const ripple: Keyframe[] = [
    { transform: 'translateY(0) rotate(0deg)' },
    { transform: 'translateY(-20%) rotate(-5deg)' },
    { transform: 'translateY(20%) rotate(5deg)' },
    { transform: 'translateY(0) rotate(0deg)' },
  ];
  for (const button of root.querySelectorAll<HTMLElement>(
    '.btn-dark, .btn-light, .btn-on-accent, .nav-links a, .bar-link, .strip-cta',
  )) {
    const label = button.querySelector<HTMLElement>(':scope > span');
    if (!label) {
      continue;
    }
    const chars = splitChars(label);
    let running: Animation[] = [];
    button.addEventListener('mouseenter', () => {
      running.forEach((a) => a.cancel());
      running = chars.map((char, i) =>
        char.animate(ripple, { duration: 1000, delay: i * 60, easing: 'linear', fill: 'forwards' }),
      );
    });
    button.addEventListener('mouseleave', () => {
      chars.forEach((char, i) => {
        const from = getComputedStyle(char).transform;
        running[i]?.cancel();
        char.animate([{ transform: from }, { transform: 'none' }], {
          duration: 200,
          easing: 'linear',
        });
      });
      running = [];
    });
  }
}

/**
 * Replaces the text of `el` with one <span class="word"> per word holding one <span class="char"> per
 * letter (the spaces stay as text between the words) and returns the letters, in reading order. The
 * .word / .char rules in grask-3.css make them inline-block, which is what lets a letter be transformed
 * and keeps a word from breaking. Same shape as GSAP's SplitText with type "words,chars".
 */
function splitChars(el: HTMLElement): HTMLElement[] {
  const text = el.textContent ?? '';
  const chars: HTMLElement[] = [];
  el.textContent = '';
  for (const token of text.split(/(\s+)/)) {
    if (/^\s*$/.test(token)) {
      el.append(token);
      continue;
    }
    const word = document.createElement('span');
    word.className = 'word';
    for (const letter of token) {
      const char = document.createElement('span');
      char.className = 'char';
      char.textContent = letter;
      word.append(char);
      chars.push(char);
    }
    el.append(word);
  }
  return chars;
}
