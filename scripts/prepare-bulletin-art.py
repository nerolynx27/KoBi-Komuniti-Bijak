"""Lossless, artwork-only crops from the user-selected Bulletin reference."""
import hashlib
import json
from pathlib import Path
from PIL import Image

source = Path('art/dashboard-bulletin/selected-reference.png')
image = Image.open(source)
assert image.size == (1536, 2752)
output_dir = Path('public/assets/dashboard')
output_dir.mkdir(parents=True, exist_ok=True)
crops = {
    'bulletin-cleanup.png': (82, 588, 716, 1192),
    'bulletin-neighbourhood-panorama.png': (128, 1880, 1408, 2032),
}
records = []
for name, box in crops.items():
    output = output_dir / name
    crop = image.crop(box)
    crop.save(output, optimize=True)
    assert crop.size == (box[2] - box[0], box[3] - box[1])
    records.append({'output': output.as_posix(), 'crop': box, 'width': crop.width,
                    'height': crop.height, 'sha256': hashlib.sha256(output.read_bytes()).hexdigest()})
record = {
    'job_id': '4be45171-bcb4-439d-8cd8-4e27fc61a0d8',
    'source_url': 'https://d8j0ntlcm91z4.cloudfront.net/user_3EbIKJiq93OP4D7Jnqcrk4yIGeR/hf_20261022_011914_4be45171-bcb4-439d-8cd8-4e27fc61a0d8.png',
    'requested_model': 'nano_banana_pro', 'returned_model': 'nano_banana_2',
    'requested_resolution': '2k', 'requested_aspect_ratio': '9:16',
    'original': source.as_posix(), 'width': image.width, 'height': image.height,
    'sha256': hashlib.sha256(source.read_bytes()).hexdigest(),
    'license_note': 'User-selected generated design reference; no additional licensing verification claimed.',
    'processing': 'Lossless integer-coordinate crops only; no resampling, recolouring, text or frame pixels. Runtime preserves aspect ratio with pixelated rendering.',
    'outputs': records,
}
Path('art/dashboard-bulletin/generation-record.json').write_text(json.dumps(record, indent=2) + '\n', encoding='utf-8')
print(json.dumps(records, indent=2))
