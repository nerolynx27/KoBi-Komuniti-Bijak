import { test, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const evidence = 'docs/verification/part-2';
const reportId = '00000000-0000-4000-8000-000000000011';
const activityId = '00000000-0000-4000-8000-000000000031';
const surfaces = [
  ['map', 'map'], ['reports', 'reports'], ['report-form', 'reports/new'],
  ['report-detail', `reports/${reportId}`], ['activities', 'activities'],
  ['activity-detail', `activities/${activityId}`], ['profile', 'profile'],
  ['settings', 'settings'], ['sign-in', 'sign-in'], ['create-account', 'create-account'],
  ['sdp', 'sdp'], ['sdp-reports', 'sdp/reports'],
  ['sdp-report-detail', `sdp/reports/${reportId}`],
  ['sdp-activities', 'sdp/activities'], ['activity-form', 'sdp/activities/new'],
  ['editor', 'sdp/world'],
];

async function capturePage(page, options, { atCurrentScroll = false } = {}) {
  if (!atCurrentScroll) await page.evaluate(() => window.scrollTo(0, 0));
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  const capture = page.screenshot.bind(page);
  await capture(options);
}

test('the real browser decodes accepted image types and rejects corrupt photo bytes', async ({ page }) => {
  await page.goto('/#map');
  const results = await page.evaluate(async () => {
    const { validatePhoto, demoPhotos } = await import('/src/lib/demoPhotos.js');
    const canvas = document.createElement('canvas'); canvas.width = 8; canvas.height = 8;
    const context = canvas.getContext('2d'); context.fillStyle = '#B6D53C'; context.fillRect(0, 0, 8, 8);
    const accepted = [];
    for (const mime of ['image/jpeg', 'image/png', 'image/webp']) {
      const blob = await new Promise(resolve => canvas.toBlob(resolve, mime));
      const file = new File([blob], `browser-fixture.${mime.split('/')[1]}`, { type: mime });
      const result = await validatePhoto(file);
      if (!result.error) demoPhotos.put(mime, file);
      accepted.push({ mime, error: result.error, staged: demoPhotos.get(mime) === file });
    }
    const malformed = await validatePhoto(new File(['corrupt image bytes'], 'bad.png', { type: 'image/png' }));
    const unsupported = await validatePhoto(new File(['<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8"/>'], 'drawing.svg', { type: 'image/svg+xml' }));
    demoPhotos.clear();
    return { accepted, malformed: malformed.error?.code, unsupported: unsupported.error?.code };
  });
  expect(results.accepted).toEqual(['image/jpeg', 'image/png', 'image/webp'].map(mime => ({ mime, error: null, staged: true })));
  expect(results.malformed).toBe('VALIDATION_ERROR');
  expect(results.unsupported).toBe('VALIDATION_ERROR');
});

test('a dirty profile can continue from discard to the sign-out confirmation', async ({ page }) => {
  await page.goto('/#profile');
  await page.getByLabel('Display name').fill('Unsaved review name');
  await page.getByRole('button', { name: 'Sign out', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toContainText('Discard changes?');
  await expect(dialog.getByRole('button', { name: 'Keep editing', exact: true })).toBeFocused();
  await dialog.getByRole('button', { name: 'Discard changes', exact: true }).click();
  await expect(dialog).toContainText('Sign out of the demo?');
  await dialog.getByRole('button', { name: 'Sign out', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Sign in', exact: true })).toBeVisible();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('kobi.demo.v1')).data.profiles[0].display_name)).toBe('Alex Tan');
});

test('profile input survives dirty navigation and repeated browser Back choices', async ({ page }) => {
  await page.goto('/#map');
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Profile', exact: true }).click();
  await page.getByLabel('Display name').fill('Keep this review name');
  await page.goBack();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toContainText('Discard changes?');
  await dialog.getByRole('button', { name: 'Keep editing', exact: true }).click();
  await expect(page.getByLabel('Display name')).toHaveValue('Keep this review name');
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Activities', exact: true }).click();
  await expect(dialog).toContainText('Discard changes?');
  await dialog.getByRole('button', { name: 'Keep editing', exact: true }).click();
  await expect(page.getByLabel('Display name')).toHaveValue('Keep this review name');
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Map', exact: true }).click();
  await dialog.getByRole('button', { name: 'Discard changes', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Map', exact: true })).toBeVisible();
  await page.goBack();
  await expect(page.getByRole('heading', { name: 'Profile', exact: true })).toBeVisible();
  await expect(page.getByLabel('Display name')).toHaveValue('Alex Tan');
  await expect(dialog).not.toBeVisible();
});

test('capture real report errors, photos, evidence timeline and recovery', async ({ page }) => {
  test.setTimeout(90000);
  await mkdir(evidence, { recursive: true });
  await page.goto('/#reports/new?facility=hall-01');
  await page.getByRole('button', { name: 'Send report', exact: true }).click();
  await expect(page.getByLabel(/^Description/)).toBeFocused();
  await capturePage(page, { path: `${evidence}/report-validation-390x844.png`, fullPage: true });
  const description = 'The community hall entrance has a loose handrail. Please inspect the fasteners and make the approach safe for neighbours. '.repeat(5).trim();
  await page.getByLabel(/^Description/).fill(description);
  await expect(page.getByLabel(/^Description/)).not.toHaveAttribute('aria-invalid', 'true');
  const png = await page.evaluate(() => { const canvas = document.createElement('canvas'); canvas.width = 160; canvas.height = 100; const ctx = canvas.getContext('2d'); ctx.fillStyle = '#EAF0D8'; ctx.fillRect(0, 0, 160, 100); ctx.fillStyle = '#5E3543'; ctx.fillRect(24, 20, 12, 60); ctx.fillRect(24, 20, 112, 8); return canvas.toDataURL('image/png').split(',')[1]; });
  const photo = { name: 'local-demo-handrail-check.png', mimeType: 'image/png', buffer: Buffer.from(png, 'base64') };
  await page.getByLabel('Report photo (optional)').setInputFiles(photo);
  await expect(page.getByRole('img', { name: 'Selected report photo' })).toBeVisible();
  await capturePage(page, { path: `${evidence}/report-long-photo-390x844.png`, fullPage: true });
  await page.getByRole('button', { name: 'Send report', exact: true }).scrollIntoViewIfNeeded();
  await capturePage(page, { path: `${evidence}/report-actions-390x844.png` }, { atCurrentScroll: true });
  await page.getByRole('button', { name: 'Preview photo', exact: true }).click();
  await page.getByRole('dialog').screenshot({ path: `${evidence}/photo-preview-dialog-390x844.png` });
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Preview photo', exact: true })).toBeFocused();
  await page.getByLabel('Report photo (optional)').setInputFiles({ name: 'broken.png', mimeType: 'image/png', buffer: Buffer.from('corrupt image') });
  await expect(page.getByRole('alert')).toContainText('could not be opened');
  await expect(page.getByRole('img', { name: 'Selected report photo' })).toBeVisible();
  await capturePage(page, { path: `${evidence}/photo-invalid-replacement-390x844.png`, fullPage: true });
  await page.getByLabel('Report photo (optional)').setInputFiles(photo);
  await page.getByRole('button', { name: 'Remove photo', exact: true }).click();
  await expect(page.getByRole('img', { name: 'Selected report photo' })).toHaveCount(0);
  await page.getByLabel('Report photo (optional)').setInputFiles(photo);
  await expect(page.getByRole('img', { name: 'Selected report photo' })).toBeVisible();
  await page.evaluate(() => { window.reviewSetItem = Storage.prototype.setItem; Storage.prototype.setItem = () => { throw new DOMException('Full', 'QuotaExceededError'); }; });
  await page.getByRole('button', { name: 'Send report', exact: true }).click();
  await expect(page.getByLabel(/^Description/)).toHaveValue(description);
  await expect(page.getByRole('img', { name: 'Selected report photo' })).toBeVisible();
  await capturePage(page, { path: `${evidence}/report-save-failure-390x844.png`, fullPage: true });
  await page.evaluate(() => { Storage.prototype.setItem = window.reviewSetItem; });
  await page.getByRole('button', { name: 'Retry storage', exact: true }).first().click();
  await expect(page.getByRole('heading', { name: 'Report details', exact: true })).toBeVisible();
  const id = await page.evaluate(() => location.hash.slice('#reports/'.length));
  await page.getByRole('button', { name: 'Enter SDP demo workspace', exact: true }).click();
  await page.goto(`/#sdp/reports/${id}`);
  await page.getByLabel(/^Action note/).fill('The maintenance team inspected the handrail and secured the work area.');
  await page.getByRole('button', { name: 'Start work', exact: true }).click();
  await page.getByLabel(/^Action note/).fill('The loose fasteners have been replaced and the handrail checked. This image is local demo evidence.');
  await page.getByLabel(/^Resolution evidence/).setInputFiles({ ...photo, name: 'local-demo-resolution-evidence.png' });
  await page.getByRole('button', { name: 'Mark resolved', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Resolution complete', exact: true })).toBeVisible();
  for (const [width, height] of [[390, 844], [1280, 800]]) {
    await page.setViewportSize({ width, height }); await assertLayout(page, `resolved timeline ${width}`);
    await capturePage(page, { path: `${evidence}/report-resolved-evidence-${width}x${height}.png`, fullPage: true });
  }
  const raw = await page.evaluate(() => localStorage.getItem('kobi.demo.v1'));
  expect(raw).not.toMatch(/blob:|data:image|base64,/);
  await page.reload();
  await expect(page.getByText('Photo preview is no longer available after reload.', { exact: false }).first()).toBeVisible();
  await capturePage(page, { path: `${evidence}/report-photo-unavailable-1280x800.png`, fullPage: true });
});

test('capture catalog, placement preview, reference blockers and removal confirmation', async ({ page }) => {
  await mkdir(evidence, { recursive: true });
  await page.goto('/#sdp/world');
  await page.getByRole('button', { name: 'Enter editor', exact: true }).click();
  await page.getByRole('button', { name: 'Add component', exact: true }).click();
  await expect(page.getByRole('dialog').locator('.catalog-card')).toHaveCount(7);
  await page.getByRole('dialog').screenshot({ path: `${evidence}/editor-catalog-390x844.png` });
  await page.getByRole('dialog').getByRole('button', { name: /^House/ }).click();
  await expect(page.getByRole('button', { name: 'Place component', exact: true })).toBeEnabled();
  await capturePage(page, { path: `${evidence}/editor-valid-preview-390x844.png`, fullPage: true });
  await page.getByLabel(/^X tile/).fill('4'); await page.getByLabel(/^Y tile/).fill('3');
  await expect(page.getByRole('button', { name: 'Place component', exact: true })).toBeDisabled();
  await capturePage(page, { path: `${evidence}/editor-invalid-preview-390x844.png`, fullPage: true });
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  await page.locator('.place-list').getByRole('button', { name: /Walkway lamp/ }).click();
  await expect(page.getByRole('button', { name: 'Remove', exact: true })).toBeDisabled();
  for (const [width, height] of [[390, 844], [1280, 800]]) {
    await page.setViewportSize({ width, height }); await assertLayout(page, `editor selected ${width}`);
    await capturePage(page, { path: `${evidence}/editor-reference-blocker-${width}x${height}.png`, fullPage: true });
  }
  await page.locator('.place-list').getByRole('button', { name: /Community hall/ }).click();
  await page.getByRole('button', { name: 'Remove', exact: true }).click();
  await expect(page.getByRole('dialog').getByRole('button', { name: 'Cancel', exact: true })).toBeFocused();
  await page.getByRole('dialog').screenshot({ path: `${evidence}/editor-remove-confirmation-1280x800.png` });
  await page.keyboard.press('Escape');
});

test('capture unsaved activity preview and a dirty confirmation without writing a draft', async ({ page }) => {
  await mkdir(evidence, { recursive: true });
  await page.goto('/#sdp/activities/new');
  const before = await page.evaluate(() => localStorage.getItem('kobi.demo.v1'));
  await page.getByLabel(/^Title/).fill('Neighbourhood recycling and reuse morning');
  await page.getByLabel(/^Description/).fill('Bring clean, sorted recyclables and meet neighbours at the collection point. Volunteers will explain the local collection categories and demonstrate how to prepare reusable materials.');
  await page.getByLabel(/^Category/).selectOption('recycling');
  await page.getByLabel(/^Location/).selectOption('recycling-01');
  const start = new Date(Date.now() + 2 * 86400000 + 8 * 3600000).toISOString();
  await page.getByLabel(/^Start date/).fill(start.slice(0, 10)); await page.getByLabel(/^Start time/).fill('09:30');
  await page.getByLabel(/^End date/).fill(start.slice(0, 10)); await page.getByLabel(/^End time/).fill('12:30');
  await page.getByLabel(/^Instructions/).fill('Rinse containers, flatten cardboard and keep glass separate. Bring a water bottle and comfortable shoes. This is a local demo event.');
  await capturePage(page, { path: `${evidence}/activity-complete-unsaved-390x844.png`, fullPage: true });
  await page.getByRole('button', { name: 'Preview activity', exact: true }).click();
  await expect(page.getByRole('dialog')).toContainText('Unsaved preview');
  await expect(page.getByRole('dialog').getByRole('button', { name: 'Join activity', exact: true })).toHaveCount(0);
  await page.getByRole('dialog').screenshot({ path: `${evidence}/activity-unsaved-preview-390x844.png` });
  await page.keyboard.press('Escape');
  await expect(page.getByLabel(/^Title/)).toHaveValue('Neighbourhood recycling and reuse morning');
  expect(await page.evaluate(() => localStorage.getItem('kobi.demo.v1'))).toBe(before);
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  await expect(page.getByRole('dialog').getByRole('button', { name: 'Keep editing', exact: true })).toBeFocused();
  await page.getByRole('dialog').screenshot({ path: `${evidence}/activity-dirty-confirmation-390x844.png` });
  await page.keyboard.press('Escape');
});

async function assertLayout(page, label) {
  await page.evaluate(() => document.fonts.ready);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Page not found', exact: true })).toHaveCount(0);
  const metrics = await page.evaluate(() => ({
    overflow: document.documentElement.scrollWidth > innerWidth,
    fonts: document.fonts.check('16px "Yanone Kaffeesatz"') && document.fonts.check('700 16px "Yanone Kaffeesatz"'),
    undersized: [...document.querySelectorAll('button, a[href], input:not([type=checkbox]):not([type=radio]):not([type=file]), select, textarea, .choice, .segmented-options label')]
      .filter(element => element.checkVisibility() && !element.closest('[inert]') && !element.classList.contains('skip-link'))
      .map(element => ({ name: element.getAttribute('aria-label') || element.textContent?.trim() || element.id, width: element.getBoundingClientRect().width, height: element.getBoundingClientRect().height }))
      .filter(rect => rect.width < 43.5 || rect.height < 43.5),
  }));
  expect(metrics.overflow, `${label}: page overflow`).toBe(false);
  expect(metrics.undersized, `${label}: touch targets`).toEqual([]);
  expect(metrics.fonts, `${label}: local fonts`).toBe(true);
}

for (const [width, height] of [[360, 800], [390, 844], [768, 1024], [1280, 800], [800, 360]]) {
  test(`Part 2 actual screens at ${width}x${height}`, async ({ page }) => {
    test.setTimeout(120000);
    await mkdir(evidence, { recursive: true });
    await page.setViewportSize({ width, height });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    for (const [name, route] of surfaces) {
      await page.goto(`/#${route}`);
      if (['report-form', 'activity-form', 'sign-in', 'create-account'].includes(name)) await expect(page.locator('form').first()).toBeVisible();
      await assertLayout(page, `${name} ${width}x${height}`);
      await capturePage(page, { path: `${evidence}/${name}-${width}x${height}.png`, fullPage: true });
    }
    expect(errors).toEqual([]);
  });
}

test('Part 2 long forms and details remain usable at 200% text', async ({ page }) => {
  test.setTimeout(120000);
  await mkdir(evidence, { recursive: true });
  for (const [width, height] of [[360, 800], [800, 360]]) {
    await page.setViewportSize({ width, height });
    for (const name of ['map', 'report-form', 'sdp-report-detail', 'activity-form', 'editor', 'settings', 'create-account']) {
      const route = surfaces.find(surface => surface[0] === name)[1];
      await page.goto(`/#${route}`);
      await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
      await assertLayout(page, `${name} 200% ${width}x${height}`);
      await capturePage(page, { path: `${evidence}/${name}-text-200-${width}x${height}.png`, fullPage: true });
    }
  }
});
