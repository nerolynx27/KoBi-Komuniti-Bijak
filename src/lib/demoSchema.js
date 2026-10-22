import { RESIDENT_ID, STAFF_ID, upgradeApprovedMap } from './demoSamples.js';

const exactKeys = (value, keys) => value && typeof value === 'object' && !Array.isArray(value) && Object.keys(value).sort().join() === keys.split(' ').sort().join();
const text = (value, min = 1, max = 1000) => typeof value === 'string' && value.trim().length >= min && value.length <= max;
const date = value => typeof value === 'string' && Number.isFinite(Date.parse(value));
const rows = (value, check) => Array.isArray(value) && value.length <= 1000 && value.every(check) && new Set(value.map(row => row.id ?? row.objectId ?? `${row.activity_id}:${row.user_id}`)).size === value.length;
const statuses = ['received', 'in_progress', 'resolved'];

// Keep the actual Part 1 acceptance rules: migration must preserve every valid save,
// including historical actor roles and provisional or overlapping footprints.
function validV1Data(d) {
  if (!exactKeys(d, 'township profiles preferences facilities complaints complaint_updates activities activity_participants layout')) return false;
  if (!exactKeys(d.township, 'id name map_id') || !text(d.township.id) || !text(d.township.name) || !text(d.township.map_id)) return false;
  if (!exactKeys(d.preferences, 'rememberWorkspace workspace') || typeof d.preferences.rememberWorkspace !== 'boolean' || !['resident', 'sdp'].includes(d.preferences.workspace)) return false;
  if (!rows(d.profiles, p => exactKeys(p, 'id township_id display_name role created_at') && text(p.id) && p.township_id === d.township.id && text(p.display_name, 2, 60) && ['resident', 'staff'].includes(p.role) && date(p.created_at)) || !d.profiles.some(p => p.role === 'resident')) return false;
  const profile = id => d.profiles.some(p => p.id === id);
  if (!rows(d.facilities, f => exactKeys(f, 'id name type township_id reportable') && text(f.id) && text(f.name) && ['lamp', 'bench', 'park', 'hall', 'recycling', 'house'].includes(f.type) && typeof f.reportable === 'boolean' && f.township_id === d.township.id)) return false;
  const facility = id => d.facilities.find(f => f.id === id);
  if (!rows(d.complaints, c => exactKeys(c, 'id facility_id resident_id description photo_path status version created_at updated_at') && text(c.id) && facility(c.facility_id)?.reportable && profile(c.resident_id) && text(c.description, 10, 1000) && c.photo_path === null && statuses.includes(c.status) && Number.isInteger(c.version) && c.version >= 1 && date(c.created_at) && date(c.updated_at))) return false;
  if (!rows(d.complaint_updates, u => exactKeys(u, 'id complaint_id actor_id status note evidence_path created_at') && text(u.id) && d.complaints.some(c => c.id === u.complaint_id) && profile(u.actor_id) && statuses.includes(u.status) && text(u.note, 5, 1000) && u.evidence_path === null && date(u.created_at))) return false;
  if (!rows(d.activities, a => exactKeys(a, 'id township_id facility_id title description category instructions starts_at ends_at status created_by version created_at updated_at') && text(a.id) && a.township_id === d.township.id && ['park', 'hall', 'recycling'].includes(facility(a.facility_id)?.type) && text(a.title, 5, 100) && text(a.description, 10, 2000) && text(a.instructions, 0, 1000) && ['community', 'recycling'].includes(a.category) && ['draft', 'published', 'cancelled'].includes(a.status) && date(a.starts_at) && date(a.ends_at) && Date.parse(a.ends_at) > Date.parse(a.starts_at) && profile(a.created_by) && Number.isInteger(a.version) && a.version >= 1 && date(a.created_at) && date(a.updated_at))) return false;
  if (!rows(d.activity_participants, p => exactKeys(p, 'activity_id user_id created_at') && d.activities.some(a => a.id === p.activity_id) && profile(p.user_id) && date(p.created_at))) return false;
  return rows(d.layout, o => exactKeys(o, 'objectId facilityId assetKey x y width height') && text(o.objectId) && (o.facilityId === null || facility(o.facilityId)) && ['house', 'lamp', 'bench', 'park', 'hall', 'recycling', 'tree'].includes(o.assetKey) && ['x', 'y', 'width', 'height'].every(k => Number.isInteger(o[k])) && o.x >= 0 && o.y >= 0 && o.width > 0 && o.height > 0 && o.x + o.width <= 32 && o.y + o.height <= 24);
}

const rootKeys = 'township profiles preferences facilities complaints complaint_updates activities activity_participants layout attachments';
const email = value => text(value, 3, 254) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const safeMetadataText = value => text(value, 1, 255) && !/^(?:blob:|data:)/i.test(value) && !/base64,/i.test(value);

