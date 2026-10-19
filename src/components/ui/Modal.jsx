import { useId, useLayoutEffect, useRef } from 'react';
import { Button, IconButton } from './Button.jsx';
import { uiText } from '../../content/uiText.js';

export function ModalHost({ open, mode = 'dialog', title, description, onClose, children, dismissible = true }) {
  const dialog = useRef(null);
  const opener = useRef(null);
  const previousOverflow = useRef('');
  const id = useId();
  useLayoutEffect(() => {
    const element = dialog.current;
    if (open) {
      if (!element.open) {
        opener.current = document.activeElement;
        previousOverflow.current = document.body.style.overflow;
        element.showModal();
        document.body.style.overflow = 'hidden';
      }
      [...element.querySelectorAll('[data-initial-focus]')].find(control => control.checkVisibility())?.focus();
    } else if (element.open) {
      element.close();
      document.body.style.overflow = previousOverflow.current;
      if (opener.current?.isConnected) opener.current.focus(); else document.querySelector('h1')?.focus();
    }
  }, [open, mode]);
  useLayoutEffect(() => {
    const element = dialog.current;
    return () => {
      if (element.open) { element.close(); document.body.style.overflow = previousOverflow.current; opener.current?.focus(); }
    };
  }, []);
  function keepFocus(event) {
    if (event.key !== 'Tab') return;
    const controls = [...dialog.current.querySelectorAll('button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled)')].filter(element => element.checkVisibility());
    const first = controls[0], last = controls.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  }
  return <dialog ref={dialog} className={`modal modal-${mode}`} aria-labelledby={`${id}-title`} aria-describedby={description ? `${id}-description` : undefined} onKeyDown={keepFocus} onCancel={event => { event.preventDefault(); if (dismissible) onClose(); }} onClick={event => { if (event.target === event.currentTarget) event.stopPropagation(); }}>
    <div className="modal-content"><div className="modal-heading"><h2 id={`${id}-title`}>{title}</h2>{mode === 'sheet' && <IconButton icon="close" label={uiText.closeSheet} onClick={onClose} data-initial-focus />}</div><div className="modal-body">{description && <p id={`${id}-description`}>{description}</p>}{children}</div></div>
  </dialog>;
}

// Content primitives share one native modal host, including nested confirmation.
export function BottomSheet({ children }) {
  return <div className="sheet-body">{children}</div>;
}
export function ConfirmDialog({ onCancel, onConfirm, confirmLabel, cancelLabel = uiText.cancel, loading = false, loadingLabel = uiText.saving, error }) {
  return <>{error && <p className="field-error" role="alert">{error}</p>}<div className="action-pair"><Button variant="danger" onClick={onConfirm} loading={loading} loadingLabel={loadingLabel}>{confirmLabel}</Button><Button variant="quiet" onClick={onCancel} disabled={loading} data-initial-focus>{cancelLabel}</Button></div></>;
}
