from PIL import Image, ImageDraw
from pathlib import Path
import json
root=Path('art/sdp-asset-pilot')
context=Image.open(root/'elmina-source-context.png').convert('RGBA')
# Union of the illustration's gold field, protruding lamp arch and building edge.
poly=[(28,60),(79,60),(79,54),(91,54),(91,47),(102,47),(102,40),(176,40),(176,45),(182,45),(182,59),(240,59),(240,64),(246,64),(246,143),(250,143),(250,231),(23,231),(23,66),(27,66)]
mask=Image.new('L',context.size,0);ImageDraw.Draw(mask).polygon(poly,fill=255)
context.putalpha(mask)
body=context.crop((23,40,251,232));body.save(root/'elmina-extracted-original.png')
palette=[(108,26,33),(185,44,44),(206,162,87),(209,191,154),(229,224,205)]
normalized=body.copy()
def map_color(pixel):
    if not pixel[3]:
        return (0,0,0,0)
    r,g,b=pixel[:3]
    # Sand preserves the lamp's neutral metal and the bright cone against gold.
    if (max(r,g,b)-min(r,g,b)<40 and min(r,g,b)>85) or (r>=245 and g>=195 and b<=145):
        return palette[3]+(pixel[3],)
    return min(palette,key=lambda c:sum((c[i]-pixel[i])**2 for i in range(3)))+(pixel[3],)
normalized.putdata([map_color(pixel) for pixel in body.get_flattened_data()])
assert normalized.getpixel((44,70))[:3]==palette[3]
normalized.save(root/'elmina-extracted-palette.png')
colors=set(normalized.get_flattened_data());assert all(c[:3] in palette for c in colors if c[3]);assert normalized.getextrema()[3]==(0,255)
(root/'extraction-metadata.json').write_text(json.dumps({'source':'reference-dashboard.png','context_crop':[115,225,390,555],'illustration_polygon_in_context':poly,'body_crop_in_context':[23,40,251,232],'size':normalized.size,'alpha':normalized.getextrema()[3],'palette_mapping':'Nearest approved colour; neutral metal and bright light cone map to sand to preserve contrast', 'visible_colors':sorted(set(c[:3] for c in colors if c[3])),'caption':'Removed from bitmap; use live Elmina text'},indent=2),encoding='utf-8')
print('Original and five-colour extraction prepared:',normalized.size,'RGBA; transparency and palette assertions passed.')

# Prepare the Higgsfield candidate with the same palette policy for fair comparison.
generated=root/'elmina-higgsfield-v1.png'
if generated.exists():
    candidate=Image.open(generated).convert('RGBA')
    candidate.putalpha(candidate.getchannel('A').point(lambda v:255 if v>=128 else 0))
    candidate=candidate.crop(candidate.getbbox())
    candidate.putdata([map_color(pixel) for pixel in candidate.get_flattened_data()])
    candidate.save(root/'elmina-higgsfield-v1-prepared.png')
    assert candidate.getextrema()[3]==(0,255)
    assert all(px[:3] in palette for px in candidate.get_flattened_data() if px[3])
