export const ELMINA_TOWNSHIP = {
  id: 'elmina-seksyen-u16',
  name: 'Elmina West (Seksyen U16)',
  address: 'Persiaran Elmina / Jalan Frekuensi, Seksyen U16, 40160 Shah Alam, Selangor, Malaysia',
  bounds: { width: 32, height: 24, tileSize: 20 },
};

export const ELMINA_PERSONAS = [
  {
    id: 'resident-alex',
    name: 'Alex Tan',
    role: 'resident',
    email: 'alex.tan@example.com',
    homeFacilityId: 'house-frekuensi-12',
    homeObjectId: 'obj-house-12',
    address: 'Lot 12, Jalan Frekuensi U16, Elmina',
  },
  {
    id: 'staff-sdp',
    name: 'SDP Demo Team',
    role: 'staff',
    email: 'sdp.team@example.com',
    homeFacilityId: null,
    homeObjectId: null,
    address: 'Township Management Office, Elmina',
  },
];

export const ELMINA_FACILITIES = [
  {
    id: 'house-frekuensi-12',
    name: 'Resident Home (Lot 12, Jalan Frekuensi)',
    type: 'house',
    category: 'Residential',
    state: 'normal',
    reportable: false,
    description: 'Your primary registered residence in Elmina West.',
  },
  {
    id: 'hall-elmina',
    name: 'Dewan Komuniti Elmina',
    type: 'hall',
    category: 'Civic Facility',
    state: 'normal',
    reportable: true,
    description: 'Shared multipurpose hall for town meetings, sports, and resident bookings.',
  },
  {
    id: 'park-elmina',
    name: 'Elmina Central Green Park',
    type: 'park',
    category: 'Recreation',
    state: 'normal',
    reportable: true,
    description: 'Community park with landscaped trails, outdoor fitness, and native shade trees.',
  },
  {
    id: 'surau-elmina',
    name: 'Surau Al-Falah (Elmina U16)',
    type: 'hall',
    category: 'Place of Worship',
    state: 'normal',
    reportable: true,
    description: 'Local neighbourhood surau providing daily prayers and community lectures.',
  },
  {
    id: 'recycling-elmina',
    name: 'Elmina Community Recycling Station',
    type: 'recycling',
    category: 'Waste & Environment',
    state: 'normal',
    reportable: true,
    description: 'Separated recycling bins for plastics, cardboard, e-waste, and aluminium.',
  },
  {
    id: 'lamp-frekuensi-01',
    name: 'Walkway Lamp #01 (Jalan Frekuensi)',
    type: 'lamp',
    category: 'Lighting',
    state: 'reported',
    reportable: true,
    description: 'LED walkway luminaire illuminating the pedestrian footpath.',
  },
  {
    id: 'lamp-frekuensi-02',
    name: 'Walkway Lamp #02 (Jalan Frekuensi)',
    type: 'lamp',
    category: 'Lighting',
    state: 'repairing',
    reportable: true,
    description: 'Pedestrian pole lighting near the children park connector.',
  },
  {
    id: 'lamp-persiaran-01',
    name: 'Streetlight #10 (Persiaran Elmina)',
    type: 'lamp',
    category: 'Lighting',
    state: 'normal',
    reportable: true,
    description: 'Arterial street lighting pole along Persiaran Elmina.',
  },
];

export const ELMINA_LAYOUT = [
  // Primary anchors
  { objectId: 'obj-house-12', facilityId: 'house-frekuensi-12', assetKey: 'house', x: 4, y: 6, width: 2, height: 2, label: 'Alex Home (Lot 12)' },
  { objectId: 'obj-hall', facilityId: 'hall-elmina', assetKey: 'hall', x: 19, y: 4, width: 3, height: 2, label: 'Dewan Komuniti' },
  { objectId: 'obj-park', facilityId: 'park-elmina', assetKey: 'park', x: 10, y: 15, width: 5, height: 4, label: 'Elmina Central Park' },
  { objectId: 'obj-surau', facilityId: 'surau-elmina', assetKey: 'hall', x: 23, y: 16, width: 3, height: 3, label: 'Surau Al-Falah' },
  { objectId: 'obj-recycling', facilityId: 'recycling-elmina', assetKey: 'recycling', x: 26, y: 7, width: 2, height: 2, label: 'Recycling Point' },
  
  // Streetlights
  { objectId: 'obj-lamp-f1', facilityId: 'lamp-frekuensi-01', assetKey: 'lamp', x: 7, y: 5, width: 1, height: 1, label: 'Lamp #01' },
  { objectId: 'obj-lamp-f2', facilityId: 'lamp-frekuensi-02', assetKey: 'lamp', x: 7, y: 9, width: 1, height: 1, label: 'Lamp #02' },
  { objectId: 'obj-lamp-p1', facilityId: 'lamp-persiaran-01', assetKey: 'lamp', x: 15, y: 11, width: 1, height: 1, label: 'Streetlight #10' },

  // Residential houses along Jalan Frekuensi
  { objectId: 'obj-house-10', facilityId: null, assetKey: 'house', x: 4, y: 2, width: 2, height: 2, label: 'Lot 10' },
  { objectId: 'obj-house-11', facilityId: null, assetKey: 'house', x: 4, y: 4, width: 2, height: 2, label: 'Lot 11' },
  { objectId: 'obj-house-13', facilityId: null, assetKey: 'house', x: 4, y: 8, width: 2, height: 2, label: 'Lot 13' },
  { objectId: 'obj-house-14', facilityId: null, assetKey: 'house', x: 4, y: 16, width: 2, height: 2, label: 'Lot 14' },
  { objectId: 'obj-house-15', facilityId: null, assetKey: 'house', x: 4, y: 18, width: 2, height: 2, label: 'Lot 15' },
];

