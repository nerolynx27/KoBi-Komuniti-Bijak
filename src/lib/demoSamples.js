import { approvedPlacements } from '../features/world/approvedMap.generated.js';

export const TOWNSHIP_ID = '00000000-0000-4000-8000-000000000001';
export const RESIDENT_ID = '00000000-0000-4000-8000-000000000002';
export const STAFF_ID = '00000000-0000-4000-8000-000000000003';
const stamp = '2026-10-16T00:00:00Z';

export const ELMINA_ROADS = [
  { id: 'road-persiaran', name: 'PERSIARAN ELMINA', x: 0, y: 11, width: 32, height: 2, orientation: 'horizontal', primary: true },
  { id: 'road-frekuensi-1', name: 'JALAN FREKUENSI 1', x: 7, y: 0, width: 2, height: 24, orientation: 'vertical', primary: false },
  { id: 'road-frekuensi-2', name: 'JALAN FREKUENSI 2', x: 18, y: 0, width: 2, height: 24, orientation: 'vertical', primary: false },
  { id: 'road-frekuensi-3', name: 'JALAN FREKUENSI 3', x: 9, y: 5, width: 9, height: 1, orientation: 'horizontal', primary: false },
  { id: 'road-frekuensi-4', name: 'JALAN FREKUENSI 4', x: 20, y: 15, width: 12, height: 1, orientation: 'horizontal', primary: false },
];

