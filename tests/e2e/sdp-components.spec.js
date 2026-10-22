import { test, expect } from '@playwright/test';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

const url = '/sdp-workspace.html?specimen=cards-buttons';
const captures = 'artifacts/sdp-dashboard/phase-1';
async function open(page) {
  await page.goto(url);
  await expect(page.getByRole('heading', { name: 'SDP cards & buttons', exact: true })).toBeVisible({ timeout: 10000 });
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator('.sdp-frame').first()).toBeAttached();
}

test('dedicated specimen mounts without reading or writing demo storage', async ({ page }) => {
  await page.addInitScript(() => {
    window.storageTouches = [];
    for (const name of ['getItem', 'setItem']) {
      const original = Storage.prototype[name];
      Storage.prototype[name] = function (...args) { window.storageTouches.push(args[0]); return original.apply(this, args); };
    }
  });
  await open(page);
  expect(await page.evaluate(() => window.storageTouches.filter(key => key.startsWith('kobi.')))).toEqual([]);
  await expect(page.locator('[data-sdp-kind]')).toHaveCount(13);
  await expect(page.locator('input, textarea, dialog, .bottom-nav')).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Return to SDP workspace', exact: true })).toHaveAttribute('href', '/sdp-workspace.html#sdp');
});

test('actions retain native semantics and block repeated pending activation', async ({ page }) => {
  await open(page);
  await expect(page.getByRole('button', { name: 'Unavailable', exact: true })).toBeDisabled();
  const run = page.getByRole('button', { name: 'Run simulated action', exact: true });
  await run.focus();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Shift+Tab');
  await expect(run).toBeFocused();
  expect(await run.evaluate(el => getComputedStyle(el).outlineStyle)).not.toBe('none');
  await mkdir(captures, { recursive: true });
  await page.screenshot({ path: `${captures}/keyboard-focus.png` });
  await page.keyboard.press('Enter');
  const pending = page.getByRole('button', { name: 'Working…', exact: true });
  await expect(pending).toHaveAttribute('aria-busy', 'true');
  // Playwright's click waits for aria-disabled to clear; dispatch during pending to test the guard.
  await pending.dispatchEvent('click');
  await page.keyboard.press('Enter');
  await expect(page.getByText('Simulated actions: 1', { exact: true })).toBeVisible();
  await expect(run).toBeVisible();
  await expect(page.getByText('Simulated actions: 2', { exact: true })).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Review reports', exact: true })).toHaveAttribute('href', '/sdp-workspace.html#sdp/reports');
  await expect(page.locator('[frameshape], [folded], [tone], [kind]')).toHaveCount(0);
});

test('frames are decorative, resize with content, and have readable CSS fallbacks', async ({ page }) => {
  await open(page);
  for (const data of await page.locator('.sdp-frame, .sdp-motif').evaluateAll(elements => elements.map(el => ({ hidden: el.getAttribute('aria-hidden'), focusable: el.getAttribute('focusable'), pointer: getComputedStyle(el).pointerEvents })))) {
    expect(data).toEqual({ hidden: 'true', focusable: 'false', pointer: 'none' });
  }
  const button = page.locator('.sdp-specimen-actions .sdp-button').first();
  const before = await button.boundingBox();
  await button.evaluate(el => { el.style.width = '100%'; el.querySelector('.button-label').textContent = 'An extended maintenance action that needs more room to remain fully readable'; });
  await expect.poll(async () => Number(await button.locator('.sdp-frame').getAttribute('height'))).toBeGreaterThan(before.height);
  await page.locator('.sdp-frame').evaluateAll(elements => elements.forEach(el => el.remove()));
  expect(await button.evaluate(el => getComputedStyle(el).backgroundColor)).toBe('rgb(206, 162, 87)');
  const card = page.locator('[data-sdp-kind="metric"]').first();
  expect(await card.evaluate(el => getComputedStyle(el).backgroundColor)).toBe('rgb(185, 44, 44)');
  await expect(card.getByText('Open reports', { exact: true })).toBeVisible();
});

for (const [width, height] of [[360, 800], [390, 844], [768, 1024], [1280, 800]]) {
  test(`specimen reflows at ${width}x${height}, normal and doubled text`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await open(page);
    await mkdir(captures, { recursive: true });
    for (const size of ['100%', '200%']) {
      await page.evaluate(size => { document.documentElement.style.fontSize = size; }, size);
      await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      const overflow = await page.locator('.sdp-specimen h1, .sdp-specimen h2, .sdp-specimen h3, .sdp-specimen p, .sdp-specimen .button-label').evaluateAll(elements => elements.filter(el => el.scrollWidth > el.clientWidth + 1).map(el => el.textContent));
      expect(overflow).toEqual([]);
      for (const box of await page.locator('.sdp-button').evaluateAll(elements => elements.map(el => ({ width: el.getBoundingClientRect().width, height: el.getBoundingClientRect().height })))) {
        expect(box.width).toBeGreaterThanOrEqual(44); expect(box.height).toBeGreaterThanOrEqual(44);
      }
      await page.screenshot({ path: `${captures}/${width}x${height}-${size}.png`, fullPage: true });
    }
    expect(await page.locator('.progress-icon').first().evaluate(el => getComputedStyle(el).animationName)).toBe('none');
  });
}

test('existing current and gateway component boxes remain unchanged', async ({ page }) => {
  const result = {};
  for (const [name, path] of [['current', '/#sdp'], ['gateway', '/#design-system']]) {
    await page.goto(path);
    await expect(page.locator('h1')).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator('.pixel-frame').first()).toBeAttached();
    await expect(page.locator('.sdp-frame')).toHaveCount(0);
    result[name] = await page.locator(name === 'gateway' ? '.specimen-section .button, .specimen-section .card' : '.staff-destinations .button, .staff-destinations .card').evaluateAll(elements => elements.slice(0,10).map(el => {
      const rect = el.getBoundingClientRect(), css = getComputedStyle(el);
      return { text: el.innerText, width: rect.width, height: rect.height, font: css.fontFamily, color: css.color, fill: css.backgroundColor };
    }));
  }
  await mkdir(captures, { recursive: true });
  const file = 'tests/fixtures/sdp-shared-components.json';
  if (process.env.SDP_BASELINE === 'before') await writeFile(file, JSON.stringify(result, null, 2));
  else expect(result).toEqual(JSON.parse(await readFile(file, 'utf8')));
});