export const ELMINA_REPORT_HISTORIES = {
  'lamp-frekuensi-01': [
    { id: 'rh-101', status: 'received', note: 'Public report received: evening flicker observed.', date: '2026-10-18T10:30:00Z' },
    { id: 'rh-102', status: 'verified', note: 'Technician inspection logged: ballast capacitor replacement required.', date: '2026-10-19T08:15:00Z' },
  ],
  'lamp-frekuensi-02': [
    { id: 'rh-201', status: 'received', note: 'Report received: light pole unlit.', date: '2026-10-16T19:00:00Z' },
    { id: 'rh-202', status: 'in_progress', note: 'SDP maintenance crew dispatched for rewiring.', date: '2026-10-19T14:00:00Z' },
  ],
  'park-elmina': [
    { id: 'rh-301', status: 'completed', note: 'Quarterly landscape pruning and trail inspection completed.', date: '2026-10-12T11:00:00Z' },
  ],
  'hall-elmina': [
    { id: 'rh-401', status: 'completed', note: 'Air conditioning serviced ahead of weekend town hall.', date: '2026-10-10T16:00:00Z' },
  ],
  'surau-elmina': [
    { id: 'rh-501', status: 'completed', note: 'Sound system check and ablution area water pressure calibrated.', date: '2026-10-08T09:30:00Z' },
  ],
  'recycling-elmina': [
    { id: 'rh-601', status: 'completed', note: 'Weekly bin collection and sanitization completed.', date: '2026-10-17T07:30:00Z' },
  ],
};

export const ELMINA_ACTIVITIES = {
  'park-elmina': [
    { id: 'act-01', title: 'Gotong-Royong Hijau Elmina', starts_at: '2026-10-25T01:00:00Z', category: 'community', status: 'published' },
    { id: 'act-02', title: 'Sunset Brisk Walk Club', starts_at: '2026-10-27T10:30:00Z', category: 'sports', status: 'published' },
  ],
  'hall-elmina': [
    { id: 'act-03', title: 'Elmina Residents Town Hall Q4', starts_at: '2026-11-02T02:00:00Z', category: 'civic', status: 'published' },
  ],
  'surau-elmina': [
    { id: 'act-04', title: 'Kuliah Subuh & Breakfast Sharing', starts_at: '2026-10-25T22:30:00Z', category: 'community', status: 'published' },
  ],
};

/**
 * Calculates straight-line distance in meters between two grid coordinates.
 * Each 1x1 grid tile corresponds to roughly 15 meters in Elmina.
 */
export function calculateDistanceMeters(posA, posB) {
  if (!posA || !posB) return null;
  const dx = posA.x - posB.x;
  const dy = posA.y - posB.y;
  const tileDistance = Math.hypot(dx, dy);
  return Math.round(tileDistance * 15 / 5) * 5; // rounded to 5m
}

export function formatWalkingDistance(meters) {
  if (meters === null || meters === undefined) return null;
  const minutes = Math.max(1, Math.round(meters / 75)); // ~75m per minute
  return `${meters} m · ~${minutes} min walk`;
}

export function getFacilityReportHistory(facilityId) {
  return ELMINA_REPORT_HISTORIES[facilityId] || [];
}

export function getFacilityActivities(facilityId) {
  return ELMINA_ACTIVITIES[facilityId] || [];
}
