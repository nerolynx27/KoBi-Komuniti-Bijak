import { describe, expect, it } from 'vitest';
import {
  ACTIVITIES_SANDBOX_STORAGE_KEY,
  INITIAL_GALLERY_ITEMS,
  INITIAL_SANDBOX_ACTIVITIES,
  filterSandboxActivities,
  joinSandboxActivity,
  leaveSandboxActivity,
} from '../../src/dev/activities-sandbox/activitiesSandboxData.js';

describe('activitiesSandboxData', () => {
  it('provides colour-classified Community and Recycling activities and Gallery items', () => {
    expect(ACTIVITIES_SANDBOX_STORAGE_KEY).toBe('kobi.activities.sandbox.v1');
    expect(INITIAL_SANDBOX_ACTIVITIES.length).toBeGreaterThanOrEqual(3);
    expect(
      INITIAL_SANDBOX_ACTIVITIES.some(
        a => a.category === 'community' && a.noteTheme === 'gold'
      )
    ).toBe(true);
    expect(
      INITIAL_SANDBOX_ACTIVITIES.some(a => a.category === 'recycling')
    ).toBe(true);
    expect(INITIAL_GALLERY_ITEMS.map(g => g.code)).toEqual([
      'G1',
      'G2',
      'G3',
      'G4',
    ]);
  });

  it('joins and leaves an activity idempotently while updating participantCount', () => {
    const target = INITIAL_SANDBOX_ACTIVITIES.find(a => !a.joined);
    const afterJoin = joinSandboxActivity(INITIAL_SANDBOX_ACTIVITIES, target.id);
    const updated = afterJoin.find(a => a.id === target.id);
    expect(updated.joined).toBe(true);
    expect(updated.participantCount).toBe(target.participantCount + 1);

    // Idempotent second join
    const afterDuplicateJoin = joinSandboxActivity(afterJoin, target.id);
    expect(
      afterDuplicateJoin.find(a => a.id === target.id).participantCount
    ).toBe(target.participantCount + 1);

    // Leave
    const afterLeave = leaveSandboxActivity(afterDuplicateJoin, target.id);
    const left = afterLeave.find(a => a.id === target.id);
    expect(left.joined).toBe(false);
    expect(left.participantCount).toBe(target.participantCount);

    // Idempotent second leave
    const afterDuplicateLeave = leaveSandboxActivity(afterLeave, target.id);
    expect(
      afterDuplicateLeave.find(a => a.id === target.id).participantCount
    ).toBe(target.participantCount);
  });

  it('filters activities by all, community, recycling, and joined', () => {
    expect(
      filterSandboxActivities(INITIAL_SANDBOX_ACTIVITIES, 'all')
    ).toHaveLength(INITIAL_SANDBOX_ACTIVITIES.length);
    expect(
      filterSandboxActivities(INITIAL_SANDBOX_ACTIVITIES, 'community').every(
        a => a.category === 'community'
      )
    ).toBe(true);
    expect(
      filterSandboxActivities(INITIAL_SANDBOX_ACTIVITIES, 'recycling').every(
        a => a.category === 'recycling'
      )
    ).toBe(true);
    expect(
      filterSandboxActivities(INITIAL_SANDBOX_ACTIVITIES, 'joined').every(
        a => a.joined
      )
    ).toBe(true);
  });
});
