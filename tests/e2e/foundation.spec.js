import { test, expect } from '@playwright/test';

const key = 'kobi.demo.v1';

test('an explicit map URL takes precedence over a remembered SDP workspace', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Enter SDP demo workspace' }).click();
  await page.goto('/#map');
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Map', exact: true })).toBeVisible();
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'SDP workspace', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Exit SDP demo workspace' }).click();
  await expect(page.getByRole('heading', { name: 'Map', exact: true })).toBeVisible();
});

test('navigation, SDP entry/exit and preference survive a reload', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Map', exact: true })).toBeVisible();
  for (const label of ['Reports', 'Activities', 'Profile', 'Map']) {
    await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: label, exact: true }).click();
    await expect(page.getByRole('heading', { level: 1, name: label, exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: label, exact: true }).first()).toHaveAttribute('aria-current', 'page');
  }
  await page.getByRole('button', { name: 'Enter SDP demo workspace' }).click();
  await expect(page.getByRole('heading', { name: 'SDP workspace', exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'SDP workspace', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Exit SDP demo workspace' }).click();
  await expect(page.getByRole('heading', { name: 'Map', exact: true })).toBeVisible();
});

test('reset cancellation preserves records; confirmation restores all samples and focus', async ({ page }) => {
  await page.goto('/#profile');
  await page.getByLabel('Remember demo workspace').click();
  const before = await page.evaluate(key => localStorage.getItem(key), key);
  const opener = page.getByRole('button', { name: 'Reset demo', exact: true });
  await opener.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByRole('button', { name: 'Cancel', exact: true })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(opener).toBeFocused();
  expect(await page.evaluate(key => localStorage.getItem(key), key)).toBe(before);
  await opener.click();
  await dialog.getByRole('button', { name: 'Reset demo', exact: true }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Demo reset' })).toBeVisible();
  await expect(page.getByLabel('Remember demo workspace')).toBeChecked();
  // Reset remounts draft-owning screens; restore the stable page heading.
  await expect(page.getByRole('heading', { level: 1, name: 'Profile', exact: true })).toBeFocused();
});

test('corruption is recoverable and never overwritten before confirmed reset', async ({ page }) => {
  await page.addInitScript(key => { localStorage.setItem(key, '{broken'); }, key);
  await page.goto('/');
  await expect(page.getByRole('alert')).toContainText('Stored demo could not be read');
  await page.getByRole('button', { name: 'Retry storage' }).click();
  expect(await page.evaluate(key => localStorage.getItem(key), key)).toBe('{broken');
  await page.getByRole('button', { name: 'Reset demo', exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Reset demo', exact: true }).click();
  await expect(page.getByRole('alert')).toHaveCount(0);
  expect(JSON.parse(await page.evaluate(key => localStorage.getItem(key), key)).version).toBe(2);
});

test('a failed save keeps committed preference and recovery is honest', async ({ page }) => {
  await page.goto('/#profile');
  await page.evaluate(() => { window.originalSetItem = Storage.prototype.setItem; Storage.prototype.setItem = () => { throw new DOMException('Full', 'QuotaExceededError'); }; });
  await page.getByLabel('Remember demo workspace').click();
  await expect(page.getByRole('alert')).toContainText('Changes were not saved');
  await expect(page.getByLabel('Remember demo workspace')).toBeChecked();
  await page.evaluate(() => { Storage.prototype.setItem = window.originalSetItem; });
  await page.getByRole('button', { name: 'Retry storage' }).click();
  await expect(page.getByRole('alert')).toHaveCount(0);
  await expect(page.getByLabel('Remember demo workspace')).not.toBeChecked();
  await page.reload();
  await expect(page.getByLabel('Remember demo workspace')).not.toBeChecked();
});

test('specimen uses guarded loading controls and a single keyboard-safe modal', async ({ page }) => {
  await page.goto('/#design-system');
  const action = page.getByRole('button', { name: 'Run simulated save', exact: true });
  const widthBefore = await action.evaluate(element => element.getBoundingClientRect().width);
  await action.click();
  const pending = page.getByRole('button', { name: 'Saving…', exact: true });
  await expect(pending).toBeFocused();
  expect(await pending.evaluate(element => element.getBoundingClientRect().width)).toBe(widthBefore);
  await pending.click();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('status').filter({ hasText: 'Simulated saves: 1' })).toBeVisible();
  const sheetOpener = page.getByRole('button', { name: 'Open specimen sheet' });
  await sheetOpener.click();
  await page.getByLabel('Example note').fill('Keep this note after cancelling confirmation.');
  await page.getByRole('button', { name: 'Reset sheet example' }).click();
  await expect(page.locator('dialog[open]')).toHaveCount(1);
  await expect(page.getByRole('button', { name: 'Cancel', exact: true })).toBeFocused();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Cancel', exact: true })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Reset sheet example' })).toBeFocused();
  await expect(page.getByLabel('Example note')).toHaveValue('Keep this note after cancelling confirmation.');
  await page.keyboard.press('Escape');
  await expect(sheetOpener).toBeFocused();
});

test('unavailable storage, future formats and failed reset retain honest recovery', async ({ page }) => {
  await page.addInitScript(() => { Storage.prototype.getItem = () => { throw new DOMException('Blocked', 'SecurityError'); }; Storage.prototype.setItem = () => { throw new DOMException('Blocked', 'SecurityError'); }; });
  await page.goto('/');
  await expect(page.getByRole('alert')).toContainText('Browser storage is unavailable');
  await expect(page.getByText('Not saved · recovery required')).toBeVisible();
  await page.getByRole('button', { name: 'Reset demo', exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Reset demo', exact: true }).click();
  await expect(page.getByRole('dialog').getByRole('alert')).toContainText('Changes were not saved');
  await expect(page.getByRole('status').filter({ hasText: 'Demo reset' })).toHaveCount(0);
  await page.keyboard.press('Escape');
});

test('valid custom records survive reload and a future version stays untouched', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(key => {
    const stored = JSON.parse(localStorage.getItem(key));
    stored.data.complaints[0].description = 'A retained sample description modified before reload.';
    localStorage.setItem(key, JSON.stringify(stored));
  }, key);
  await page.goto('/#reports');
  await page.reload();
  await page.getByRole('button', { name: 'Received', exact: true }).click();
  await expect(page.getByText('A retained sample description modified before reload.')).toBeVisible();
  const future = '{"version":999,"data":{"preserve":"future records"}}';
  await page.evaluate(([key, raw]) => localStorage.setItem(key, raw), [key, future]);
  await page.reload();
  await expect(page.getByRole('alert')).toContainText('stored demo version is unsupported');
  await page.getByRole('button', { name: 'Retry storage' }).click();
  expect(await page.evaluate(key => localStorage.getItem(key), key)).toBe(future);
});
