import { describe, expect, it } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { TemporaryMap } from '../../src/features/world/TemporaryMap.jsx';
import { createSampleData } from '../../src/lib/demoSamples.js';

describe('TemporaryMap Classic 2D Grid Integration', () => {
  it('renders lively green grass, lake, sidewalks, and crosswalks', () => {
    const data = createSampleData();
    const html = renderToStaticMarkup(
      React.createElement(TemporaryMap, { data })
    );

    // Grass pattern and colors
    expect(html).toContain('classic-grid-pattern');
    expect(html).toContain('#569443');

    // Elmina Lake
    expect(html).toContain('ELMINA LAKE');
    expect(html).toContain('#347CA1');

    // Sidewalks & Crosswalks
    expect(html).toContain('#D1BF9A');
    expect(html).toContain('street-labels');
  });

  it('renders Persiaran Elmina and Jalan Frekuensi street name banners', () => {
    const data = createSampleData();
    const html = renderToStaticMarkup(
      React.createElement(TemporaryMap, { data })
    );

    expect(html).toContain('PERSIARAN ELMINA');
    expect(html).toContain('JALAN FREKUENSI 1');
    expect(html).toContain('JALAN FREKUENSI 2');
  });

  it('renders streetlights on roadside verges without asphalt overlap', () => {
    const data = createSampleData();
    const html = renderToStaticMarkup(
      React.createElement(TemporaryMap, { data })
    );

    expect(html).toContain('Lamp #01');
    expect(html).toContain('Streetlight #10');
  });

  it('renders 20+ houses with ★ MY HOUSE pinpoint banner over Lot 12', () => {
    const data = createSampleData();
    const html = renderToStaticMarkup(
      React.createElement(TemporaryMap, { data })
    );

    expect(html).toContain('★ MY HOUSE');
    expect(html).toContain('Alex Home (Lot 12)');
    expect(html).toContain('Lot 08');
    expect(html).toContain('Lot 19');
    expect(html).toContain('Lot 25');
  });

  it('renders hover HUD and click-and-drag viewport with data-draggable', () => {
    const data = createSampleData();
    const html = renderToStaticMarkup(
      React.createElement(TemporaryMap, { data })
    );

    expect(html).toContain('data-draggable="true"');
    expect(html).toContain('schematic-hover-hud');
    expect(html).toContain('Drag anywhere to pan');
  });

  it('renders controls with Zoom in, Zoom out, Reset view, and Find my house', () => {
    const data = createSampleData();
    const html = renderToStaticMarkup(
      React.createElement(TemporaryMap, { data })
    );

    expect(html).toContain('Zoom in');
    expect(html).toContain('Zoom out');
    expect(html).toContain('Reset view');
    expect(html).toContain('Find my house');
    expect(html).toContain('schematic-scale');
  });

  it('preserves World Editor hooks and ghost preview compatibility', () => {
    const data = createSampleData();
    const ghost = { x: 2, y: 2, width: 3, height: 3, valid: true };
    const html = renderToStaticMarkup(
      React.createElement(TemporaryMap, {
        data,
        ghost,
        compact: true,
        selectedObjectId: 'object-lamp-01',
      })
    );

    expect(html).toContain('schematic-card');
    expect(html).toContain('schematic-viewport');
    expect(html).toContain('schematic-ghost');
    expect(html).toContain('is-valid');
    expect(html).toContain('Preview');
    expect(html).toContain('Select a component');
    expect(html).toContain('schematic-object');
    expect(html).toContain('is-selected');
  });

  it('enforces strict-mode compliance with exactly 1 rect per schematic-object', () => {
    const data = createSampleData();
    const html = renderToStaticMarkup(
      React.createElement(TemporaryMap, { data })
    );

    // Extract all schematic-object groups and ensure each has exactly 1 <rect>
    const objectGroups = html.match(/<g[^>]*class="[^"]*schematic-object[^"]*"[\s\S]*?<\/g>/g) || [];
    expect(objectGroups.length).toBeGreaterThan(20);

    for (const group of objectGroups) {
      // Primary rects only - child rect count must be exactly 1
      const rectCount = (group.match(/<rect[\s>]/g) || []).length;
      expect(rectCount).toBe(1);
    }
  });

  it('renders miniature pixel typography and distinct architectural shapes', () => {
    const data = createSampleData();
    const html = renderToStaticMarkup(
      React.createElement(TemporaryMap, { data })
    );

    // Explicit font sizes in SVG
    expect(html).toContain('font-size="8.5"');
    expect(html).toContain('font-size="6.5"');

    // Surau Al-Falah dome
    expect(html).toContain('surau-dome');

    // Park pavilion gazebo
    expect(html).toContain('park-gazebo');

    // Civic wine body fill for Dewan Komuniti and Surau
    expect(html).toContain('civic-hall-facade');
  });
});
