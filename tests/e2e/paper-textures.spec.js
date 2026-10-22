import { test, expect } from '@playwright/test';

const specimen = '/sdp-workspace.html?specimen=cards-buttons';
const masks = ['fine-grain', 'laid-paper', 'woven-paper'];

test('frozen masks preserve preview pixels, binary alpha and physical scale', async ({ page }) => {
  await page.goto('/paper-textures.html');
  const results = await page.evaluate(async names => {
    const results = [];
    for (const [i, name] of names.entries()) {
      const image = new Image(); image.src = '/assets/ui/paper/' + name + '-mask.png';
      await image.decode();
      const canvas = document.createElement('canvas'); canvas.width = canvas.height = 640;
      const ctx = canvas.getContext('2d'); ctx.drawImage(image, 0, 0);
      const actual = ctx.getImageData(0, 0, 640, 640).data;
      const source = document.querySelectorAll('canvas')[[0,3,4][i]].getContext('2d').getImageData(0,0,640,640).data;
      let marks = 0, mismatches = 0, invalidAlpha = 0, opaqueCream = 0;
      for (let p = 0; p < actual.length; p += 4) {
        const expected = source[p] === 209 ? 255 : 0;
        if (actual[p+3] !== expected) mismatches++;
        if (![0,255].includes(actual[p+3])) invalidAlpha++;
        if (actual[p+3]) { marks++; if (actual[p] === 229) opaqueCream++; }
      }
      results.push({width:image.width,height:image.height,coverage:marks/409600,mismatches,invalidAlpha,opaqueCream});
    }
    return results;
  }, masks);
  for (const [i, result] of results.entries()) {
    expect(result).toMatchObject({width:640,height:640,mismatches:0,invalidAlpha:0,opaqueCream:0});
    expect(result.coverage).toBeGreaterThan([.16,.16,.20][i]);
    expect(result.coverage).toBeLessThan([.19,.19,.23][i]);
  }
});

test('shared faces tile the right roles with unique IDs and retained fills', async ({ page }) => {
  await page.goto(specimen);
  await expect(page.locator('.paper-texture[data-paper-role="panel"]').first()).toBeAttached();
  await expect(page.locator('.paper-texture[data-paper-role="control"]')).toHaveCount(0);
  const result = await page.locator('.paper-texture').evaluateAll(els => els.map(el => {
    const svg = el.ownerSVGElement;
    const id = el.getAttribute('fill').slice(5,-1);
    const pattern = svg.querySelector('[id="' + id + '"]');
    const mask = svg.querySelector('mask');
    return {id,role:el.dataset.paperRole,width:pattern?.getAttribute('width'),path:mask?.querySelector('image')?.getAttribute('href'),fill:getComputedStyle(svg.querySelector('.frame-fill')).fill};
  }));
  expect(new Set(result.map(x=>x.id)).size).toBe(result.length);
  expect(result.length).toBeGreaterThan(2);
  for (const face of result) {
    expect(face.width).toBe('320');
    expect(face.path).toContain(face.role === 'control' ? 'woven-paper-mask.png' : 'laid-paper-mask.png');
    expect(face.fill).not.toBe('rgba(0, 0, 0, 0)');
  }
  for (const backing of await page.locator('.sdp-reference-board .sdp-card-backing').evaluateAll(els => els.map(el => {
    const css = getComputedStyle(el, '::after');
    return {mask:css.maskImage,pointer:css.pointerEvents,clip:css.clipPath,source:getComputedStyle(el).borderImageSource};
  }))) {
    expect(backing.mask).toContain('laid-paper-mask.png'); expect(backing.pointer).toBe('none');
    expect(backing.clip).not.toBe('none'); expect(backing.source).toContain('/cards/');
  }
  await expect(page.locator('.sdp-reference-board .sdp-card-backing')).toHaveCount(10);
  await page.getByRole('button',{name:'Primary ticket',exact:true}).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByText('Primary example activated.',{exact:true})).toBeVisible();
});

