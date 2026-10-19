import { test, expect } from '@playwright/test';

const saved = page => page.evaluate(() => JSON.parse(localStorage.getItem('kobi.demo.v1')));
async function editor(page) {
  await page.goto('/#map');
  await page.getByRole('button', { name: 'Enter SDP demo workspace', exact: true }).click();
  await page.goto('/#sdp/world');
  await page.getByRole('button', { name: 'Enter editor', exact: true }).click();
}
async function catalog(page, label) {
  await page.getByRole('button', { name: 'Add component', exact: true }).click();
  await expect(page.getByRole('dialog').locator('.catalog-card')).toHaveCount(7);
  await page.getByRole('dialog').getByRole('button', { name: new RegExp(`^${label}`) }).click();
}
async function coordinates(page, x, y) {
  await page.getByLabel(/^X tile/).fill(String(x)); await page.getByLabel(/^Y tile/).fill(String(y));
}

test('catalog placement preview, cancellation, storage retry, reload and facility pickers', async ({ page }) => {
  await editor(page);
  const before = await saved(page);
  await catalog(page, 'House'); await coordinates(page, 31, 23);
  await expect(page.locator('.schematic-ghost')).toHaveClass(/is-invalid/);
  await expect(page.getByRole('button', { name: 'Place component', exact: true })).toBeDisabled();
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  expect(await saved(page)).toEqual(before);
  await catalog(page, 'Community hall'); await coordinates(page, 29, 20);
  await expect(page.locator('.schematic-ghost')).toHaveClass(/is-valid/);
  await page.evaluate(() => { window.worldSetItem = Storage.prototype.setItem; Storage.prototype.setItem = () => { throw new DOMException('Full', 'QuotaExceededError'); }; });
  await page.getByRole('button', { name: 'Place component', exact: true }).click();
  expect(await saved(page)).toEqual(before);
  await expect(page.getByLabel(/^X tile/)).toHaveValue('29');
  await expect(page.locator('.schematic-ghost')).toBeVisible();
  await page.evaluate(() => { Storage.prototype.setItem = window.worldSetItem; });
  await page.getByRole('button', { name: 'Retry storage', exact: true }).first().click();
  await expect(page.locator('.placement-form')).toHaveCount(0);
  const added = (await saved(page)).data.layout.find(row => !before.data.layout.some(old => old.objectId === row.objectId));
  expect(added).toMatchObject({ assetKey: 'hall', x: 29, y: 20 });
  expect((await saved(page)).data.facilities.filter(row => row.id === added.facilityId)).toHaveLength(1);
  await page.reload();
  expect((await saved(page)).data.layout.filter(row => row.objectId === added.objectId)).toHaveLength(1);
  expect((await saved(page)).data.facilities.find(row => row.id === added.facilityId).name).toBe('Community hall 2');
  await page.goto('/#reports/new');
  await page.getByRole('button', { name: 'Switch to resident demo', exact: true }).click();
  await expect(page.getByLabel(/^Facility/).locator(`option[value="${added.facilityId}"]`)).toHaveCount(1);
  await page.getByRole('button', { name: 'Enter SDP demo workspace', exact: true }).click();
  await page.goto('/#sdp/activities/new'); await expect(page.getByLabel(/^Location/).locator(`option[value="${added.facilityId}"]`)).toHaveCount(1);
});

