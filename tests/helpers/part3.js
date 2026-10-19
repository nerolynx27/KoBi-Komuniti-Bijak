import { createSampleData } from '../../src/lib/demoSamples.js';

export const PART3_NOW = '2026-10-18T01:00:00.000Z';
export async function openPart3(page, route = 'map', { data = createSampleData(PART3_NOW) } = {}) {
  await page.clock.setFixedTime(new Date(PART3_NOW));
  await page.addInitScript(data => {
    if (!sessionStorage.getItem('kobi.part3.seeded')) {
      localStorage.setItem('kobi.demo.v1', JSON.stringify({ version: 2, revision: 0, data }));
      sessionStorage.setItem('kobi.part3.seeded', 'true');
    }
  }, data);
  await page.goto(`/#${route}`);
}
export const readPart3Envelope = page => page.evaluate(() => JSON.parse(localStorage.getItem('kobi.demo.v1')));
export const readPart3Bytes = page => page.evaluate(() => localStorage.getItem('kobi.demo.v1'));
