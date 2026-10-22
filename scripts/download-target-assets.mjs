import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import https from 'https';

const outDir = 'c:\\Users\\user\\Desktop\\hackathon\\public\\assets\\slides';
fs.mkdirSync(outDir, { recursive: true });

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        return downloadFile(response.headers.location, dest).then(resolve).catch(reject);
      }
      response.pipe(file);
      file.on('finish', () => file.close(resolve));
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

await page.goto('https://canva.link/ydp3mlz4i455cff', {
  waitUntil: 'domcontentloaded',
  timeout: 60000
});
await page.waitForTimeout(6000);

// Collapse sidebar
const collapseBtn = page.locator('button[aria-label="Collapse"]');
if (await collapseBtn.count() > 0) {
  await collapseBtn.first().click().catch(() => {});
  await page.waitForTimeout(1000);
}

// Download Slide 1 images
const s1Images = await page.evaluate(() => {
  return Array.from(document.querySelectorAll('img, image'))
    .map(el => {
      const r = el.getBoundingClientRect();
      return { tag: el.tagName, src: el.src || el.getAttribute('xlink:href') || el.getAttribute('href'), x: r.x, y: r.y, w: r.width, h: r.height };
    })
    .filter(x => x.w > 40 && x.h > 40 && x.y > 60 && x.y < 950);
});

for (const img of s1Images) {
  if (img.src.includes('e8ce2dae')) {
    console.log('Downloading aerial-neighborhood.jpg...');
    await downloadFile(img.src, path.join(outDir, 'aerial-neighborhood.jpg'));
  }
}

// Extract KoBi badge via screenshot of its element or canvas
const badgeImg = s1Images.find(img => img.w > 200 && img.w < 350 && img.x > 500 && img.x < 1000);
if (badgeImg) {
  // Take screenshot of badge rect
  console.log('Taking screenshot of KoBi badge rect:', badgeImg);
  await page.screenshot({
    path: path.join(outDir, 'kobi-badge.png'),
    clip: { x: badgeImg.x, y: badgeImg.y, width: badgeImg.w, height: badgeImg.h }
  });
}

// Navigate to Slide 3
const ps = await page.evaluate(() => {
  return Array.from(document.querySelectorAll('p'))
    .filter(el => /^[1-9]|10|11$/.test(el.textContent.trim()) && el.getBoundingClientRect().y > 850)
    .map(el => {
      const r = el.getBoundingClientRect();
      return { num: el.textContent.trim(), x: Math.round(r.x + 30), y: Math.round(r.y - 30) };
    });
});
const p3 = ps.find(x => x.num === '3');
if (p3) {
  await page.mouse.click(p3.x, p3.y);
  await page.waitForTimeout(1500);

  const s3Images = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('img, image'))
      .map(el => {
        const r = el.getBoundingClientRect();
        return { tag: el.tagName, src: el.src || el.getAttribute('xlink:href') || el.getAttribute('href'), x: r.x, y: r.y, w: r.width, h: r.height };
      })
      .filter(x => x.w > 40 && x.h > 40 && x.y > 60 && x.y < 950);
  });

  for (const img of s3Images) {
    if (img.src.includes('a7afc5f1')) {
      console.log('Downloading crowd-residents.png...');
      await downloadFile(img.src, path.join(outDir, 'crowd-residents.png'));
    } else if (img.src.includes('b04a25f8')) {
      console.log('Downloading sime-darby-building.png...');
      await downloadFile(img.src, path.join(outDir, 'sime-darby-building.png'));
    } else if (img.src.includes('MAHLsbi7p_E')) {
      console.log('Downloading community-icon.png...');
      await downloadFile(img.src, path.join(outDir, 'community-icon.png'));
    } else if (img.src.includes('53662412')) {
      console.log('Downloading sime-darby-logo.png...');
      await downloadFile(img.src, path.join(outDir, 'sime-darby-logo.png'));
    }
  }
}

// Navigate to Slide 10 for township entrance photo
const p10 = ps.find(x => x.num === '10');
if (p10) {
  await page.mouse.click(p10.x, p10.y);
  await page.waitForTimeout(1500);

  const s10Images = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('img, image'))
      .map(el => {
        const r = el.getBoundingClientRect();
        return { tag: el.tagName, src: el.src || el.getAttribute('xlink:href') || el.getAttribute('href'), x: r.x, y: r.y, w: r.width, h: r.height };
      })
      .filter(x => x.w > 100 && x.h > 100 && x.y > 60 && x.y < 950);
  });

  const bg10 = s10Images.find(img => img.w > 600);
  if (bg10 && bg10.src.startsWith('https://')) {
    console.log('Downloading township-entrance.png...');
    await downloadFile(bg10.src, path.join(outDir, 'township-entrance.png'));
  }
}

await browser.close();
console.log('All targeted slide assets downloaded successfully!');
