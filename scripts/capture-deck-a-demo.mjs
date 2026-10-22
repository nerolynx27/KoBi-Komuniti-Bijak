import fs from 'node:fs';
import path from 'node:path';
import { createServer } from 'vite';
import { chromium } from '@playwright/test';

const output = path.resolve('public/assets/slides/deck-a-demo');
fs.mkdirSync(output, { recursive: true });
const server = await createServer({ server: { host: '127.0.0.1', port: 5194, strictPort: true }, logLevel: 'warn' });
await server.listen();
const browser = await chromium.launch({ headless: true });
try {
  const routes = [
    ['map', 'map'],
    ['report', 'reports/new?facility=lamp-01'],
    ['progress', 'reports/00000000-0000-4000-8000-000000000012'],
    ['activities', 'activities'],
    ['activity-detail', 'activities/00000000-0000-4000-8000-000000000031'],
  ];
  for (const [name, route] of routes) {
    const page = await browser.newPage({ viewport: { width: 560, height: 900 }, deviceScaleFactor: 2 });
    await page.goto(`http://127.0.0.1:5194/#${route}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    if (name === 'report') await page.getByLabel(/^Description/).fill('The walkway lamp is not lighting up in the evening.');
    // Keep the actual screen content and its demo labels; hide fixed navigation only for the capture.
    await page.addStyleTag({ content: 'nav[aria-label="Main navigation"] { display: none !important; }' });
    // Match the deck's 20% body-type increase without changing the live app.
    await page.evaluate(() => {
      const bodyText = Array.from(document.querySelectorAll('body *')).filter(node => getComputedStyle(node).fontFamily.includes('Yanone')).map(node => [node, parseFloat(getComputedStyle(node).fontSize)]);
      for (const [node, size] of bodyText) node.style.fontSize = `${size * 1.2}px`;
    });
    const shell = await page.locator('.app-shell').boundingBox();
    await page.screenshot({ path: path.join(output, `${name}.png`), clip: { x: shell.x, y: 0, width: shell.width, height: 900 } });
    console.log(`Captured ${name}`);
    await page.close();
  }
  const page = await browser.newPage();
  await page.setViewportSize({ width: 560, height: 900 });
  await page.goto('http://127.0.0.1:5194/reports-sandbox.html', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Resolved', exact: true }).click();
  await page.getByRole('button', { name: 'Inspect evidence', exact: true }).first().click();
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => {
    const bodyText = Array.from(document.querySelectorAll('.sandbox-modal-card *')).filter(node => getComputedStyle(node).fontFamily.includes('Yanone')).map(node => [node, parseFloat(getComputedStyle(node).fontSize)]);
    for (const [node, size] of bodyText) node.style.fontSize = `${size * 1.2}px`;
  });
  await page.locator('.sandbox-modal-card').screenshot({ path: path.join(output, 'evidence.png') });
  console.log('Captured sample completion evidence');
  const files = fs.readdirSync('public/assets/slides').filter(name => /^media-\d+\.(jpg|png)$/.test(name));
  await page.setViewportSize({ width: 1600, height: 1200 });
  await page.setContent(`<body style="margin:0;background:#E5E0CD;display:grid;grid-template-columns:repeat(6,1fr);gap:16px;padding:16px">${files.map(name => `<figure style="margin:0"><img style="width:240px;height:140px;object-fit:contain" src="data:image/${name.endsWith('png') ? 'png' : 'jpeg'};base64,${fs.readFileSync(`public/assets/slides/${name}`).toString('base64')}"><figcaption>${name}</figcaption></figure>`).join('')}</body>`);
  await page.screenshot({ path: path.resolve('artifacts/slides/media-overview.png'), fullPage: true });
} finally {
  await browser.close();
  await server.close();
}
