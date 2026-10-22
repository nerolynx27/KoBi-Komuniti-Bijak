import { useRef, useState } from 'react';
import { Button, ActionLink, IconButton } from '../components/ui/Button.jsx';
import { Icon, iconNames } from '../components/ui/Icon.jsx';
import { FormField, Choice } from '../components/ui/FormField.jsx';
import { FilterChip, SegmentedControl } from '../components/ui/Selection.jsx';
import { Card, StatusBadge, FeedbackState } from '../components/ui/Feedback.jsx';
import { ModalHost, BottomSheet, ConfirmDialog } from '../components/ui/Modal.jsx';
import { BottomNav } from '../components/navigation/BottomNav.jsx';
import { PasswordField } from '../components/ui/PasswordField.jsx';
import { PhotoPicker } from '../components/ui/PhotoPicker.jsx';
import { PhotoPreview } from '../components/ui/PhotoPreview.jsx';
import { demoPhotos } from '../lib/demoPhotos.js';
import { statusLabels } from '../content/uiText.js';
import './specimen.css';
import { FrameStyleProvider } from '../components/ui/FrameStyle.jsx';

const specimenNavigation = [{ id: 'map', label: 'Map', icon: 'map' }, { id: 'reports', label: 'Reports', icon: 'report' }, { id: 'activities', label: 'Activities', icon: 'activity' }, { id: 'profile', label: 'Profile', icon: 'profile' }];

