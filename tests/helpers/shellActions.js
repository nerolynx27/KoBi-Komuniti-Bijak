import { expect } from '@playwright/test';
import { readPart3Envelope } from './part3.js';

export const button = (page, name) => page.getByRole('button', { name, exact: true });
export const link = (page, name) => page.getByRole('link', { name, exact: true });
export const nav = (page, name) => page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name, exact: true });
export async function enterStaffWorkspace(page) {
  await button(page, 'Open app menu').click();
  await page.getByRole('button', { name: /^SDP WORKSPACE/ }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('SDP workspace — Elmina');
}
export async function openResetDemo(page) {
  const reset = button(page, 'Reset demo');
  if (await reset.isVisible()) await reset.click();
  else { await button(page, 'Open app menu').click(); await button(page, 'Reset demo data').click(); }
}
export async function commit(page, action) {
  const before = await readPart3Envelope(page);
  await action();
  await expect.poll(async () => (await readPart3Envelope(page)).revision).toBe(before.revision + 1);
  return readPart3Envelope(page);
}
export async function enterEditor(page) {
  await button(page, 'Enter SDP demo workspace').click();
  await link(page, 'Enter editor').click();
  await button(page, 'Enter editor').click();
}
export async function coordinates(page, x, y) {
  await page.getByLabel(/^X tile/).fill(String(x));
  await page.getByLabel(/^Y tile/).fill(String(y));
}
export async function addComponent(page, label, x, y) {
  const before = await readPart3Envelope(page);
  await button(page, 'Add component').click();
  await expect(page.getByRole('dialog').locator('.catalog-card')).toHaveCount(7);
  await page.getByRole('dialog').getByRole('button', { name: new RegExp(`^${label}`) }).click();
  await coordinates(page, x, y);
  const after = await commit(page, () => button(page, 'Place component').click());
  return after.data.layout.find(row => !before.data.layout.some(old => old.objectId === row.objectId));
}
export async function fillActivity(page, title, facilityId = 'park-01') {
  await page.getByLabel(/^Title/).fill(title);
  await page.getByLabel(/^Description/).fill('Meet neighbours for a community morning at this shared place.');
  await page.getByLabel(/^Location/).selectOption(facilityId);
  await page.getByLabel(/^Start date/).fill('2026-10-25');
  await page.getByLabel(/^Start time/).fill('09:30');
  await page.getByLabel(/^End date/).fill('2026-10-25');
  await page.getByLabel(/^End time/).fill('11:00');
  await page.getByLabel('Instructions', { exact: true }).fill('Bring a water bottle.');
}

export async function exitStaffWorkspace(page) {
  await button(page, 'Open app menu').click();
  await button(page, 'Exit SDP workspace').click();
}
