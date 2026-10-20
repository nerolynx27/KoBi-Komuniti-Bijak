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

export const ELMINA_ROADS = [
  { id: 'road-persiaran', name: 'PERSIARAN ELMINA', x: 0, y: 11, width: 32, height: 2, orientation: 'horizontal', primary: true },
  { id: 'road-frekuensi-1', name: 'JALAN FREKUENSI 1', x: 7, y: 0, width: 2, height: 24, orientation: 'vertical', primary: false },
  { id: 'road-frekuensi-2', name: 'JALAN FREKUENSI 2', x: 18, y: 0, width: 2, height: 24, orientation: 'vertical', primary: false },
  { id: 'road-frekuensi-3', name: 'JALAN FREKUENSI 3', x: 9, y: 5, width: 9, height: 1, orientation: 'horizontal', primary: false },
  { id: 'road-frekuensi-4', name: 'JALAN FREKUENSI 4', x: 20, y: 15, width: 12, height: 1, orientation: 'horizontal', primary: false },
];

export const ELMINA_FACILITIES = [
  {
    id: 'house-frekuensi-12',
    name: 'Resident Home (Lot 12, Jalan Frekuensi)',
    type: 'house',
    category: 'Residential',
    state: 'normal',
    reportable: false,
    description: 'Your primary registered double-storey terrace residence in Elmina West.',
  },
  {
    id: 'hall-elmina',
    name: 'Dewan Komuniti Elmina',
    type: 'hall',
    category: 'Civic Facility',
    state: 'normal',
    reportable: true,
    description: 'Shared multipurpose hall for town meetings, badminton courts, and resident bookings.',
  },
  {
    id: 'park-elmina',
    name: 'Elmina Central Green Park',
    type: 'park',
    category: 'Recreation',
    state: 'normal',
    reportable: true,
    description: 'Community park with landscaped jogging trails, lakeside deck, outdoor fitness, and shade trees.',
  },
  {
    id: 'surau-elmina',
    name: 'Surau Al-Falah (Elmina U16)',
    type: 'hall',
    category: 'Place of Worship',
    state: 'normal',
    reportable: true,
    description: 'Local neighbourhood surau providing daily congregational prayers and community classes.',
  },
  {
    id: 'recycling-elmina',
    name: 'Elmina Community Recycling Station',
    type: 'recycling',
    category: 'Waste & Environment',
    state: 'normal',
    reportable: true,
    description: 'Separated recycling drop-off station for plastics, paper, glass, e-waste, and aluminium.',
  },
  {
    id: 'lamp-frekuensi-01',
    name: 'Walkway Lamp #01 (Jalan Frekuensi 1)',
    type: 'lamp',
    category: 'Lighting',
    state: 'reported',
    reportable: true,
    description: 'Roadside LED luminaire along the western pedestrian walkway of Jalan Frekuensi 1.',
  },
  {
    id: 'lamp-frekuensi-02',
    name: 'Walkway Lamp #02 (Jalan Frekuensi 1)',
    type: 'lamp',
    category: 'Lighting',
    state: 'repairing',
    reportable: true,
    description: 'Roadside pedestrian pole light near the Lot 12 residential junction.',
  },
  {
    id: 'lamp-frekuensi-03',
    name: 'Parkside Lamp #03 (Jalan Frekuensi 1)',
    type: 'lamp',
    category: 'Lighting',
    state: 'normal',
    reportable: true,
    description: 'Pedestrian lamp post lighting the western entrance to Elmina Central Green Park.',
  },
  {
    id: 'lamp-persiaran-01',
    name: 'Streetlight #10 (Persiaran Elmina)',
    type: 'lamp',
    category: 'Lighting',
    state: 'normal',
    reportable: true,
    description: 'Arterial roadside lighting pole on the northern verge of Persiaran Elmina.',
  },
  {
    id: 'lamp-persiaran-02',
    name: 'Streetlight #11 (Persiaran Elmina)',
    type: 'lamp',
    category: 'Lighting',
    state: 'normal',
    reportable: true,
    description: 'Arterial roadside lighting pole near Dewan Komuniti Elmina.',
  },
  {
    id: 'lamp-persiaran-03',
    name: 'Streetlight #12 (Persiaran Elmina South)',
    type: 'lamp',
    category: 'Lighting',
    state: 'normal',
    reportable: true,
    description: 'Arterial roadside lighting pole on the southern verge of Persiaran Elmina.',
  },
];

