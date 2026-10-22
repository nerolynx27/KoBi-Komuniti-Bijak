import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { chromium } from '@playwright/test';

const browser = await chromium.launch({ channel: 'msedge', headless: true });
try {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  for (const [name, width, height] of [['desktop', 1440, 1000], ['mobile', 390, 844]]) {
    await page.setViewportSize({ width, height });
    await page.goto('http://127.0.0.1:5182/storyboard.html');
    await page.evaluate(() => document.fonts.ready);
    await page.locator('.pixel-frame').first().waitFor();
    assert.equal(await page.locator('.sb-scene').count(), 7);
    await page.waitForFunction(() => [...document.querySelectorAll('.sb-art img')].every(image => image.complete && image.naturalWidth > 0));
    const overflow = await page.evaluate(() => ({ width: innerWidth, scroll: document.documentElement.scrollWidth, elements: [...document.querySelectorAll('body *')].filter(element => element.getBoundingClientRect().right > innerWidth + 2 && !element.closest('.sb-art')).map(element => element.className).slice(0, 12) }));
    console.log(name, JSON.stringify(overflow));
    assert(overflow.scroll <= width, `${name} has horizontal overflow`);
    const clippedPanels = await page.locator('.sb-panel, .sb-title-card').evaluateAll(panels => panels.filter(panel => {
      const bounds = panel.getBoundingClientRect();
      const frame = panel.closest('.sb-frame').getBoundingClientRect();
      const caption = panel.closest('.sb-frame').querySelector('.sb-caption').getBoundingClientRect();
      return bounds.top < frame.top + 48 || bounds.bottom > caption.top;
    }).map(panel => ({ scene: panel.closest('.sb-scene').id, height: panel.getBoundingClientRect().height })));
    assert.deepEqual(clippedPanels, [], `${name} has clipped scene panels`);
    await mkdir('output/storyboard-review', { recursive: true });
    await page.screenshot({ path: `output/storyboard-review/${name}.png`, fullPage: true });
    if (name === 'desktop') await page.screenshot({ path: 'output/storyboard-review/preview.png' });
    await page.locator('#scene-4 .sb-frame').screenshot({ path: `output/storyboard-review/${name}-form.png` });
    await page.getByRole('link', { name: '06', exact: true }).click();
    assert.equal(new URL(page.url()).hash, '#scene-6');
    assert.equal(await page.evaluate(() => localStorage.length), 0);
    console.log(`${name}: seven frames, loaded artwork, panel fit, scene navigation, no storage writes passed`);
  }
  assert.deepEqual(errors, []);
  console.log('No browser errors.');
} finally {
  await browser.close();
}
