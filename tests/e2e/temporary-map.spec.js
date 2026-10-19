import { test, expect } from '@playwright/test';

const saved = page => page.evaluate(() => JSON.parse(localStorage.getItem('kobi.demo.v1')));

test('public sheets, report prefill and explicit colocated activity choice', async ({ page }) => {
  await page.goto('/#map');
  for (const name of ['Walkway lamp', 'Garden bench', 'Community garden', 'Community hall', 'Recycling point', 'Neighbourhood house']) {
    await page.getByRole('button', { name: new RegExp(`^${name}`) }).click();
    const sheet = page.getByRole('dialog');
    await expect(sheet.getByRole('heading', { name, exact: true })).toBeVisible();
    await expect(sheet).not.toContainText('Alex Tan');
    await expect(sheet).not.toContainText('The walkway lamp is not lighting up');
    await expect(sheet.getByRole('button', { name: 'Report a problem', exact: true })).toHaveCount(name === 'Neighbourhood house' ? 0 : 1);
    await sheet.getByRole('button', { name: 'Close', exact: true }).click();
  }
  await page.getByRole('button', { name: /^Walkway lamp/ }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Report a problem', exact: true }).click();
  await expect(page.getByLabel(/^Facility/)).toHaveValue('lamp-01');
  await page.goto('/#map');
  const envelope = await saved(page);
  envelope.data.activities.push({ ...envelope.data.activities[0], id: '00000000-0000-4000-8000-000000000032', title: 'Garden neighbours together' });
  await page.evaluate(envelope => localStorage.setItem('kobi.demo.v1', JSON.stringify(envelope)), envelope);
  await page.reload();
  await page.getByRole('button', { name: /^Community garden/ }).click();
  await expect(page.getByRole('dialog').getByRole('heading', { name: 'Choose an activity', exact: true })).toBeVisible();
  const second = page.getByRole('dialog').locator('.record-row').filter({ hasText: 'Garden neighbours together' });
  await second.getByRole('button', { name: 'View activity', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Garden neighbours together', exact: true })).toBeVisible();
  await expect(page).toHaveURL(/#activities\/00000000-0000-4000-8000-000000000032$/);
});

test('report and activity map links focus current objects; zoom scroll stays internal and resets', async ({ page }) => {
  await page.goto('/#map');
  const envelope = await saved(page);
  envelope.data.layout.find(row => row.facilityId === 'lamp-01').x = 29;
  await page.evaluate(envelope => localStorage.setItem('kobi.demo.v1', JSON.stringify(envelope)), envelope);
  await page.goto(`/#reports/${envelope.data.complaints[0].id}`); await page.reload();
  await page.getByRole('link', { name: 'View on map', exact: true }).click();
  await expect(page.getByRole('button', { name: /^Walkway lamp/ })).toBeFocused();
  await expect(page.locator('.schematic-object.is-selected rect')).toHaveAttribute('x', '580');
  await page.goto(`/#activities/${envelope.data.activities[0].id}`);
  await page.getByRole('button', { name: 'View on map', exact: true }).click();
  await expect(page.getByRole('button', { name: /^Community garden/ })).toBeFocused();
  await expect(page.getByRole('button', { name: 'Zoom out', exact: true })).toBeDisabled();
  for (let count = 0; count < 8; count++) await page.getByRole('button', { name: 'Zoom in', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Zoom in', exact: true })).toBeDisabled();
  await expect(page.locator('.schematic-scale')).toHaveText('300%');
  expect(await page.locator('.schematic-viewport').evaluate(view => view.scrollWidth > view.clientWidth)).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.locator('.schematic-viewport').evaluate(view => { view.scrollLeft = 100; view.scrollTop = 100; });
  await page.getByRole('button', { name: 'Reset view', exact: true }).click();
  await expect(page.locator('.schematic-scale')).toHaveText('100%');
  expect(await page.locator('.schematic-viewport').evaluate(view => [view.scrollLeft, view.scrollTop])).toEqual([0, 0]);
});
