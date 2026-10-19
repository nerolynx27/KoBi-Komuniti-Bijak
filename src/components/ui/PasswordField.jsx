import { useState } from 'react';
import { FormField } from './FormField.jsx';
import { Button } from './Button.jsx';

export function PasswordField({ label = 'Password', value, onChange, autoComplete = 'current-password', disabled = false, ...props }) {
  const [visible, setVisible] = useState(false);
  return <div className="password-field">
    <FormField {...props} label={label} value={value} onChange={onChange} autoComplete={autoComplete} disabled={disabled} type={visible ? 'text' : 'password'} />
    <Button size="sm" variant="text" disabled={disabled} aria-pressed={visible} onClick={() => setVisible(show => !show)}>{visible ? 'Hide password' : 'Show password'}</Button>
  </div>;
}
