import { useId } from 'react';
import { Icon } from './Icon.jsx';

export function FormField({ label, helper, error, required = false, as: Element = 'input', children, id: suppliedId, ...props }) {
  const generatedId = useId();
  const id = suppliedId || generatedId;
  const describedBy = [helper && `${id}-helper`, error && `${id}-error`, props['aria-describedby']].filter(Boolean).join(' ') || undefined;
  return <div className="form-field">
    <label htmlFor={id}>{label}{required && <span aria-hidden="true"> *</span>}</label>
    <div className="paper-input-face" data-paper-tone={props.disabled || props.readOnly ? 'sand' : 'vanilla'}><Element {...props} className="form-input" id={id} required={required} aria-invalid={Boolean(error) || undefined} aria-describedby={describedBy}>{children}</Element></div>
    {helper && <p className="helper" id={`${id}-helper`}>{helper}</p>}
    {error && <p className="field-error" id={`${id}-error`}><Icon name="warning" />{error}</p>}
  </div>;
}

export function Choice({ children, type = 'checkbox', ...props }) {
  return <label className="choice"><input {...props} type={type} /><span>{children}</span></label>;
}
