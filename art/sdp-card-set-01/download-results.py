import json,urllib.request
from pathlib import Path
root=Path('art/sdp-card-set-01');data=json.loads((root/'results.json').read_text(encoding='utf-8'))
for item in data['items']:
    target=root/'generated'/f"{item['id']}.png"
    if not target.exists():urllib.request.urlretrieve(item['result']['result_url'],target)
    print(item['id'],target.stat().st_size,'bytes')