export function validateDemoData(data) {
  const issues = [];
  if (!exactKeys(data, rootKeys)) return { valid: false, issues: ['Demo data has missing or unsupported fields.'] };

  const validProfile = p => {
    if (!p || typeof p !== 'object' || Array.isArray(p)) return false;
    const requiredKeys = ['id', 'township_id', 'display_name', 'role', 'email', 'created_at'];
    const allowedKeys = new Set([...requiredKeys, 'home_facility_id', 'home_object_id', 'address']);
    const keys = Object.keys(p);
    return requiredKeys.every(k => k in p) && keys.every(k => allowedKeys.has(k)) && email(p.email);
  };

  if (!rows(data.profiles, validProfile)) {
    return { valid: false, issues: ['Profiles must have valid email addresses and supported fields.'] };
  }

  if (!rows(data.attachments, a => exactKeys(a, 'id kind file_name mime_type size_bytes') && safeMetadataText(a.id) && ['report', 'resolution'].includes(a.kind) && safeMetadataText(a.file_name) && ['image/jpeg', 'image/png', 'image/webp'].includes(a.mime_type) && Number.isInteger(a.size_bytes) && a.size_bytes >= 1 && a.size_bytes <= 5000000)) {
    return { valid: false, issues: ['Attachments must contain supported image metadata only (1–5,000,000 bytes).'] };
  }
  const reference = (path, kind) => path === null || (typeof path === 'string' && path.startsWith('demo-attachment:') && data.attachments.some(a => a.id === path.slice('demo-attachment:'.length) && a.kind === kind));
  if (!Array.isArray(data.complaints) || data.complaints.some(c => !c || !reference(c.photo_path, 'report'))) issues.push('A report photo reference is invalid or missing.');
  if (!Array.isArray(data.complaint_updates) || data.complaint_updates.some(u => !u || !reference(u.evidence_path, 'resolution'))) issues.push('An evidence reference is invalid or missing.');
  if (issues.length) return { valid: false, issues };

  // Validate shared structural fields with the original contract without weakening
  // its exact-key checks. Image bytes and session files never enter this shape.
  const { attachments: _attachments, ...shared } = data;
  const legacyShape = {
    ...shared,
    township: data.township ? { id: data.township.id, name: data.township.name, map_id: data.township.map_id } : null,
    profiles: Array.isArray(data.profiles)
      ? data.profiles.map(({ email: _email, home_facility_id: _hf, home_object_id: _ho, address: _addr, ...profile }) => profile)
      : data.profiles,
    layout: Array.isArray(data.layout)
      ? data.layout.map(({ label: _label, ...obj }) => obj)
      : data.layout,
    complaints: Array.isArray(data.complaints)
      ? data.complaints.map(c => (c && typeof c === 'object' ? { ...c, photo_path: null } : c))
      : data.complaints,
    complaint_updates: Array.isArray(data.complaint_updates)
      ? data.complaint_updates.map(u => (u && typeof u === 'object' ? { ...u, evidence_path: null } : u))
      : data.complaint_updates,
  };
  if (!validV1Data(legacyShape)) issues.push('Records contain invalid fields, duplicate IDs, out-of-bounds tiles or missing relationships.');
  return { valid: issues.length === 0, issues };
}

export function migrateV1(data) {
  if (!validV1Data(data)) throw new Error('The original version 1 demo data is invalid.');
  const next = structuredClone(data);
  next.profiles = next.profiles.map((profile, index) => ({
    ...profile,
    email: profile.id === RESIDENT_ID ? 'alex.tan@example.com' : profile.id === STAFF_ID ? 'sdp.team@example.com' : `demo.${profile.role}.${index + 1}@example.com`,
  }));
  next.attachments = [];
  return next;
}

export function readDemoEnvelope(raw) {
  const failure = (code, message) => ({ data: null, error: { code, message } });
  let envelope;
  try { envelope = JSON.parse(raw); } catch { return failure('INVALID_DATA', 'Saved demo data could not be read.'); }
  if (!envelope || typeof envelope !== 'object' || Array.isArray(envelope)) return failure('INVALID_DATA', 'Saved demo data is invalid.');
  if (envelope.version !== 1 && envelope.version !== 2) return failure('UNSUPPORTED_VERSION', 'This saved demo version is not supported.');
  if (envelope.version === 1) {
    if (!exactKeys(envelope, 'version data')) return failure('INVALID_DATA', 'The version 1 envelope is invalid.');
    try {
      const data = upgradeApprovedMap(migrateV1(envelope.data));
      const validation = validateDemoData(data);
      if (!validation.valid) return failure('INVALID_DATA', validation.issues.join(' '));
      return { data: { version: 2, revision: 0, data, migrated: true }, error: null };
    } catch { return failure('INVALID_DATA', 'The original version 1 demo data is invalid.'); }
  }
  if (!exactKeys(envelope, 'version revision data') || !Number.isSafeInteger(envelope.revision) || envelope.revision < 0) return failure('INVALID_DATA', 'The saved demo revision is invalid.');
  const validation = validateDemoData(envelope.data);
  if (!validation.valid) return failure('INVALID_DATA', validation.issues.join(' '));
  const data = upgradeApprovedMap(envelope.data);
  const upgradedValidation = validateDemoData(data);
  if (!upgradedValidation.valid) return failure('INVALID_DATA', upgradedValidation.issues.join(' '));
  return { data: { version: 2, revision: envelope.revision, data, migrated: data !== envelope.data }, error: null };
}
