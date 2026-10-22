import { test, expect } from '@playwright/test';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

const root = 'artifacts/bulletin-dashboard/phase-1';
const baselineRoot = 'artifacts/gateway-dashboard/phase-1/before';
const capture = process.env.BULLETIN_CAPTURE === 'before' ? 'before' : 'after';
const viewports = [[360, 800], [390, 844], [768, 1024], [1280, 800]];

async function open(page) {
  await page.goto('/#design-system');
  await expect(page.locator('.specimen')).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator('.specimen .pixel-frame').first()).toBeAttached();
}

async function metrics(page) {
  return page.evaluate(() => {
    const selectors = '.specimen-section, .specimen h2, .specimen .button, .specimen .button-label, .specimen .card, .specimen input, .specimen textarea, .specimen select, .specimen .icon, .specimen img, .specimen-actions, .specimen-fields, dialog[open], dialog[open] .button, dialog[open] .form-input';
    return [...document.querySelectorAll(selectors)].filter(el => el.checkVisibility()).map(el => {
      const rect = el.getBoundingClientRect(), css = getComputedStyle(el);
      return { tag: el.tagName, className: el.getAttribute('class'), text: el.textContent.trim(), box: [rect.x + scrollX, rect.y + scrollY, rect.width, rect.height], font: [css.fontFamily, css.fontSize, css.lineHeight, css.fontWeight], spacing: [css.padding, css.gap, css.margin], image: el.tagName === 'IMG' ? [el.naturalWidth, el.naturalHeight] : null };
    });
  });
}

async function record(page, name) {
  const directory = `${root}/${capture}`;
  await mkdir(directory, { recursive: true });
  await page.evaluate(() => Promise.all(document.getAnimations().filter(animation => animation.effect?.target?.closest('.modal')).map(animation => animation.finished)));
  const actual = await metrics(page);
  await writeFile(`${directory}/${name}.json`, JSON.stringify(actual, null, 2), capture === 'before' ? { flag: 'wx' } : undefined);
  await page.screenshot({ path: `${directory}/${name}.png`, fullPage: true });
  if (name.endsWith('-sheet') || name.endsWith('-confirmation')) await page.screenshot({ path: `${directory}/${name}-viewport.png` });
  if (capture === 'before') return;
  const baseline = JSON.parse(await readFile(`${baselineRoot}/${name}.json`, 'utf8'));
  expect(actual.length, name).toBe(baseline.length);
  actual.forEach((item, i) => {
    expect({ ...item, box: undefined }, `${name} item ${i}`).toEqual({ ...baseline[i], box: undefined });
    item.box.forEach((value, j) => expect(Math.abs(value - baseline[i].box[j]), `${name} item ${i} box ${j}`).toBeLessThanOrEqual(1));
  });
}

for (const [width, height] of viewports) {
  test(`specimen preserves baseline at ${width}x${height}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await open(page);
    await record(page, `${width}x${height}`);
    await page.locator('.specimen-section').first().screenshot({ path: `${root}/${capture}/${width}-actions.png`, style: 'header { visibility: hidden !important; }' });
    await page.locator('.specimen .card').screenshot({ path: `${root}/${capture}/${width}-card.png` });
    await page.getByRole('button', { name: 'Open specimen sheet', exact: true }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await record(page, `${width}x${height}-sheet`);
    await page.getByRole('button', { name: 'Reset sheet example', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Cancel', exact: true })).toBeFocused();
    await record(page, `${width}x${height}-confirmation`);
    await page.getByRole('button', { name: 'Cancel', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Reset sheet example', exact: true })).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).not.toBeVisible();
    await page.getByLabel('Specimen photo', { exact: true }).setInputFiles({ name: 'example.png', mimeType: 'image/png', buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aEuoAAAAASUVORK5CYII=', 'base64') });
    await expect(page.locator('.photo-picker img')).toBeVisible();
    await record(page, `${width}x${height}-photo`);
  });
}

test('gateway is scoped, layered, decorative and retains native hit boxes', async ({ page }) => {
  await open(page);
  await expect(page.locator('.specimen .pixel-frame-gateway').first()).toBeAttached();
  await expect(page.locator('.specimen .card > .pixel-frame-gateway')).toHaveCount(1);
  await expect(page.locator('.specimen .card > h3')).toBeVisible();
  const frames = await page.locator('.specimen .pixel-frame').evaluateAll(elements => elements.map(el => {
    const rect = el.getBoundingClientRect(), target = el.parentElement.getBoundingClientRect();
    return { hidden: el.getAttribute('aria-hidden'), focusable: el.getAttribute('focusable'), pointer: getComputedStyle(el).pointerEvents, x: rect.x - target.x, y: rect.y - target.y, overflowX: rect.right - target.right, overflowY: rect.bottom - target.bottom, panel: el.parentElement.matches('.card'), keyline: !!el.querySelector('.frame-keyline') };
  }));
  for (const { overflowX, overflowY, panel, ...frame } of frames) {
    expect(frame).toEqual({ hidden: 'true', focusable: 'false', pointer: 'none', x: 0, y: 0, keyline: !panel });
    const shadow = panel ? 2 : 4;
    expect(Math.abs(overflowX - shadow)).toBeLessThanOrEqual(0.5);
    expect(Math.abs(overflowY - shadow)).toBeLessThanOrEqual(0.5);
  }
  await expect(page.locator('.button-text .pixel-frame')).toHaveCount(0);
  for (const route of ['map', 'reports', 'activities', 'profile', 'sdp']) {
    await page.goto(`/#${route}`);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.locator('.pixel-frame-gateway')).toHaveCount(0);
    await expect(page.locator('.card[data-frame-style="gateway"]')).toHaveCount(0);
  }
});

