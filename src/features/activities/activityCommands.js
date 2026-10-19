import { selectParticipation } from './activitySelectors.js';

const failure = (code, message, fields) => ({ data: null, error: { code, message, ...(fields ? { fields } : {}) } });
const success = (nextData, result, entityId, changed = true) => ({ data: { nextData, result, entityId, changed }, error: null });
const valueKeys = ['title', 'description', 'category', 'instructions', 'facility_id', 'starts_at', 'ends_at', 'status'];
function validInstant(value) {
  if (typeof value !== 'string') return false;
  const parts = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d{1,3})?(?:Z|[+-](\d{2}):(\d{2}))$/.exec(value);
  if (!parts) return false;
  const [, year, month, day, hour, minute, second, zoneHour = 0, zoneMinute = 0] = parts.map(Number);
  if (year < 1 || month < 1 || month > 12 || day < 1 || hour > 23 || minute > 59 || second > 59 || zoneHour > 23 || zoneMinute > 59) return false;
  const calendar = new Date(0);
  calendar.setUTCFullYear(year, month - 1, day);
  return calendar.getUTCFullYear() === year && calendar.getUTCMonth() === month - 1 && calendar.getUTCDate() === day && Number.isFinite(Date.parse(value));
}

function validateValues(data, values, now) {
  const fields = {};
  if (!values || typeof values !== 'object' || Array.isArray(values) || Object.keys(values).some(key => !valueKeys.includes(key))) return { fields: { form: 'Use the supported activity fields.' } };
  const cleaned = { ...values };
  for (const [key, min, max] of [['title', 5, 100], ['description', 10, 2000], ['instructions', 0, 1000]]) {
    if (typeof values[key] !== 'string' || values[key].trim().length < min || values[key].trim().length > max) fields[key] = `Enter ${min}–${max} characters.`;
    else cleaned[key] = values[key].trim();
  }
  if (!['community', 'recycling'].includes(values.category)) fields.category = 'Choose a supported category.';
  if (!data.facilities.some(facility => facility.id === values.facility_id && facility.township_id === data.township.id && ['park', 'hall', 'recycling'].includes(facility.type))) fields.facility_id = 'Choose a current pilot park, hall or recycling location.';
  if (!validInstant(values.starts_at) || Date.parse(values.starts_at) <= Date.parse(now)) fields.starts_at = 'Choose a start time in the future.';
  if (!validInstant(values.ends_at) || Date.parse(values.ends_at) <= Date.parse(values.starts_at)) fields.ends_at = 'Choose an end time after the start.';
  if (!['draft', 'published'].includes(values.status)) fields.status = 'Choose draft or published.';
  if (!fields.starts_at) cleaned.starts_at = new Date(values.starts_at).toISOString();
  if (!fields.ends_at) cleaned.ends_at = new Date(values.ends_at).toISOString();
  return { fields, cleaned };
}

export function applyActivityCommand(data, command, context) {
  const { type, input = {} } = command;
  if (!['activities.save', 'activities.cancel', 'activities.join', 'activities.leave'].includes(type)) return failure('UNAVAILABLE', 'This activity action is unavailable.');
  const actor = context?.actor;
  if (!actor?.id) return failure('UNAUTHENTICATED', 'Select a demo persona before this action.');
  const authoring = ['activities.save', 'activities.cancel'].includes(type);
  const profile = data.profiles.find(row => row.id === actor.id);
  if (actor.role !== (authoring ? 'staff' : 'resident') || profile?.role !== actor.role || profile.township_id !== data.township.id) return failure('FORBIDDEN', `Use the ${authoring ? 'SDP staff' : 'resident'} demo persona for this action.`);
  if (typeof input.id !== 'string' || !input.id.trim()) return failure('VALIDATION_ERROR', 'An activity ID is required.');
  if (!validInstant(context.now) || !validInstant(context.timestamp)) return failure('VALIDATION_ERROR', 'A valid action time is required.');
  const existing = data.activities.find(activity => activity.id === input.id);

  if (type === 'activities.save') {
    if (input.expectedVersion !== null && (!Number.isSafeInteger(input.expectedVersion) || input.expectedVersion < 1)) return failure('VALIDATION_ERROR', 'A valid activity version is required.');
    const creating = input.expectedVersion === null;
    if (!creating && !existing) return failure('NOT_FOUND', 'This activity is unavailable.');
    if (!creating && input.expectedVersion !== existing.version) return failure('CONFLICT', 'This activity changed. Reload and review before saving.');
    if (!creating && (existing.status === 'cancelled' || Date.parse(context.now) >= Date.parse(existing.starts_at))) return failure('ACTIVITY_CLOSED', 'Started or cancelled activities cannot be edited.');
    const { fields, cleaned } = validateValues(data, input.values, context.now);
    if (!creating && existing.status === 'published' && cleaned?.status === 'draft') fields.status = 'Published activities must remain published.';
    if (Object.keys(fields).length) return failure('VALIDATION_ERROR', 'Review the activity fields.', fields);
    if (creating && existing) {
      if (existing.created_by === actor.id && valueKeys.every(key => existing[key] === cleaned[key])) return success(data, existing, existing.id, false);
      return failure('CONFLICT', 'This activity ID is already in use.');
    }
    const activity = creating
      ? { id: input.id, township_id: data.township.id, ...cleaned, created_by: actor.id, version: 1, created_at: context.timestamp, updated_at: context.timestamp }
      : { ...existing, ...cleaned, version: existing.version + 1, updated_at: context.timestamp };
    const activities = creating ? [...data.activities, activity] : data.activities.map(row => row.id === activity.id ? activity : row);
    return success({ ...data, activities }, activity, activity.id);
  }

  if (!existing) return failure('NOT_FOUND', 'This activity is unavailable.');
  if (type === 'activities.cancel') {
    if (!Number.isSafeInteger(input.expectedVersion) || input.expectedVersion < 1) return failure('VALIDATION_ERROR', 'A valid activity version is required.');
    if (existing.version !== input.expectedVersion) return failure('CONFLICT', 'This activity changed. Reload and review before cancelling.');
    if (existing.status === 'cancelled') return success(data, existing, existing.id, false);
    const activity = { ...existing, status: 'cancelled', version: existing.version + 1, updated_at: context.timestamp };
    return success({ ...data, activities: data.activities.map(row => row.id === activity.id ? activity : row) }, activity, activity.id);
  }
  if (Date.parse(context.now) >= Date.parse(existing.starts_at) || (type === 'activities.join' && existing.status !== 'published') || (type === 'activities.leave' && existing.status === 'draft')) return failure('ACTIVITY_CLOSED', 'Participation is closed for this activity.');
  const participation = selectParticipation(data, existing.id, actor.id);
  const joining = type === 'activities.join';
  if (participation.joined === joining) return success(data, participation, existing.id, false);
  const activity_participants = joining
    ? [...data.activity_participants, { activity_id: existing.id, user_id: actor.id, created_at: context.timestamp }]
    : data.activity_participants.filter(row => row.activity_id !== existing.id || row.user_id !== actor.id);
  const nextData = { ...data, activity_participants };
  return success(nextData, selectParticipation(nextData, existing.id, actor.id), existing.id);
}
