import { test, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { createSampleData } from '../../src/lib/demoSamples.js';
import { openPart3, PART3_NOW, readPart3Bytes } from '../helpers/part3.js';
import { button, coordinates, fillActivity } from '../helpers/shellActions.js';

const evidence = 'docs/verification/part-3/automated/captures';
const image = { name: 'nonpersonal-fixture.png', mimeType: 'image/png', buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=', 'base64') };
async function exposed(control) {
  await control.focus(); await control.scrollIntoViewIfNeeded();
  const metrics = await control.evaluate(el => {
    const r = el.getBoundingClientRect(), v = visualViewport;
    const x = r.x + r.width / 2, y = r.y + r.height / 2;
    return { exposed: x >= 0 && x < v.width && y >= v.offsetTop && y < v.offsetTop + v.height && el.contains(document.elementFromPoint(x, y)), x, y, viewport: { height: v.height, top: v.offsetTop }, scroll: scrollY, covering: document.elementFromPoint(x, y)?.outerHTML.slice(0, 200) };
  });
  expect(metrics.exposed, JSON.stringify(metrics)).toBe(true);
  await expect(control).toBeEnabled(); await expect(control).toBeFocused();
}
async function bottomCapture(page, control, name) {
  await exposed(control);
  await page.screenshot({ path: `${evidence}/${name}-bottom-390x400.png` });
  await page.setViewportSize({ width: 390, height: 844 });
  await exposed(control);
  await page.screenshot({ path: `${evidence}/${name}-bottom-390x844.png` });
  await page.setViewportSize({ width: 390, height: 400 });
}
async function modal(page, name, safe) {
  const dialog = page.getByRole('dialog');
  await expect(page.locator('dialog[open]')).toHaveCount(1);
  await expect(dialog).toHaveAccessibleName(name);
  if (safe) await expect(dialog.getByRole('button', { name: safe, exact: true })).toBeFocused();
  const controls = dialog.locator('button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled)').filter({ visible: true });
  await controls.first().focus(); await page.keyboard.press('Shift+Tab'); await expect(controls.last()).toBeFocused();
  await page.keyboard.press('Tab'); await expect(controls.first()).toBeFocused();
  await page.locator('h1').focus();
  expect(await dialog.evaluate(el => el.contains(document.activeElement))).toBe(true);
}

test('required actions remain exposed in short resized viewports and bottom captures', async ({ page }) => {
  await mkdir(evidence, { recursive: true });
  await page.setViewportSize({ width: 390, height: 400 });
  await openPart3(page, 'reports/new');
  await page.getByLabel(/^Facility/).selectOption('hall-01');
  await page.getByLabel(/^Description/).fill('A complete disposable report for bottom action visibility.');
  await bottomCapture(page, button(page, 'Send report'), 'report');
  await button(page, 'Send report').click();
  const id = await page.evaluate(() => JSON.parse(localStorage.getItem('kobi.demo.v1')).data.complaints.at(-1).id);
  await page.goto(`/#sdp/reports/${id}`);
  await page.getByLabel(/^Action note/).fill('The inspection has started.'); await button(page, 'Start work').click();
  await page.getByLabel(/^Action note/).fill('The maintenance has been completed and checked.');
  await page.getByLabel('Resolution evidence', { exact: false }).setInputFiles(image);
  await expect(page.getByRole('img', { name: 'Selected resolution evidence' })).toBeVisible();
  await bottomCapture(page, button(page, 'Mark resolved'), 'resolution');
  await button(page, 'Mark resolved').click();
  await page.goto('/#sdp/activities/new'); await fillActivity(page, 'Accessible activity morning');
  await bottomCapture(page, button(page, 'Publish activity'), 'activity');
  await button(page, 'Publish activity').click();
  await page.goto('/#sdp/world'); await button(page, 'Enter editor').click(); await button(page, 'Add component').click();
  await page.getByRole('dialog').getByRole('button', { name: /^Tree/ }).click(); await coordinates(page, 31, 23);
  await exposed(button(page, 'Place component')); await button(page, 'Place component').click();
  await button(page, 'Remove').click(); await modal(page, 'Remove tree?', 'Cancel');
  await exposed(page.getByRole('dialog').getByRole('button', { name: 'Cancel', exact: true }));
  await page.keyboard.press('Escape'); await expect(button(page, 'Remove')).toBeFocused();
});

test('actual sheets photo dirty and reset dialogs contain focus and restore meaningful targets', async ({ page }) => {
  await openPart3(page);
  const place = page.getByRole('button', { name: /^Walkway lamp/ });
  await place.click(); await modal(page, 'Walkway lamp', 'Close sheet');
  await page.keyboard.press('Escape'); await expect(place).toBeFocused();
  await page.goto('/#reports/new'); await page.getByLabel('Report photo (optional)').setInputFiles(image);
  await button(page, 'Preview photo').click(); await modal(page, /photo/i, 'Close');
  await page.keyboard.press('Escape'); await expect(button(page, 'Preview photo')).toBeFocused();
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Map', exact: true }).click();
  const before = await readPart3Bytes(page);
  await modal(page, 'Discard changes?', 'Keep editing');
  await page.keyboard.press('Escape'); expect(await readPart3Bytes(page)).toBe(before);
  await expect(page.getByRole('img', { name: 'Selected report photo' })).toBeVisible();
  await page.reload(); await page.goto('/#settings');
  await button(page, 'Reset demo').click(); await modal(page, 'Reset demo?', 'Cancel');
  await page.keyboard.press('Escape'); await expect(button(page, 'Reset demo')).toBeFocused();
});

test('Leave and activity cancellation dialogs have safe focus and cancel without mutation', async ({ page }) => {
  const data = createSampleData(PART3_NOW), activity = data.activities[0];
  await openPart3(page, `activities/${activity.id}`, { data });
  await button(page, 'Join activity').click();
  let before = await readPart3Bytes(page);
  await button(page, 'Leave activity').click(); await modal(page, `Leave ${activity.title}?`, 'Cancel');
  await page.keyboard.press('Escape'); await expect(button(page, 'Leave activity')).toBeFocused();
  expect(await readPart3Bytes(page)).toBe(before);
  await page.goto('/#sdp/activities'); before = await readPart3Bytes(page);
  await button(page, 'Cancel activity').click(); await modal(page, `Cancel ${activity.title}?`, 'Cancel');
  await page.keyboard.press('Escape'); await expect(button(page, 'Cancel activity')).toBeFocused();
  expect(await readPart3Bytes(page)).toBe(before);
  await button(page, 'Cancel activity').click();
  await page.getByRole('dialog').getByRole('button', { name: 'Cancel activity', exact: true }).click();
  await page.goto(`/#activities/${activity.id}`);
  await button(page, 'Switch to resident demo').click();
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: `${evidence}/activity-cancelled-390x844.png`, fullPage: true });
  await page.clock.setFixedTime(new Date(activity.starts_at));
  await page.evaluate(() => window.dispatchEvent(new Event('focus')));
  await expect(button(page, 'Leave activity')).toBeDisabled();
  await page.screenshot({ path: `${evidence}/activity-started-390x844.png`, fullPage: true });
});

