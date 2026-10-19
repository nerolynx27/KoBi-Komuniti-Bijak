import { test, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const sizes = [[360, 800], [390, 844], [768, 1024], [1280, 800]];
const evidence = process.env.KOBI_EVIDENCE_DIR || 'docs/verification/part-2';

test('measured frames replace fallback borders and keep pixel dimensions on long labels', async ({ page }) => {
  await page.goto('/#design-system');
  const action = page.getByRole('button', { name: 'Continue with a longer neighbourhood action label that wraps naturally' });
  await expect(action.locator('svg.pixel-frame')).toBeVisible();
  expect(await action.evaluate(element => {
    const frame = element.querySelector('.pixel-frame');
    return { width: frame.width.baseVal.value - Math.round(element.getBoundingClientRect().width), height: frame.height.baseVal.value - Math.round(element.getBoundingClientRect().height), fallback: getComputedStyle(element).backgroundColor };
  })).toEqual({ width: 4, height: 4, fallback: 'rgba(0, 0, 0, 0)' });
});

for (const [width, height] of sizes) {
  test(`rendered shell and specimen at ${width}x${height}`, async ({ page }) => {
    await mkdir(evidence, { recursive: true });
    await page.setViewportSize({ width, height });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    for (const route of ['map', 'reports', 'activities', 'profile', 'sdp', 'design-system']) {
      await page.goto(`/#${route}`);
      await page.evaluate(() => document.fonts.ready);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      if (route === 'design-system') await expect(page.getByRole('heading', { name: 'Clear, calm fields' })).toBeVisible();
      const metrics = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > innerWidth,
        undersized: [...document.querySelectorAll('button, a[href], input:not([type=checkbox]):not([type=radio]), select, textarea, .choice, .segmented-options label')].filter(element => element.checkVisibility() && !element.classList.contains('skip-link')).map(element => ({ label: element.textContent || element.getAttribute('aria-label'), width: element.getBoundingClientRect().width, height: element.getBoundingClientRect().height })).filter(rect => rect.width < 43.5 || rect.height < 43.5),
        fonts: document.fonts.check('16px "Yanone Kaffeesatz"') && document.fonts.check('700 16px "Yanone Kaffeesatz"') && document.fonts.check('20px Bungee'),
      }));
      expect(metrics.overflow, `${route} horizontal overflow`).toBe(false);
      expect(metrics.undersized, `${route} touch targets`).toEqual([]);
      expect(metrics.fonts).toBe(true);
      if (['map', 'sdp'].includes(route)) await page.screenshot({ path: `${evidence}/${route}-${width}x${height}.png`, fullPage: true });
      if (route === 'design-system') {
        // Isolate component paint from sticky app chrome in tall element captures.
        const style = '.app-header, .skip-link { visibility: hidden !important; }';
        await page.locator('.specimen-section').nth(0).screenshot({ path: `${evidence}/buttons-${width}x${height}.png`, style });
        await page.locator('.specimen-section').nth(3).screenshot({ path: `${evidence}/fields-${width}x${height}.png`, style });
        await page.getByRole('button', { name: 'Open specimen sheet' }).click();
        await page.getByRole('dialog').screenshot({ path: `${evidence}/sheet-${width}x${height}.png` });
        await page.keyboard.press('Escape');
      }
    }
    expect(errors).toEqual([]);
  });
}

test('200% text and short landscape retain wrapping and visible controls', async ({ page }) => {
  for (const [width, height] of [[360, 800], [800, 360]]) {
    await page.setViewportSize({ width, height });
    for (const route of ['map', 'reports', 'activities', 'profile', 'sdp', 'design-system']) {
      await page.goto(`/#${route}`);
      await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `200% overflow on ${route} at ${width}`).toBe(true);
      expect(await page.locator('.skip-link').evaluate(element => element.getBoundingClientRect().bottom), 'unfocused skip link must be offscreen at 200%').toBeLessThanOrEqual(0);
      if (route === 'map') {
        const navMetrics = await page.locator('.bottom-nav').evaluate(nav => ({
          overflow: [...nav.querySelectorAll('.nav-item .control-content > span')].some(label => label.scrollWidth > label.clientWidth),
          reserved: parseFloat(getComputedStyle(document.querySelector('main')).paddingBottom),
          height: nav.getBoundingClientRect().height,
        }));
        expect(navMetrics.overflow, 'enlarged navigation labels must wrap within their targets').toBe(false);
        expect(navMetrics.reserved).toBeGreaterThanOrEqual(navMetrics.height + 16);
        const available = await page.evaluate(() => {
          const header = document.querySelector('.app-header');
          const headerHeight = ['sticky', 'fixed'].includes(getComputedStyle(header).position) ? header.getBoundingClientRect().height : 0;
          return { space: innerHeight - headerHeight - document.querySelector('.bottom-nav').getBoundingClientRect().height, line: parseFloat(getComputedStyle(document.querySelector('h1')).lineHeight) };
        });
        expect(available.space, 'sticky surfaces must leave room for a complete enlarged line').toBeGreaterThanOrEqual(available.line);
      }
      if (route === 'map') await page.screenshot({ path: `${evidence}/text-200-${width}x${height}.png`, fullPage: true });
    }
  }
});

test('short landscape sheet keeps title and Close available while its body scrolls', async ({ page }) => {
  await page.setViewportSize({ width: 800, height: 360 });
  await page.goto('/#design-system');
  await page.getByRole('button', { name: 'Open specimen sheet' }).click();
  await page.getByRole('button', { name: 'Reset sheet example' }).scrollIntoViewIfNeeded();
  const dialog = page.getByRole('dialog');
  expect(await dialog.evaluate(element => {
    const bounds = element.getBoundingClientRect();
    return [...element.querySelectorAll('h2, [aria-label="Close sheet"]')].every(control => { const rect = control.getBoundingClientRect(); return rect.top >= bounds.top && rect.bottom <= bounds.bottom; });
  }), 'sheet title and Close must remain inside the visible modal').toBe(true);
});

test('font fallback, reduced motion and keyboard focus remain usable', async ({ page }) => {
  await page.route('**/*.ttf', route => route.abort());
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#design-system');
  await expect(page.getByRole('button', { name: 'Run simulated save' })).toBeVisible();
  await expect(page.locator('.progress-icon').first()).toHaveCSS('animation-name', 'none');
  const button = page.getByRole('button', { name: 'Run simulated save' });
  await button.focus();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Shift+Tab');
  await expect(button).toBeFocused();
  await expect(button).toHaveCSS('outline-style', 'solid');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.locator('.specimen-section').first().screenshot({ path: `${evidence}/fallback-reduced-motion.png` });
});

test('rendered action colors retain specified text contrast across variants', async ({ page }) => {
  await page.goto('/#design-system');
  const colors = await page.locator('.specimen-section').first().locator('button.framed').evaluateAll(elements => elements.map(element => ({ text: getComputedStyle(element).color, fill: getComputedStyle(element.querySelector('.frame-fill')).fill })));
  const luminance = rgb => {
    const [r, g, b] = rgb.match(/[\d.]+/g).slice(0, 3).map(value => { const n = Number(value) / 255; return n <= .04045 ? n / 12.92 : ((n + .055) / 1.055) ** 2.4; });
    return .2126 * r + .7152 * g + .0722 * b;
  };
  for (const pair of colors) {
    const a = luminance(pair.text), b = luminance(pair.fill);
    expect((Math.max(a, b) + .05) / (Math.min(a, b) + .05)).toBeGreaterThanOrEqual(4.5);
  }
});

