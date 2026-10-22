import { test, expect } from '@playwright/test';
import { coordinates } from '../helpers/shellActions.js';
import { mkdir } from 'node:fs/promises';

const wine = 'rgb(108, 26, 33)', cherry = 'rgb(185, 44, 44)', gold = 'rgb(206, 162, 87)', sand = 'rgb(209, 191, 154)', vanilla = 'rgb(229, 224, 205)';

async function specimen(page) {
  await page.goto('/#design-system');
  await expect(page.getByRole('textbox', { name: 'Display name', exact: true })).toBeVisible();
  await expect(page.locator('.button-primary .frame-fill').first()).toBeAttached();
  await page.evaluate(() => document.fonts.ready);
}

test('shared controls resolve to the approved palette', async ({ page }) => {
  await specimen(page);
  const colors = await page.evaluate(() => {
    const css = (selector, property) => getComputedStyle(document.querySelector(selector))[property];
    return {
      page: css('.app-shell', 'backgroundColor'), input: css('.paper-input-face', 'backgroundColor'),
      primary: [css('.button-primary', 'color'), css('.button-primary .frame-fill', 'fill')],
      secondary: [css('.button-secondary', 'color'), css('.button-secondary .frame-fill', 'fill')],
      quiet: [css('.button-quiet', 'color'), css('.button-quiet .frame-fill', 'fill')],
      strong: [css('.button-strong', 'color'), css('.button-strong .frame-fill', 'fill')],
      danger: [css('.button-danger', 'color'), css('.button-danger .frame-fill', 'fill')],
      ink: css('.frame-ink', 'fill'), rim: css('.frame-rim', 'fill'), shadow: css('.frame-shadow', 'fill'), fold: css('.frame-fold', 'fill'),
    };
  });
  expect(colors).toEqual({ page: vanilla, input: vanilla, primary: [wine, gold], secondary: [wine, vanilla], quiet: [wine, sand], strong: [vanilla, wine], danger: [vanilla, cherry], ink: wine, rim: vanilla, shadow: wine, fold: cherry });
  expect(await page.locator('meta[name="theme-color"]').getAttribute('content')).toBe('#E5E0CD');
});

test('error text stays readable on context and selected surfaces', async ({ page }) => {
  await specimen(page);
  for (const surface of ['--surface-panel', '--surface-context', '--surface-selected']) {
    await page.locator('.specimen-fields').evaluate((element, token) => { element.style.backgroundColor = `var(${token})`; }, surface);
    const errors = await page.locator('.field-error, .tone-error').evaluateAll(elements => elements.map(element => ({ color: getComputedStyle(element).color, background: getComputedStyle(element).backgroundColor })));
    expect(errors.length).toBeGreaterThan(0);
    for (const error of errors) expect(error).toEqual({ color: cherry, background: vanilla });
  }
});

