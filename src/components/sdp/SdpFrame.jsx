import { PaperTexture } from '../ui/PaperTexture.jsx';

// Fixed-pixel corner recipes traced at the reference's 390px comparison width.
function outline(w, h, inset, kind, folded) {
  const l = inset, r = w - inset, t = inset, b = h - inset;
  const step = Math.max(2, 8 - inset), fold = Math.max(3, 14 - inset);
  let points;
  if (kind === 'event' || kind === 'ticket') {
    const mid = Math.round(h / 2), bite = Math.max(2, 9 - inset);
    points = [[l+5,t],[r-5,t],[r-5,t+3],[r,t+3],[r,mid-10],[r-3,mid-8],[r-bite,mid-4],[r-bite,mid+4],[r-3,mid+8],[r,mid+10],[r,b-3],[r-5,b-3],[r-5,b],[l+5,b],[l+5,b-3],[l,b-3],[l,mid+10],[l+3,mid+8],[l+bite,mid+4],[l+bite,mid-4],[l+3,mid-8],[l,mid-10],[l,t+3],[l+5,t+3]];
  } else if (kind === 'report') {
    const c = Math.max(3, 11 - inset);
    points = [[l+c,t],[r-c,t],[r-c,t+3],[r-c+4,t+3],[r-c+4,t+7],[r,t+7],[r,b-7],[r-c+4,b-7],[r-c+4,b-3],[r-c,b-3],[r-c,b],[l+c,b],[l+c,b-3],[l+c-4,b-3],[l+c-4,b-7],[l,b-7],[l,t+7],[l+c-4,t+7],[l+c-4,t+3],[l+c,t+3]];
  } else if (kind === 'metric' || kind === 'sticker') {
    const edge = Math.min(3, step);
    points = [[l+step,t],[r-step,t],[r-step,t+edge],[r-edge,t+edge],[r-edge,t+step],[r,t+step],[r,b-step],[r-edge,b-step],[r-edge,b-edge],[r-step,b-edge],[r-step,b],[l+step,b],[l+step,b-edge],[l+edge,b-edge],[l+edge,b-step],[l,b-step],[l,t+step],[l+edge,t+step],[l+edge,t+edge],[l+step,t+edge]];
  } else {
    points = [[l+5,t],[r-(folded && kind === 'panel' ? fold : 5),t]];
    if (folded && kind === 'panel') points.push([r,t+fold]);
    else points.push([r,t+5]);
    points.push([r,b-(folded ? fold : 5)],[r-(folded ? fold : 5),b],[l+5,b],[l,b-5],[l,t+5]);
  }
  return `${points.map(([x,y], i) => `${i ? 'L' : 'M'}${x},${y}`).join(' ')} Z`;
}

export function SdpFrame({ width, height, shape, folded }) {
  if (shape && shape.startsWith('sdp-')) {
    return <div className="pixel-frame sdp-frame sdp-card-backing" data-frame-shape={shape} aria-hidden="true" focusable="false" style={{ pointerEvents: 'none' }} />;
  }
  const kind = shape.replace(/^sdp-/, '');
  const detailed = !['panel', 'welcome'].includes(kind), shadow = detailed ? 3 : 2;
  const control = ['ticket', 'sticker'].includes(kind);
  const rim = detailed && !control ? 2 : 1;
  const keyline = control ? 2 : kind === 'report' ? 5 : 4;
  const face = detailed ? keyline + 1 : 2;
  const path = inset => outline(width, height, inset, kind, folded);
  return <svg className="pixel-frame sdp-frame" data-frame-shape={shape} width={width+shadow} height={height+shadow} viewBox={`0 0 ${width+shadow} ${height+shadow}`} aria-hidden="true" focusable="false" shapeRendering="crispEdges">
    <path className="frame-shadow" d={path(0)} transform={`translate(2 ${shadow})`} />
    <g className="frame-face">
      <path className="frame-ink" d={path(0)} />
      <path className="frame-rim" d={path(rim)} />
      {detailed && <path className="frame-ink frame-keyline" d={path(keyline)} />}
      <path className="frame-fill" d={path(face)} />
      <PaperTexture facePath={path(face)} role={control ? 'control' : 'panel'} />
      {folded && kind === 'panel' && <path className="sdp-paper-fold" d={`M${width-14},1 V14 H${width-1} Z`} />}
      {folded && ['welcome', 'shortcut', 'panel'].includes(kind) && <path className="sdp-paper-fold" d={`M${width-14},${height-1} V${height-14} H${width-1} Z`} />}
    </g>
  </svg>;
}