test('failed masks leave solid faces, native focus and disabled state working', async ({ page }) => {
  await page.route('**/assets/ui/paper/**', route => route.abort());
  await page.goto(specimen);
  const button = page.getByRole('button',{name:'Primary ticket',exact:true});
  await expect(button).toBeVisible();
  expect(await button.locator('.frame-fill').evaluate(el=>getComputedStyle(el).fill)).toBe('rgb(206, 162, 87)');
  await button.click(); await expect(page.getByText('Primary example activated.',{exact:true})).toBeVisible();
  await expect(page.getByRole('button',{name:'Unavailable',exact:true})).toBeDisabled();
  await button.focus(); await page.keyboard.press('Tab'); await page.keyboard.press('Shift+Tab'); await expect(button).toBeFocused();
  expect(await button.evaluate(el=>getComputedStyle(el).outlineStyle)).not.toBe('none');
});

test('both entries expose all three roles and preserve native form editing', async ({page}) => {
  for (const entry of ['/sdp-workspace.html', '/']) {
    await page.goto(entry + '#home');
    await expect(page.locator('h1')).toContainText('neighbourhood bulletin');
    expect(await page.locator('.app-shell').evaluate(el=>getComputedStyle(el,'::before').maskImage)).toContain('fine-grain-mask.png');
    await page.goto(entry + '#reports');
    await expect(page.locator('.sandbox-folder-svg .paper-texture[data-paper-role="panel"]').first()).toBeAttached();
    await page.goto(entry + '#reports/new');
    const description = page.getByLabel(/^Description/);
    await description.fill('Texture leaves native field editing intact.');
    await expect(description).toHaveValue('Texture leaves native field editing intact.');
    expect(await page.locator('.paper-input-face').first().evaluate(el=>getComputedStyle(el,'::before').maskImage)).toContain('laid-paper-mask.png');
  }
});

test('SVG panel texture actually paints beneath live text', async ({page}) => {
  await page.goto('/sdp-workspace.html#home');
  await page.waitForLoadState('networkidle');
  for (const selector of ['.bulletin-update']) {
    const face = page.locator(selector);
    await expect(face.locator('.paper-texture').first()).toBeAttached();
    await face.evaluate(async el=>{await Promise.all([...el.querySelectorAll('mask image')].map(x=>{const image=new Image();image.src=x.getAttribute('href');return image.decode();}));await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));});
    const textured = await face.screenshot();
    await face.locator('.paper-texture').evaluateAll(els=>els.forEach(el=>el.style.display='none'));
    const plain = await face.screenshot();
    const pixels = await page.evaluate(async ([a,b]) => {
      const read = async source => { const image=new Image(); image.src=source; await image.decode(); const canvas=document.createElement('canvas'); canvas.width=image.width; canvas.height=image.height; const ctx=canvas.getContext('2d'); ctx.drawImage(image,0,0); return ctx.getImageData(0,0,canvas.width,canvas.height).data; };
      const x=await read(a), y=await read(b); let changed=0;
      for(let i=0;i<x.length;i+=4) if(x[i]!==y[i]||x[i+1]!==y[i+1]||x[i+2]!==y[i+2]) changed++;
      return changed;
    }, ['data:image/png;base64,'+textured.toString('base64'),'data:image/png;base64,'+plain.toString('base64')]);
    expect(pixels, selector + ' renders visible texture').toBeGreaterThan(100);
    await face.locator('.paper-texture').evaluateAll(els=>els.forEach(el=>el.style.removeProperty('display')));
  }
});

test('mask requests are shared across instances and text links stay unfilled', async ({page}) => {
  const requests=[]; page.on('request',req=>{if(req.url().includes('/assets/ui/paper/'))requests.push(req.url());});
  await page.goto(specimen); await page.waitForLoadState('networkidle');
  expect(new Set(requests).size).toBe(2);
  expect(requests.length).toBe(2);
  const link=page.getByRole('link',{name:'Workspace link',exact:true});
  expect(await link.evaluate(el=>getComputedStyle(el).backgroundColor)).toBe('rgba(0, 0, 0, 0)');
  expect(await link.locator('.paper-texture').count()).toBe(0);
});

