import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { chromium } from '@playwright/test';
import { fileURLToPath } from 'node:url';

// Run the unchanged six-option preview, preserving its original indexes and seeds.
const root = new URL('../', import.meta.url);
const html = await readFile(new URL('public/paper-textures.html', root), 'utf8');
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage();
  await page.setContent('<canvas data-texture="grain"></canvas><canvas data-texture="cotton"></canvas><canvas data-texture="recycled"></canvas><canvas data-texture="laid"></canvas><canvas data-texture="woven"></canvas><canvas data-texture="parchment"></canvas>');
  await page.addScriptTag({ content: script });
  const assets = await page.evaluate(() => [
    ['fine-grain', 0], ['laid-paper', 3], ['woven-paper', 4],
  ].map(([name, index]) => {
    const canvas = document.querySelectorAll('canvas')[index], ctx = canvas.getContext('2d');
    const pixels = ctx.getImageData(0,0,640,640); let marks = 0;
    for (let i=0; i<pixels.data.length; i+=4) {
      if (pixels.data[i] === 229) pixels.data.fill(0,i,i+4);
      else { pixels.data[i+3] = 255; marks++; }
    }
    ctx.putImageData(pixels,0,0);
    return { name, coverage: marks/409600, data: canvas.toDataURL('image/png').split(',')[1] };
  }));
  const output = new URL('public/assets/ui/paper/',root); await mkdir(output,{recursive:true});
  for (const {name,coverage,data} of assets) {
    const bytes = Buffer.from(data,'base64');
    await writeFile(new URL(name+'-mask.png',output),bytes);
    console.log(name+': 640x640; binary alpha; '+(coverage*100).toFixed(2)+'%; '+bytes.length+' bytes');
  }
  console.log('Exported to '+fileURLToPath(output));
} finally { await browser.close(); }
