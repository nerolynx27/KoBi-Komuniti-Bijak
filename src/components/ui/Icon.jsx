export const iconNames = ['map', 'report', 'activity', 'profile', 'settings', 'camera', 'image', 'location', 'calendar', 'clock', 'back', 'close', 'plus', 'minus', 'reset-view', 'refresh', 'check', 'warning', 'edit', 'sign-out', 'eye', 'eye-off', 'catalog', 'move', 'trash', 'reset-demo', 'leaf', 'recycle', 'chevron-right', 'progress'];

export function Icon({ name, large = false, className = '' }) {
  return <svg className={`icon ${large ? 'icon-large' : ''} ${className}`} width={large ? 40 : 20} height={large ? 40 : 20} viewBox="0 0 20 20" aria-hidden="true" focusable="false" shapeRendering="crispEdges"><use href={`/assets/ui/icons.svg#${name}`} /></svg>;
}
