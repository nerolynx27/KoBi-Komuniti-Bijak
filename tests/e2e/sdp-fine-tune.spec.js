import { test, expect } from '@playwright/test';

for (const [width, height] of [[320,800], [360,800], [390,844], [402,874], [768,1024], [1440,900]]) {
  test(`SDP ticket spacing and smooth surfaces at ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.goto('/sdp-workspace.html#sdp');
    await page.evaluate(() => document.fonts.ready);
    const columns = await page.locator('.sdp-report-row > div, .sdp-event-body > div').evaluateAll(es => es.map(e => ({left:e.getBoundingClientRect().left, padding:getComputedStyle(e).paddingLeft})));
    expect(columns).toHaveLength(3);
    expect(new Set(columns.map(e=>e.left)).size).toBe(1);
    expect(columns.every(e=>e.padding==='12px')).toBe(true);
    const label = await page.locator('.sdp-card-event h2').boundingBox();
    const body = await page.locator('.sdp-event-body').boundingBox();
    const event = await page.locator('.sdp-card-event').boundingBox();
    const shortcuts = await page.locator('.sdp-dashboard-shortcuts').boundingBox();
    expect(label.y+label.height).toBeLessThanOrEqual(body.y);
    expect(event.y+event.height).toBeLessThan(shortcuts.y);
    expect(await page.locator('.sdp-card-backing').evaluateAll(es=>es.every(e=>getComputedStyle(e,'::after').display==='none'))).toBe(true);
    expect(await page.locator('.app-shell').evaluate(e=>getComputedStyle(e,'::before').display)).toBe('block');
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    if (width===402) await page.screenshot({path:'artifacts/sdp-fine-tune-402.png',fullPage:true});
  });
}

test('SDP sections share the inverted resident header and working menu', async ({ page }) => {
  for (const path of ['sdp','sdp/reports','sdp/activities','sdp/world']) {
    await page.goto('/sdp-workspace.html#'+path);
    await expect(page.locator('.app-header.bulletin-header')).toBeVisible();
    expect(await page.locator('.app-header').evaluate(e=>getComputedStyle(e).backgroundColor)).toBe('rgb(108, 26, 33)');
    await expect(page.getByRole('link',{name:'KoBi workspace',exact:true})).toHaveAttribute('href','#sdp');
    await page.getByRole('button',{name:'Open app menu',exact:true}).click();
    await expect(page.getByRole('button',{name:'Reset demo data',exact:true})).toBeVisible();
    await page.keyboard.press('Escape');
  }
  await page.goto('/sdp-workspace.html#home');
  expect(await page.locator('.app-header').evaluate(e=>getComputedStyle(e).backgroundColor)).toBe('rgb(229, 224, 205)');
});
