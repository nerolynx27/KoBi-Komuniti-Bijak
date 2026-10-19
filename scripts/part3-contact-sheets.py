"""Review sheets preserve all screenshot content; originals remain untouched."""
from pathlib import Path
from PIL import Image, ImageDraw
import json

root = Path(__file__).resolve().parents[1] / 'docs/verification/part-3/automated'
captures = root / 'captures'
output = root / 'review'
output.mkdir(parents=True, exist_ok=True)
manifest = []
files = sorted(captures.glob('*.png'))
for start in range(0, len(files), 4):
    subset = files[start:start + 4]
    images = []
    for path in subset:
        source = Image.open(path).convert('RGB')
        # Trim only the empty desktop margins, retaining the entire app and height.
        width = min(source.width, 960 if path.name.startswith(('sdp', 'editor')) else 640 if path.name.startswith('activity-form') else 480)
        left = (source.width - width) // 2
        crop = source.crop((left, 0, left + width, source.height))
        crop.thumbnail((390, 1800), Image.Resampling.LANCZOS)
        images.append(crop)
    row_heights = [max(im.height for im in images[i:i + 2]) + 32 for i in range(0, len(images), 2)]
    sheet = Image.new('RGB', (800, sum(row_heights)), '#FFF4E7')
    draw = ImageDraw.Draw(sheet)
    for i, (path, im) in enumerate(zip(subset, images)):
        x, y = (i % 2) * 400, sum(row_heights[:i // 2])
        draw.text((x + 4, y + 6), path.name, fill='#5E3543')
        sheet.paste(im, (x + (400 - im.width) // 2, y + 30))
    destination = output / f'sheet-{start // 4 + 1:02}.png'
    sheet.save(destination)
    manifest.append({'sheet': destination.name, 'captures': [p.name for p in subset]})
(output / 'index.json').write_text(json.dumps(manifest, indent=2), encoding='utf-8')
print(f'{len(files)} captures in {len(manifest)} full-content review sheets')
