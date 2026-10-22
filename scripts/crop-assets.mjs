import { chromium } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const outDir = 'c:\\Users\\user\\Desktop\\hackathon\\public\\assets\\slides';
fs.mkdirSync(outDir, { recursive: true });

// Copy media-22.png as uniten-logo.png
fs.copyFileSync(path.join(outDir, 'media-22.png'), path.join(outDir, 'uniten-logo.png'));
// Copy media-21.png as township-render.png
fs.copyFileSync(path.join(outDir, 'media-21.png'), path.join(outDir, 'township-render.png'));

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1920, height: 1080 }
});
const page = await context.newPage();

await page.goto('https://canva.link/ydp3mlz4i455cff', {
  waitUntil: 'domcontentloaded',
  timeout: 60000
});
await page.waitForTimeout(6000);

// Collapse left sidebar
const collapseBtn = page.locator('button[aria-label="Collapse"]');
if (await collapseBtn.count() > 0) {
  await collapseBtn.first().click().catch(() => {});
  await page.waitForTimeout(1000);
}

// Find thumbnail coordinates
const ps = await page.evaluate(() => {
  return Array.from(document.querySelectorAll('p'))
    .filter(el => /^[1-9]|10|11$/.test(el.textContent.trim()) && el.getBoundingClientRect().y > 850)
    .map(el => {
      const r = el.getBoundingClientRect();
      return { num: el.textContent.trim(), x: Math.round(r.x + 30), y: Math.round(r.y - 30) };
    });
});

async function goToSlide(n) {
  const p = ps.find(x => x.num === String(n));
  if (p) {
    await page.mouse.click(p.x, p.y);
    await page.waitForTimeout(1500);
  }
}

// Slide 1: Crop KoBi logo badge
await goToSlide(1);
await page.screenshot();
// Let's inspect images on Slide 1
const s1Images = await page.evaluate(() => {
  return Array.from(document.querySelectorAll('img, image'))
    .map(el => {
      const r = el.getBoundingClientRect();
      return { tag: el.tagName, src: el.src || el.getAttribute('xlink:href') || el.getAttribute('href'), x: r.x, y: r.y, w: r.width, h: r.height };
    })
    .filter(x => x.w > 40 && x.h > 40 && x.y > 60 && x.y < 950);
});
console.log('Slide 1 images:', s1Images);

// Slide 3: Sime Darby Logo and crowd photo
await goToSlide(3);
const s3Images = await page.evaluate(() => {
  return Array.from(document.querySelectorAll('img, image'))
    .map(el => {
      const r = el.getBoundingClientRect();
      return { tag: el.tagName, src: el.src || el.getAttribute('xlink:href') || el.getAttribute('href'), x: r.x, y: r.y, w: r.width, h: r.height };
    })
    .filter(x => x.w > 40 && x.h > 40 && x.y > 60 && x.y < 950);
});
console.log('Slide 3 images:', s3Images);

fs.writeFileSync(path.join(outDir, 'slide-images-inspection.json'), JSON.stringify({ s1Images, s3Images }, null, 2));

await browser.close();
console.log('Crop inspection complete!');
