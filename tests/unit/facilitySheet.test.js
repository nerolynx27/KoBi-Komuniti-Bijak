import { describe, expect, it, vi } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { FacilitySheet } from '../../src/features/world/FacilitySheet.jsx';

describe('FacilitySheet Component', () => {
  const baseObject = {
    objectId: 'object-lamp-01',
    facilityId: 'lamp-01',
    name: 'Walkway lamp #01 (Jalan Frekuensi)',
    type: 'lamp',
    label: 'Lamp #01',
    state: 'reported',
    reportable: true,
    isUserHome: false,
    distanceText: '75 m · ~1 min walk',
    distanceMeters: 75,
    reportHistory: [
      { id: 'rh-1', status: 'received', note: 'Public report received: flicker observed.', created_at: '2026-10-18T10:00:00Z', date: '2026-10-18T10:00:00Z' },
      { id: 'rh-2', status: 'in_progress', note: 'Technician dispatched for rewiring.', created_at: '2026-10-19T08:00:00Z', date: '2026-10-19T08:00:00Z' },
    ],
    activities: [
      { id: 'act-01', title: 'Gotong-Royong Hijau Elmina', starts_at: '2026-10-25T01:00:00Z', status: 'published' },
    ],
  };

  it('renders walking distance estimate pill when distance is available', () => {
    const html = renderToStaticMarkup(
      React.createElement(FacilitySheet, { object: baseObject, closeModal: () => {}, navigate: () => {} })
    );
    expect(html).toContain('75 m · ~1 min walk');
    expect(html).toContain('badge-distance');
  });

  it('renders My House badge and disables reporting when isUserHome is true', () => {
    const homeObject = {
      ...baseObject,
      objectId: 'object-house-01',
      facilityId: 'house-01',
      name: 'Neighbourhood house (Alex Tan Home - Lot 12)',
      type: 'house',
      isUserHome: true,
      reportable: false,
      distanceText: 'Your registered home',
    };

    const html = renderToStaticMarkup(
      React.createElement(FacilitySheet, { object: homeObject, closeModal: () => {}, navigate: () => {} })
    );
    expect(html).toContain('My House');
    expect(html).toContain('badge-home');
    expect(html).not.toContain('Report a problem');
    expect(html).toContain('This is your private registered residence');
  });

  it('renders current condition badge (Normal, Reported, Work in progress)', () => {
    const reportedHtml = renderToStaticMarkup(
      React.createElement(FacilitySheet, { object: baseObject, closeModal: () => {}, navigate: () => {} })
    );
    expect(reportedHtml).toContain('Reported');

    const normalHtml = renderToStaticMarkup(
      React.createElement(FacilitySheet, { object: { ...baseObject, state: 'normal' }, closeModal: () => {}, navigate: () => {} })
    );
    expect(normalHtml).toContain('Normal');

    const repairHtml = renderToStaticMarkup(
      React.createElement(FacilitySheet, { object: { ...baseObject, state: 'repairing' }, closeModal: () => {}, navigate: () => {} })
    );
    expect(repairHtml).toContain('Work in progress');
  });

  it('renders public report history timeline with safe milestones', () => {
    const html = renderToStaticMarkup(
      React.createElement(FacilitySheet, { object: baseObject, closeModal: () => {}, navigate: () => {} })
    );
    expect(html).toContain('Maintenance &amp; Report History');
    expect(html).toContain('Public report received: flicker observed.');
    expect(html).toContain('Technician dispatched for rewiring.');
  });

  it('renders scheduled activities with links to view activity', () => {
    const html = renderToStaticMarkup(
      React.createElement(FacilitySheet, { object: baseObject, closeModal: () => {}, navigate: () => {} })
    );
    expect(html).toContain('Gotong-Royong Hijau Elmina');
    expect(html).toContain('View activity');
  });

  it('closes on backdrop click and Escape key press', () => {
    const mockClose = vi.fn();
    const tree = FacilitySheet({ object: baseObject, closeModal: mockClose, navigate: () => {} });

    // Overlay backdrop click: target === currentTarget triggers close
    const backdropTarget = { id: 'backdrop' };
    tree.props.onClick({ target: backdropTarget, currentTarget: backdropTarget });
    expect(mockClose).toHaveBeenCalledTimes(1);

    // Inner element click: target !== currentTarget does NOT trigger close
    tree.props.onClick({ target: { id: 'inner' }, currentTarget: backdropTarget });
    expect(mockClose).toHaveBeenCalledTimes(1);

    // Escape key press triggers close
    tree.props.onKeyDown({ key: 'Escape' });
    expect(mockClose).toHaveBeenCalledTimes(2);

    // Other key press does not trigger close
    tree.props.onKeyDown({ key: 'Enter' });
    expect(mockClose).toHaveBeenCalledTimes(2);
  });
});