test('sand panels retain gold marks while buttons and navigation stay smooth', async ({page}) => {
  await page.goto('/sdp-workspace.html#home');
  await page.goto('/sdp-workspace.html#activities');
  await expect(page.getByRole('button',{name:'Recycling',exact:true})).toBeVisible();
  expect(await page.locator('.act-notice-board-surface').evaluate(el=>getComputedStyle(el).getPropertyValue('--paper-ink').trim())).toBe('#CEA257');
  for(const selector of ['button', '.button', 'nav', '.app-header']) {
    for(const painted of await page.locator(selector).evaluateAll(els=>els.map(el=>{const c=getComputedStyle(el,'::before');return c.content!=='none'&&c.display!=='none';}))) expect(painted).toBe(false);
  }
  await expect(page.locator('.paper-texture[data-paper-role="control"]')).toHaveCount(0);
});

test('resident map and world editor contain no paper texture layers', async ({page}) => {
  for(const path of ['/#map','/#sdp/world','/sdp-workspace.html#map','/sdp-workspace.html#sdp/world']) {
    await page.goto(path); await expect(page.locator('h1').first()).toBeAttached();
    await expect(page.locator('.world-texture-free')).toBeAttached();
    const layers=await page.locator('html, .app-shell, .card, .paper-texture').evaluateAll(els=>els.map(el=>el.matches('.paper-texture')?getComputedStyle(el).display:getComputedStyle(el,'::before').display));
    expect(layers.every(x=>x==='none')).toBe(true);
  }
});

test('native paper wrappers preserve control dimensions without baseline gaps', async ({page}) => {
  await page.goto('/#reports/new');
  await expect(page.getByLabel(/^Description/)).toBeVisible();
  for(const box of await page.locator('.paper-input-face').evaluateAll(els=>els.map(el=>({face:el.getBoundingClientRect().height,input:el.firstElementChild.getBoundingClientRect().height})))) {
    expect(box.face).toBe(box.input);
  }
});

test('open menu button and header remain smooth', async ({page}) => {
  await page.goto('/#reports');
  await page.getByRole('button',{name:'Open app menu',exact:true}).click();
  for(const selector of ['.burger-menu-btn.is-open','.app-header']) {
    expect(await page.locator(selector).evaluate(el=>getComputedStyle(el,'::before').display)).toBe('none');
  }
});

test('report recipe overlays preserve their divider and texture the short secondary face', async ({page}) => {
  await page.goto(specimen);
  const secondary=page.locator('.sdp-reference-board .sdp-card-report:not(.sdp-report-priority) > .sdp-card-backing');
  await expect(secondary).toBeAttached();
  expect.soft(await secondary.evaluate(el=>parseFloat(getComputedStyle(el,'::after').height))).toBeGreaterThan(10);
  const priority=page.locator('.sdp-reference-board .sdp-report-priority > .sdp-card-backing');
  const bounds=await priority.evaluate(async el=>{
    const image=new Image(); image.src='/assets/dashboard/sdp/cards/06-priority-report.png'; await image.decode();
    const css=getComputedStyle(el), overlay=getComputedStyle(el,'::after');
    const top=parseFloat(css.borderTopWidth), bottom=parseFloat(css.borderBottomWidth);
    const centre=el.getBoundingClientRect().height-top-bottom;
    // The original PNG's cream ends at row 75; this lies within its stretched centre.
    return {textureBottom:top+parseFloat(overlay.top)+parseFloat(overlay.height), divider:top+(75-top)/(image.naturalHeight-top-bottom)*centre};
  });
  expect(bounds.textureBottom).toBeLessThan(bounds.divider);
});
