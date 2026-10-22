import { chromium } from '@playwright/test';
import { readFile,writeFile } from 'node:fs/promises';
const catalog=JSON.parse(await readFile('art/sdp-card-set-01/catalog.json','utf8'));
const selectors=['.sdp-card-welcome','[data-metric="open"]','[data-metric="progress"]','[data-metric="upcoming"]','.sdp-attention','.sdp-report-priority','.sdp-card-report:not(.sdp-report-priority)','.sdp-card-event','.sdp-dashboard-shortcuts>.sdp-card:first-child','.sdp-dashboard-shortcuts>.sdp-card:last-child'];
const browser=await chromium.launch();const page=await browser.newPage({viewport:{width:390,height:699}});
await page.goto('http://127.0.0.1:5177/tests/fixtures/sdp-dashboard-reference.html');await page.evaluate(()=>document.fonts.ready);
for(const item of catalog.items){const card=page.locator(selectors[item.index]);await card.screenshot({path:`art/sdp-card-set-01/current/${item.id}.png`});item.current_html=await card.evaluate(el=>el.outerHTML);item.current_size=await card.evaluate(el=>({width:el.getBoundingClientRect().width,height:el.getBoundingClientRect().height}));}
await writeFile('art/sdp-card-set-01/current-cards.json',JSON.stringify(catalog.items.map(({id,current_html,current_size})=>({id,current_html,current_size})),null,2));await browser.close();console.log('Captured all ten current cards and their live markup.');
