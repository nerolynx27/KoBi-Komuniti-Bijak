"""Make review-only contact sheets from the actual Part 2 browser captures."""
from pathlib import Path
from PIL import Image, ImageDraw

root = Path(__file__).resolve().parents[1] / 'docs' / 'verification' / 'part-2'
groups = {
    'resident': ['map', 'reports', 'activities', 'profile'],
    'forms': ['report-form', 'activity-form', 'sign-in', 'create-account'],
    'staff': ['sdp', 'sdp-reports', 'sdp-activities', 'editor'],
    'details': ['report-detail', 'activity-detail', 'sdp-report-detail', 'settings'],
}
created = []
for width, height in [(360, 800), (390, 844), (768, 1024), (1280, 800), (800, 360)]:
    for name, surfaces in groups.items():
        cell_w, cell_h = 390, min(height, 844) + 28
        sheet = Image.new('RGB', (cell_w * 2, cell_h * 2), '#FFF4E7')
        draw = ImageDraw.Draw(sheet)
        for index, surface in enumerate(surfaces):
            source = root / f'{surface}-{width}x{height}.png'
            image = Image.open(source).convert('RGB')
            app_width = min(width, 640 if surface == 'activity-form' else 960 if surface.startswith('sdp') or surface == 'editor' else 480)
            left = (image.width - app_width) // 2
            image = image.crop((left, 0, left + app_width, min(image.height, height)))
            image.thumbnail((cell_w, cell_h - 28), Image.Resampling.LANCZOS)
            x, y = index % 2 * cell_w, index // 2 * cell_h
            draw.text((x + 8, y + 8), f'{surface} | {width} x {height}', fill='#5E3543')
            sheet.paste(image, (x + (cell_w - image.width) // 2, y + 28))
        destination = root / f'contact-{name}-{width}x{height}.png'
        sheet.save(destination)
        created.append(destination.name)
print(f'Created {len(created)} review contact sheets. Originals are unchanged.')
