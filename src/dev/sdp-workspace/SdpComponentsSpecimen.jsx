import { useEffect, useRef, useState } from 'react';
import { SdpActionLink, SdpButton, SdpCard } from '../../components/sdp/SdpPrimitives.jsx';
import { SdpMotif } from '../../components/sdp/SdpMotif.jsx';
import { FrameStyleProvider } from '../../components/ui/FrameStyle.jsx';
import { FilterChip } from '../../components/ui/Selection.jsx';
import { Card } from '../../components/ui/Feedback.jsx';
import { Button, IconButton } from '../../components/ui/Button.jsx';
import { Icon } from '../../components/ui/Icon.jsx';
import './sdp-specimen.css';

const workspace = '/sdp-workspace.html#sdp';

function Metric({ value, label, tone, icon }) {
  return <SdpCard kind="metric" tone={tone} aria-label={`${value} ${label}`}><div className="sdp-metric-main"><span className="sdp-metric-value">{value}</span><h3>{label}</h3></div><div className="sdp-metric-foot"><span>Sample data</span><Icon name={icon} /></div></SdpCard>;
}

function Report({ priority = false, title, location, note, motif = false }) {
  return <SdpCard kind="report" className={priority ? 'sdp-report-priority' : ''}>
    {priority && <span className="sdp-priority-label">Priority</span>}
    <div className="sdp-report-row">{motif && <SdpMotif name="streetlight" />}<div><h3>{title}</h3><p>⌖ {location}</p><p><strong>Sample data:</strong> {note}</p></div></div>
    {priority && <SdpActionLink className="sdp-report-action" href={`${workspace}/reports`} frameShape="sticker">Review reports <span className="sdp-arrow" aria-hidden="true">↗</span></SdpActionLink>}
  </SdpCard>;
}