export default function DesignSystemPage() {
  const [saving, setSaving] = useState(false);
  const saveLock = useRef(false);
  const [saves, setSaves] = useState(0);
  const [filter, setFilter] = useState('All');
  const [view, setView] = useState('resident');
  const [modal, setModal] = useState(null);
  const [confirmationOrigin, setConfirmationOrigin] = useState(null);
  const [message, setMessage] = useState('');
  const [photo, setPhoto] = useState(null), [password, setPassword] = useState('demo only');
  const sheetReset = useRef(null);
  function simulatedSave() {
    if (saveLock.current) return;
    saveLock.current = true;
    setSaving(true);
    setTimeout(() => { setSaves(count => count + 1); setSaving(false); saveLock.current = false; }, 1600);
  }
  function close() {
    if (modal === 'confirm' && confirmationOrigin === 'sheet') {
      setModal('sheet');
      requestAnimationFrame(() => sheetReset.current?.focus());
    } else setModal(null);
  }
  return <FrameStyleProvider value="gateway"><div className="specimen">
    <p className="specimen-note">Development only · all example states and saves below are simulated. These are the same shared components used by the app.</p>
    <section className="specimen-section"><h2>Actions that feel like stickers</h2><p>Live text, fixed corner pixels, vanilla rims and a hard 4 px shadow.</p><div className="specimen-actions">{['primary', 'secondary', 'quiet', 'strong', 'danger', 'text'].map(variant => <div key={variant}><span className="helper">{variant}</span><Button variant={variant} frameShape={variant === 'strong' ? 'ticket' : undefined} onClick={() => setMessage(`${variant} example activated.`)}>{({ primary: 'Send report', secondary: 'View on map', quiet: 'Keep editing', strong: 'Sign in', danger: 'Remove', text: 'Back to list' })[variant]}</Button></div>)}</div><div className="specimen-actions"><Button size="sm">Small action</Button><Button>Medium action</Button><Button size="lg">Large action</Button><IconButton icon="camera" label="Camera example" /></div><Button variant="primary" fullWidth>Continue with a longer neighbourhood action label that wraps naturally</Button><ActionLink href="#map" icon="map">Return to map</ActionLink></section>
    <section className="specimen-section"><h2>Interaction states</h2><p className="helper">Pressed and focus outlines in this row are visual simulations. Actual keyboard focus remains available on every enabled control.</p><div className="specimen-actions"><Button variant="primary" data-simulated="pressed">Pressed example</Button><Button variant="secondary" data-simulated="focus">Focus example</Button><Button disabled>Unavailable</Button><Button variant="primary" loading loadingLabel="Sending…">Send report</Button></div><p className="helper">Unavailable example: this action needs a selected facility.</p><div className="paint-space"><Button variant="primary" onClick={simulatedSave} loading={saving} loadingLabel="Saving…">Run simulated save</Button></div><p role="status">Simulated saves: {saves}</p><p className="helper">Try clicking or pressing Enter repeatedly while the save is pending.</p></section>
    <section className="specimen-section"><h2>Pixel icon family</h2><div className="icon-specimens">{iconNames.map(name => <div key={name}><Icon name={name} /><span>{name}</span></div>)}</div></section>
    <section className="specimen-section"><h2>Clear, calm fields</h2><div className="specimen-fields"><FormField label="Display name" helper="A labeled text field example." defaultValue="Alex Tan" autoComplete="name" /><FormField label="Email" type="email" required defaultValue="alex" error="Enter a complete email address, such as alex@example.com." autoComplete="email" /><FormField label="Township" readOnly value="KoBi pilot neighbourhood" helper="Read-only example." /><FormField label="Unavailable field" disabled value="Choose a facility first" helper="Disabled example with an explanation." /><FormField as="textarea" label="Description" defaultValue="The community garden is a place for everyone. Long English content should remain readable as the field grows." /><FormField as="select" label="Activity category"><option>Community</option><option>Recycling</option></FormField><FormField type="date" label="Example date" defaultValue="2026-11-07" /><FormField type="time" label="Example time" defaultValue="09:00" /></div><Choice defaultChecked>Checkbox with a long label that grows instead of cutting off important information</Choice><Choice type="radio" name="specimen-radio" defaultChecked>Native radio example</Choice></section>
    <section className="specimen-section"><h2>Selection and status</h2><SegmentedControl label="Simulated demo view" value={view} onChange={setView} options={[{ value: 'resident', label: 'Resident' }, { value: 'sdp', label: 'SDP view' }]} /><div className="filter-row">{['All', 'Community', 'Recycling', 'Joined'].map(label => <FilterChip key={label} selected={filter === label} onClick={() => setFilter(label)}>{label}</FilterChip>)}</div><p role="status">{filter}: {filter === 'All' ? 2 : 1} simulated results</p><div className="badge-specimens">{Object.keys(statusLabels).map(status => <StatusBadge key={status} status={status} />)}</div></section>
    <section className="specimen-section"><h2>Feedback and records</h2><FeedbackState title="Loading examples…" icon="progress">Simulated initial loading state. No records are available yet.</FeedbackState><FeedbackState title="No reports yet" icon="report">Report a problem when you spot one.</FeedbackState><FeedbackState title="No upcoming activities" icon="calendar">Try another filter or check back later.</FeedbackState><FeedbackState error title="Changes were not saved" action="Retry simulated save" onAction={() => setMessage('Simulated recovery action activated.')} >Your input is kept here. Allow browser storage, then retry.</FeedbackState><FeedbackState title="This view is unavailable" action="Try again" onAction={() => setMessage('Simulated retry activated.')}>A clear recovery action stays close to the explanation.</FeedbackState><Card folded><h3>Community garden walkway lamp needs attention</h3><p>A long record title wraps above a textual status.</p><StatusBadge status="received" /><div className="paint-space"><ActionLink href="#reports" icon="chevron-right">Open sample reports</ActionLink></div></Card></section>
    <section className="specimen-section"><h2>Navigation</h2><BottomNav active="map" specimen items={specimenNavigation} /></section>
    <section className="specimen-section"><h2>Sheets and safe confirmation</h2><div className="specimen-actions"><Button onClick={() => setModal('sheet')}>Open specimen sheet</Button><Button onClick={() => { setConfirmationOrigin(null); setModal('confirm'); }}>Open specimen confirmation</Button></div><p className="helper">Escape closes the active layer. Confirmation starts on Cancel. A confirmation from the sheet uses the same modal host.</p></section>
    <section className="specimen-section"><h2>Future editor control composition</h2><p className="helper">Simulated toolbar only; no world editing is implemented.</p><div className="specimen-actions"><Button icon="catalog" onClick={() => setMessage('Simulated catalog action.')}>Add component</Button><Button icon="move" onClick={() => setMessage('Simulated move action.')}>Move</Button><Button icon="trash" variant="danger" onClick={() => { setConfirmationOrigin(null); setModal('confirm'); }}>Remove</Button><Button variant="quiet" onClick={() => setMessage('Simulated editor exit.')}>Exit editor</Button></div></section>
    <section className="specimen-section"><h2>Photos and password visibility</h2><PasswordField label="Demo password example" value={password} onChange={event => setPassword(event.target.value)} /><PhotoPicker label="Specimen photo" value={photo} onChange={value => { if (photo) demoPhotos.delete(photo.id); setPhoto(value); }} onPreview={() => setModal('photo')} /></section>
    <section className="specimen-section"><h2>Explicitly simulated recovery examples</h2><FeedbackState title="Demo example: session expired" action="Return to sign in" onAction={() => setMessage('Simulated expired-session recovery. Real authentication is not connected.')}>This is an inspectable DEV example. Real authentication is not connected.</FeedbackState><FeedbackState title="Demo example: access unavailable" action="Return to workspace" onAction={() => setMessage('Simulated access recovery.')}>This demonstrates a future protected-view failure. The current SDP workspace is open demo navigation.</FeedbackState><FeedbackState error title="Demo example: artwork unavailable" action="Retry example asset" onAction={() => setMessage('Simulated asset retry. No world artwork was requested.')}>The temporary schematic needs no world artwork. This DEV example demonstrates later asset recovery.</FeedbackState></section>
    <p><a href="/sdp-workspace.html?specimen=cards-buttons">SDP cards &amp; buttons</a></p>
    <p role="status" className="specimen-message">{message}</p>
    <ModalHost open={modal !== null} mode={modal === 'sheet' ? 'sheet' : 'dialog'} title={modal === 'sheet' ? 'Specimen bottom sheet' : modal === 'photo' ? 'Specimen photo preview' : 'Reset this example?'} description={modal === 'sheet' || modal === 'photo' ? undefined : 'This simulated confirmation changes no stored records.'} onClose={close}>
      <div hidden={modal !== 'sheet'}><BottomSheet onClose={() => setModal(null)}><p>A scrollable sheet with live HTML content and a reachable action.</p><FormField label="Example note" as="textarea" defaultValue="This note stays in the sheet when confirmation is cancelled." /><div className="paint-space"><Button onClick={event => { sheetReset.current = event.currentTarget; setConfirmationOrigin('sheet'); setModal('confirm'); }}>Reset sheet example</Button></div></BottomSheet></div>
      {modal === 'confirm' && <ConfirmDialog confirmLabel="Reset example" onCancel={close} onConfirm={() => { setMessage('Simulated reset complete. No stored records changed.'); setModal(null); }} />}
      {modal === 'photo' && <><PhotoPreview attachment={photo} /><Button variant="quiet" onClick={close} data-initial-focus>Close photo</Button></>}
    </ModalHost>
  </div></FrameStyleProvider>;
}
