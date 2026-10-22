import { useEffect, useRef } from 'react';
import { Icon } from '../ui/Icon.jsx';
import { observeSize } from '../ui/PixelFrame.jsx';
import './sdp-components.css';

const destinations = [
  ['workspace', '#sdp', 'Workspace', 'catalog'],
  ['reports', '#sdp/reports', 'Reports', 'report'],
  ['activities', '#sdp/activities', 'Activities', 'calendar'],
  ['world', '#sdp/world', 'World', 'map'],
];
export function SdpBottomNav({ active }) {
  const nav = useRef(null);
  useEffect(() => observeSize(nav.current, ({ height }) => {
    nav.current?.closest('.sdp-workspace-shell')?.style.setProperty('--sdp-nav-height', `${height}px`);
  }), []);
  return <nav ref={nav} className="sdp-bottom-nav" aria-label="SDP navigation">
    {destinations.map(([id, href, label, icon]) => <a key={id} href={href} aria-label={id === 'world' ? 'World editor' : label} aria-current={active === id ? 'page' : undefined}><Icon name={icon} /><span>{label}</span></a>)}
  </nav>;
}
