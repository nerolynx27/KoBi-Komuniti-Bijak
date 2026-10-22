import { useEffect, useState } from 'react';
import { useFrameStyle } from './FrameStyle.jsx';
import './PixelFrame.css';
import { PaperTexture } from './PaperTexture.jsx';
import { SdpFrame } from '../sdp/SdpFrame.jsx';

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

function gatewayBand(w, h, inset, ticket) {
  const left = inset, right = w - inset, top = inset, bottom = h - inset;
  const mid = Math.round(h / 2);
  const points = [[left+4,top],[right-4,top],[right-4,top+2],[right-2,top+2],[right-2,top+4],[right,top+4]];
  if (ticket) points.push([right,mid-6-inset],[right-2,mid-6-inset],[right-2,mid-4-inset],[right-4,mid-4-inset],[right-4,mid-2-inset],[right-6,mid-2-inset],[right-6,mid+2+inset],[right-4,mid+2+inset],[right-4,mid+4+inset],[right-2,mid+4+inset],[right-2,mid+6+inset],[right,mid+6+inset]);
  points.push([right,bottom-4],[right-2,bottom-4],[right-2,bottom-2],[right-4,bottom-2],[right-4,bottom],[left+4,bottom],[left+4,bottom-2],[left+2,bottom-2],[left+2,bottom-4],[left,bottom-4]);
  if (ticket) points.push([left,mid+6+inset],[left+2,mid+6+inset],[left+2,mid+4+inset],[left+4,mid+4+inset],[left+4,mid+2+inset],[left+6,mid+2+inset],[left+6,mid-2-inset],[left+4,mid-2-inset],[left+4,mid-4-inset],[left+2,mid-4-inset],[left+2,mid-6-inset],[left,mid-6-inset]);
  points.push([left,top+4],[left+2,top+4],[left+2,top+2],[left+4,top+2]);
  return points.map(([x,y], index) => `${index ? 'L' : 'M'}${x},${y}`).join(' ') + ' Z';
}

export function PixelFrame({ targetRef, shape = 'sticker', folded = false, tone = 'panel' }) {
  const style = useFrameStyle();
  const [size, setSize] = useState(null);
  // Parent control refs are attached after child layout effects.
  useEffect(() => {
    if (!targetRef.current) return;
    if (style === 'sdp' && shape.startsWith('sdp-')) return;
    return observeSize(targetRef.current, () => {
      // SVG geometry uses layout pixels; ancestor transforms scale the finished frame.
      if (!targetRef.current) return;
      const width = targetRef.current.offsetWidth, height = targetRef.current.offsetHeight;
      setSize(previous => previous?.width === width && previous?.height === height ? previous : { width, height });
    });
  }, [targetRef, style, shape]);
  if (style === 'sdp' && shape.startsWith('sdp-')) return <SdpFrame shape={shape} folded={folded} />;
  if (!size) return null;
  const { width: w, height: h } = size;
  if (w < 16 || h < 16) return null;
  if (style === 'sdp') return <SdpFrame width={w} height={h} shape={shape} folded={folded} />;
  const ticket = shape === 'ticket';
  const panel = shape === 'panel', shadow = panel ? 2 : 4;
  const layered = !panel || tone === 'strong';
  if (style === 'gateway') return <svg className="pixel-frame pixel-frame-gateway" data-frame-shape={shape} width={w+shadow} height={h+shadow} viewBox={`0 0 ${w+shadow} ${h+shadow}`} aria-hidden="true" focusable="false" shapeRendering="crispEdges">
    <path className="frame-shadow" d={gatewayBand(w,h,0,ticket)} transform={`translate(${shadow} ${shadow})`} />
    <g className="frame-face">
      <path className="frame-ink" d={gatewayBand(w,h,0,ticket)} />
      <path className="frame-rim" d={gatewayBand(w,h,2,ticket)} />
      {layered && <path className="frame-ink frame-keyline" d={gatewayBand(w,h,4,ticket)} />}
      <path className="frame-fill" d={gatewayBand(w,h,layered ? 5 : 2,ticket)} />
      <PaperTexture facePath={gatewayBand(w,h,layered ? 5 : 2,ticket)} role={panel ? 'panel' : 'control'} />
      {(ticket || (panel && folded)) && <><path className="frame-ink" d={`M${w-16},1 h2 v13 h13 v2 h-15 Z`} /><path className="frame-fold" d={`M${w-14},2 h4 v2 h2 v2 h2 v2 h2 v5 h-10 Z`} /></>}
      {shape === 'folded-tab' && <><path className="frame-fold" d={`M${w-12},5 h3 v2 h2 v2 h2 v3 h-7 Z`} /><path className="frame-ink" d={`M${w-13},5 h1 v8 h9 v1 h-10 Z`} /></>}
    </g>
  </svg>;
  return <svg className="pixel-frame" width={w+4} height={h+4} viewBox={`0 0 ${w+4} ${h+4}`} aria-hidden="true" focusable="false" shapeRendering="crispEdges">
    <path className="frame-shadow" d={band(w,h,0,ticket)} transform="translate(4 4)" fillRule="evenodd" />
    <g className="frame-face">
      <path className="frame-ink" d={band(w,h,0,ticket)} fillRule="evenodd" />
      <path className="frame-rim" d={band(w,h,2,ticket)} fillRule="evenodd" />
      <path className="frame-fill" d={band(w,h,4,ticket)} fillRule="evenodd" />
      <PaperTexture facePath={band(w,h,4,ticket)} role={panel ? 'panel' : 'control'} />
      {shape === 'folded-tab' && <><path className="frame-fold" d={`M${w-12},4 h4 v2 h2 v2 h2 v4 h-8 Z`} /><path className="frame-ink" d={`M${w-12},4 h2 v8 h8 v2 h-10 Z`} /></>}
    </g>
  </svg>;
}
