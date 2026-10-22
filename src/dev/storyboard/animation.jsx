import { StrictMode, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Button, ActionLink } from '../../components/ui/Button.jsx';
import { Film } from './Film.jsx';
import { createFilmTimeline, filmScenes, FILM_DURATION } from './filmTimeline.mjs';
import '../../styles/tokens.css';
import '../../styles/app.css';
import '../../styles/components.css';
import './animation.css';

const formatTime = time => `0:${String(Math.floor(time)).padStart(2, '0')}`;

function AnimationPlayer() {
  const film = useRef(null), viewport = useRef(null), timeline = useRef(null);
  const [time, setTime] = useState(0), [playing, setPlaying] = useState(false), [ready, setReady] = useState(false);
  const clock = useRef(0);
  const chapter = filmScenes.findLast(scene => time >= scene.start);
  useLayoutEffect(() => {
    const controller = createFilmTimeline(film.current);
    timeline.current = controller;
    const resize = new ResizeObserver(entries => { const { width, height } = entries[0].contentRect; film.current.style.setProperty('--preview-scale', Math.min(width / 1280, height / 720)); });
    resize.observe(viewport.current);
    return () => { resize.disconnect(); controller.destroy(); };
  }, []);
  useEffect(() => {
    let active = true;
    document.fonts.ready.then(() => { if (active) setReady(true); });
    return () => { active = false; };
  }, []);
  useEffect(() => {
    timeline.current.seek(time);
    clock.current = time;
  }, [time]);
  useEffect(() => {
    if (!playing) return;
    let request, previous;
    function tick(timestamp) {
      if (previous !== undefined) clock.current = Math.min(FILM_DURATION, clock.current + (timestamp - previous) / 1000);
      previous = timestamp;
      setTime(clock.current);
      if (clock.current >= FILM_DURATION) setPlaying(false);
      else request = requestAnimationFrame(tick);
    }
    request = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(request);
  }, [playing]);
  function seek(value) { setPlaying(false); setTime(Number(value)); }
  function toggle() { if (time >= FILM_DURATION) setTime(0); setPlaying(value => !value); }
  return <main className="film-page">
    <header className="film-page-heading"><div><p className="film-eyebrow">KoBi / Animated demonstration</p><h1>From report to repair.</h1><p>38 seconds · Seven scenes · Development specimen + Master World</p></div><ActionLink href="/storyboard.html" variant="quiet">View storyboard</ActionLink></header>
    <div ref={viewport} className="film-viewport"><Film ref={film} /></div>
    <section className="film-controls" aria-label="Animation playback controls"><div className="film-buttons"><Button onClick={toggle} disabled={!ready}>{playing ? 'Pause' : time >= FILM_DURATION ? 'Play again' : 'Play'}</Button><Button variant="quiet" onClick={() => seek(0)}>Replay</Button><output aria-label="Playback time">{formatTime(time)} / 0:38</output><Button variant="quiet" onClick={() => viewport.current.requestFullscreen?.()}>Fullscreen</Button></div><label className="film-seek-label" htmlFor="film-seek">Seek animation <span>{chapter.title}</span></label><input id="film-seek" type="range" min="0" max="38" step="0.01" value={time} onChange={event => seek(event.target.value)} aria-valuetext={`${formatTime(time)} — ${chapter.title}`} /><nav className="film-scene-buttons" aria-label="Jump to scene">{filmScenes.map((scene, index) => <Button key={scene.start} size="sm" variant={chapter === scene ? 'primary' : 'quiet'} aria-pressed={chapter === scene} onClick={() => seek(scene.start + 0.55)}>{String(index + 1).padStart(2, '0')}</Button>)}</nav></section>
    <p className="film-player-note">Silent preview. All reports and maintenance updates are simulated. Scene controls and the seek bar let you inspect each moment. On a phone, rotate to landscape or use Fullscreen for larger text.</p>
    <details className="film-transcript"><summary>Read the scene transcript</summary><ol>{filmScenes.map(scene => <li key={scene.start}><strong>{formatTime(scene.start)} — {scene.title}.</strong> {scene.caption}{scene.start === 23 && ' Later in the demonstration, maintenance progresses to resolved and the light returns.'}</li>)}</ol></details>
  </main>;
}

createRoot(document.getElementById('root')).render(<StrictMode><AnimationPlayer /></StrictMode>);