function createLegacySampleData(referenceTime) {
  const start = referenceTime === undefined ? '2026-11-07T01:00:00Z' : new Date(new Date(referenceTime).getTime() + 7 * 86400000).toISOString();
  const end = referenceTime === undefined ? '2026-11-07T03:00:00Z' : new Date(Date.parse(start) + 7200000).toISOString();

  const facilities = [
    { id: 'lamp-01', name: 'Walkway lamp #01 (Jalan Frekuensi)', type: 'lamp', township_id: TOWNSHIP_ID, reportable: true },
    { id: 'bench-01', name: 'Garden bench (Elmina Central Park)', type: 'bench', township_id: TOWNSHIP_ID, reportable: true },
    { id: 'park-01', name: 'Community garden & park (Elmina Central Park)', type: 'park', township_id: TOWNSHIP_ID, reportable: true },
    { id: 'hall-01', name: 'Community hall (Dewan Komuniti Elmina)', type: 'hall', township_id: TOWNSHIP_ID, reportable: true },
    { id: 'recycling-01', name: 'Recycling point (Elmina Station)', type: 'recycling', township_id: TOWNSHIP_ID, reportable: true },
    { id: 'lamp-02', name: 'Streetlight #02 (Jalan Frekuensi)', type: 'lamp', township_id: TOWNSHIP_ID, reportable: true },
    { id: 'lamp-03', name: 'Streetlight #10 (Persiaran Elmina)', type: 'lamp', township_id: TOWNSHIP_ID, reportable: true },
    { id: 'surau-01', name: 'Surau Al-Falah (Elmina U16)', type: 'hall', township_id: TOWNSHIP_ID, reportable: true },
    { id: 'house-01', name: 'Neighbourhood house (Alex Tan Home - Lot 12)', type: 'house', township_id: TOWNSHIP_ID, reportable: false },
  ];

  const layout = [
    // Primary streetlights on roadside verges
    { objectId: 'object-lamp-01', facilityId: 'lamp-01', assetKey: 'lamp', x: 6, y: 3, width: 1, height: 1, label: 'Lamp #01' },
    { objectId: 'object-lamp-02', facilityId: 'lamp-02', assetKey: 'lamp', x: 6, y: 10, width: 1, height: 1, label: 'Lamp #02' },
    { objectId: 'object-lamp-03', facilityId: 'lamp-03', assetKey: 'lamp', x: 13, y: 10, width: 1, height: 1, label: 'Streetlight #10' },
    { objectId: 'object-lamp-04', facilityId: null, assetKey: 'lamp', x: 9, y: 14, width: 1, height: 1, label: 'Lamp #03' },
    { objectId: 'object-lamp-05', facilityId: null, assetKey: 'lamp', x: 23, y: 10, width: 1, height: 1, label: 'Streetlight #11' },
    { objectId: 'object-lamp-06', facilityId: null, assetKey: 'lamp', x: 16, y: 13, width: 1, height: 1, label: 'Streetlight #12' },

    // Primary Community Amenities
    { objectId: 'object-bench-01', facilityId: 'bench-01', assetKey: 'bench', x: 17, y: 14, width: 1, height: 1, label: 'Garden bench' },
    { objectId: 'object-park-01', facilityId: 'park-01', assetKey: 'park', x: 10, y: 15, width: 7, height: 6, label: 'Elmina Central Park' },
    { objectId: 'object-hall-01', facilityId: 'hall-01', assetKey: 'hall', x: 21, y: 6, width: 4, height: 3, label: 'Dewan Komuniti' },
    { objectId: 'object-surau-01', facilityId: 'surau-01', assetKey: 'hall', x: 22, y: 16, width: 4, height: 3, label: 'Surau Al-Falah' },
    { objectId: 'object-recycling-01', facilityId: 'recycling-01', assetKey: 'recycling', x: 27, y: 7, width: 2, height: 2, label: 'Recycling Point' },

    // Residential Garden Tree at (3, 8) to preserve worldLayout collision contract
    { objectId: 'object-tree-01', facilityId: null, assetKey: 'tree', x: 3, y: 8, width: 1, height: 1, label: 'Garden tree' },

    // Precinct 1: North-West Frekuensi Residential Terrace (West of Jalan Frekuensi 1)
    { objectId: 'object-house-08', facilityId: null, assetKey: 'house', x: 1, y: 3, width: 2, height: 2, label: 'Lot 08' },
    { objectId: 'object-house-09', facilityId: null, assetKey: 'house', x: 4, y: 1, width: 2, height: 2, label: 'Lot 09' },
    { objectId: 'object-house-10', facilityId: null, assetKey: 'house', x: 1, y: 5, width: 2, height: 2, label: 'Lot 10' },
    { objectId: 'object-house-11', facilityId: null, assetKey: 'house', x: 4, y: 3, width: 2, height: 2, label: 'Lot 11' },
    // 2-tile clearance at y=6..7 for Lot 12 pinpoint banner
    { objectId: 'object-house-13', facilityId: null, assetKey: 'house', x: 1, y: 8, width: 2, height: 2, label: 'Lot 13' },
    { objectId: 'object-house-01', facilityId: 'house-01', assetKey: 'house', x: 4, y: 8, width: 2, height: 2, label: 'Alex Home (Lot 12)' },

    // Precinct 2: South-West Frekuensi Residential Terrace
    { objectId: 'object-house-14', facilityId: null, assetKey: 'house', x: 1, y: 14, width: 2, height: 2, label: 'Lot 14' },
    { objectId: 'object-house-15', facilityId: null, assetKey: 'house', x: 4, y: 14, width: 2, height: 2, label: 'Lot 15' },
    { objectId: 'object-house-16', facilityId: null, assetKey: 'house', x: 1, y: 17, width: 2, height: 2, label: 'Lot 16' },
    { objectId: 'object-house-17', facilityId: null, assetKey: 'house', x: 4, y: 17, width: 2, height: 2, label: 'Lot 17' },
    { objectId: 'object-house-18', facilityId: null, assetKey: 'house', x: 1, y: 20, width: 2, height: 2, label: 'Lot 18' },
    { objectId: 'object-house-19', facilityId: null, assetKey: 'house', x: 4, y: 20, width: 2, height: 2, label: 'Lot 19' },

    // Precinct 3: Central Frekuensi Residential Terrace (Between Jalan Frekuensi 1 & 2)
    { objectId: 'object-house-20', facilityId: null, assetKey: 'house', x: 10, y: 2, width: 2, height: 2, label: 'Lot 20' },
    { objectId: 'object-house-21', facilityId: null, assetKey: 'house', x: 13, y: 2, width: 2, height: 2, label: 'Lot 21' },
    { objectId: 'object-house-22', facilityId: null, assetKey: 'house', x: 16, y: 2, width: 2, height: 2, label: 'Lot 22' },
    { objectId: 'object-house-23', facilityId: null, assetKey: 'house', x: 10, y: 7, width: 2, height: 2, label: 'Lot 23' },
    { objectId: 'object-house-24', facilityId: null, assetKey: 'house', x: 15, y: 7, width: 2, height: 2, label: 'Lot 24' },

    // Precinct 4: East Elmina Residential Terrace (East of Jalan Frekuensi 2)
    { objectId: 'object-house-25', facilityId: null, assetKey: 'house', x: 21, y: 2, width: 2, height: 2, label: 'Lot 25' },
    { objectId: 'object-house-26', facilityId: null, assetKey: 'house', x: 25, y: 2, width: 2, height: 2, label: 'Lot 26' },
    { objectId: 'object-house-27', facilityId: null, assetKey: 'house', x: 28, y: 2, width: 2, height: 2, label: 'Lot 27' },
    { objectId: 'object-house-28', facilityId: null, assetKey: 'house', x: 21, y: 21, width: 2, height: 2, label: 'Lot 28' },
    { objectId: 'object-house-29', facilityId: null, assetKey: 'house', x: 24, y: 21, width: 2, height: 2, label: 'Lot 29' },
    { objectId: 'object-house-30', facilityId: null, assetKey: 'house', x: 24, y: 17, width: 2, height: 2, label: 'Lot 30' },
  ];

  return {
    township: {
      id: TOWNSHIP_ID,
      name: 'Elmina West (Seksyen U16)',
      address: 'Persiaran Elmina / Jalan Frekuensi, Seksyen U16, 40160 Shah Alam, Selangor',
      map_id: 'pilot-map',
      bounds: { width: 32, height: 24, tileSize: 20 },
    },
    profiles: [
      {
        id: RESIDENT_ID,
        township_id: TOWNSHIP_ID,
        display_name: 'Alex Tan',
        role: 'resident',
        email: 'alex.tan@example.com',
        home_facility_id: 'house-01',
        home_object_id: 'object-house-01',
        address: 'Lot 12, Jalan Frekuensi U16, Elmina',
        created_at: stamp,
      },
      {
        id: STAFF_ID,
        township_id: TOWNSHIP_ID,
        display_name: 'SDP demo team',
        role: 'staff',
        email: 'sdp.team@example.com',
        home_facility_id: null,
        home_object_id: null,
        created_at: stamp,
      },
    ],
    preferences: { rememberWorkspace: true, workspace: 'resident' },
    facilities,
    complaints: [
      { id: '00000000-0000-4000-8000-000000000011', facility_id: 'lamp-01', resident_id: RESIDENT_ID, description: 'The walkway lamp is not lighting up in the evening.', photo_path: null, status: 'received', version: 1, created_at: stamp, updated_at: stamp },
      { id: '00000000-0000-4000-8000-000000000012', facility_id: 'bench-01', resident_id: RESIDENT_ID, description: 'One of the garden bench boards needs securing.', photo_path: null, status: 'in_progress', version: 2, created_at: stamp, updated_at: stamp },
    ],
    complaint_updates: [
      { id: '00000000-0000-4000-8000-000000000021', complaint_id: '00000000-0000-4000-8000-000000000011', actor_id: RESIDENT_ID, status: 'received', note: 'Sample report received.', evidence_path: null, created_at: stamp },
      { id: '00000000-0000-4000-8000-000000000022', complaint_id: '00000000-0000-4000-8000-000000000012', actor_id: RESIDENT_ID, status: 'received', note: 'Sample report received.', evidence_path: null, created_at: stamp },
      { id: '00000000-0000-4000-8000-000000000023', complaint_id: '00000000-0000-4000-8000-000000000012', actor_id: STAFF_ID, status: 'in_progress', note: 'Sample maintenance work scheduled.', evidence_path: null, created_at: stamp },
    ],
    activities: [{ id: '00000000-0000-4000-8000-000000000031', township_id: TOWNSHIP_ID, facility_id: 'park-01', title: 'A greener Saturday', description: 'Meet your neighbours for a community garden morning.', category: 'community', instructions: 'Bring a water bottle and comfortable shoes.', starts_at: start, ends_at: end, status: 'published', created_by: STAFF_ID, version: 1, created_at: stamp, updated_at: stamp }],
    activity_participants: [],
    attachments: [],
    layout,
  };
}

