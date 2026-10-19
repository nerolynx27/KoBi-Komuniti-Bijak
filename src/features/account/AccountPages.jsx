import { useState } from 'react';
import { Button, ActionLink } from '../../components/ui/Button.jsx';
import { FormField } from '../../components/ui/FormField.jsx';
import { PasswordField } from '../../components/ui/PasswordField.jsx';
import { Card } from '../../components/ui/Feedback.jsx';
import { SegmentedControl } from '../../components/ui/Selection.jsx';
import { useCommandForm } from '../../app/useCommandForm.js';
import { validateAccountForm } from './accountCommands.js';

export function AccountPages({ registration = false, store, snapshot, session, navigate, registerGuard, notify }) {
  const [values, setValues] = useState({ displayName: '', email: '', password: '', confirmation: '' });
  const [view, setView] = useState('resident'), [fields, setFields] = useState({});
  const dirty = Object.values(values).some(Boolean);
  const form = useCommandForm({ store, snapshot, registerGuard, dirty, onSuccess: () => { notify('Demo profile prepared. No real account was created.'); navigate('profile'); } });
  const change = name => event => setValues(current => ({ ...current, [name]: event.target.value }));
  function submit(event) {
    event.preventDefault(); const invalid = validateAccountForm(values, registration); setFields(invalid);
    if (Object.keys(invalid).length) { requestAnimationFrame(() => document.querySelector('[aria-invalid="true"]')?.focus()); return; }
    if (registration) { session.setView('resident'); form.submit('profile.prepareResident', { displayName: values.displayName, email: values.email }); }
    else { registerGuard(null); session.setView(view); if (snapshot.data.preferences.rememberWorkspace) store.setWorkspace(view); notify('Demo view opened. No credentials were verified.'); navigate(view === 'sdp' ? 'sdp' : 'map'); }
  }
  return <div className="section-stack account-page"><Card className="demo-explainer"><h2>Your neighbourhood, together</h2><p>Try KoBi with a local demo profile. This form simulates an account flow. No real account is created, no password is stored and credentials are not checked.</p></Card>
    <form className="form-stack" noValidate onSubmit={submit}>
      {!registration && <SegmentedControl label="Choose a demo view" value={view} onChange={setView} options={[{ value: 'resident', label: 'Resident' }, { value: 'sdp', label: 'SDP' }]} />}
      {registration && <FormField label="Display name" required autoComplete="name" value={values.displayName} onChange={change('displayName')} error={fields.displayName || form.error?.fields?.displayName} maxLength={61} />}
      <FormField label="Email" required type="email" autoComplete="email" value={values.email} onChange={change('email')} error={fields.email || form.error?.fields?.email} />
      <PasswordField label="Password" required autoComplete={registration ? 'new-password' : 'current-password'} value={values.password} onChange={change('password')} error={fields.password} />
      {registration && <PasswordField label="Confirm password" required autoComplete="new-password" value={values.confirmation} onChange={change('confirmation')} error={fields.confirmation} />}
      {form.error && <p role="alert" className="field-error">{form.error.message}</p>}
      {form.awaitingRecovery && <div className="action-pair"><Button onClick={form.retry}>Retry storage</Button><Button variant="quiet" onClick={form.clearPending}>Discard pending change</Button></div>}
      <div className="form-actions"><Button type="submit" variant="primary" disabled={form.awaitingRecovery}>{registration ? 'Create account' : 'Sign in'}</Button><ActionLink href={registration ? '#sign-in' : '#create-account'} variant="quiet">{registration ? 'Back to sign in' : 'Create account'}</ActionLink></div>
    </form></div>;
}
