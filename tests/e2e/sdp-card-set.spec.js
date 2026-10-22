import { test, expect } from '@playwright/test';

const url = '/art/sdp-card-set-01/review.html';

test('ticket previews keep text clear of bookmarks and dividers', async ({ page }) => {
  for (const width of [360, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(url);
    await page.evaluate(() => document.fonts.ready);
    for (const backing of ['prepared', 'source-studies']) {
      for (const [id, minimumInset] of [['06-priority-report', 68], ['07-secondary-report', 58], ['08-upcoming-event', 88]]) {
        const article = page.locator(`[data-card-id="${id}"]`);
        await article.locator('select').selectOption(backing);
        const layout = await article.locator('.live-candidate').evaluate(el => {
          const card = el.getBoundingClientRect(), title = el.querySelector('h3').getBoundingClientRect();
          const stage = el.closest('.native-stage');
          const label = el.querySelector('.sdp-priority-label')?.getBoundingClientRect();
          return { inset: title.left - card.left, fits: stage.scrollWidth <= stage.clientWidth, labelInside: !label || label.top >= card.top };
        });
        expect(layout.inset, `${id}: text clears artwork`).toBeGreaterThanOrEqual(minimumInset);
        expect(layout.fits, `${id}: preview fits its panel`).toBe(true);
        expect(layout.labelInside, `${id}: priority label stays inside ribbon`).toBe(true);
      }
    }
  }
});
test('ten-card review loads every reference and generated backing without demo-store access', async ({ page }) => {
  await page.addInitScript(() => {
    window.cardSetStorage = [];
    for (const name of ['getItem', 'setItem']) {
      const original = Storage.prototype[name];
      Storage.prototype[name] = function (...args) { window.cardSetStorage.push(args[0]); return original.apply(this, args); };
    }
  });
  await page.goto(url);
  await expect(page.getByRole('heading', { name: 'SDP cards — all 10', exact: true })).toBeVisible({ timeout: 4000 });
  await expect(page.locator('article[data-card-id]')).toHaveCount(10);
  await expect(page.locator('.candidate-skin')).toHaveCount(10);
  await expect.poll(() => page.locator('.reference-image, .generated-image').evaluateAll(els => els.length === 20 && els.every(el => el.complete && el.naturalWidth > 0))).toBe(true);
  expect(await page.evaluate(() => window.cardSetStorage.filter(key => key.startsWith('kobi.')))).toEqual([]);
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.getByRole('link', { name: 'Open SDP dashboard', exact: true })).toHaveAttribute('href', '/sdp-workspace.html#sdp');
  const priority = page.locator('article[data-card-id="06-priority-report"]');
  await page.getByLabel('Backing for Priority report ticket', { exact: true }).selectOption('source-studies');
  expect(await priority.locator('.candidate-skin').evaluate(el => getComputedStyle(el).borderImageSource)).toContain('source-studies/06-priority-report.png');
  await page.getByLabel('Backing for Priority report ticket', { exact: true }).selectOption('prepared');
  expect(await priority.locator('.candidate-skin').evaluate(el => getComputedStyle(el).borderImageSource)).toContain('prepared/06-priority-report.png');
  await expect(priority.getByRole('link', { name: 'Review reports', exact: true })).toHaveAttribute('href', '/sdp-workspace.html#sdp/reports');
  for (const attributes of await page.locator('.candidate-skin').evaluateAll(els => els.map(el => ({ hidden: el.getAttribute('aria-hidden'), pointer: getComputedStyle(el).pointerEvents })))) expect(attributes).toEqual({ hidden: 'true', pointer: 'none' });
});

for (const width of [360, 1280]) {
  test(`ten-card review fits ${width}px with normal and doubled text`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(url);
    await expect(page.locator('article[data-card-id]')).toHaveCount(10);
    await page.evaluate(() => document.fonts.ready);
    for (const fontSize of ['100%', '200%']) {
      await page.evaluate(size => { document.documentElement.style.fontSize = size; }, fontSize);
      await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await page.screenshot({ path: `artifacts/sdp-card-set/${width}-${fontSize}.png`, fullPage: true });
    }
  });
}
