import { useState } from 'react';
import { Card } from '../../components/ui/Feedback.jsx';
import { Button, ActionLink } from '../../components/ui/Button.jsx';

export function BulletinArtwork({ src, label, className = '', width, height }) {
  const [failed, setFailed] = useState(false), [attempt, setAttempt] = useState(0);
  return <div className={`bulletin-art ${className}`}>
    {failed ? <div className="bulletin-art-error" role="status"><p>{label} artwork unavailable</p><Button size="sm" onClick={() => { setAttempt(value => value + 1); setFailed(false); }}>Retry artwork</Button></div>
      : <img key={attempt} src={src} alt="" width={width} height={height} onError={() => setFailed(true)} />}
  </div>;
}

export function DashboardWorldEntry() {
  return <Card tone="strong" className="bulletin-world" aria-labelledby="bulletin-world-title">
    <h2 id="bulletin-world-title">See your neighbourhood</h2>
    <BulletinArtwork src="/assets/dashboard/bulletin-neighbourhood-panorama.png" label="Neighbourhood" className="bulletin-panorama" width={1280} height={152} />
    <ActionLink href="#map" variant="primary" fullWidth>Enter World</ActionLink>
  </Card>;
}
