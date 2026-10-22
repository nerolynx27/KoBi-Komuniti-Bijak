import { test, expect } from '@playwright/test';
import { createSampleData } from '../../src/lib/demoSamples.js';
import { createV1Fixture } from '../helpers/demoFixtures.js';
import { migrateV1 } from '../../src/lib/demoSchema.js';

const stored = page => page.evaluate(() => JSON.parse(localStorage.getItem('kobi.demo.v1')));
test.use({ hasTouch: true, isMobile: true });

for (const width of [320, 390, 1280]) test(`approved map assets open the matching report form and private homes remain private at ${width}`, async ({ page }) => {
  await page.setViewportSize({ width, height: 844 });
  await page.goto('/#map');
  await expect(page.locator('.approved-map')).toBeVisible();
  await expect(page.locator('.approved-map-hit')).toHaveCount(54);
  for (const facility of ['hall-01', 'surau-01', 'park-01', 'lake-01', 'recycling-01', ...Array.from({ length: 12 }, (_, i) => `lamp-${String(i + 1).padStart(2, '0')}`)]) {
    await page.locator(`#object-${facility}`).tap();
    await expect(page.getByRole('button', { name: 'Report a problem', exact: true }), `Map tap on ${facility}`).toBeVisible({ timeout: 5000 });
    await page.getByRole('button', { name: 'Report a problem', exact: true }).click();
    await expect(page.getByLabel('Facility', { exact: true })).toHaveValue(facility);
    await page.goto('/#map');
  }
  await page.locator('#object-house-01').press('Enter');
  await expect(page.getByText('My House', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Report a problem', exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'Close sheet', exact: true }).click();
  await expect(page.locator('#object-house-01')).toBeFocused();
  const treeFill = await page.locator('#object-tree-02 > g rect').first().evaluate(el => getComputedStyle(el).fill);
  await page.locator('#object-tree-02').press('Enter');
  await page.getByRole('button', { name: 'Close sheet', exact: true }).click();
  expect(await page.locator('#object-tree-02 > g rect').first().evaluate(el => getComputedStyle(el).fill)).toBe(treeFill);
  await page.screenshot({ path: test.info().outputPath('integrated-map-mobile.png'), fullPage: true });
});

test('a newly added streetlight report survives reload and changes its condition', async ({ page }) => {
  await page.goto('/#map');
  await page.locator('#object-lamp-12').click();
  await page.getByRole('button', { name: 'Report a problem', exact: true }).click();
  await expect(page.getByLabel('Facility', { exact: true })).toHaveValue('lamp-12');
  await page.getByLabel('Problem title', { exact: true }).fill('Streetlight needs attention');
  await page.getByLabel('Description', { exact: true }).fill('Sample map test: the light beside Jalan Frekuensi 4 is flickering.');
  await page.getByRole('button', { name: 'Send report', exact: true }).click();
  await expect.poll(async () => (await stored(page)).data.complaints.filter(c => c.facility_id === 'lamp-12').length).toBe(1);
  await page.reload();
  expect((await stored(page)).data.complaints.filter(c => c.facility_id === 'lamp-12')).toHaveLength(1);
  await page.goto('/#home');
  await expect(page.getByRole('link', { name: 'My reports: 3', exact:true })).toBeVisible();
  await expect(page.locator('.bulletin-update')).toContainText('Report received');
  await page.goto('/#map');
  await page.locator('#object-lamp-12').click();
  await expect(page.locator('.facility-condition')).toHaveText('Reported');
  await page.screenshot({ path: test.info().outputPath('integrated-light-report.png'), fullPage: true });
});

test('mobile map fits at reset and zoom reveals more detail without horizontal page overflow', async ({ page }) => {
  await page.goto('/#map');
  const viewport = page.locator('.schematic-viewport');
  expect(await viewport.evaluate(el => el.scrollWidth <= el.clientWidth + 1)).toBe(true);
  expect(await viewport.evaluate(el => el.scrollHeight <= el.clientHeight + 1)).toBe(true);
  await page.getByRole('button', { name: 'Zoom in', exact: true }).click();
  await expect(page.locator('.schematic-scale')).toHaveText('125%');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('button', { name: 'Find my house', exact: true }).click();
  await expect(page.locator('#object-house-01')).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Reset view', exact: true }).click();
  await expect(page.locator('.schematic-scale')).toHaveText('100%');
  await expect.poll(() => viewport.evaluate(el => [el.scrollLeft, el.scrollTop])).toEqual([0, 0]);
});

for (const [width, height] of [[320, 700], [390, 844], [1280, 800]]) {
  test(`full-screen route, fit, controls and Back at ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.goto('/#home');
    await page.getByRole('link', { name: 'Enter World', exact: true }).click();
    await expect(page.locator('.app-header, .bottom-nav, .page-heading, .local-footer')).toHaveCount(0);
    await expect(page.locator('.map-status, .schematic-hover-hud')).toHaveCount(0);
    const view = page.locator('.schematic-viewport');
    const box = await view.boundingBox();
    expect(box).toEqual({ x: 0, y: 0, width, height });
    const map = await page.locator('.approved-map').boundingBox();
    expect(map.width / map.height).toBeCloseTo(4 / 3, 2);
    expect(map.x).toBeGreaterThanOrEqual(0); expect(map.y).toBeGreaterThanOrEqual(0);
    expect(map.x + map.width).toBeLessThanOrEqual(width + 1);
    expect(map.y + map.height).toBeLessThanOrEqual(height + 1);
    const buttons = await page.locator('.schematic-controls > button').evaluateAll(elements => elements.map(el => {
      const r = el.getBoundingClientRect(); return { y:r.y, bottom:r.bottom, height:r.height, x:r.x, right:r.right };
    }));
    expect(buttons).toHaveLength(4);
    for (const b of buttons) { expect(b.y).toBe(buttons[0].y); expect(b.height).toBeGreaterThanOrEqual(44); expect(b.right).toBeLessThanOrEqual(width); }
    expect(await page.evaluate(() => [document.documentElement.scrollWidth <= innerWidth, document.documentElement.scrollHeight <= innerHeight])).toEqual([true,true]);
    await page.getByRole('button', { name: 'Zoom in', exact: true }).click();
    const zoomed = await page.locator('.approved-map').boundingBox(); expect(zoomed.width).toBeGreaterThan(map.width);
    await page.getByRole('button', { name: 'Find my house', exact: true }).click();
    await expect(page.locator('#object-house-01')).toHaveAttribute('aria-pressed','true');
    const homeBox = await page.locator('#object-house-01').boundingBox();
    expect(homeBox.x).toBeGreaterThanOrEqual(-1); expect(homeBox.x + homeBox.width).toBeLessThanOrEqual(width + 1);
    await page.getByRole('button', { name: 'Reset view', exact: true }).click();
    await expect(page.getByRole('button', {name:'Zoom out',exact:true})).toBeDisabled();
    await expect(page.locator('.approved-map')).toHaveCSS('width', `${map.width}px`);
    await page.screenshot({ path: test.info().outputPath(`fullscreen-${width}.png`) });
    await page.getByRole('button', { name: 'Back', exact: true }).click();
    await expect(page).toHaveURL(/#home$/);
    await expect(page.locator('.bottom-nav')).toBeVisible();
  });
}

for (const width of [320,390,1280]) test(`touch pan, zoom bounds, reset and keyboard sheets at ${width}`, async ({ page }) => {
  await page.setViewportSize({ width, height: 700 });
  await page.goto('/#map');
  for (let i=0; i<8; i++) await page.getByRole('button', {name:'Zoom in',exact:true}).click();
  await expect(page.getByRole('button', {name:'Zoom in',exact:true})).toBeDisabled();
  const view = page.locator('.schematic-viewport');
  const before = await view.evaluate(el => el.scrollLeft);
  const touch = await page.context().newCDPSession(page);
  await touch.send('Input.dispatchTouchEvent', {type:'touchStart',touchPoints:[{x:width/2,y:350}]});
  await touch.send('Input.dispatchTouchEvent', {type:'touchMove',touchPoints:[{x:width/2-100,y:310}]});
  await touch.send('Input.dispatchTouchEvent', {type:'touchEnd',touchPoints:[]});
  await expect.poll(() => view.evaluate(el => el.scrollLeft)).toBeGreaterThan(before + 50);
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await page.getByRole('button', {name:'Find my house',exact:true}).click();
  await expect(page.locator('#object-house-01')).toBeFocused();
  await page.getByRole('button', {name:'Reset view',exact:true}).click();
  await expect.poll(() => view.evaluate(el => [el.scrollLeft,el.scrollTop])).toEqual([0,0]);
  await page.locator('#object-hall-01').press('Enter');
  await expect(page.getByRole('button',{name:'Close sheet',exact:true})).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  expect(await page.getByRole('dialog').evaluate(el => el.contains(document.activeElement))).toBe(true);
  await page.keyboard.press('Escape');
  await expect(page.locator('#object-hall-01')).toBeFocused();
  await page.goto('/#map?facility=lamp-12');
  await expect(page.locator('#object-lamp-12')).toBeFocused();
});

test('untouched pilot migrates and persists without losing records, and edited approved removals stay removed', async ({ page }) => {
  const old = migrateV1(createV1Fixture());
  old.profiles[0].display_name = 'My saved profile';
  old.complaints[0].description = 'My saved report from the old neighbourhood.';
  await page.addInitScript(data => {
    if (!localStorage.getItem('kobi.demo.v1')) localStorage.setItem('kobi.demo.v1',JSON.stringify({version:2,revision:7,data}));
  },old);
  await page.goto('/#map');
  await expect(page.locator('.approved-map-hit')).toHaveCount(54);
  let saved = await stored(page);
  expect(saved.revision).toBe(7);
  expect(saved.data.complaints).toEqual(old.complaints);
  expect(saved.data.activities).toEqual(old.activities);
  expect(saved.data.profiles[0].display_name).toBe('My saved profile');
  await page.reload();
  expect((await stored(page))).toEqual(saved);
  // A later deliberate editor removal must never be inferred to be an old seed.
  await page.evaluate(() => {
    const data = JSON.parse(localStorage.getItem('kobi.demo.v1'));
    data.data.layout = data.data.layout.filter(o => o.objectId !== 'object-house-08');
    localStorage.setItem('kobi.demo.v1',JSON.stringify(data));
  });
  await page.reload();
  await expect(page.locator('#object-house-08')).toHaveCount(0);
  saved = await stored(page); expect(saved.data.complaints).toEqual(old.complaints);
});

test('approved artwork follows saved editor moves and new components are reportable', async ({ page }) => {
  const seed = createSampleData();
  seed.preferences.workspace = 'sdp';
  await page.addInitScript(data => {
    if (!localStorage.getItem('kobi.demo.v1')) localStorage.setItem('kobi.demo.v1', JSON.stringify({ version: 2, revision: 0, data }));
  }, seed);
  await page.goto('/#sdp/world');
  await page.getByRole('button', { name: 'Enter editor', exact: true }).click();
  await page.locator('.place-list').getByRole('button', { name: /^Community hall/ }).click();
  await page.getByRole('button', { name: 'Move', exact: true }).click();
  await page.getByLabel(/^X tile/).fill('26');
  await page.getByLabel(/^Y tile/).fill('18');
  await page.getByRole('button', { name: 'Confirm move', exact: true }).click();
  await expect(page.locator('#object-hall-01')).toHaveAttribute('transform', 'translate(100, 240)');
  await page.reload();
  await expect(page.locator('#object-hall-01')).toHaveAttribute('transform', 'translate(100, 240)');
  await page.getByRole('button', { name: 'Enter editor', exact: true }).click();
  await page.getByRole('button', { name: 'Add component', exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: /^Walkway lamp/ }).click();
  await page.getByLabel(/^X tile/).fill('31');
  await page.getByLabel(/^Y tile/).fill('22');
  await page.getByRole('button', { name: 'Place component', exact: true }).click();
  const added = (await stored(page)).data.layout.find(o => o.x === 31 && o.y === 22);
  expect(added).toBeTruthy();
  await expect(page.locator(`[id="${added.objectId}"]`)).toBeVisible();
  expect((await stored(page)).data.facilities.find(f => f.id === added.facilityId).reportable).toBe(true);
});
