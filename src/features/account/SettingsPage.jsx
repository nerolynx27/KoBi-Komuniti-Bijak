import { Button, ActionLink } from '../../components/ui/Button.jsx';
import { Choice } from '../../components/ui/FormField.jsx';
import { Card } from '../../components/ui/Feedback.jsx';
export function SettingsPage({ data, store, notify, openSignOut, openReset }) {
  return <div className="section-stack"><ActionLink href="#profile" icon="back" variant="text">Back to profile</ActionLink><Card><h2>Demo preferences</h2><Choice checked={data.preferences.rememberWorkspace} onChange={event => { if (store.setRememberWorkspace(event.target.checked)) notify('Preference saved on this browser.'); }}>Remember demo workspace</Choice><p className="helper">Reopen the last demo workspace from the home address. A direct page link takes precedence.</p></Card>
    <Card><h2>A little help</h2><p>Select a place on Map to report a problem or find an activity. Follow repairs in Reports. Explore Community and Recycling events in Activities.</p><p>SDP is an open simulated workspace. It uses the same local records as the resident view.</p></Card>
    <Card><h2>About this demo</h2><p>KoBi — Komuniti Bijak · Part 2 shell</p><p>Records are saved only in this browser. Photo previews last for this page session; they are unavailable after reload. No real submissions or uploads are made.</p><div className="form-actions"><Button onClick={openSignOut} icon="sign-out">Sign out</Button><Button variant="danger" onClick={openReset} icon="reset-demo">Reset demo</Button></div></Card></div>;
}
