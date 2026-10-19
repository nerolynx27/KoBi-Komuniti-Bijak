import { componentCatalog } from './componentCatalog.js';
import { validatePlacement, getRemovalBlockers } from './layoutValidation.js';
const fail = (code, message) => ({ data: null, error: { code, message } });
const ok = (nextData, result, entityId, changed = true) => ({ data: { nextData, result, entityId, changed }, error: null });
const validId = id => typeof id === 'string' && /^[a-z0-9][a-z0-9-]{0,254}$/.test(id);
export function applyLayoutCommand(data, command, context) {
  const actor = data.profiles.find(row => row.id === context.actor?.id);
  if (!actor || actor.role !== 'staff' || context.actor.role !== 'staff' || actor.township_id !== data.township.id) return fail('FORBIDDEN', 'Use the SDP demo view to edit the schematic.');
  const { type, input } = command;
  if (!['world.add', 'world.move', 'world.remove'].includes(type)) return fail('UNAVAILABLE', 'This layout action is unavailable.');
  const current = data.layout.find(row => row.objectId === input.objectId);
  if (type === 'world.add') {
    if (!Number.isInteger(input.expectedRevision) || input.expectedRevision !== context.revision) return fail('CONFLICT', 'The saved layout changed. Cancel this preview and review the latest layout.');
    const catalog = componentCatalog.find(row => row.assetKey === input.assetKey);
    if (!catalog || !validId(input.objectId) || (catalog.decorative ? input.facilityId !== null : !validId(input.facilityId))) return fail('VALIDATION_ERROR', 'Choose a valid catalog component and stable IDs.');
    const object = { objectId: input.objectId, facilityId: input.facilityId, assetKey: input.assetKey, x: input.x, y: input.y, width: catalog.width, height: catalog.height };
    if (current) return JSON.stringify(current) === JSON.stringify(object) ? ok(data, current, current.objectId, false) : fail('CONFLICT', 'This object ID is already in use.');
    if (input.facilityId && data.facilities.some(row => row.id === input.facilityId)) return fail('CONFLICT', 'This facility ID is already in use.');
    const placement = validatePlacement(data.layout, object);
    if (!placement.valid) return fail('VALIDATION_ERROR', placement.reason);
    const ordinal = Math.max(1, ...data.facilities.filter(row => row.type === catalog.assetKey).map(row => row.name === catalog.label ? 1 : Number(row.name.startsWith(`${catalog.label} `) ? row.name.slice(catalog.label.length + 1) : 0) || 0)) + 1;
    const facility = input.facilityId ? { id: input.facilityId, name: `${catalog.label} ${ordinal}`, type: catalog.assetKey, township_id: data.township.id, reportable: true } : null;
    return ok({ ...data, layout: [...data.layout, object], facilities: facility ? [...data.facilities, facility] : data.facilities }, object, object.objectId);
  }
  if (!current) return fail('NOT_FOUND', 'This component is no longer available.');
  if (!Number.isInteger(input.expectedRevision) || input.expectedRevision !== context.revision) return fail('CONFLICT', 'The saved layout changed. Cancel this preview and review the latest layout.');
  if (type === 'world.remove') {
    const blockers = getRemovalBlockers(data, current.objectId);
    if (blockers.length) return fail('REFERENCED', blockers.join(' '));
    return ok({ ...data, layout: data.layout.filter(row => row.objectId !== current.objectId), facilities: data.facilities.filter(row => row.id !== current.facilityId) }, { objectId: current.objectId }, current.objectId);
  }
  const moved = { ...current, x: input.x, y: input.y };
  const placement = validatePlacement(data.layout, moved, { excludeObjectId: current.objectId });
  if (!placement.valid) return fail('VALIDATION_ERROR', placement.reason);
  return ok({ ...data, layout: data.layout.map(row => row.objectId === current.objectId ? moved : row) }, moved, moved.objectId, current.x !== moved.x || current.y !== moved.y);
}
