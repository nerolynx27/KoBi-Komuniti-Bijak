import { test, expect } from '@playwright/test';
import { openPart3, readPart3Bytes } from '../helpers/part3.js';

test('main entry ships the reviewed SDP dashboard and preserves saved records', async ({ page }) => {
  const errors = [], failed = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('requestfailed', request => failed.push(request.url()));
  page.on('response', response => { if (response.status() >= 400) failed.push(response.url()); });
  await openPart3(page, 'sdp');
  await expect(page.locator('.sdp-dashboard')).toBeVisible();
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('.staff-destinations')).toHaveCount(0);
  await expect(page.locator('.sdp-bottom-nav a')).toHaveCount(4);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: test.info().outputPath('sdp-main.png'), fullPage: true });
  const bytes = await readPart3Bytes(page);
  await page.reload();
  expect(await readPart3Bytes(page)).toBe(bytes);
  expect(await page.evaluate(() => localStorage.getItem('kobi.sdp-workspace.v1'))).toBeNull();
  await page.locator('.sdp-report-priority h3 a').click();
  await page.getByLabel(/^Action note/).fill('Production integration inspection assigned.');
  await page.getByRole('button', { name: 'Start work', exact: true }).click();
  await page.getByRole('navigation', { name: 'SDP navigation' }).getByRole('link', { name: 'Workspace', exact: true }).click();
  await expect(page.locator('[data-metric="progress"] .sdp-metric-value')).toHaveText('2');
  await page.reload();
  await expect(page.locator('[data-metric="progress"] .sdp-metric-value')).toHaveText('2');
  await page.getByRole('button', { name: 'Open app menu', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Presentation Studio', exact: true })).toBeVisible();
  await page.getByRole('button', { name: /^RESIDENT VIEW/ }).click();
  await expect(page.locator('.resident-shell')).toBeVisible();
  expect(errors).toEqual([]);
  expect(failed).toEqual([]);
});
test('main staff navigation guards unsaved input and reset remains explicit', async ({ page }) => {
  await openPart3(page, 'sdp');
  const navigation = page.getByRole('navigation', { name: 'SDP navigation' });
  await navigation.getByRole('link', { name: 'Activities', exact: true }).click();
  await page.getByRole('link', { name: 'New activity', exact: true }).click();
  await page.getByLabel(/^Title/).fill('Keep this unsaved event');
  await navigation.getByRole('link', { name: 'Workspace', exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Keep editing', exact: true }).click();
  await expect(page.getByLabel(/^Title/)).toHaveValue('Keep this unsaved event');
  await navigation.getByRole('link', { name: 'Workspace', exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Discard changes', exact: true }).click();
  const bytes = await readPart3Bytes(page);
  await page.getByRole('button', { name: 'Open app menu', exact: true }).click();
  await page.getByRole('button', { name: 'Reset demo data', exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Cancel', exact: true }).click();
  expect(await readPart3Bytes(page)).toBe(bytes);
  for (const name of ['Reports', 'Activities', 'World editor', 'Workspace']) {
    await navigation.getByRole('link', { name, exact: true }).click();
    await page.reload();
    await expect(navigation.getByRole('link', { name, exact: true })).toHaveAttribute('aria-current', 'page');
  }
  await page.getByRole('button', { name: 'Open app menu', exact: true }).click();
  await page.getByRole('button', { name: 'Presentation Studio', exact: true }).click();
  await expect(page).toHaveURL(/#presentation$/);
});
