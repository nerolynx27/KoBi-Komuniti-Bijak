import { mkdir, readFile, writeFile, copyFile } from 'node:fs/promises';
import { chromium } from '@playwright/test';
import { createFilmTimeline, FILM_DURATION, filmScenes } from '../src/dev/storyboard/filmTimeline.mjs';

const project = new URL('../videos/report-to-repair/', import.meta.url);
const browser = await chromium.launch({ channel: 'msedge', headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto('http://127.0.0.1:5182/animation.html');
  await page.evaluate(() => document.fonts.ready);
  await page.locator('.film-panel .pixel-frame').first().waitFor();
  await page.waitForFunction(() => { const logo = document.querySelector('.film-logo'); return logo?.complete && logo.naturalWidth > 0; });
  // Font loading can resize cards before ResizeObserver has rebuilt their SVG frames.
  await page.waitForFunction(() => [...document.querySelectorAll('.film-panel, .film-logo-card')].every(card => {
    const frame = card.querySelector(':scope > .pixel-frame');
    return frame && Math.abs(Number(frame.getAttribute('height')) - card.offsetHeight - 2) <= 1 && Math.abs(Number(frame.getAttribute('width')) - card.offsetWidth - 2) <= 1;
  }));
  const snapshot = await page.evaluate(() => ({
    html: document.querySelector('#kobi-film').outerHTML,
    css: [...document.styleSheets].flatMap(sheet => [...sheet.cssRules].map(rule => rule.cssText)).join('\n'),
  }));
  const html = snapshot.html.replace(/style="--preview-scale:[^"]*"/, '').replaceAll('/assets/', 'assets/');
  const css = snapshot.css.replaceAll('/assets/', 'assets/').replace(/transition:[^;}]+;?/g, '');
  const script = `window.__timelines = window.__timelines || {};\nconst FILM_DURATION=${FILM_DURATION};\nconst filmScenes=${JSON.stringify(filmScenes)};\n${createFilmTimeline.toString()}\ncreateFilmTimeline(document.getElementById('kobi-film'));`;
  await mkdir(new URL('assets/ui/', project), { recursive: true });
  await mkdir(new URL('assets/brand/', project), { recursive: true });
  await copyFile(new URL('../public/assets/brand/kobi-logo.png', import.meta.url), new URL('assets/brand/kobi-logo.png', project));
  for (const file of ['bungee-regular.ttf', 'yanone-kaffeesatz-variable.ttf', 'icons.svg']) await copyFile(new URL(`../public/assets/ui/${file}`, import.meta.url), new URL(`assets/ui/${file}`, project));
  await writeFile(new URL('index.html', project), `<!doctype html>\n<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=1280,height=720"><title>KoBi — From report to repair</title><style>${css}\nhtml,body{margin:0;width:100%;height:100%;overflow:hidden}.film-canvas{width:100%;height:100%;transform:none;left:0;top:0}</style></head><body>${html}<script>${script}</script></body></html>\n`);
  await writeFile(new URL('BRIEF.md', project), '# KoBi — From report to repair\n\nApproved seven-frame storyboard, 22 October 2026. 38 seconds, 1280×720, silent browser animation. Use Development specimen shared React components and approved Master World artwork. Camera focus, facility pointer selection, staged report, confirmation, explicit later maintenance update, light restoration and closing. No character sprites, generated artwork, real submissions or saved data. User approved animation after reviewing the storyboard. Final video export is separate.\n');
  await writeFile(new URL('STORYBOARD.md', project), await readFile(new URL('../docs/verification/REPORT_TO_REPAIR_STORYBOARD.md', import.meta.url), 'utf8'));
  console.log('Prepared standalone HyperFrames composition from the actual rendered React specimen components.');
} finally { await browser.close(); }
