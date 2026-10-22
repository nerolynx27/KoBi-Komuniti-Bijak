export const FILM_DURATION = 38;
export const filmScenes = [
  { start: 0, end: 5, title: 'A place we share', caption: 'Your neighbourhood. Connected.' },
  { start: 5, end: 10, title: 'One light needs attention', caption: 'Small problem. Clear location.' },
  { start: 10, end: 15, title: 'Select the facility', caption: 'Find it. Select it. Report it.' },
  { start: 15, end: 20, title: 'Tell us what happened', caption: 'A few details make a difference.' },
  { start: 20, end: 23, title: 'A report to follow', caption: 'Recorded. Ready to follow.' },
  { start: 23, end: 30, title: 'From report to repair', caption: 'See the progress, in one place.' },
  { start: 30, end: 38, title: 'Better, together', caption: 'Small reports. Better neighbourhoods.' },
];

// Native paused animations are also seekable by HyperFrames' WAAPI adapter.
export function createFilmTimeline(root) {
  const animations = [];
  function animate(selector, keyframes, options = {}) {
    for (const element of root.querySelectorAll(selector)) {
      const animation = element.animate(keyframes, { duration: FILM_DURATION * 1000, fill: 'both', iterations: 1, ...options });
      animation.pause();
      animation.currentTime = 0;
      animations.push(animation);
    }
  }
  const point = (second, properties) => ({ offset: second / FILM_DURATION, ...properties });
  function reveal(selector, start, end, x = 0, y = 22) {
    const first = { opacity: 0, transform: `translate(${x}px, ${y}px)` };
    const shown = { opacity: 1, transform: 'translate(0px, 0px)' };
    const keys = [point(0, first)];
    if (start > 0) keys.push(point(start, first));
    keys.push(point(start + 0.48, shown));
    if (end < FILM_DURATION) keys.push(point(end - 0.25, shown), point(end, first), point(FILM_DURATION, first));
    else keys.push(point(end, shown));
    animate(selector, keys, { easing: 'linear' });
  }

  animate('.film-world', [
    point(0, { transform: 'translate(0px, 0px) scale(1)' }),
    point(4.5, { transform: 'translate(-18px, -12px) scale(1.035)', easing: 'cubic-bezier(.65,0,.35,1)' }),
    point(7, { transform: 'translate(-388px, -582px) scale(2)' }),
    point(29.5, { transform: 'translate(-388px, -582px) scale(2)', easing: 'cubic-bezier(.65,0,.35,1)' }),
    point(32, { transform: 'translate(0px, 0px) scale(1)' }),
    point(38, { transform: 'translate(0px, 0px) scale(1)' }),
  ]);
  filmScenes.forEach((scene, index) => {
    reveal(`#film-scene-${index + 1} .film-panel`, scene.start, scene.end, index === 6 ? -28 : 55, 0);
    reveal(`#film-caption-${index + 1} .film-caption-text`, scene.start, scene.end, 0, 12);
    reveal(`#film-step-${index + 1}`, scene.start, scene.end, 0, 0);
  });
  reveal('.film-marker', 6.5, 30, 0, -8);
  animate('.film-marker-pulse', [point(0, { transform: 'scale(1)' }), point(7, { transform: 'scale(1)' }), point(7.4, { transform: 'scale(1.35)' }), point(7.8, { transform: 'scale(1)' }), point(8.2, { transform: 'scale(1.35)' }), point(8.6, { transform: 'scale(1)' }), point(38, { transform: 'scale(1)' })]);
  animate('[data-lamp="f1-south"]', [point(0, { opacity: 0 }), point(27.3, { opacity: 0 }), point(27.65, { opacity: 1 }), point(38, { opacity: 1 })]);
  reveal('.film-working', 23, 27.4, 0, 12);
  reveal('.film-resolved', 27.4, 30, 0, 12);
  reveal('.film-description', 16.1, 20, 0, 0);
  animate('.film-progress-fill', [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { delay: 23500, duration: 3800 });
  animate('.film-pointer', [
    point(0, { opacity: 0, transform: 'translate(330px, 450px) scale(1)' }),
    point(7.9, { opacity: 0, transform: 'translate(330px, 450px) scale(1)' }),
    point(8.5, { opacity: 1, transform: 'translate(370px, 360px) scale(1)' }),
    point(9.15, { opacity: 1, transform: 'translate(370px, 360px) scale(.85)' }),
    point(9.4, { opacity: 1, transform: 'translate(370px, 360px) scale(1)' }),
    point(12.6, { opacity: 1, transform: 'translate(980px, 460px) scale(1)' }),
    point(14.1, { opacity: 1, transform: 'translate(980px, 460px) scale(.85)' }),
    point(14.4, { opacity: 1, transform: 'translate(980px, 460px) scale(1)' }),
    point(15.6, { opacity: 1, transform: 'translate(995px, 296px) scale(1)' }),
    point(16.4, { opacity: 1, transform: 'translate(995px, 365px) scale(1)' }),
    point(18.4, { opacity: 1, transform: 'translate(995px, 493px) scale(1)' }),
    point(19.5, { opacity: 1, transform: 'translate(995px, 493px) scale(.85)' }),
    point(20, { opacity: 0, transform: 'translate(995px, 493px) scale(1)' }),
    point(38, { opacity: 0, transform: 'translate(995px, 493px) scale(1)' }),
  ]);
  for (const [selector, start] of [['.film-report-action', 13.95], ['.film-submit-action', 19.35]]) {
    animate(selector, [{ transform: 'translate(0px, 0px)' }, { transform: 'translate(3px, 3px)' }, { transform: 'translate(0px, 0px)' }], { delay: start * 1000, duration: 300 });
  }
  return {
    seek(seconds) { const time = Math.max(0, Math.min(FILM_DURATION, seconds)); animations.forEach(animation => { animation.currentTime = time * 1000; }); },
    destroy() { animations.forEach(animation => animation.cancel()); },
    animations,
  };
}
