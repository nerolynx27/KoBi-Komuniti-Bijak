import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { createServer } from 'vite';
import { chromium } from '@playwright/test';
import { SLIDES_DATA } from '../src/slides/slideData.js';

const root = path.resolve('.');
const build = path.join(root, 'tmp/deck-a-native');
await fs.mkdir(build, { recursive: true });
const server = await createServer({ server: { host: '127.0.0.1', port: 5197, strictPort: true }, logLevel: 'warn' });
await server.listen();
const browser = await chromium.launch();
const layouts = [];
try {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  for (let index = 0; index < 11; index++) {
    await page.goto(`http://127.0.0.1:5197/#presentation?deck=deck-a&slide=${index}&export=true`, { waitUntil: 'domcontentloaded' });
    await page.locator('.deck-a-container').waitFor();
    await page.evaluate(async () => { await document.fonts.ready; await Promise.all(Array.from(document.images, image => image.decode())); });
    const items = await page.evaluate(() => {
      const stage = document.querySelector('.deck-a-container');
      const origin = stage.getBoundingClientRect();
      const result = [];
      let serial = 0;
      function visit(el) {
        const cs = getComputedStyle(el), rect = el.getBoundingClientRect();
        if (!rect.width || !rect.height || cs.display === 'none' || cs.visibility === 'hidden') return;
        const id = `native-${++serial}`;
        el.setAttribute('data-ppt-id', id);
        const pos = { left: rect.left - origin.left, top: rect.top - origin.top, width: rect.width, height: rect.height };
        const info = { id, label: el.className?.baseVal ?? el.className ?? el.tagName, ...pos };
        if (el.matches('img,svg')) {
          result.push({ ...info, kind: 'image', alt: el.getAttribute('alt') || 'Project icon' });
          return;
        }
        const borders = ['Top','Right','Bottom','Left'].map(side => ({ side, width: parseFloat(cs[`border${side}Width`]), color: cs[`border${side}Color`] }));
        const fill = cs.backgroundColor;
        if (fill !== 'rgba(0, 0, 0, 0)' || borders.some(b => b.width)) {
          result.push({ ...info, kind: 'shape', fill, borders, radius: parseFloat(cs.borderTopLeftRadius), clip: cs.clipPath, shadow: cs.boxShadow });
        }
        const children = [...el.children];
        const directText = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
        const inlineOnly = children.every(c => ['BR','SPAN','B','STRONG','EM'].includes(c.tagName) && getComputedStyle(c).display === 'inline');
        if ((directText && inlineOnly) || (!children.length && el.innerText?.trim())) {
          const raw = el.innerText.trim();
          const vertical = cs.writingMode.startsWith('vertical');
          const lines = [];
          const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
          while (walker.nextNode()) {
            const n = walker.currentNode;
            for (let j = 0; j < n.length; j++) {
              const range = document.createRange(); range.setStart(n,j); range.setEnd(n,j+1);
              const r = range.getBoundingClientRect();
              if (!r.width || !r.height) continue;
              let line = lines.find(l => Math.abs(l.top-r.top)<2);
              if (!line) { line={top:r.top,left:r.left,right:r.right,height:r.height,text:''}; lines.push(line); }
              line.text += n.textContent[j]; line.left=Math.min(line.left,r.left); line.right=Math.max(line.right,r.right);
            }
          }
          const paddingLeft=parseFloat(cs.paddingLeft), paddingRight=parseFloat(cs.paddingRight);
          const borderLeft=parseFloat(cs.borderLeftWidth), borderRight=parseFloat(cs.borderRightWidth);
          const text = vertical ? raw : lines.map(l=>l.text.trim()).filter(Boolean).join('\n');
          if (text) {
            const centered = cs.textAlign==='center' || ((cs.display==='flex' || cs.display==='inline-flex') && cs.justifyContent==='center');
            const right = cs.textAlign==='right';
            const first = lines[0];
            const lineHeight=parseFloat(cs.lineHeight) || parseFloat(cs.fontSize)*1.2;
            result.push({ ...info, id:`${id}-text`, kind:'text', text:cs.textTransform==='uppercase'?text.toUpperCase():text,
              left: vertical ? pos.left-(pos.height-pos.width)/2 : centered || right ? pos.left+paddingLeft+borderLeft : Math.min(...lines.map(l=>l.left))-origin.left,
              top:vertical ? pos.top+(pos.height-pos.width)/2 : first.top-origin.top,
              width:vertical ? pos.height : centered || right ? pos.width-paddingLeft-paddingRight-borderLeft-borderRight : pos.width-paddingLeft-paddingRight-borderLeft-borderRight,
              height:vertical ? pos.width : lineHeight*lines.length+12,
              family:cs.fontFamily.includes('Bungee')?'Bungee':'Yanone Kaffeesatz', fontSize:parseFloat(cs.fontSize), weight:parseInt(cs.fontWeight), color:cs.color,
              spacing:parseFloat(cs.letterSpacing)||0, lineHeight, align:centered?'center':right?'right':'left', rotation:vertical?270:0,
              shadow:cs.textShadow, referenceTop:first?.top-origin.top });
          }
          if (el.tagName==='LI') {
            const ordinal=[...el.parentElement.children].indexOf(el)+1;
            result.push({ ...info, kind:'text', id:`${id}-number`, text:`0${ordinal}`, left:pos.left, top:pos.top+3, width:50,height:40,
              family:'Bungee',fontSize:24,weight:400,color:cs.color,spacing:0,lineHeight:29,align:'left',rotation:0 });
          }
          return;
        }
        children.map((child,i)=>({child,i,z:parseInt(getComputedStyle(child).zIndex)||0})).sort((a,b)=>a.z-b.z || a.i-b.i).forEach(({child})=>visit(child));
      }
      visit(stage);
      return result;
    });
    for (const item of items.filter(i=>i.kind==='image')) {
      item.file=path.join(build,`slide-${index+1}-${item.id}.png`);
      const isolation=await page.addStyleTag({content:`html,body,.slide-viewport-container {background:transparent!important} .deck-a-container, .deck-a-container * {visibility:hidden!important} [data-ppt-id="${item.id}"], [data-ppt-id="${item.id}"] * {visibility:visible!important}`});
      await page.locator(`[data-ppt-id="${item.id}"]`).screenshot({path:item.file,omitBackground:true});
      await isolation.evaluate(el=>el.remove());
    }
    const textItems=items.filter(i=>i.kind==='text');
    for(const [j,item] of textItems.entries()) item.calibrationColor=[30+(j*53)%200,30+(j*97)%200,30+(j*137)%200];
    const calibrate=await page.addStyleTag({content:`html,body,.slide-viewport-container {background:#fff!important} .deck-a-container,.deck-a-container * {background:transparent!important;border-color:transparent!important;box-shadow:none!important;text-shadow:none!important;color:transparent!important;opacity:1!important} .deck-a-container img,.deck-a-container svg {visibility:hidden!important} ${textItems.map(item=>`[data-ppt-id="${item.id.replace(/-text$/,'').replace(/-number$/,'')}"]${item.id.endsWith('-number')?'::before':''} {color:rgb(${item.calibrationColor.join(',')})!important}`).join(' ')}`});
    await page.locator('.slide-stage-16-9').screenshot({path:path.join(build,`target-${index+1}.png`)});
    await calibrate.evaluate(el=>el.remove());
    layouts.push(items);
    console.log(`Slide ${index+1}: ${items.filter(i=>i.kind==='text').length} text blocks, ${items.filter(i=>i.kind==='image').length} separate images`);
  }
} finally { await browser.close(); await server.close(); }
await fs.writeFile(path.join(build,'layout.json'),JSON.stringify(layouts,null,2));

