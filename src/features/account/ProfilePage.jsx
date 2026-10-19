import { useState } from 'react';
import { Button, ActionLink } from '../../components/ui/Button.jsx';
import { FormField, Choice } from '../../components/ui/FormField.jsx';
import { Card } from '../../components/ui/Feedback.jsx';
import { useCommandForm } from '../../app/useCommandForm.js';
export function ProfilePage({ data, actor, store, snapshot, registerGuard, notify, openSignOut, openReset, enterStaff }) {
  const profile = data.profiles.find(row => row.id === actor.id) || data.profiles[0];
  const [name, setName] = useState(profile.display_name);
  const form = useCommandForm({ store, snapshot, registerGuard, dirty: name !== profile.display_name, onSuccess: () => notify('Profile saved on this browser.') });
  return <div className="section-stack"><Card><span className="eyebrow">Demo profile</span><h2>{profile.display_name}</h2><p>{actor.role === 'staff' ? 'SDP demo view' : 'Resident demo view'} · Sample data</p></Card>
    <form className="form-stack" noValidate onSubmit={event => { event.preventDefault(); form.submit('profile.updateName', { displayName: name }); }}>
      <FormField label="Display name" required value={name} onChange={event => setName(event.target.value)} error={form.error?.fields?.displayName} />
      <FormField label="Email" value={profile.email} readOnly /><FormField label="Township" value={data.township.name} readOnly /><FormField label="Demo role" value={profile.role === 'staff' ? 'SDP' : 'Resident'} readOnly />
      {form.error && <p role="alert" className="field-error">{form.error.message}</p>}
      {form.awaitingRecovery && <div className="action-pair"><Button onClick={form.retry}>Retry storage</Button><Button variant="quiet" onClick={form.clearPending}>Discard pending change</Button></div>}
      <div className="form-actions"><Button type="submit" variant="primary" disabled={form.awaitingRecovery}>Save changes</Button><ActionLink href="#settings" variant="text" icon="settings">Settings</ActionLink></div>
    </form>
    <Card><h2>Your demo workspace</h2><Choice checked={data.preferences.rememberWorkspace} onChange={event => { if (store.setRememberWorkspace(event.target.checked)) notify('Preference saved on this browser.'); }}>Remember demo workspace</Choice><div className="form-actions"><Button onClick={enterStaff} icon="catalog">Enter SDP demo workspace</Button><Button onClick={openSignOut} icon="sign-out">Sign out</Button><Button variant="danger" onClick={openReset} icon="reset-demo">Reset demo</Button></div></Card></div>;
}
