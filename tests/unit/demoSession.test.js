import { expect, it } from 'vitest';
import { createDemoSession } from '../../src/app/demoSession.js';
it('uses one transient actor source and notifies only real persona changes', () => {
  const session = createDemoSession(); let changes = 0;
  const stop = session.subscribe(() => changes++);
  expect(session.getActor().role).toBe('resident');
  session.setView('sdp'); session.setView('sdp');
  expect(session.getActor().role).toBe('staff'); expect(changes).toBe(1);
  stop(); session.setView('resident'); expect(changes).toBe(1);
});