export function upgradeApprovedMap(data) {
  const pilotLayout = [
    ...['lamp', 'bench', 'park', 'hall', 'recycling'].map((type, i) => ({ objectId: `object-${type}-01`, facilityId: `${type}-01`, assetKey: type, x: 3 + i * 4, y: 8, width: 1, height: 1 })),
    { objectId: 'object-house-01', facilityId: null, assetKey: 'house', x: 4, y: 3, width: 3, height: 3 },
  ];
  const legacy = createLegacySampleData();
  const approved = new Map(approvedPlacements.map(o => [o.objectId, o]));
  // Recognize only the shipped untouched pilot, including its first partial upgrade.
  // Any movement, addition, removal or custom label makes that saved layout ambiguous.
  const partialPilot = pilotLayout.map(o => approved.has(o.objectId) ? { ...o, facilityId: o.facilityId || approved.get(o.objectId).facilityId, label: approved.get(o.objectId).label } : o)
    .concat(approvedPlacements.filter(o => !legacy.layout.some(old => old.objectId === o.objectId)));
  const sameLayout = expected => data.layout.length === expected.length && expected.every(o => {
    const saved = data.layout.find(row => row.objectId === o.objectId);
    return saved && ['facilityId', 'assetKey', 'x', 'y', 'width', 'height', 'label'].every(key => saved[key] === o[key]);
  });
  if (data.township.id === TOWNSHIP_ID && ['pilot-map', 'elmina-approved-v1'].includes(data.township.map_id)
    && !data.profiles.some(p => p.home_object_id)
    && (sameLayout(pilotLayout) || sameLayout(partialPilot))) {
    const facilities = [...data.facilities];
    for (const facility of legacy.facilities) if (!facilities.some(f => f.id === facility.id)) facilities.push({ ...facility });
    for (const o of approvedPlacements) if (o.facilityId && !facilities.some(f => f.id === o.facilityId)) facilities.push({ id: o.facilityId, name: o.label, type: o.assetKey, township_id: data.township.id, reportable: o.assetKey !== 'house' });
    const mosque = facilities.find(f => f.id === 'surau-01');
    if (mosque?.name === 'Surau Al-Falah (Elmina U16)') facilities[facilities.indexOf(mosque)] = { ...mosque, name: 'Masjid Al Falah' };
    return { ...data, township: { ...data.township, map_id: 'elmina-approved-v1' }, facilities,
      profiles: data.profiles.map(p => p.id === RESIDENT_ID ? { ...p, home_object_id: 'object-house-01', home_facility_id: 'house-01' } : p),
      layout: approvedPlacements.map(o => ({ ...o })) };
  }
  if (data.township.map_id !== 'pilot-map' || !data.profiles.some(p => p.home_object_id === 'object-house-01')) return data;
  const previous = new Map(legacy.layout.map(o => [o.objectId, o]));
  const matchesOriginal = object => {
    const original = previous.get(object.objectId);
    return original && ['assetKey', 'x', 'y', 'width', 'height'].every(key => object[key] === original[key]);
  };
  const layout = data.layout
    .filter(o => o.objectId !== 'object-bench-01' || !matchesOriginal(o))
    .map(object => {
      const next = approved.get(object.objectId);
      if (!next || next.assetKey !== object.assetKey) return object;
      return { ...object, ...(matchesOriginal(object) ? next : {}), facilityId: object.facilityId || next.facilityId, label: next.label };
    });
  for (const placement of approvedPlacements) {
    // A missing original object was removed by its owner; only introduce genuinely new assets.
    if (!previous.has(placement.objectId) && !layout.some(o => o.objectId === placement.objectId)) layout.push({ ...placement });
  }
  const facilities = data.facilities.map(f => f.id === 'surau-01' && f.name === 'Surau Al-Falah (Elmina U16)' ? { ...f, name: 'Masjid Al Falah' } : f);
  for (const placement of layout) {
    if (!placement.facilityId || facilities.some(f => f.id === placement.facilityId)) continue;
    facilities.push({ id: placement.facilityId, name: placement.label, type: placement.assetKey, township_id: data.township.id, reportable: placement.assetKey !== 'house' });
  }
  return { ...data, township: { ...data.township, map_id: 'elmina-approved-v1' }, layout, facilities };
}

export function createSampleData(referenceTime) {
  return upgradeApprovedMap(createLegacySampleData(referenceTime));
}
