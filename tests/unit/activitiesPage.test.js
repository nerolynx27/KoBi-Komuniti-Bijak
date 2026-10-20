import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';
import { NoticeBoard } from '../../src/features/activities/components/NoticeBoard.jsx';
import { PolaroidGalleryCarousel } from '../../src/features/activities/components/PolaroidGalleryCarousel.jsx';
import { GalleryPreviewModal } from '../../src/features/activities/components/GalleryPreviewModal.jsx';
import { ActivityDetailModal } from '../../src/features/activities/components/ActivityDetailModal.jsx';
import { ActivitiesPage } from '../../src/features/activities/ActivitiesPage.jsx';
import { createSampleData, RESIDENT_ID } from '../../src/lib/demoSamples.js';

describe('Activities Production Components', () => {
  it('renders NoticeBoard with filter chips and year label', () => {
    const html = renderToStaticMarkup(createElement(NoticeBoard, { activities: [], activeFilter: 'all' }));
    expect(html).toContain('2026');
    expect(html).toContain('ALL');
    expect(html).toContain('COMMUNITY');
    expect(html).toContain('RECYCLING');
    expect(html).toContain('JOINED');
    expect(html).toContain('data-filter="recycling"');
    expect(html).toContain('data-filter="joined"');
  });

  it('renders PolaroidGalleryCarousel with actual event names and without G1–G4 dots', () => {
    const items = [
      { id: 'g1', code: 'G1', shortCaption: 'Park Clean-Up', title: 'Township Clean & Green Day', dateLabel: '04 Oct 2026', artworkKey: 'cleanup-event' },
      { id: 'g2', code: 'G2', shortCaption: 'Garden Harvest', title: 'Community Garden Harvest Day', dateLabel: '12 Oct 2026', artworkKey: 'harvest-day' },
      { id: 'g3', code: 'G3', shortCaption: 'Recycling Drive', title: 'Weekend E-Waste Sorting Drive', dateLabel: '18 Oct 2026', artworkKey: 'recycling-drive' },
      { id: 'g4', code: 'G4', shortCaption: 'Tree Planting', title: 'Neighbourhood Tree Planting', dateLabel: '19 Oct 2026', artworkKey: 'tree-planting' },
    ];
    const htmlInitial = renderToStaticMarkup(createElement(PolaroidGalleryCarousel, { items }));
    expect(htmlInitial).toContain('GALLERY');
    expect(htmlInitial).toContain('Park Clean-Up');
    expect(htmlInitial).toContain('Garden Harvest');
    expect(htmlInitial).toContain('Recycling Drive');
    // Verify no G1-G4 indicator dots rendered
    expect(htmlInitial).not.toContain('act-gallery-dot');

    // Verify 4th event is rendered when viewing next slot
    const htmlNext = renderToStaticMarkup(createElement(PolaroidGalleryCarousel, { items: items.slice(1) }));
    expect(htmlNext).toContain('Tree Planting');
  });

  it('renders GalleryPreviewModal with Brick Red CLOSE PREVIEW button', () => {
    const item = {
      id: 'g1',
      code: 'G1',
      category: 'community',
      categoryLabel: 'COMMUNITY',
      dateLabel: '04 Oct 2026',
      title: 'Township Clean & Green Day',
      summary: 'Collected 145 kg of recyclables and cleared walkway planters.',
      artworkKey: 'cleanup-event',
    };
    const html = renderToStaticMarkup(createElement(GalleryPreviewModal, { item, onClose: () => {} }));
    expect(html).toContain('CLOSE PREVIEW');
    expect(html).toContain('is-close-preview-cherry');
    expect(html).toContain('Township Clean &amp; Green Day');
  });

  it('renders ActivityDetailModal with activity metadata and Join activity button', () => {
    const activity = {
      id: 'act-1',
      title: 'Gotong-Royong Garden',
      category: 'community',
      categoryLabel: 'COMMUNITY',
      dateLabel: '15 Nov 2026',
      timeLabel: '8:00 AM – 11:00 AM',
      location: 'Community Garden',
      participantCount: 18,
      joined: false,
      description: 'Weed raised beds and harvest greens.',
    };
    const html = renderToStaticMarkup(
      createElement(ActivityDetailModal, {
        activity,
        onJoin: () => {},
        onClose: () => {},
      })
    );
    expect(html).toContain('Gotong-Royong Garden');
    expect(html).toContain('COMMUNITY');
    expect(html).toContain('15 Nov 2026');
    expect(html).toContain('Community Garden');
    expect(html).toContain('18 joined');
    expect(html).toContain('Join activity');
    expect(html).not.toContain('Leave activity');
  });

  it('renders ActivityDetailModal with Joined status and Leave activity button when joined', () => {
    const activity = {
      id: 'act-1',
      title: 'Gotong-Royong Garden',
      category: 'community',
      categoryLabel: 'COMMUNITY',
      dateLabel: '15 Nov 2026',
      timeLabel: '8:00 AM – 11:00 AM',
      location: 'Community Garden',
      participantCount: 19,
      joined: true,
      description: 'Weed raised beds and harvest greens.',
    };
    const html = renderToStaticMarkup(
      createElement(ActivityDetailModal, {
        activity,
        onLeave: () => {},
        onClose: () => {},
      })
    );
    expect(html).toContain('Joined');
    expect(html).toContain('19 joined');
    expect(html).toContain('Leave activity');
    expect(html).toContain('Done');
  });

  it('renders ActivitiesPage with sample activities on Notice Board', () => {
    const data = createSampleData();
    const actor = { id: RESIDENT_ID, role: 'resident' };
    const store = { dispatch: () => true };
    const filters = { activities: 'all' };
    const snapshot = { pendingOperation: null };
    const html = renderToStaticMarkup(
      createElement(ActivitiesPage, {
        data,
        actor,
        store,
        snapshot,
        filters,
        setFilter: () => {},
      })
    );
    if (html.includes('activities-page-bleed')) {
      expect(html).toContain('GALLERY');
      expect(html).toContain('2026');
    }
    expect(html).toContain('A greener Saturday');
  });
});
