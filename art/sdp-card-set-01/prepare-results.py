from pathlib import Path
from PIL import Image,ImageDraw,ImageOps
import json,hashlib
root=Path('art/sdp-card-set-01');data=json.loads((root/'results.json').read_text(encoding='utf-8'));palette=[(108,26,33),(185,44,44),(206,162,87),(209,191,154),(229,224,205)];p=Image.new('P',(1,1));p.putpalette([v for rgb in (palette*52)[:256] for v in rgb]);qa=[]
(root/'source-studies').mkdir(exist_ok=True)

def clean_backing(image,index,source=False):
    im=image.copy();w,h=im.size;d=ImageDraw.Draw(im);wine=palette[0]+(255,);gold=palette[2]+(255,);vanilla=palette[4]+(255,);sand=palette[3]+(255,);cherry=palette[1]+(255,)
    face=cherry if index==1 else gold if index in [2,8] else vanilla
    original=im.copy()
    if not source:
        # Most generations already have clean blank interiors: preserve their rims exactly.
        if index not in [2,4,8,9]:
            return im
        if index==2:
            d.rectangle((12,10,w-13,h-22),fill=gold)
            return im
        if index in [8,9]:
            d.rectangle((8,8,w-9,h-9),fill=face)
            box=(w-20,h-20,w,h);im.paste(original.crop(box),box[:2])
            return im
    edge=12 if index==7 else 6
    d.rectangle((edge,6,w-edge-1,h-7),fill=face)
    if index==0:
        d.rectangle((4,3,w-5,round(h*.29)),fill=wine)
        d.rectangle((6,round(h*.29)+1,w-7,h-8),fill=vanilla)
    if index in [1,2,3]:
        d.line((9,round(h*.68),w-10,round(h*.68)),fill=gold if index==1 else wine,width=1)
    if index==4:
        d.rectangle((3,3,w-4,h-4),fill=vanilla)
        d.polygon([(w-17,2),(w-17,16),(w-3,16)],fill=sand)
        d.line([(w-17,2),(w-17,16),(w-3,16)],fill=wine,width=1)
        d.polygon([(w-17,h-3),(w-17,h-17),(w-3,h-17)],fill=sand)
        d.line([(w-17,h-3),(w-17,h-17),(w-3,h-17)],fill=wine,width=1)
    if index in [5,6]:
        # Preserve isolated original bookmarks, reconstructing no lettering.
        boxes=[(16,5,43,36)]
        if index==6:boxes.append((w-48,5,w-20,36))
        for box in boxes:
            patch=original.crop(box)
            # Keep only cherry/wine ornament pixels; its plain background stays clean.
            m=Image.new('L',patch.size);m.putdata([255 if px[:3] in palette[:2] and px[3] else 0 for px in patch.get_flattened_data()]);im.paste(patch,box[:2],m)
        d=ImageDraw.Draw(im)
        if index==5:
            y=max(40,h-32);d.rectangle((6,y,w-7,h-8),fill=gold);d.line((6,y,w-7,y),fill=wine,width=2)
            d.rectangle((w-67,3,w-17,13),fill=cherry,outline=wine,width=1)
        else:d.line((58,10,58,h-11),fill=wine,width=1)
    if index==7:
        d.rectangle((9,4,w-10,13),fill=gold);d.line((9,14,w-10,14),fill=wine,width=1)
        d.line((round(w*.22),18,round(w*.22),h-10),fill=wine,width=1)
    if index in [0,8,9]:
        box=(w-18,h-18,w,h);im.paste(original.crop(box),box[:2])
    return im

for item in data['items']:
 path=root/'generated'/f"{item['id']}.png"
 if not path.exists():raise RuntimeError('Missing completed download: '+str(path))
 raw=Image.open(path).convert('RGBA');alpha=raw.getchannel('A');binary=alpha.point(lambda v:255 if v>=128 else 0);bounds=binary.getbbox();assert bounds,'Empty generation'
 crop=raw.crop(bounds);mask=binary.crop(bounds);mapped=crop.convert('RGB').quantize(palette=p,dither=Image.Dither.NONE).convert('RGBA');mapped.putalpha(mask)
 width=item['native_size'][0];height=max(1,round(width*mapped.height/mapped.width));native=mapped.resize((width,height),Image.Resampling.NEAREST);native=clean_backing(native,item['index']);native.save(root/'prepared'/f"{item['id']}.png")
 source=Image.open(root/'references'/f"{item['id']}.png").convert('RGB').quantize(palette=p,dither=Image.Dither.NONE).convert('RGBA');source=source.resize(tuple(item['native_size']),Image.Resampling.NEAREST)
 # Remove connected surrounding paper while retaining the original perimeter.
 for x,y in [(0,0),(source.width-1,0),(0,source.height-1),(source.width-1,source.height-1)]:
  if source.getpixel((x,y))[:3]==palette[4]:ImageDraw.floodfill(source,(x,y),(0,0,0,0))
 source=clean_backing(source,item['index'],source=True);source.save(root/'source-studies'/f"{item['id']}.png")
 assert all(px[:3] in palette for px in source.get_flattened_data() if px[3])
 assert source.size==tuple(item['native_size'])
 assert native.getextrema()[3][0]==0 and all(px[:3] in palette for px in native.get_flattened_data() if px[3])
 drift=round(abs((mapped.width/mapped.height)/(item['native_size'][0]/item['native_size'][1])-1)*100,1)
 qa.append({'id':item['id'],'job_id':item['result']['job_id'],'raw_size':raw.size,'raw_alpha_range':alpha.getextrema(),'alpha_bounds_128':bounds,'prepared_size':native.size,'aspect_difference_percent':drift,'preparation':'Binary alpha at 128; palette normalization; reconstructed blank interior/dividers; original raw output retained', 'review_note':'Check proportions against original' if drift>10 else 'Compare border and corner details','raw_sha256':hashlib.sha256(path.read_bytes()).hexdigest(), 'source_study_sha256':hashlib.sha256((root/'source-studies'/f"{item['id']}.png").read_bytes()).hexdigest(), 'prepared_sha256':hashlib.sha256((root/'prepared'/f"{item['id']}.png").read_bytes()).hexdigest()})
(root/'qa.json').write_text(json.dumps(qa,indent=2),encoding='utf-8')
out=Image.new('RGB',(1100,1400),'#E5E0CD');d=ImageDraw.Draw(out)
for i,item in enumerate(data['items']):
 x=(i%2)*550+20;y=(i//2)*280+15;d.text((x,y),item['name'],fill='#6C1A21');im=Image.open(root/'prepared'/f"{item['id']}.png");im.thumbnail((500,230));out.paste(im,(x,y+25),im)
out.save(root/'generated-contact-sheet.png');print('Prepared 10 candidates; exact palette/alpha checks passed.');print(json.dumps([{'id':x['id'],'aspect_difference_percent':x['aspect_difference_percent']} for x in qa]))