export const ELMINA_LAYOUT = [
  // Primary Community Amenities
  { objectId: 'obj-hall', facilityId: 'hall-elmina', assetKey: 'hall', x: 21, y: 6, width: 4, height: 3, label: 'Dewan Komuniti' },
  { objectId: 'obj-recycling', facilityId: 'recycling-elmina', assetKey: 'recycling', x: 27, y: 7, width: 2, height: 2, label: 'Recycling Point' },
  { objectId: 'obj-park', facilityId: 'park-elmina', assetKey: 'park', x: 10, y: 15, width: 7, height: 6, label: 'Elmina Central Park' },
  { objectId: 'obj-surau', facilityId: 'surau-elmina', assetKey: 'hall', x: 22, y: 16, width: 4, height: 3, label: 'Surau Al-Falah' },

  // Roadside Streetlights (Strictly on roadside verges, never on asphalt)
  { objectId: 'obj-lamp-f1', facilityId: 'lamp-frekuensi-01', assetKey: 'lamp', x: 6, y: 3, width: 1, height: 1, label: 'Lamp #01' },
  { objectId: 'obj-lamp-f2', facilityId: 'lamp-frekuensi-02', assetKey: 'lamp', x: 6, y: 10, width: 1, height: 1, label: 'Lamp #02' },
  { objectId: 'obj-lamp-f3', facilityId: 'lamp-frekuensi-03', assetKey: 'lamp', x: 9, y: 14, width: 1, height: 1, label: 'Lamp #03' },
  { objectId: 'obj-lamp-p1', facilityId: 'lamp-persiaran-01', assetKey: 'lamp', x: 13, y: 10, width: 1, height: 1, label: 'Streetlight #10' },
  { objectId: 'obj-lamp-p2', facilityId: 'lamp-persiaran-02', assetKey: 'lamp', x: 23, y: 10, width: 1, height: 1, label: 'Streetlight #11' },
  { objectId: 'obj-lamp-p3', facilityId: 'lamp-persiaran-03', assetKey: 'lamp', x: 16, y: 13, width: 1, height: 1, label: 'Streetlight #12' },

  // Precinct 1: North-West Frekuensi Residential Terrace (West of Jalan Frekuensi 1)
  { objectId: 'obj-house-08', facilityId: null, assetKey: 'house', x: 1, y: 1, width: 2, height: 2, label: 'Lot 08' },
  { objectId: 'obj-house-09', facilityId: null, assetKey: 'house', x: 4, y: 1, width: 2, height: 2, label: 'Lot 09' },
  { objectId: 'obj-house-10', facilityId: null, assetKey: 'house', x: 1, y: 4, width: 2, height: 2, label: 'Lot 10' },
  { objectId: 'obj-house-11', facilityId: null, assetKey: 'house', x: 4, y: 4, width: 2, height: 2, label: 'Lot 11' },
  // 2-tile vertical garden & driveway clearance (y=6..7) so MY HOUSE pinpoint at Lot 12 never overlaps Lot 11
  { objectId: 'obj-house-13', facilityId: null, assetKey: 'house', x: 1, y: 8, width: 2, height: 2, label: 'Lot 13' },
  { objectId: 'obj-house-12', facilityId: 'house-frekuensi-12', assetKey: 'house', x: 4, y: 8, width: 2, height: 2, label: 'Alex Home (Lot 12)' },

  // Precinct 2: South-West Frekuensi Residential Terrace
  { objectId: 'obj-house-14', facilityId: null, assetKey: 'house', x: 1, y: 14, width: 2, height: 2, label: 'Lot 14' },
  { objectId: 'obj-house-15', facilityId: null, assetKey: 'house', x: 4, y: 14, width: 2, height: 2, label: 'Lot 15' },
  { objectId: 'obj-house-16', facilityId: null, assetKey: 'house', x: 1, y: 17, width: 2, height: 2, label: 'Lot 16' },
  { objectId: 'obj-house-17', facilityId: null, assetKey: 'house', x: 4, y: 17, width: 2, height: 2, label: 'Lot 17' },
  { objectId: 'obj-house-18', facilityId: null, assetKey: 'house', x: 1, y: 20, width: 2, height: 2, label: 'Lot 18' },
  { objectId: 'obj-house-19', facilityId: null, assetKey: 'house', x: 4, y: 20, width: 2, height: 2, label: 'Lot 19' },

  // Precinct 3: Central Frekuensi Residential Terrace (Between Jalan Frekuensi 1 & 2)
  { objectId: 'obj-house-20', facilityId: null, assetKey: 'house', x: 10, y: 2, width: 2, height: 2, label: 'Lot 20' },
  { objectId: 'obj-house-21', facilityId: null, assetKey: 'house', x: 13, y: 2, width: 2, height: 2, label: 'Lot 21' },
  { objectId: 'obj-house-22', facilityId: null, assetKey: 'house', x: 16, y: 2, width: 2, height: 2, label: 'Lot 22' },
  { objectId: 'obj-house-23', facilityId: null, assetKey: 'house', x: 10, y: 7, width: 2, height: 2, label: 'Lot 23' },
  { objectId: 'obj-house-24', facilityId: null, assetKey: 'house', x: 15, y: 7, width: 2, height: 2, label: 'Lot 24' },

  // Precinct 4: East Elmina Residential Terrace (East of Jalan Frekuensi 2)
  { objectId: 'obj-house-25', facilityId: null, assetKey: 'house', x: 21, y: 2, width: 2, height: 2, label: 'Lot 25' },
  { objectId: 'obj-house-26', facilityId: null, assetKey: 'house', x: 25, y: 2, width: 2, height: 2, label: 'Lot 26' },
  { objectId: 'obj-house-27', facilityId: null, assetKey: 'house', x: 28, y: 2, width: 2, height: 2, label: 'Lot 27' },
  { objectId: 'obj-house-28', facilityId: null, assetKey: 'house', x: 21, y: 20, width: 2, height: 2, label: 'Lot 28' },
  { objectId: 'obj-house-29', facilityId: null, assetKey: 'house', x: 25, y: 20, width: 2, height: 2, label: 'Lot 29' },
  { objectId: 'obj-house-30', facilityId: null, assetKey: 'house', x: 28, y: 20, width: 2, height: 2, label: 'Lot 30' },
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
  'lamp-frekuensi-03': [
    { id: 'rh-251', status: 'completed', note: 'Routine LED bulb brightness check passed.', date: '2026-10-11T09:00:00Z' },
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
 * Resolves or synthesizes facility metadata for any layout object (including neighbourhood houses).
 */
export function resolveObjectFacility(obj, facilities = ELMINA_FACILITIES) {
  if (!obj) return null;
  if (obj.facilityId) {
    const found = facilities.find(f => f.id === obj.facilityId);
    if (found) return found;
  }
  if (obj.assetKey === 'house') {
    return {
      id: obj.objectId,
      name: `Neighbourhood Residence (${obj.label || 'Jalan Frekuensi'})`,
      type: 'house',
      category: 'Residential Terrace',
      state: 'normal',
      reportable: false,
      description: 'Private residential terrace home along Jalan Frekuensi, Seksyen U16 Elmina.',
    };
  }
  return null;
}

/**
 * Calculates straight-line distance in meters between two grid coordinates.
 * Each 1x1 grid tile corresponds to roughly 15 meters in Elmina.
 */
export function calculateDistanceMeters(posA, posB) {
  if (!posA || !posB) return null;
  const dx = posA.x - posB.x;
  const dy = posA.y - posB.y;
  const tileDistance = Math.hypot(dx, dy);
  return Math.round((tileDistance * 15) / 5) * 5; // rounded to 5m
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
