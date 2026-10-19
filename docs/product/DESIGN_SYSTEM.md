# KoBi Design System — Current Reference

**Selected:** 03 — Pixel Stickers, confirmed by the user on 16 October 2026.  
**Authoritative specification:** [product.md](product.md).

**Current revision — 19 October 2026:** preserve Pixel Stickers geometry, with the following replacement palette and typography. The user subsequently authorized font replacement and colour-plan execution. The current app implements this five-colour palette and Bungee/Yanone Kaffeesatz typography; see [current verification](../verification/UI_COLOUR_MIGRATION.md).

| UI colour | Exact hex |
|---|---|
| Wine | `#6C1A21` |
| Cherry | `#B92C2C` |
| Gold | `#CEA257` |
| Sand | `#D1BF9A` |
| Vanilla | `#E5E0CD` |

Source: [user-supplied palette image](https://i.pinimg.com/736x/78/71/af/7871af2062e7b91f2a7d4672865e71fa.jpg), using its printed hex labels. Only these five colours may be used for UI, including status, errors, focus, disabled states and controls over the map. Future pixel-world artwork is exempt; photo content is not a UI colour token. Do not derive new UI shades or adopt the image's gradients/textures.

Only two font families are selected for the whole project, including future world text:

- [Bungee](https://fonts.google.com/specimen/Bungee?preview.script=Latn), normal 400: titles, section headers, card/dialog/sheet headers, wordmark and all buttons.
- [Yanone Kaffeesatz](https://fonts.google.com/specimen/Yanone+Kaffeesatz), normal 400/700: descriptions, long text, supporting copy, dates, labels and form text.

This supersedes the earlier Play/Press Start 2P and plum/lime palette specification. The subsequent font-replacement request authorized the font downloads, typography roles, preload, provenance and asset metadata updates. The subsequent approved colour plan has also been executed and verified. See product.md Sections 3–4 for semantic mappings, computed contrast, planned asset paths and font roles.

Use product.md for exact colors, fonts, frame geometry, button recipes, component states, English UI labels, asset formats, screen coverage, and acceptance checks. It replaces the earlier exploration guidance in this file. Do not reopen the four-way style selection or mix the other concepts into the app.

Selected geometry reference: [03-pixel-stickers.png](../../art/ui-button-explorations/03-pixel-stickers.png). Its old colours and lettering do not override the current revision.

Historical production evidence:

- Four original PNG concept sheets were inspected and verified as 2048×2048, 24-bit RGB with opaque backgrounds.
- Prompts and result metadata remain in [generation-record.json](../../art/ui-button-explorations/generation-record.json).
- Submission requested `nano_banana_pro`; completion reported `nano_banana_2`. Verified Pro provenance cannot be claimed.
- The chosen PNG is visual reference, not a runtime button atlas. Rebuild stepped sticker geometry with inline SVG/CSS and live labels. Correct generated shading, palette drift, low-contrast pairs, and historical Malay labels using product.md.
- Source images remain preserved. The earlier shell, SVG components and fonts have implementation evidence under `docs/verification/`; that evidence does not validate the replacement palette or typography. The subsequent font and colour tasks now apply the selected typography and palette in the runtime UI.