const runtime='C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies';
const {Presentation,PresentationFile}=await import(pathToFileURL(`${runtime}/node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs`));
const pres=Presentation.create({slideSize:{width:1920,height:1080}});
const hex=color=> !color || color==='rgba(0, 0, 0, 0)' ? 'none' : '#'+color.match(/[\d.]+/g).slice(0,3).map(n=>Math.round(Number(n)).toString(16).padStart(2,'0')).join('');
for (const [index,items] of layouts.entries()) {
  const slide=pres.slides.add();
  for (const item of items) {
    const position={left:item.left,top:item.top,width:item.width,height:item.height,rotation:item.rotation||0};
    if(item.kind==='image') {
      slide.images.add({blob:new Uint8Array(await fs.readFile(item.file)),contentType:'image/png',alt:item.alt,position});
    } else if(item.kind==='shape') {
      const all=item.borders.every(b=>b.width===item.borders[0].width);
      const border=all?item.borders[0]:{width:0};
      const opts={geometry:'rect',name:item.id,position,fill:hex(item.fill),line:{fill:border.width?hex(border.color):'none',width:border.width}};
      if(item.radius) opts.borderRadius=item.radius;
      if(item.clip?.startsWith('polygon')) {
        const points=item.clip.slice(8,-1).split(',').map(pair=>{const [x,y]=pair.trim().split(/\s+/);return {x:parseFloat(x)*(x.endsWith('%')?item.width/100:1),y:parseFloat(y)*(y.endsWith('%')?item.height/100:1)};});
        opts.geometry='custom'; opts.customPaths=[{width:item.width,height:item.height,commands:[{moveTo:points[0]},...points.slice(1).map(p=>({lineTo:p})),{close:{}}]}];
      }
      // Keep the reference's hard offset sticker shadow as its own editable shape.
      const shadow=item.shadow?.match(/rgba?\([^)]+\)\s+([\d.-]+)px\s+([\d.-]+)px/);
      if(shadow && !item.label.includes('stage')) slide.shapes.add({...opts,name:`${item.id}-shadow`,position:{...position,left:item.left+Number(shadow[1]),top:item.top+Number(shadow[2])},fill:'#6C1A21',line:{fill:'none',width:0}});
      slide.shapes.add(opts);
      if(!all) for(const b of item.borders.filter(b=>b.width)) {
        const horizontal=['Top','Bottom'].includes(b.side);
        slide.shapes.add({geometry:'rect',name:`${item.id}-border-${b.side}`,position:{left:item.left+(b.side==='Right'?item.width-b.width:0),top:item.top+(b.side==='Bottom'?item.height-b.width:0),width:horizontal?item.width:b.width,height:horizontal?b.width:item.height},fill:hex(b.color),line:{fill:'none',width:0}});
      }
    } else {
      // One editable text box per semantic block, including its native line breaks.
      const shape=slide.shapes.add({geometry:'textbox',name:item.id,position,fill:'none',line:{fill:'none',width:0}});
      shape.text=item.text;
      shape.text.style={typeface:item.family,fontSize:item.fontSize,bold:item.weight>=600,color:hex(item.color),insets:0,wrap:'none',autoFit:'none',verticalAlignment:'top',alignment:item.align};
    }
  }
  slide.speakerNotes.text=[SLIDES_DATA[index].notes||'', 'Editable rebuild: native panels, frames, arrows, heading and paragraph text. Logos, photographs, project icons and prototype screenshots are separate images. Screenshot contents are images.', 'Local prototype, sample data. Pixel worker animation is planned.', index===2?'Photo: RDNE Stock project / Pexels https://www.pexels.com/photo/volunteers-cleaning-the-street-6647014/':'',index===9?'Photo: Azli Nawawi / Pexels https://www.pexels.com/photo/aerial-view-of-kuala-lumpur-s-modern-skyline-36703170/':'',index===10?'Photo: Airlangga Jati / Pexels https://www.pexels.com/photo/kuala-lumpur-skyline-featuring-petronas-towers-32644036/':''].filter(Boolean).join('\n\n');
}
await (await PresentationFile.exportPptx(pres)).save(path.join(build,'candidate.pptx'));
console.log('Created native editable deck.');
