import { forwardRef } from 'react';
import { Card, StatusBadge } from '../../components/ui/Feedback.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { FormField } from '../../components/ui/FormField.jsx';
import { Icon } from '../../components/ui/Icon.jsx';
import { FrameStyleProvider } from '../../components/ui/FrameStyle.jsx';
import { approvedScenery, approvedArtwork } from '../../features/world/approvedMap.generated.js';
import { filmScenes } from './filmTimeline.mjs';

const orderedArtwork = Object.values(approvedArtwork).sort((a, b) => a.order - b.order);
// Map labels belong to the artwork; the film repeats all essential copy in readable panels.
const world = (approvedScenery + '<g clip-path="url(#road-light-clip)">' + orderedArtwork.map(art => art.light || '').join('') + '</g>' + orderedArtwork.map(art => art.markup).join('')).replace(/<text\b/g, '<text data-layout-ignore="true"');

function Panel({ index }) {
  if (index === 0) return <Card tone="strong" className="film-panel film-title"><Icon name="map" large /><h2>Your neighbourhood.<br />Connected.</h2><p>KoBi — Komuniti Bijak</p></Card>;
  if (index === 1) return <Card folded className="film-panel"><Icon name="warning" large /><h2>A streetlight needs attention.</h2><p>Streetlight #04 · Frekuensi 1</p><p>Pinpoint the facility in your neighbourhood.</p></Card>;
  if (index === 2) return <Card folded className="film-panel"><p className="film-kicker"><Icon name="location" /> Selected facility</p><h2>Streetlight #04</h2><p>Frekuensi 1 · Sample neighbourhood</p><p>Report an issue at this facility.</p><Button className="film-report-action" variant="primary" icon="report" fullWidth>Report a problem</Button></Card>;
  if (index === 3) return <Card className="film-panel film-form"><h2>Report a problem</h2><FormField label="Facility" value="Streetlight #04" readOnly /><div className="film-description"><FormField label="What happened?" value="Streetlight is not working." readOnly /></div><p className="film-photo"><Icon name="camera" /> Add a photo (optional)</p><Button className="film-submit-action" variant="primary" fullWidth>Submit example</Button></Card>;
  if (index === 4) return <Card className="film-panel film-confirm"><Icon name="check" large /><h2>Demo report saved.</h2><p>Example report KOBI-004<br />Streetlight #04</p><StatusBadge status="received" /><p className="film-small">Demonstration only. No report was submitted.</p></Card>;
  if (index === 5) return <Card className="film-panel film-repair"><p className="film-kicker"><Icon name="clock" /> Later · simulated update</p><h2>Streetlight #04</h2><div className="film-repair-states"><div className="film-working"><StatusBadge status="in_progress" /><p>Maintenance is under way.</p></div><div className="film-resolved"><StatusBadge status="resolved" /><p>The light is working again.</p></div></div><div className="film-progress"><span className="film-progress-fill" /></div><p className="film-small">Follow the update in your report history.</p></Card>;
  return <Card tone="strong" className="film-panel film-title film-closing"><Icon name="check" large /><h2>KoBi</h2><p>Komuniti Bijak</p><h3>Small reports.<br />Better neighbourhoods.</h3></Card>;
}

export const Film = forwardRef(function Film(_props, ref) {
  return <FrameStyleProvider value="gateway"><div ref={ref} id="kobi-film" data-composition-id="kobi-film" data-width="1280" data-height="720" data-duration="38" data-start="0" className="film-canvas" aria-label="KoBi: From report to repair, animated demonstration">
    <div className="film-background" />
    <div className="film-world" aria-hidden="true"><svg viewBox="0 0 640 480" width="960" height="720" className="film-map" dangerouslySetInnerHTML={{ __html: world }} /><div className="film-marker"><span className="film-marker-pulse"><Icon name="location" /></span><span>Streetlight #04</span></div></div>
    <div className="film-masthead"><Card className="film-logo-card"><img className="film-logo" src="/assets/brand/kobi-logo.png" alt="KoBi" width="1460" height="493" /></Card></div>
    {filmScenes.map((scene, index) => <section key={scene.start} id={`film-scene-${index + 1}`} className={`clip film-scene film-scene-${index + 1}`} data-start={scene.start} data-duration={scene.end - scene.start} data-track-index="1" aria-label={scene.title}><div className="film-panel-position" inert><Panel index={index} /></div></section>)}
    <svg className="film-pointer" width="40" height="48" viewBox="0 0 40 48" aria-hidden="true"><path d="M4 3V36L13 28L22 44L30 40L21 25H35Z" fill="var(--surface-panel)" stroke="var(--border-strong)" strokeWidth="4" /></svg>
    <div className="film-captions">{filmScenes.map((scene, index) => <div key={scene.start} id={`film-caption-${index + 1}`} className="clip film-caption" data-start={scene.start} data-duration={scene.end - scene.start} data-track-index="2"><p className="film-caption-text">{scene.caption}</p></div>)}</div>
    <div className="film-chapters" aria-hidden="true">{filmScenes.map((scene, index) => <span id={`film-step-${index + 1}`} key={scene.start}>{String(index + 1).padStart(2, '0')} / 07</span>)}</div>
  </div></FrameStyleProvider>;
});
