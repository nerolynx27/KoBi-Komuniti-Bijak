import { useEffect, useState } from 'react';
import './PixelFrame.css';

let observer;
const callbacks = new WeakMap();
export function observeSize(element, callback) {
  if (!observer && typeof ResizeObserver !== 'undefined') observer = new ResizeObserver(entries => entries.forEach(entry => callbacks.get(entry.target)?.(entry.target.getBoundingClientRect())));
  callbacks.set(element, callback);
  observer?.observe(element);
  callback(element.getBoundingClientRect());
  return () => { observer?.unobserve(element); callbacks.delete(element); };
}

function silhouette(w, h, x = 0, y = 0) {
  return [[4,0],[w-4,0],[w-4,2],[w-2,2],[w-2,4],[w,4],[w,h-4],[w-2,h-4],[w-2,h-2],[w-4,h-2],[w-4,h],[4,h],[4,h-2],[2,h-2],[2,h-4],[0,h-4],[0,4],[2,4],[2,2],[4,2]].map(([a,b],i) => `${i ? 'L' : 'M'}${a+x},${b+y}`).join(' ') + ' Z';
}
function band(w, h, inset, ticket) {
  let d = silhouette(w - 2 * inset, h - 2 * inset, inset, inset);
  if (ticket && inset < 4) {
    const top = Math.round(h / 2) - 4;
    d += ` M${inset},${top} H4 V${top+8} H${inset} Z M${w-inset},${top} H${w-4} V${top+8} H${w-inset} Z`;
  }
  return d;
}

export function PixelFrame({ targetRef, shape = 'sticker' }) {
  const [size, setSize] = useState(null);
  // Parent control refs are attached after child layout effects.
  useEffect(() => {
    if (!targetRef.current) return;
    return observeSize(targetRef.current, rect => {
      const width = Math.round(rect.width), height = Math.round(rect.height);
      setSize(previous => previous?.width === width && previous?.height === height ? previous : { width, height });
    });
  }, [targetRef]);
  if (!size) return null;
  const { width: w, height: h } = size;
  if (w < 16 || h < 16) return null;
  const ticket = shape === 'ticket';
  return <svg className="pixel-frame" width={w+4} height={h+4} viewBox={`0 0 ${w+4} ${h+4}`} aria-hidden="true" focusable="false" shapeRendering="crispEdges">
    <path className="frame-shadow" d={band(w,h,0,ticket)} transform="translate(4 4)" fillRule="evenodd" />
    <g className="frame-face">
      <path className="frame-ink" d={band(w,h,0,ticket)} fillRule="evenodd" />
      <path className="frame-rim" d={band(w,h,2,ticket)} fillRule="evenodd" />
      <path className="frame-fill" d={band(w,h,4,ticket)} fillRule="evenodd" />
      {shape === 'folded-tab' && <><path className="frame-fold" d={`M${w-12},4 h4 v2 h2 v2 h2 v4 h-8 Z`} /><path className="frame-ink" d={`M${w-12},4 h2 v8 h8 v2 h-10 Z`} /></>}
    </g>
  </svg>;
}
