import { describe, expect, it } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ClassicGridMap } from '../../src/dev/worldbox/maps/ClassicGridMap.jsx';
import { IsometricDioramaMap } from '../../src/dev/worldbox/maps/IsometricDioramaMap.jsx';
import { CartographicBlueprintMap } from '../../src/dev/worldbox/maps/CartographicBlueprintMap.jsx';
import { StickerboardPatchMap } from '../../src/dev/worldbox/maps/StickerboardPatchMap.jsx';
import {
  ELMINA_FACILITIES,
  ELMINA_LAYOUT,
} from '../../src/dev/worldbox/worldboxData.js';

const commonProps = {
  layout: ELMINA_LAYOUT,
  facilities: ELMINA_FACILITIES,
  selectedObjectId: 'obj-hall',
  userHomeObjectId: 'obj-house-12',
  onSelect: () => {},
};

describe('Worldbox 4 Map Approaches', () => {
  it('Approach 1: ClassicGridMap renders orthographic grid and street names', () => {
    const html = renderToStaticMarkup(React.createElement(ClassicGridMap, commonProps));
    expect(html).toContain('classic-grid-map');
    expect(html).toMatch(/Persiaran Elmina/i);
    expect(html).toMatch(/Jalan Frekuensi/i);
    expect(html).toMatch(/My House/i);
  });

  it('Approach 2: IsometricDioramaMap renders isometric diorama and 2.5D buildings', () => {
    const html = renderToStaticMarkup(React.createElement(IsometricDioramaMap, commonProps));
    expect(html).toContain('isometric-diorama-map');
    expect(html).toMatch(/Persiaran Elmina/i);
    expect(html).toMatch(/Surau Al-Falah/i);
    expect(html).toMatch(/My House/i);
  });

  it('Approach 3: CartographicBlueprintMap renders high-contrast blueprint arteries', () => {
    const html = renderToStaticMarkup(React.createElement(CartographicBlueprintMap, commonProps));
    expect(html).toContain('cartographic-blueprint-map');
    expect(html).toMatch(/Persiaran Elmina/i);
    expect(html).toMatch(/Dewan Komuniti/i);
    expect(html).toMatch(/My House/i);
  });

  it('Approach 4: StickerboardPatchMap renders tactile pixel-sticker badges', () => {
    const html = renderToStaticMarkup(React.createElement(StickerboardPatchMap, commonProps));
    expect(html).toContain('stickerboard-patch-map');
    expect(html).toContain('sticker-badge');
    expect(html).toMatch(/My House/i);
  });
});
