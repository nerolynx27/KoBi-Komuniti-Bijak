import { describe, expect, it } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { WorldboxApp } from '../../src/dev/worldbox/WorldboxApp.jsx';

describe('Worldbox Full App Integration', () => {
  it('mounts the active map component directly inside the draggable viewport', () => {
    const html = renderToStaticMarkup(React.createElement(WorldboxApp));
    // Default active approach is classic-grid
    expect(html).toContain('classic-grid-map');
    expect(html).toContain('Find my house');
    expect(html).toContain('data-draggable="true"');
    expect(html).not.toContain('Loading Renderers');
  });

  it('renders all 4 approach tabs with active accessibility attributes', () => {
    const html = renderToStaticMarkup(React.createElement(WorldboxApp));
    expect(html).toContain('aria-selected="true"');
    expect(html).toContain('Classic 2D Grid');
    expect(html).toContain('Isometric 2.5D');
    expect(html).toContain('Cartographic');
    expect(html).toContain('Pixel Stickers');
  });
});
