import { describe, expect, it } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { WorldboxApp } from '../../src/dev/worldbox/WorldboxApp.jsx';
import { WorldboxFacilitySheet } from '../../src/dev/worldbox/WorldboxFacilitySheet.jsx';

describe('Worldbox sandbox shell', () => {
  it('renders the header with all 4 approach tabs and persona switcher', () => {
    const html = renderToStaticMarkup(React.createElement(WorldboxApp));
    expect(html).toContain('Worldbox');
    expect(html).toContain('Classic 2D Grid');
    expect(html).toContain('Isometric 2.5D');
    expect(html).toContain('Cartographic');
    expect(html).toContain('Pixel Stickers');
    expect(html).toContain('Alex Tan');
  });

  it('renders amenity detail sheet with walking distance, condition, and report history', () => {
    const mockFacility = {
      id: 'hall-elmina',
      name: 'Dewan Komuniti Elmina',
      category: 'Civic Facility',
      state: 'normal',
      reportable: true,
      description: 'Shared multipurpose hall.',
    };
    const mockUserHome = { x: 4, y: 6 };
    const mockLocation = { x: 19, y: 4 };

    const html = renderToStaticMarkup(
      React.createElement(WorldboxFacilitySheet, {
        facility: mockFacility,
        location: mockLocation,
        userHome: mockUserHome,
        onClose: () => {},
      })
    );
    expect(html).toContain('Dewan Komuniti Elmina');
    expect(html).toContain('Normal');
    expect(html).toContain('min walk');
    expect(html).toContain('Report History');
  });
});
