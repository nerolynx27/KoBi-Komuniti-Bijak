/**
 * scripts/export-slides.mjs
 * 
 * High-precision slide exporter using Playwright & in-process Vite server:
 * - Exports 11 16:9 PNGs (1920x1080) for Deck A (Original Overhaul)
 * - Exports 11 16:9 PNGs (1920x1080) for Deck B (Reimagined Composition)
 * - Generates 2 multi-page 16:9 PDFs:
 *   1. artifacts/slides/KoBi-Deck-A-Original-Overhaul.pdf
 *   2. artifacts/slides/KoBi-Deck-B-Reimagined-Composition.pdf
 * - Generates 2 panoramic contact sheets:
 *   1. artifacts/slides/deck-a-contact-sheet.png
 *   2. artifacts/slides/deck-b-contact-sheet.png
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { chromium } from 'playwright';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const OUT_DIR = path.resolve(rootDir, 'artifacts', 'slides');
const revisedA = process.argv.includes('--deck-a-revised');
const DECK_A_DIR = path.resolve(OUT_DIR, revisedA ? 'deck-a-revised' : 'deck-a');
const DECK_B_DIR = path.resolve(OUT_DIR, 'deck-b');

// Ensure output directories exist
fs.mkdirSync(DECK_A_DIR, { recursive: true });
fs.mkdirSync(DECK_B_DIR, { recursive: true });

async function exportDecks() {
  console.log('🚀 Starting KoBi 16:9 Slide Export Pipeline...');
  const startTime = Date.now();

  // 1. Start in-process Vite dev server on dedicated port
  const port = 5193;
  const viteServer = await createServer({
    root: rootDir,
    server: { port, strictPort: true, host: '127.0.0.1' },
    logLevel: 'warn',
  });
  await viteServer.listen();
  console.log(`📡 Local preview server ready at http://127.0.0.1:${port}`);

  // 2. Launch Chromium at 1920x1080
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--font-render-hinting=none'],
  });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  const totalSlides = 11;
  const decks = revisedA ? [
    { id: 'deck-a', name: 'Deck A (Revised)', dir: DECK_A_DIR, pdfName: 'KoBi-Deck-A-Revised.pdf', contactSheetName: 'deck-a-revised-contact-sheet.png' },
  ] : [
    { id: 'deck-a', name: 'Deck A (Original Overhaul)', dir: DECK_A_DIR, pdfName: 'KoBi-Deck-A-Original-Overhaul.pdf', contactSheetName: 'deck-a-contact-sheet.png' },
    { id: 'deck-b', name: 'Deck B (Reimagined Composition)', dir: DECK_B_DIR, pdfName: 'KoBi-Deck-B-Reimagined-Composition.pdf', contactSheetName: 'deck-b-contact-sheet.png' },
  ];

  for (const deck of decks) {
    console.log(`\n📸 Capturing ${deck.name} (${totalSlides} slides at 1920×1080)...`);
    const slidePngPaths = [];

    for (let i = 0; i < totalSlides; i++) {
      const slideNum = String(i + 1).padStart(2, '0');
      const targetUrl = `http://127.0.0.1:${port}/#presentation?deck=${deck.id}&slide=${i}&export=true`;

      await page.goto(targetUrl, { waitUntil: 'networkidle' });

      // Wait for fonts to finish rendering
      await page.evaluate(async () => {
        await document.fonts.ready;
        // Wait for all images to complete loading
        const images = Array.from(document.querySelectorAll('img'));
        await Promise.all(
          images.map(img => {
        if (img.complete) {
          if (!img.naturalWidth) throw new Error(`Missing image: ${img.src}`);
          return Promise.resolve();
        }
            return new Promise((resolve, reject) => {
              img.onload = resolve;
              img.onerror = () => reject(new Error(`Missing image: ${img.src}`));
            });
          })
        );
      });

      // Allow animations and SVG rasterization to stabilize
      await page.waitForTimeout(350);

      const pngFileName = `slide-${slideNum}.png`;
      const pngFilePath = path.resolve(deck.dir, pngFileName);

      // Locate slide stage
      const stage = page.locator('.slide-stage-16-9');
      if (await stage.count() > 0) {
        await stage.screenshot({ path: pngFilePath });
      } else {
        await page.screenshot({ path: pngFilePath });
      }

      const stat = fs.statSync(pngFilePath);
      console.log(`  ✓ Slide ${slideNum} -> ${pngFileName} (${Math.round(stat.size / 1024)} KB)`);
      slidePngPaths.push(pngFilePath);
    }

    // 3. Generate Multi-Page 16:9 PDF from the captured slides
    console.log(`📑 Assembling 16:9 PDF: ${deck.pdfName}...`);
    const pdfPath = path.resolve(OUT_DIR, deck.pdfName);

    const pdfHtmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${deck.name}</title>
  <style>
    @page {
      size: 1920px 1080px;
      margin: 0;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    html, body {
      width: 1920px;
      background: #000;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .slide-page {
      width: 1920px;
      height: 1080px;
      page-break-after: always;
      break-after: page;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #000;
      overflow: hidden;
    }
    .slide-page:last-child {
      page-break-after: avoid;
      break-after: avoid;
    }
    .slide-img {
      width: 1920px;
      height: 1080px;
      object-fit: contain;
      display: block;
    }
  </style>
</head>
<body>
  ${slidePngPaths.map(p => {
    const base64 = fs.readFileSync(p).toString('base64');
    return `<div class="slide-page"><img class="slide-img" src="data:image/png;base64,${base64}" /></div>`;
  }).join('\n')}
</body>
</html>
    `;

    const pdfPage = await context.newPage();
    await pdfPage.setContent(pdfHtmlContent, { waitUntil: 'load' });
    await pdfPage.waitForTimeout(200);

    await pdfPage.pdf({
      path: pdfPath,
      width: '1920px',
      height: '1080px',
      printBackground: true,
      margin: { top: 0, bottom: 0, left: 0, right: 0 },
    });

    const pdfStat = fs.statSync(pdfPath);
    console.log(`  ✓ Multi-Page PDF Generated: ${deck.pdfName} (${Math.round(pdfStat.size / 1024)} KB)`);

    // 4. Generate Panoramic Contact Sheet (Overview Board)
    console.log(`🖼️ Rendering Overview Contact Sheet: ${deck.contactSheetName}...`);
    const contactSheetPath = path.resolve(OUT_DIR, deck.contactSheetName);

    const contactSheetHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #120507;
      color: #E5E0CD;
      font-family: 'Bungee', sans-serif;
      padding: 40px;
      width: 2560px;
    }
    header {
      margin-bottom: 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 4px solid #CEA257;
      padding-bottom: 20px;
    }
    h1 {
      font-size: 40px;
      color: #CEA257;
      letter-spacing: 1px;
    }
    .meta {
      font-size: 24px;
      color: #D1BF9A;
      font-family: sans-serif;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 30px;
    }
    .card {
      background: #6C1A21;
      border: 3px solid #CEA257;
      box-shadow: 6px 6px 0px #000;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .card-label {
      font-size: 18px;
      color: #E5E0CD;
      display: flex;
      justify-content: space-between;
    }
    .card img {
      width: 100%;
      height: auto;
      aspect-ratio: 16 / 9;
      border: 2px solid #000;
      display: block;
    }
  </style>
</head>
<body>
  <header>
    <h1>${deck.name.toUpperCase()} · 11 SLIDE OVERVIEW</h1>
    <div class="meta">KoBi — Komuniti Bijak · Sime Darby Property Hackathon 2026</div>
  </header>
  <div class="grid">
    ${slidePngPaths.map((p, idx) => {
      const base64 = fs.readFileSync(p).toString('base64');
      return `
        <div class="card">
          <div class="card-label">
            <span>SLIDE ${String(idx + 1).padStart(2, '0')}</span>
            <span>1920 × 1080</span>
          </div>
          <img src="data:image/png;base64,${base64}" />
        </div>
      `;
    }).join('\n')}
  </div>
</body>
</html>
    `;

    const contactPage = await context.newPage();
    await contactPage.setViewportSize({ width: 2560, height: 1600 });
    await contactPage.setContent(contactSheetHtml, { waitUntil: 'load' });
    await contactPage.waitForTimeout(300);
    await contactPage.screenshot({ path: contactSheetPath, fullPage: true });
    await contactPage.close();
    await pdfPage.close();

    const csStat = fs.statSync(contactSheetPath);
    console.log(`  ✓ Contact Sheet Generated: ${deck.contactSheetName} (${Math.round(csStat.size / 1024)} KB)`);
  }

  // Cleanup
  await browser.close();
  await viteServer.close();

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\nSlide export complete in ${elapsed}s: ${decks.length * totalSlides} PNGs, ${decks.length} PDFs and contact sheets saved to:`);
  console.log(`📁 ${OUT_DIR}`);
}

exportDecks().catch(err => {
  console.error('❌ Slide export failed:', err);
  process.exit(1);
});