export default function SdpComponentsSpecimen() {
  const [pending, setPending] = useState(false), [count, setCount] = useState(0), [message, setMessage] = useState('Select an enabled example to try it.');
  const lock = useRef(false), timer = useRef(null);
  useEffect(() => { document.title = 'SDP cards & buttons · KoBi'; return () => clearTimeout(timer.current); }, []);
  function simulate() {
    if (lock.current) return;
    lock.current = true; setPending(true); setCount(value => value + 1);
    timer.current = setTimeout(() => { lock.current = false; setPending(false); }, 1400);
  }
  return <main className="sdp-specimen">
    <header className="sdp-specimen-header"><a href={workspace}>KoBi / Development</a><span>Component study · 01</span><h1>SDP cards &amp; buttons</h1><p>The Dispatch Desk family. Reusable live controls, composed from the selected dashboard reference.</p><a href={workspace}>Return to SDP workspace</a></header>
    <div className="sdp-specimen-intro"><p><strong>Development only.</strong> Visual fixtures and simulated actions; no demo records are read or changed.</p><p>Wine · Cherry · Gold · Sand · Vanilla / Bungee + Yanone Kaffeesatz</p></div>
    <div className="sdp-specimen-columns">
      <section className="sdp-specimen-section" aria-labelledby="sdp-recipes-heading">
        <div className="sdp-specimen-section-title"><span>01 / Card recipes</span><h2 id="sdp-recipes-heading">The reference, in components</h2><p>A portrait-width visual fixture. These are the actual reusable components, with the picture's sample content.</p></div>
        <div className="sdp-reference-board">
          <SdpCard kind="welcome"><div className="sdp-welcome-band">SDP workspace — Elmina</div><div className="sdp-welcome-body"><SdpMotif name="elmina" /><p>Welcome, Staff Member.<br />Neighbourhood operations are ready.</p></div></SdpCard>
          <div className="sdp-metrics-row"><Metric value={12} label="Open reports" tone="cherry" icon="report" /><Metric value={4} label="In progress" tone="gold" icon="clock" /><Metric value={3} label="Upcoming activities" tone="vanilla" icon="calendar" /></div>
          <SdpCard kind="panel"><h3>Needs attention</h3><div className="sdp-report-stack"><Report priority motif title="Streetlight not working" location="Frekuensi 2" note="Light flicker reported." /><Report title="Park bench repair" location="Central park" note="Broken slat." /></div></SdpCard>
          <SdpCard kind="event"><span className="sdp-card-label">Upcoming event</span><div className="sdp-event-body"><SdpMotif name="calendar" /><div><h3>Community clean-up</h3><p>24 Oct · 8:00 AM</p><p><strong>Sample data:</strong> Volunteers needed.</p></div></div></SdpCard>
          <div className="sdp-shortcuts-row"><SdpCard kind="shortcut" tone="gold"><a className="sdp-shortcut-link" href={`${workspace}/activities`}><div><h3>Manage activities</h3><p>Organize and schedule events.</p></div><SdpMotif name="community" /></a></SdpCard><SdpCard kind="shortcut"><a className="sdp-shortcut-link" href={`${workspace}/world`}><div><h3>World editor</h3><p>Update community assets.</p></div><SdpMotif name="world" /></a></SdpCard></div>
        </div>
        <p className="sdp-specimen-caption">Welcome · Metrics · Panel · Report · Event · Shortcut<br />Frames and lettering are SVG, CSS and live text.</p>
      </section>
      <div className="sdp-specimen-library">
        <section className="sdp-specimen-section" aria-labelledby="sdp-actions-heading"><div className="sdp-specimen-section-title"><span>02 / Button recipes</span><h2 id="sdp-actions-heading">Actions with a purpose</h2><p>Shared native button and link behavior with an opt-in SDP frame.</p></div><div className="sdp-specimen-actions">
          <SdpButton onClick={() => setMessage('Primary example activated.')}>Primary ticket</SdpButton>
          <SdpButton variant="secondary" onClick={() => setMessage('Secondary example activated.')}>Secondary action</SdpButton>
          <SdpButton variant="quiet" onClick={() => setMessage('Quiet example activated.')}>Quiet action</SdpButton>
          <SdpButton variant="strong" onClick={() => setMessage('Strong example activated.')}>Strong action</SdpButton>
          <SdpButton icon="calendar" onClick={() => setMessage('Icon example activated.')}>Plan an event</SdpButton>
          <SdpActionLink href={workspace} variant="text">Workspace link</SdpActionLink>
          <SdpButton size="sm" onClick={() => setMessage('Small example activated.')}>Small action</SdpButton>
          <SdpButton size="lg" onClick={() => setMessage('Large example activated.')}>Large action</SdpButton>
        </div><div className="sdp-specimen-wide"><SdpButton fullWidth onClick={() => setMessage('Full-width example activated.')}>Review neighbourhood maintenance reports and record the next action</SdpButton></div><p className="sdp-specimen-status" role="status">{message}</p></section>
        <section className="sdp-specimen-section" aria-labelledby="sdp-states-heading"><div className="sdp-specimen-section-title"><span>03 / Interaction states</span><h2 id="sdp-states-heading">Ready, focused, working</h2><p>Hover, focus and pressed examples below are visual simulations; all enabled controls also support actual keyboard focus.</p></div><div className="sdp-specimen-actions">
          <SdpButton data-simulated="hover" onClick={() => setMessage('Hover example activated.')}>Hover example</SdpButton>
          <SdpButton data-simulated="focus" onClick={() => setMessage('Focus example activated.')}>Focus example</SdpButton>
          <SdpButton data-simulated="pressed" onClick={() => setMessage('Pressed example activated.')}>Pressed example</SdpButton>
          <SdpButton disabled>Unavailable</SdpButton>
          <SdpButton loading loadingLabel="Sending…">Send action</SdpButton>
        </div><p className="sdp-specimen-caption">Unavailable: select a report before recording an action.</p><SdpButton onClick={simulate} loading={pending} loadingLabel="Working…">Run simulated action</SdpButton><p className="sdp-specimen-status" role="status">Simulated actions: {count}</p><p>Try repeated clicks or Enter while the action is pending. This example never writes records.</p></section>
        <section className="sdp-specimen-section" aria-labelledby="sdp-resilience-heading"><div className="sdp-specimen-section-title"><span>04 / Content resilience</span><h2 id="sdp-resilience-heading">Room for real content</h2><p>Zero counts, long English titles and cards without illustrations.</p></div><div className="sdp-specimen-stress">
          <Metric value={0} label="Open reports" tone="vanilla" icon="report" />
          <Report title="Community garden walkway lighting needs maintenance before the next evening neighbourhood gathering" location="The long pedestrian route beside Elmina Central Park" note="A longer description stays readable and the card grows with its content. No illustration is required." />
          <SdpCard kind="event"><span className="sdp-card-label">Upcoming event</span><h3>No upcoming activities</h3><p>Sample empty state. The event card remains useful without an illustration.</p><SdpActionLink href={`${workspace}/activities`} variant="text">Browse activities</SdpActionLink></SdpCard>
        </div></section>
      </div>
    </div>
    <section className="sdp-specimen-section" aria-label="Paper texture frame contexts"><h2>Paper in every frame context</h2>
      {['current', 'gateway', 'sdp'].map(context => <FrameStyleProvider key={context} value={context}><div className="sdp-specimen-actions" data-paper-context={context}>
        <Card folded><h3>{context} laid paper</h3><p>Live text inside the original panel.</p></Card>
        <Card tone="strong"><h3>Strong panel</h3><p>Vanilla text on wine.</p></Card>
        <Button size="sm" onClick={() => setMessage(context + ' selected.')}>Small {context}</Button>
        <Button size="lg" frameShape="ticket">Long maintenance action with wrapping English labels</Button>
        <IconButton label={context + ' icon action'} icon="calendar" />
        <Button variant="danger">Error action</Button><Button disabled>Disabled {context}</Button>
        <FilterChip selected onClick={() => setMessage(context + ' selected.')}>Selected {context}</FilterChip>
      </div></FrameStyleProvider>)}
    </section>
    <footer className="sdp-specimen-footer"><span>SDP design study / Phase 1</span><a href="/#design-system">Open Development specimen</a></footer>
  </main>;
}
