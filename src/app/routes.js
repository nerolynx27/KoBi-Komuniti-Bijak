const staticRoutes = {
  'sign-in': ['sign-in', 'Sign in'], 'create-account': ['create-account', 'Create account'],
  map: ['map', 'Map'], reports: ['reports', 'Reports'], 'reports/new': ['report-new', 'Report a problem'],
  activities: ['activities', 'Activities'], profile: ['profile', 'Profile'], settings: ['settings', 'Settings'],
  sdp: ['sdp', 'SDP workspace'], 'sdp/reports': ['staff-reports', 'SDP reports'],
  'sdp/activities': ['manage-activities', 'Manage activities'], 'sdp/activities/new': ['activity-new', 'New activity'],
  'sdp/world': ['world-editor', 'World editor'], 'design-system': ['design-system', 'Design system'],
};
export function parseRoute(hash = '') {
  try {
    const [encoded, query = ''] = hash.replace(/^#/, '').split('?');
    const path = decodeURIComponent(encoded || 'map');
    const params = new URLSearchParams(query);
    let spec = staticRoutes[path], id;
    if (!spec) {
      let match;
      if ((match = path.match(/^sdp\/activities\/([^/]+)\/edit$/))) { spec = ['activity-edit', 'Edit activity']; id = match[1]; }
      else if ((match = path.match(/^sdp\/reports\/([^/]+)$/))) { spec = ['staff-report-detail', 'SDP report details']; id = match[1]; }
      else if ((match = path.match(/^reports\/([^/]+)$/))) { spec = ['report-detail', 'Report details']; id = match[1]; }
      else if ((match = path.match(/^activities\/([^/]+)$/))) { spec = ['activity-detail', 'Activity details']; id = match[1]; }
    }
    if (!spec) return { name: 'not-found', title: 'Page not found', path, nav: 'map', staff: false };
    return { name: spec[0], title: spec[1], path, id, facilityId: params.get('facility') || null, staff: path === 'sdp' || path.startsWith('sdp/'), nav: path.startsWith('reports') ? 'reports' : path.startsWith('activities') ? 'activities' : path === 'profile' || path === 'settings' ? 'profile' : 'map' };
  } catch { return { name: 'not-found', title: 'Page not found', path: '', nav: 'map', staff: false }; }
}
export function buildRoute(route) {
  if (typeof route === 'string') return route.startsWith('#') ? route : `#${route}`;
  if (route.name === 'map') return `#map${route.facilityId ? `?facility=${encodeURIComponent(route.facilityId)}` : ''}`;
  return `#${route.path || route.name}`;
}