test('move preserves identity, cancel and exit discard previews, references block remove, confirmed pair removal focuses add', async ({ page }) => {
  await editor(page);
  await page.getByRole('button', { name: /^Walkway lamp/ }).click();
  await expect(page.getByText('Removal blocked', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Remove', exact: true })).toBeDisabled();
  const before = await saved(page);
  await page.getByRole('button', { name: 'Move', exact: true }).click(); await coordinates(page, 28, 20);
  await page.getByRole('button', { name: 'Cancel', exact: true }).click(); expect(await saved(page)).toEqual(before);
  await page.getByRole('button', { name: 'Move', exact: true }).click(); await coordinates(page, 28, 20);
  await page.getByRole('button', { name: 'Confirm move', exact: true }).click();
  expect((await saved(page)).data.layout.find(row => row.objectId === 'object-lamp-01')).toEqual({ ...before.data.layout.find(row => row.objectId === 'object-lamp-01'), x: 28, y: 20 });
  await page.getByRole('button', { name: /^Community hall/ }).click();
  await page.getByRole('button', { name: 'Remove', exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Cancel', exact: true }).click();
  expect((await saved(page)).data.facilities.some(row => row.id === 'hall-01')).toBe(true);
  await page.getByRole('button', { name: 'Remove', exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Remove component', exact: true }).click();
  const removed = await saved(page);
  expect(removed.data.facilities.some(row => row.id === 'hall-01')).toBe(false);
  expect(removed.data.layout.some(row => row.objectId === 'object-hall-01')).toBe(false);
  await expect(page.getByRole('heading', { name: 'Community hall', exact: true })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Add component', exact: true })).toBeFocused();
  await catalog(page, 'Tree'); await coordinates(page, 30, 20);
  await page.getByRole('button', { name: 'Exit editor', exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Discard changes', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Enter editor', exact: true })).toBeVisible();
  expect(await saved(page)).toEqual(removed);
});

test('stale selection cannot remove a facility after external reload', async ({ page }) => {
  await editor(page); await page.getByRole('button', { name: /^Community hall/ }).click();
  const external = await saved(page); external.revision += 1;
  await page.evaluate(envelope => { localStorage.setItem('kobi.demo.v1', JSON.stringify(envelope)); window.dispatchEvent(new StorageEvent('storage', { key: 'kobi.demo.v1' })); }, external);
  await page.getByRole('button', { name: 'Reload saved data', exact: true }).click();
  await page.getByRole('button', { name: 'Remove', exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Remove component', exact: true }).click();
  await expect(page.getByRole('dialog')).toContainText('The saved layout changed.');
  expect(await saved(page)).toEqual(external);
});

test('failed move and remove preserve both records until retry commits once', async ({ page }) => {
  await editor(page); await page.getByRole('button', { name: /^Community hall/ }).click();
  const before = await saved(page);
  await page.getByRole('button', { name: 'Move', exact: true }).click(); await coordinates(page, 28, 20);
  await page.evaluate(() => { window.worldSetItem = Storage.prototype.setItem; Storage.prototype.setItem = () => { throw new DOMException('Full', 'QuotaExceededError'); }; });
  await page.getByRole('button', { name: 'Confirm move', exact: true }).click();
  expect(await saved(page)).toEqual(before);
  await expect(page.getByLabel(/^X tile/)).toHaveValue('28');
  await page.evaluate(() => { Storage.prototype.setItem = window.worldSetItem; });
  await page.getByRole('button', { name: 'Retry storage', exact: true }).first().click();
  await expect(page.locator('.placement-form')).toHaveCount(0);
  const moved = await saved(page);
  expect(moved.data.layout.find(row => row.objectId === 'object-hall-01')).toMatchObject({ facilityId: 'hall-01', x: 28, y: 20 });
  await page.getByRole('button', { name: 'Remove', exact: true }).click();
  await page.evaluate(() => { Storage.prototype.setItem = () => { throw new DOMException('Full', 'QuotaExceededError'); }; });
  await page.getByRole('dialog').getByRole('button', { name: 'Remove component', exact: true }).click();
  expect(await saved(page)).toEqual(moved);
  await page.evaluate(() => { Storage.prototype.setItem = window.worldSetItem; });
  await page.getByRole('dialog').getByRole('button', { name: 'Retry storage', exact: true }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  const removed = await saved(page);
  expect(removed.revision).toBe(moved.revision + 1);
  expect(removed.data.layout.some(row => row.facilityId === 'hall-01')).toBe(false);
  expect(removed.data.facilities.some(row => row.id === 'hall-01')).toBe(false);
});
