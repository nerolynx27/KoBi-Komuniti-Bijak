import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import { createServer } from 'vite';
import { chromium } from '@playwright/test';
import { SLIDES_DATA } from '../src/slides/slideData.js';

const root = path.resolve('.');
const build = path.join(root, 'tmp/deck-a-pptx');
const runtime = 'C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies';
const pkg = `${runtime}/node/node_modules/@oai/artifact-tool`;
await fs.mkdir(build, { recursive: true });
const server = await createServer({ server: { host: '127.0.0.1', port: 5196, strictPort: true }, logLevel: 'warn' });
await server.listen();
const browser = await chromium.launch({ headless: true });
const captured = [];
try {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  for (let index = 0; index < 11; index++) {
    await page.goto(`http://127.0.0.1:5196/#presentation?deck=deck-a&slide=${index}&export=true`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.locator('.deck-a-container').waitFor({ state: 'visible' });
    await page.evaluate(async () => { await document.fonts.ready; await Promise.all(Array.from(document.images, image => image.decode())); });
    const lines = await page.evaluate(() => {
      const stage = document.querySelector('.deck-a-container');
      const origin = stage.getBoundingClientRect();
      const walker = document.createTreeWalker(stage, NodeFilter.SHOW_TEXT);
      const nodes = [];
      while (walker.nextNode()) {
        const node = walker.currentNode;
        if (!node.textContent.trim() || node.parentElement.closest('svg,.deck-a-acc-title-vertical')) continue;
        const style = getComputedStyle(node.parentElement);
        if (style.visibility === 'hidden' || style.display === 'none') continue;
        nodes.push(node);
      }
      const lines = [];
      for (const node of nodes) {
        const style = getComputedStyle(node.parentElement);
        const groups = [];
        for (let char = 0; char < node.length; char++) {
          const range = document.createRange();
          range.setStart(node, char); range.setEnd(node, char + 1);
          const rect = range.getBoundingClientRect();
          if (!rect.width || !rect.height) continue;
          let group = groups.find(item => Math.abs(item.top - rect.top) < 2);
          if (!group) { group = { top: rect.top, left: rect.left, right: rect.right, height: rect.height, text: '' }; groups.push(group); }
          group.text += node.textContent[char];
          group.left = Math.min(group.left, rect.left); group.right = Math.max(group.right, rect.right);
        }
        for (const group of groups) {
          const text = group.text.trim();
          if (!text) continue;
          const displayed = style.textTransform === 'uppercase' ? text.toUpperCase() : text;
          lines.push({ text: displayed, left: group.left - origin.left, top: group.top - origin.top, width: group.right - group.left, height: group.height,
            fontSize: parseFloat(style.fontSize), family: style.fontFamily.includes('Bungee') ? 'Bungee' : 'Yanone Kaffeesatz',
            color: style.color, weight: parseInt(style.fontWeight, 10), letterSpacing: parseFloat(style.letterSpacing) || 0, shadow: style.textShadow });
        }
        const span = document.createElement('span');
        span.style.opacity = '0';
        node.replaceWith(span); span.appendChild(node);
      }
      return lines;
    });
    const background = path.join(build, `background-${index + 1}.png`);
    await page.locator('.slide-stage-16-9').screenshot({ path: background });
    captured.push({ background, lines });
    console.log(`Captured slide ${index + 1}: ${lines.length} editable text lines`);
  }
} finally { await browser.close(); await server.close(); }

const require = createRequire(pathToFileURL(`${pkg}/package.json`));
const { FontLibrary } = require('skia-canvas');
const registerFont = FontLibrary.use.bind(FontLibrary);
registerFont('Bungee', [path.join(root, 'public/assets/ui/bungee-regular.ttf')]);
registerFont('Yanone Kaffeesatz', [path.join(root, 'public/assets/ui/yanone-kaffeesatz-variable.ttf')]);
const { Presentation, PresentationFile } = await import(pathToFileURL(`${pkg}/dist/artifact_tool.mjs`));
const presentation = Presentation.create({ slideSize: { width: 1920, height: 1080 } });
const rgbHex = color => '#' + color.match(/[\d.]+/g).slice(0, 3).map(value => Math.round(Number(value)).toString(16).padStart(2, '0')).join('');
const spacing = {};
for (const [index, capture] of captured.entries()) {
  const slide = presentation.slides.add();
  slide.images.add({ blob: new Uint8Array(await fs.readFile(capture.background)), contentType: 'image/png', alt: 'Deck A visual layout, logos, photographs and app screenshots', position: { left: 0, top: 0, width: 1920, height: 1080 } });
  const addText = (line, name, color, dx = 0, dy = 0) => {
    const offset = line.fontSize * (line.family === 'Bungee' ? 0.05 : 0.14) + 3;
    const shape = slide.shapes.add({ geometry: 'textbox', name, position: { left: line.left + dx, top: Math.max(0, line.top + dy - offset), width: Math.min(1920 - line.left - dx, line.width + 12), height: line.height + 6 }, fill: 'none', line: { fill: 'none', width: 0 } });
    shape.text = line.text;
    shape.text.style = { typeface: line.family, fontSize: line.fontSize, bold: line.weight >= 600, color, insets: 0, wrap: 'none', autoFit: 'none', verticalAlignment: 'middle' };
    spacing[name] = Math.round(line.letterSpacing * 75);
  };
  for (const [lineIndex, line] of capture.lines.entries()) {
    if (index === 0 && line.text.toUpperCase() === 'KOBI') {
      addText(line, `shadow-light-${index}-${lineIndex}`, '#E5E0CD', 14, 14);
      addText(line, `shadow-gold-${index}-${lineIndex}`, '#CEA257', 8, 8);
    } else if (index === 10 && ['THANK', 'YOU'].includes(line.text)) addText(line, `shadow-gold-${index}-${lineIndex}`, '#CEA257', 6, 6);
    addText(line, `editable-${index}-${lineIndex}`, rgbHex(line.color));
  }
  slide.speakerNotes.text = [SLIDES_DATA[index].notes || '', 'KoBi local frontend prototype. Sample data only. Pixel worker animation is planned.', index === 2 ? 'Illustrative photo: RDNE Stock project / Pexels, photo 6647014. https://www.pexels.com/photo/volunteers-cleaning-the-street-6647014/' : '', index === 9 ? 'City photo: Azli Nawawi / Pexels, photo 36703170, 3024 × 4032. https://www.pexels.com/photo/aerial-view-of-kuala-lumpur-s-modern-skyline-36703170/' : '', index === 10 ? 'City photo: Airlangga Jati / Pexels, photo 32644036, 6000 × 4000. https://www.pexels.com/photo/kuala-lumpur-skyline-featuring-petronas-towers-32644036/' : '', 'Main slide text is editable. Visual styling, vertical tab labels and screenshot contents are raster images. Fonts: Bungee and Yanone Kaffeesatz.'].filter(Boolean).join('\n\n');
}
await fs.writeFile(path.join(build, 'text-layout.json'), JSON.stringify(captured, null, 2));
await fs.writeFile(path.join(build, 'character-spacing.json'), JSON.stringify(spacing));
await (await PresentationFile.exportPptx(presentation)).save(path.join(build, 'candidate.pptx'));
for (const index of [0, 4, 9]) {
  const png = await presentation.export({ slide: presentation.slides.items[index], format: 'png', scale: 1 });
  await fs.writeFile(path.join(build, `preview-${index + 1}.png`), new Uint8Array(await png.arrayBuffer()));
}
console.log('Draft PPTX created with editable main text.');
