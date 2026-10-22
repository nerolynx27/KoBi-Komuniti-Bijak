import {test,expect} from '@playwright/test';
test('resident sections share Home header and navigation while SDP stays separate',async({page})=>{
 for(const entry of ['/','/sdp-workspace.html']){
  let reference;
  for(const route of ['home','reports','activities','profile']){
   await page.goto(entry+'#'+route);await expect(page.locator('.app-header')).toBeVisible();await page.evaluate(()=>document.fonts.ready);
   await expect(page.locator('.bulletin-township')).toBeVisible();
   const style=await page.locator('.bottom-nav').evaluate(el=>{const c=getComputedStyle(el),item=getComputedStyle(el.querySelector('.nav-item'));return {padding:c.padding,gap:c.gap,font:item.fontSize,height:item.minHeight};});
   if(!reference)reference=style;else expect(style).toEqual(reference);
   expect(await page.locator('.nav-item.is-selected > .pixel-frame').evaluate(el=>getComputedStyle(el).display)).toBe('none');
  }
  await page.goto(entry+'#sdp');await expect(page.locator('h1')).toBeVisible();await expect(page.locator('.resident-shell')).toHaveCount(0);
 }
});

test('activity board loads four new 2K pictures',async({page})=>{await page.goto('/#activities');const images=page.locator('.act-pinned-note .act-illustration-img');await expect(images).toHaveCount(4);await expect.poll(()=>images.evaluateAll(els=>els.every(el=>el.complete&&el.naturalWidth===2400&&el.naturalHeight===1792))).toBe(true);const urls=await images.evaluateAll(els=>els.map(el=>el.getAttribute('src')));expect(new Set(urls).size).toBe(4);expect(urls.every(url=>url.endsWith('-20261022.webp'))).toBe(true);});