test('keyboard skip labels errors selected states and English icon names work on actual routes', async ({ page }) => {
  await openPart3(page, 'reports/new');
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  await page.keyboard.press('Shift+Tab'); await page.keyboard.press('Shift+Tab'); await page.keyboard.press('Shift+Tab');
  await expect(page.locator('.skip-link')).toBeFocused();
  await page.keyboard.press('Enter'); await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  await button(page, 'Send report').focus(); await page.keyboard.press('Space');
  const field = page.locator('[aria-invalid="true"]').first(); await expect(field).toBeFocused();
  expect(await field.getAttribute('aria-describedby')).toBeTruthy();
  await expect(field).toHaveCSS('outline-style', 'solid');
  await page.goto('/#sdp/reports');
  await button(page, 'Resolved').focus(); await page.keyboard.press('Enter');
  await expect(button(page, 'Resolved')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('[role=status]').filter({ hasText: '0 reports' })).toBeVisible();
  await page.goto('/#map');
  await expect(page.locator('button.button-icon')).not.toHaveCount(0);
  for (const icon of await page.locator('button.button-icon').all()) await expect(icon).toHaveAccessibleName(/\w/);
  expect(await page.locator('html').getAttribute('lang')).toBe('en');
});

test('rendered error selected disabled and focus colors meet their contrast requirements', async ({ page }) => {
  await openPart3(page, 'reports/new');
  await button(page, 'Send report').click();
  const error = page.locator('.field-error').first();
  const input = page.locator('[aria-invalid=true]').first();
  const errorColors = await error.evaluate(el => ({ text: getComputedStyle(el).color, fill: getComputedStyle(document.querySelector('.app-shell')).backgroundColor }));
  const focusColors = await input.evaluate(el => ({ text: getComputedStyle(el).outlineColor, fill: getComputedStyle(el).backgroundColor }));
  await page.goto('/#sdp/reports'); await button(page, 'Resolved').click();
  const selectedColors = await button(page, 'Resolved').evaluate(el => ({ text: getComputedStyle(el).color, fill: getComputedStyle(el.querySelector('.frame-fill')).fill }));
  await page.goto('/#map');
  const disabledColors = await button(page, 'Zoom out').evaluate(el => ({ text: getComputedStyle(el).color, fill: getComputedStyle(el.querySelector('.frame-fill')).fill }));
  const luminance = rgb => {
    const values = rgb.match(/[\d.]+/g).slice(0, 3).map(v => { const n = Number(v) / 255; return n <= .04045 ? n / 12.92 : ((n + .055) / 1.055) ** 2.4; });
    return values[0] * .2126 + values[1] * .7152 + values[2] * .0722;
  };
  for (const [colors, minimum] of [[errorColors, 4.5], [focusColors, 3], [selectedColors, 4.5], [disabledColors, 4.5]]) {
    const a = luminance(colors.text), b = luminance(colors.fill);
    expect((Math.max(a, b) + .05) / (Math.min(a, b) + .05)).toBeGreaterThanOrEqual(minimum);
  }
});

test('fallback fonts and reduced motion preserve real forms and specimen feedback', async ({ page }) => {
  const failures = []; page.on('requestfailed', r => failures.push(r.url()));
  await page.route('**/*.ttf', route => route.abort());
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openPart3(page, 'reports/new');
  await page.getByLabel(/^Description/).fill('Fallback font report remains readable and actionable.');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  await exposed(button(page, 'Send report'));
  await page.screenshot({ path: `${evidence}/fallback-form-390x844.png` });
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Report a problem');
  await page.evaluate(() => document.fonts.ready);
  await page.goto('/#design-system');
  await expect(page.locator('.progress-icon').first()).toHaveCSS('animation-name', 'none');
  await button(page, 'Run simulated save').click();
  await expect(page.getByRole('button', { name: 'Saving…', exact: true })).toHaveAttribute('aria-disabled', 'true');
  expect(failures.filter(url => !url.endsWith('.ttf'))).toEqual([]);
});