test('focus and disabled states remain visible', async ({ page }) => {
  await specimen(page);
  await page.keyboard.press('Tab');
  for (const selector of ['.button-primary', '.button-strong', '.button-danger']) {
    const action = page.locator(selector).first(); await action.focus();
    expect(await action.evaluate(element => ({ outline: getComputedStyle(element).outlineColor, ring: getComputedStyle(element).boxShadow }))).toEqual({ outline: wine, ring: `${vanilla} 0px 0px 0px 6px` });
  }
  const disabled = page.getByRole('button', { name: 'Unavailable', exact: true });
  await expect(disabled).toBeDisabled();
  expect(await disabled.evaluate(element => ({ color: getComputedStyle(element).color, opacity: getComputedStyle(element).opacity, fill: getComputedStyle(element.querySelector('.frame-fill')).fill })) ).toEqual({ color: wine, opacity: '1', fill: sand });
  const loading = page.getByRole('button', { name: 'Sending…', exact: true });
  await expect(loading).toHaveAttribute('aria-busy', 'true');
  await page.getByRole('button', { name: 'Community', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Community', exact: true })).toHaveAttribute('aria-pressed', 'true');
});

test('modal backdrop uses solid wine and retains keyboard focus', async ({ page }) => {
  await specimen(page);
  await page.getByRole('button', { name: 'Open specimen sheet', exact: true }).click();
  const dialog = page.getByRole('dialog'); await expect(dialog).toBeVisible();
  expect(await dialog.evaluate(element => ({ backdrop: getComputedStyle(element, '::backdrop').backgroundColor, surface: getComputedStyle(element).backgroundColor, opacity: getComputedStyle(element).opacity }))).toEqual({ backdrop: wine, surface: vanilla, opacity: '1' });
  await page.getByRole('button', { name: 'Close sheet', exact: true }).focus();
  await expect(page.getByRole('button', { name: 'Close sheet', exact: true })).toBeFocused();
  await mkdir('artifacts/colour-migration/captures', { recursive: true });
  await page.screenshot({ path: 'artifacts/colour-migration/captures/modal-backdrop.png' });
  await page.keyboard.press('Escape'); await expect(dialog).not.toBeVisible();
});

test('placement previews distinguish valid and invalid positions without blended colours', async ({ page }) => {
  await page.goto('/#sdp/world');
  await page.getByRole('button', { name: 'Enter editor', exact: true }).click();
  await page.getByRole('button', { name: 'Add component', exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: /^Garden bench/ }).click();
  await coordinates(page, 30, 22);
  await expect(page.locator('.schematic-ghost')).toHaveClass(/is-valid/);
  const paint = () => page.locator('.schematic-ghost rect').evaluate(element => ({ fill: getComputedStyle(element).fill, alpha: getComputedStyle(element).fillOpacity, stroke: getComputedStyle(element).stroke }));
  expect(await paint()).toEqual({ fill: gold, alpha: '1', stroke: wine });
  expect(await page.locator('.schematic-grid').evaluate(element => getComputedStyle(element).opacity)).toBe('1');
  await mkdir('artifacts/colour-migration/captures', { recursive: true });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: 'artifacts/colour-migration/captures/editor-valid.png', fullPage: true });
  await coordinates(page, 32, 22);
  await expect(page.locator('.schematic-ghost')).toHaveClass(/is-invalid/);
  expect(await paint()).toEqual({ fill: vanilla, alpha: '1', stroke: cherry });
  await expect(page.getByRole('button', { name: 'Place component', exact: true })).toBeDisabled();
  await coordinates(page, 4, 3);
  await expect(page.locator('.schematic-ghost')).toHaveClass(/is-invalid/);
  expect(await paint()).toEqual({ fill: vanilla, alpha: '1', stroke: cherry });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: 'artifacts/colour-migration/captures/editor-invalid.png', fullPage: true });
});

test('resident and SDP routes retain palette colours across real content', async ({ page }) => {
  const report = '00000000-0000-4000-8000-000000000011', activity = '00000000-0000-4000-8000-000000000031';
  const routes = ['sign-in', 'create-account', 'map', 'reports', 'reports/new', `reports/${report}`, 'activities', `activities/${activity}`, 'profile', 'settings', 'sdp', 'sdp/reports', `sdp/reports/${report}`, 'sdp/activities', 'sdp/activities/new', `sdp/activities/${activity}/edit`, 'sdp/world'];
  await page.setViewportSize({ width: 390, height: 844 });
  await mkdir('artifacts/colour-migration/routes', { recursive: true });
  for (const [index, route] of routes.entries()) {
    await page.goto(`/#${route}`);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.locator('main button').first()).toBeAttached();
    await page.evaluate(() => document.fonts.ready);
    const colors = await page.locator('main :is(h1,h2,h3,p,.helper,.button,.status-badge,.form-input)').evaluateAll(elements => elements.filter(element => element.checkVisibility()).map(element => ({ label: element.textContent.slice(0, 70), color: getComputedStyle(element).color })));
    expect(colors.length, route).toBeGreaterThan(1);
    for (const element of colors) expect([wine, cherry, gold, sand, vanilla], `${route}: ${element.label}`).toContain(element.color);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), route).toBe(true);
    await page.screenshot({ path: `artifacts/colour-migration/routes/${String(index + 1).padStart(2, '0')}-${route.replaceAll('/', '-')}.png`, fullPage: true });
  }
});
