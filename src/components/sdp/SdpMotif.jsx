function Calendar() {
  return <g stroke="var(--color-wine)" strokeWidth="1.5" strokeLinejoin="miter">
    <path fill="var(--color-vanilla)" d="M4 10h36v36H4z" />
    <path fill="var(--color-cherry)" d="M4 10h36v9H4z" />
    <path fill="var(--color-sand)" d="M10 5h3v10h-3zM30 5h3v10h-3z" />
    <path fill="none" d="M9 24h4m5 0h4m5 0h4m-22 6h4m5 0h4m5 0h4m-22 6h4m5 0h4m5 0h4m-22 6h4m5 0h4" />
    <path fill="var(--color-cherry)" stroke="none" d="M19 29h4v4h-4z" />
  </g>;
}
function Buildings() {
  return <g stroke="var(--color-wine)" strokeWidth="1.5" strokeLinejoin="miter">
    <path fill="var(--color-gold)" d="M26 36h19v25H26zM44 25h15v36H44z" />
    <path fill="var(--color-cherry)" d="M24 36l11-9 12 9zM46 27h4v6h-4zM46 38h4v6h-4zM46 49h4v6h-4z" />
    <path fill="var(--color-vanilla)" d="M29 40h4v6h-4zM37 40h4v6h-4zM32 51h7v10h-7zM53 27h4v6h-4zM53 38h4v6h-4zM53 49h4v6h-4z" />
    <path fill="none" d="M24 61h37M44 24h17" />
  </g>;
}
function Lamp() {
  return <g stroke="var(--color-wine)" strokeWidth="1.5" strokeLinejoin="miter">
    <path fill="var(--color-gold)" d="M9 61V24h3v-7h5v-4h25v3H19v4h-4v41z" />
    <path fill="var(--color-sand)" d="M32 13h14v5H32zM6 60h13v3H6z" />
    <path fill="none" stroke="var(--color-gold)" d="M31 23l-3 9m10-10v12m7-11 4 8" />
    <path fill="none" d="M12 60V26l3-6h16" />
  </g>;
}
export function SdpMotif({ name, className = '' }) {
  const elmina = name === 'elmina';
  return <svg className={`sdp-motif ${className}`} viewBox={elmina ? '0 0 62 68' : '0 0 64 64'} width="64" height="64" aria-hidden="true" focusable="false" shapeRendering="crispEdges">
    {elmina && <>
      <image href="/assets/dashboard/sdp/elmina-extracted-v1.png" x="0" y="0" width="62" height="52.2" style={{ imageRendering: 'pixelated' }} />
      <path d="M0 52h62v16H0z" fill="var(--color-wine)" />
      <text x="31" y="65" textAnchor="middle" fill="var(--color-gold)" fontFamily="var(--font-heading)" fontSize="11">Elmina</text>
    </>}
    {name === 'streetlight' && <Lamp />}
    {name === 'calendar' && <><Calendar /><Buildings /></>}
    {name === 'community' && <><Calendar /><g stroke="var(--color-wine)" strokeWidth="1.5">
      <path d="M38 34h7v3h3v8h-3v3h-7v-3h-3v-8h3z" fill="var(--color-gold)" />
      <path d="M31 50h6v-3h12v3h5v11H31z" fill="var(--color-gold)" />
      <path d="M51 42h5v2h3v7h-3v2h-5v-2h-3v-7h3zM48 55h12v7H48z" fill="var(--color-cherry)" />
      <path d="M27 43h5v2h2v6h-2v2h-5v-2h-2v-6h2zM23 56h13v6H23z" fill="var(--color-vanilla)" />
    </g></>}
    {name === 'world' && <g stroke="var(--color-wine)" strokeWidth="1.5" strokeLinejoin="miter">
      <path fill="var(--color-gold)" d="M3 12l18-6 21 7 18-6v45l-18 6-21-7-18 6z" />
      <path fill="var(--color-sand)" d="M21 6l21 7v45l-21-7z" />
      <path fill="none" d="M21 6v45m21-38v45M3 28l18-6 21 7 18-6M3 44l18-6 21 7 18-6" />
      <path fill="var(--color-cherry)" d="M7 23v-8l5-4 5 4v8zM27 38v-9l6-4 6 4v9zM47 29v-9l6-4 5 4v9z" />
      <path fill="var(--color-vanilla)" d="M10 17h4v6h-4zM30 31h5v7h-5zM50 22h5v7h-5z" />
    </g>}
  </svg>;
}
