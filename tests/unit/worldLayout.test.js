import { describe, expect, it } from 'vitest';
import { createSampleData } from '../../src/lib/demoSamples.js';
import { validatePlacement, getRemovalBlockers } from '../../src/features/world-editor/layoutValidation.js';
import { applyLayoutCommand } from '../../src/features/world-editor/layoutCommands.js';
const context = data => ({ actor: data.profiles[1], revision: 4 });
const command = (type, input) => ({ type, input: type === 'world.add' ? { expectedRevision: 4, ...input } : input, operationId: 'layout-op' });
describe('temporary layout safety', () => {
  it('accepts the last 1x1 tile and rejects empty or beyond-edge coordinates', () => {
    expect(validatePlacement([], { x: 31, y: 23, width: 1, height: 1 }).valid).toBe(true);
    for (const patch of [{ x: '' }, { y: '' }, { x: 32 }, { y: 24 }]) {
      expect(validatePlacement([], { x: 31, y: 23, width: 1, height: 1, ...patch }).valid).toBe(false);
    }
  });
  it('rejects placement captured against an old or missing revision', () => {
    const data = createSampleData();
    for (const expectedRevision of [3, undefined]) expect(applyLayoutCommand(data, command('world.add', { objectId: 'object-new', facilityId: 'hall-new', assetKey: 'hall', x: 28, y: 20, expectedRevision }), context(data)).error?.code).toBe('CONFLICT');
  });
  it('creates distinct persistent facility labels even after a numbered facility is removed', () => {
    const data = createSampleData();
    const add = (data, id, x) => applyLayoutCommand(data, command('world.add', { objectId: `object-${id}`, facilityId: id, assetKey: 'hall', x, y: 20 }), context(data)).data.nextData;
    const first = add(data, 'hall-new', 28), second = add(first, 'hall-next', 29);
    expect(first.facilities.at(-1).name).toBe('Community hall 2');
    expect(second.facilities.at(-1).name).toBe('Community hall 3');
    const removed = applyLayoutCommand(second, command('world.remove', { objectId: 'object-hall-new', expectedRevision: 4 }), context(data)).data.nextData;
    expect(add(removed, 'hall-final', 30).facilities.at(-1).name).toBe('Community hall 4');
  });
  it('rejects invalid coordinates at every edge and allows all four legal corners', () => {
    for (const [x, y] of [[0, 0], [29, 0], [0, 21], [29, 21]]) expect(validatePlacement([], { x, y, width: 3, height: 3 }).valid).toBe(true);
    for (const patch of [{ x: -1 }, { y: -1 }, { x: 30 }, { y: 22 }, { x: NaN }, { y: Infinity }, { x: '1' }, { height: 0 }, { height: 1.5 }]) expect(validatePlacement([], { x: 0, y: 0, width: 3, height: 3, ...patch }).valid).toBe(false);
  });
  it('validates catalog identities and actor authority without changing input data', () => {
    const data = createSampleData(), before = structuredClone(data);
    const input = { objectId: 'new-object', facilityId: 'new-facility', assetKey: 'lamp', x: 28, y: 20 };
    for (const patch of [{ assetKey: 'unknown' }, { objectId: '' }, { objectId: 'bad id' }, { facilityId: null }, { facilityId: 'lamp-01' }, { x: 3, y: 8 }]) expect(applyLayoutCommand(data, command('world.add', { ...input, ...patch }), context(data)).error).not.toBeNull();
    for (const actor of [data.profiles[0], { ...data.profiles[1], role: 'resident' }, { ...data.profiles[1], id: 'missing' }]) expect(applyLayoutCommand(data, command('world.add', input), { actor, revision: 4 }).error.code).toBe('FORBIDDEN');
    expect(data).toEqual(before);
    const house = applyLayoutCommand(data, command('world.add', { ...input, assetKey: 'house', facilityId: null }), context(data));
    expect(house.data.result).toMatchObject({ width: 3, height: 3, facilityId: null });
    expect(house.data.nextData.facilities).toEqual(data.facilities);
  });
  it('rejects stale removals, missing targets and invalid moves atomically', () => {
    const data = createSampleData(), before = structuredClone(data);
    for (const expectedRevision of [undefined, 3, '4']) expect(applyLayoutCommand(data, command('world.remove', { objectId: 'object-hall-01', expectedRevision }), context(data)).error.code).toBe('CONFLICT');
    expect(applyLayoutCommand(data, command('world.move', { objectId: 'missing', expectedRevision: 4 }), context(data)).error.code).toBe('NOT_FOUND');
    expect(applyLayoutCommand(data, command('world.move', { objectId: 'object-hall-01', x: 3, y: 8, expectedRevision: 4 }), context(data)).error.code).toBe('VALIDATION_ERROR');
    expect(data).toEqual(before);
  });
  it.each(['draft', 'published', 'cancelled', 'completed'])('blocks removal for %s activity references', status => {
    const data = createSampleData(); data.activities[0].status = status;
    expect(applyLayoutCommand(data, command('world.remove', { objectId: 'object-park-01', expectedRevision: 4 }), context(data)).error.code).toBe('REFERENCED');
  });
  it('requires integer full footprints within bounds and permits touching edges', () => {
    const rect = { objectId: 'a', x: 0, y: 0, width: 3, height: 3 };
    expect(validatePlacement([], rect).valid).toBe(true);
    for (const patch of [{ x: -.1 }, { x: 30 }, { y: 22 }, { x: .5 }, { width: 0 }]) expect(validatePlacement([], { ...rect, ...patch }).valid).toBe(false);
    expect(validatePlacement([rect], { ...rect, objectId: 'b', x: 3 }).valid).toBe(true);
    expect(validatePlacement([rect], { ...rect, objectId: 'b', x: 2 }).valid).toBe(false);
    expect(validatePlacement([rect], rect, { excludeObjectId: 'a' }).valid).toBe(true);
  });
  it('adds facility/object atomically and moves preserve both IDs with revision protection', () => {
    const data = createSampleData();
    const added = applyLayoutCommand(data, command('world.add', { objectId: 'new-lamp', facilityId: 'lamp-new', assetKey: 'lamp', x: 28, y: 20 }), context(data));
    expect(added.error).toBeNull();
    expect(added.data.nextData.facilities.find(row => row.id === 'lamp-new').reportable).toBe(true);
    const moved = applyLayoutCommand(added.data.nextData, command('world.move', { objectId: 'new-lamp', x: 29, y: 20, expectedRevision: 4 }), context(data));
    expect(moved.data.result).toMatchObject({ objectId: 'new-lamp', facilityId: 'lamp-new', x: 29 });
    expect(applyLayoutCommand(data, command('world.move', { objectId: data.layout[0].objectId, x: 1, y: 1, expectedRevision: 2 }), context(data)).error.code).toBe('CONFLICT');
  });
  it('blocks every historical report/activity reference and removes unreferenced pairs together', () => {
    const data = createSampleData(); data.complaints[0].status = 'resolved'; data.activities[0].status = 'cancelled';
    expect(getRemovalBlockers(data, 'object-lamp-01').length).toBeGreaterThan(0);
    expect(getRemovalBlockers(data, 'object-park-01').length).toBeGreaterThan(0);
    expect(applyLayoutCommand(data, command('world.remove', { objectId: 'object-lamp-01', expectedRevision: 4 }), context(data)).error.code).toBe('REFERENCED');
    const removed = applyLayoutCommand(data, command('world.remove', { objectId: 'object-hall-01', expectedRevision: 4 }), context(data));
    expect(removed.error).toBeNull(); expect(removed.data.nextData.facilities.some(row => row.id === 'hall-01')).toBe(false);
    expect(removed.data.nextData.layout.some(row => row.facilityId === 'hall-01')).toBe(false);
  });
});
