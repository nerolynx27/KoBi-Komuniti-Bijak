import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Button, ActionLink } from '../../components/ui/Button.jsx';
import { Card, StatusBadge } from '../../components/ui/Feedback.jsx';
import { FormField } from '../../components/ui/FormField.jsx';
import { Icon } from '../../components/ui/Icon.jsx';
import { FrameStyleProvider } from '../../components/ui/FrameStyle.jsx';
import { approvedArtwork, approvedPlacements } from '../../features/world/approvedMap.generated.js';
import '../../styles/tokens.css';
import '../../styles/app.css';
import '../../styles/components.css';
import './storyboard.css';

const lamp = approvedPlacements.find(object => object.facilityId === 'lamp-04');
const [lampX, lampY, lampWidth, lampHeight] = approvedArtwork[lamp.objectId].hit;
const focus = { '--lamp-x': `${(lampX + lampWidth / 2) / 640 * 100}%`, '--lamp-y': `${(lampY + lampHeight / 2) / 480 * 100}%` };

const scenes = [
  { title: 'A place we share', time: '00:00–00:05', duration: '5 seconds', type: 'wide', copy: 'Your neighbourhood. Connected.', motion: 'Open on the complete approved neighbourhood. Slowly move towards the southern Frekuensi 1 streetlight.', assets: 'Master World: approved assembly, houses, roads, park and community hall.', ui: 'Specimen: strong Card and map Icon.', transition: 'Follow the camera into Streetlight #04.' },
  { title: 'One light needs attention', time: '00:05–00:10', duration: '5 seconds', type: 'problem', copy: 'Small problem. Clear location.', motion: 'Push in on Streetlight #04. A wine outline identifies the same facility used in every following frame.', assets: 'Master World: Streetlight #04 and its existing surrounding street.', ui: 'Specimen: folded Card and warning Icon.', transition: 'A demonstration pointer selects the streetlight.' },
  { title: 'Select the facility', time: '00:10–00:15', duration: '5 seconds', type: 'facility', copy: 'Find it. Select it. Report it.', motion: 'Keep the street in view while the facility panel enters from the right. Emphasise the gold action.', assets: 'Master World: the same streetlight crop and object identity.', ui: 'Specimen: Card, location Icon and primary Button.', transition: 'Report a problem opens the prefilled form.' },
  { title: 'Tell us what happened', time: '00:15–00:20', duration: '5 seconds', type: 'form', copy: 'A few details make a difference.', motion: 'Hold the form still for reading. The pointer follows facility, description, optional photo and submit.', assets: 'Master World: contextual map behind the form.', ui: 'Specimen: FormField, camera Icon and primary Button.', transition: 'Submit example leads to a demo confirmation.' },
  { title: 'A report to follow', time: '00:20–00:23', duration: '3 seconds', type: 'confirmation', copy: 'Recorded. Ready to follow.', motion: 'Replace the form with one clear confirmation. Hold the received status and report reference.', assets: 'Master World: the same neighbourhood backdrop.', ui: 'Specimen: Card, check Icon, StatusBadge and quiet Button.', transition: 'Advance time explicitly to the simulated maintenance update.' },
  { title: 'From report to repair', time: '00:23–00:30', duration: '7 seconds', type: 'repair', copy: 'See the progress, in one place.', motion: 'Return attention to the selected streetlight. Show In progress, then Resolved; the existing light cone returns at resolution.', assets: 'Master World: streetlight and its separately exported light cone. Worker sprite is not available in the inspected catalog.', ui: 'Specimen: Card, edit/check Icons and both StatusBadge states.', transition: 'Pull back from the repaired facility to the whole neighbourhood.' },
  { title: 'Better, together', time: '00:30–00:38', duration: '8 seconds', type: 'closing', copy: 'Small reports. Better neighbourhoods.', motion: 'Return to the wide neighbourhood and hold the KoBi closing message. The community hall remains part of the approved assembly.', assets: 'Master World: complete assembly and community hall. Resident and wheelchair-user sprites remain an artwork gap.', ui: 'Specimen: strong Card and check Icon; existing Bungee wordmark.', transition: 'End on the brand message; no additional scene.' },
];

