import { test, expect } from '@playwright/test';

test('selected fonts load locally and use the intended heading, button and body roles', async ({ page }) => {
  const failures = [];
  page.on('response', response => {
    if (response.url().endsWith('.ttf') && !response.ok()) failures.push(response.url());
  });
  await page.goto('/#design-system');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Display name', exact: true })).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  const metrics = await page.evaluate(async () => {
    const loaded = await Promise.all(['400 20px Bungee', '400 16px "Yanone Kaffeesatz"', '700 16px "Yanone Kaffeesatz"'].map(font => document.fonts.load(font)));
    const family = element => getComputedStyle(element).fontFamily.split(',')[0].replaceAll('"', '');
    return {
      loaded: loaded.every(faces => faces.length > 0 && faces.every(face => face.status === 'loaded')),
      heading: family(document.querySelector('h1')),
      buttons: [...document.querySelectorAll('button')].every(button => family(button) === 'Bungee'),
      body: family(document.body),
      input: family(document.querySelector('.form-input')),
      families: [...new Set([...document.fonts].map(font => font.family))].sort(),
      palette: getComputedStyle(document.documentElement).getPropertyValue('--color-wine').trim(),
    };
  });
  expect(failures).toEqual([]);
  expect(metrics).toEqual({ loaded: true, heading: 'Bungee', buttons: true, body: 'Yanone Kaffeesatz', input: 'Yanone Kaffeesatz', families: ['Bungee', 'Yanone Kaffeesatz'], palette: '#6C1A21' });
});