test('Bulletin tickets and folded panels expose live semantics without leaking React props', async ({ page }) => {
  await open(page);
  const primary = page.locator('.specimen .button-primary').first();
  const strong = page.locator('.specimen .button-strong').first();
  for (const action of [primary, strong]) await expect(action.locator('.pixel-frame')).toHaveAttribute('data-frame-shape', 'ticket');
  expect(await primary.locator('.frame-fill').evaluate(el => getComputedStyle(el).fill)).toBe('rgb(206, 162, 87)');
  expect(await strong.locator('.frame-fill').evaluate(el => getComputedStyle(el).fill)).toBe('rgb(108, 26, 33)');
  expect(await strong.evaluate(el => getComputedStyle(el).color)).toBe('rgb(229, 224, 205)');
  await expect(page.locator('.specimen .card .frame-fold')).toHaveCount(1);
  await expect(page.locator('.specimen .card .frame-paper-fold')).toHaveCount(0);
  await expect(page.locator('[frameshape], [folded], [tone]')).toHaveCount(0);
  // The original fallback stays readable if measurement/decoration is unavailable.
  await primary.locator('.pixel-frame').evaluate(el => el.remove());
  expect(await primary.evaluate(el => ({ fill: getComputedStyle(el).backgroundColor, border: getComputedStyle(el).borderTopColor }))).toEqual({ fill: 'rgb(206, 162, 87)', border: 'rgb(108, 26, 33)' });
});

test('strong panel reuses the existing record example without changing its content box', async ({ page }) => {
  // Exercise the same specimen Card in an alternate tone; no gallery or app-only switch.
  await page.route('**/src/dev/DesignSystemPage.jsx*', async route => {
    const response = await route.fetch(), original = await response.text();
    const body = original.replace('folded: true', 'tone: "strong"');
    if (body === original) throw new Error('Expected the existing folded record Card.');
    await route.fulfill({ response, body });
  });
  await open(page);
  const card = page.locator('.specimen .card');
  await expect(card).toHaveAttribute('data-frame-tone', 'strong');
  expect(await card.locator(':scope > .pixel-frame .frame-fill').evaluate(el => getComputedStyle(el).fill)).toBe('rgb(108, 26, 33)');
  expect(await card.locator(':scope > .pixel-frame .frame-rim').evaluate(el => getComputedStyle(el).fill)).toBe('rgb(206, 162, 87)');
  expect(await card.locator('h3').evaluate(el => getComputedStyle(el).color)).toBe('rgb(229, 224, 205)');
  await expect(card.locator('.frame-fold')).toHaveCount(0);
  const baseline = JSON.parse(await readFile(`${baselineRoot}/390x844.json`, 'utf8')).find(item => item.tag === 'SECTION' && item.className.trim() === 'card');
  const box = await card.boundingBox();
  expect(box.width).toBe(baseline.box[2]); expect(box.height).toBe(baseline.box[3]);
  await card.screenshot({ path: `${root}/after/390-strong-panel.png` });
  await expect(page.locator('[frameshape], [folded], [tone]')).toHaveCount(0);
});

test('states, keyboard activation and modal controls retain their behavior', async ({ page }) => {
  await open(page);
  const unavailable = page.getByRole('button', { name: 'Unavailable', exact: true });
  await expect(unavailable).toBeDisabled();
  expect(await unavailable.locator('.frame-shadow').evaluate(el => getComputedStyle(el).display)).toBe('none');
  const save = page.getByRole('button', { name: 'Run simulated save', exact: true });
  await save.focus();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Shift+Tab');
  await expect(save).toBeFocused();
  expect(await save.evaluate(el => getComputedStyle(el).outlineStyle)).not.toBe('none');
  await page.keyboard.press('Enter');
  const pending = page.getByRole('button', { name: 'Saving…', exact: true });
  await expect(pending).toHaveAttribute('aria-busy', 'true');
  await pending.click();
  await page.keyboard.press('Enter');
  await expect(page.getByText('Simulated saves: 1', { exact: true })).toBeVisible();
  await expect(page.getByText('Simulated saves: 2', { exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'Open specimen confirmation', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Cancel', exact: true })).toBeFocused();
  await expect(page.getByRole('dialog').locator('.pixel-frame-gateway')).toHaveCount(2);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Open specimen confirmation', exact: true })).toBeFocused();
});

test('specimen handles short landscape and 200 percent text without overflow', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const [width, height, textSize] of [[800, 360, '100%'], [360, 800, '200%']]) {
    await page.setViewportSize({ width, height });
    await open(page);
    await page.evaluate(size => { document.documentElement.style.fontSize = size; }, textSize);
    // The shared single-line footer is outside the Phase 1 provider and overflows at 200%.
    const overflow = await page.locator('.specimen').evaluate(root => [...root.querySelectorAll('*')].filter(el => el.checkVisibility() && el.getBoundingClientRect().right > innerWidth + 1 && el.tagName !== 'path').map(el => ({ text: el.textContent.trim(), tag: el.tagName, className: el.getAttribute('class'), right: el.getBoundingClientRect().right })));
    expect(overflow).toEqual([]);
    const boxes = await page.locator('.specimen .button').evaluateAll(elements => elements.filter(el => el.checkVisibility()).map(el => ({ width: el.getBoundingClientRect().width, height: el.getBoundingClientRect().height })));
    for (const box of boxes) { expect(box.width).toBeGreaterThanOrEqual(44); expect(box.height).toBeGreaterThanOrEqual(44); }
    expect(await page.locator('.progress-icon').first().evaluate(el => getComputedStyle(el).animationName)).toBe('none');
    await page.screenshot({ path: `${root}/after/${width}x${height}-${textSize}.png`, fullPage: true });
  }
});
