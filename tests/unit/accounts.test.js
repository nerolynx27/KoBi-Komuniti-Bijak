import { expect, it } from 'vitest';
import { createSampleData } from '../../src/lib/demoSamples.js';
import { applyAccountCommand, validateAccountForm } from '../../src/features/account/accountCommands.js';
it('validates demo form boundaries without storing passwords', () => {
  const values = { displayName: 'Alex', email: 'alex@example.com', password: 'x', confirmation: 'x' };
  expect(validateAccountForm(values, true)).toEqual({});
  for (const name of ['a', 'x'.repeat(61)]) expect(validateAccountForm({ ...values, displayName: name }, true).displayName).toBeTruthy();
  for (const name of ['ab', 'x'.repeat(60)]) expect(validateAccountForm({ ...values, displayName: name }, true).displayName).toBeUndefined();
  expect(validateAccountForm({ ...values, email: 'bad', password: '', confirmation: 'no' }, true)).toMatchObject({ email: expect.any(String), password: expect.any(String), confirmation: expect.any(String) });
  const data = createSampleData();
  const result = applyAccountCommand(data, { type: 'profile.prepareResident', input: values }, { actor: data.profiles[0] });
  expect(result.error).toBeNull();
  expect(JSON.stringify(result.data.nextData)).not.toContain('confirmation');
  expect(result.data.nextData.profiles[0].email).toBe(values.email);
  expect(applyAccountCommand(data, { type: 'profile.prepareResident', input: values }, { actor: data.profiles[1] }).error.code).toBe('FORBIDDEN');
  expect(applyAccountCommand(data, { type: 'profile.prepareResident', input: values }, { actor: { ...data.profiles[1], role: 'resident' } }).error.code).toBe('FORBIDDEN');
  expect(applyAccountCommand(data, { type: 'profile.unknown', input: values }, { actor: data.profiles[0] }).error.code).toBe('UNAVAILABLE');
});
