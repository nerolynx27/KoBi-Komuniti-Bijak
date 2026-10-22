import { useId } from 'react';

const masks = { panel: 'laid-paper', control: 'woven-paper' };

export function PaperTexture({ facePath, role = 'panel' }) {
  const id = 'paper-' + useId().replace(/:/g, '');
  if (role === 'control') return null;
  return <>
    <defs>
      <mask id={id + '-mask'} x="0" y="0" width="320" height="320" maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse" style={{ maskType: 'alpha' }}>
        <image crossOrigin="anonymous" href={'/assets/ui/paper/' + masks[role] + '-mask.png'} width="320" height="320" />
      </mask>
      <pattern id={id} width="320" height="320" patternUnits="userSpaceOnUse">
        <rect width="320" height="320" fill="var(--paper-ink)" mask={'url(#' + id + '-mask)'} />
      </pattern>
    </defs>
    <path className="paper-texture" style={{ display: 'var(--paper-texture-display, none)' }} data-paper-role={role} d={facePath} fill={'url(#' + id + ')'} fillRule="evenodd" aria-hidden="true" pointerEvents="none" />
  </>;
}