function SceneContent({ type }) {
  if (type === 'wide') return <Card tone="strong" className="sb-title-card"><Icon name="map" large /><h3>Your neighbourhood.<br />Connected.</h3><p>KoBi — Komuniti Bijak</p></Card>;
  if (type === 'problem') return <Card folded className="sb-panel"><Icon name="warning" large /><h3>A streetlight needs attention.</h3><p>Streetlight #04 · Frekuensi 1</p><p>Pinpoint the facility in your neighbourhood.</p></Card>;
  if (type === 'facility') return <Card folded className="sb-panel"><span className="sb-kicker"><Icon name="location" /> Selected facility</span><h3>Streetlight #04</h3><p>Frekuensi 1 · Sample neighbourhood</p><p>Report an issue at this facility.</p><Button variant="primary" icon="report" fullWidth tabIndex={-1}>Report a problem</Button></Card>;
  if (type === 'form') return <Card className="sb-panel sb-form"><h3>Report a problem</h3><FormField label="Facility" value="Streetlight #04" readOnly /><FormField label="What happened?" value="Streetlight is not working." readOnly /><p className="sb-photo"><Icon name="camera" /> Add a photo (optional)</p><Button variant="primary" fullWidth tabIndex={-1}>Submit example</Button></Card>;
  if (type === 'confirmation') return <Card className="sb-panel sb-confirm"><Icon name="check" large /><h3>Demo report saved.</h3><p>Example report KOBI-004<br />Streetlight #04</p><StatusBadge status="received" /><Button variant="quiet" fullWidth tabIndex={-1}>View report</Button><p className="helper">Storyboard example · no report was submitted.</p></Card>;
  if (type === 'repair') return <Card className="sb-panel"><span className="sb-kicker"><Icon name="clock" /> Later · simulated update</span><h3>Streetlight #04</h3><div className="sb-status-flow"><StatusBadge status="in_progress" /><Icon name="chevron-right" /><StatusBadge status="resolved" /></div><p>Maintenance completed.<br />The light is working again.</p><p className="helper">Two key states shown together for storyboard review.</p></Card>;
  return <Card tone="strong" className="sb-title-card sb-closing"><Icon name="check" large /><h3>KoBi</h3><p>Komuniti Bijak</p><h3>Small reports.<br />Better neighbourhoods.</h3></Card>;
}

function Storyboard() {
  return <FrameStyleProvider value="gateway"><main className="sb-page" id="top">
    <header className="sb-header"><div><p className="sb-eyebrow">KoBi / Film storyboard / Revision 01</p><h1>From report to repair.</h1><p className="sb-intro">Seven frames. One neighbourhood. A 38-second story built from our Development specimen and Master World assets.</p></div><div className="sb-stamp"><strong>38 SEC</strong><span>7 scenes · 16:9 delivery</span><span>Still-frame review</span></div></header>
    <nav className="sb-nav" aria-label="Storyboard scenes"><ActionLink href="/animation.html" variant="primary">Watch animation</ActionLink>{scenes.map((scene, i) => <ActionLink key={scene.type} href={`#scene-${i + 1}`} size="sm">{String(i + 1).padStart(2, '0')}</ActionLink>)}</nav>
    <div className="sb-source-line"><span><Icon name="catalog" /> Development specimen → interface</span><span><Icon name="map" /> Master World → scenery</span><span><Icon name="clock" /> JavaScript → future motion</span></div>
    <div className="sb-grid">{scenes.map((scene, i) => <article className="sb-scene" id={`scene-${i + 1}`} key={scene.type}>
      <header className="sb-scene-heading"><span className="sb-number">{String(i + 1).padStart(2, '0')}</span><div><h2>{scene.title}</h2><p>{scene.time} <span> / {scene.duration}</span></p></div><span className="sb-shot">{['wide', 'closing'].includes(scene.type) ? 'WIDE' : 'DETAIL'}</span></header>
      <div className={`sb-frame sb-frame-${scene.type}`} style={focus} aria-label={`Storyboard frame ${i + 1}: ${scene.copy}`}>
        <div className="sb-art" aria-hidden="true"><img src="/assets/world/elmina-map.svg" alt="" />{!['wide', 'closing'].includes(scene.type) && <span className="sb-lamp-ring"><Icon name={scene.type === 'repair' ? 'check' : 'location'} /></span>}</div>
        <span className="sb-brand">KoBi</span><span className="sb-sample">Sample data</span>
        <div className="sb-composition" inert><SceneContent type={scene.type} /></div>
        <div className="sb-caption">{scene.copy}</div>
      </div>
      <div className="sb-notes"><p><strong>Motion</strong>{scene.motion}</p><p><strong>World</strong>{scene.assets.replace('Master World: ', '')}</p><p><strong>Interface</strong>{scene.ui.replace('Specimen: ', '')}</p><p className="sb-transition"><strong>Next beat</strong>{scene.transition}</p></div>
    </article>)}</div>
    <footer className="sb-footer"><h2>Production notes</h2><p>This is a visual storyboard, with staged sample text and inert example controls. Timing describes the proposed animation; playback and video export are the next production stage.</p><p>Reuse the specimen’s current Bulletin frame treatment, five UI colours, Bungee and Yanone Kaffeesatz. World artwork retains its approved palette. The map artwork comes from the existing Master World export; no gallery page styling is imported.</p><p><strong>Artwork gaps:</strong> worker, resident and wheelchair-user sprites are not present in the inspected Master World catalog. This draft uses the approved map and status cards. Those character beats need compatible artwork before character animation.</p><div className="sb-footer-links"><ActionLink href="/#design-system">Development specimen</ActionLink><ActionLink href="/compiled-gallery.html">Master World catalog</ActionLink><ActionLink href="#top" variant="quiet">Back to top</ActionLink></div></footer>
  </main></FrameStyleProvider>;
}

createRoot(document.getElementById('root')).render(<StrictMode><Storyboard /></StrictMode>);
