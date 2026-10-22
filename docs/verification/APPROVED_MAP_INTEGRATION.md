# Approved map integration — 22 October 2026

The approved Master World Asset Catalog assembly now renders in the resident map and SDP world editor. Its twelve curb-mounted streetlights, removed boulevard labels/bench, Frekuensi label layering, and Masjid Al Falah label below the building are retained.

The catalog remains the artwork source. Run `node scripts/export-map-overview.mjs` after editing it to regenerate both `public/assets/world/elmina-map.svg` and `src/features/world/approvedMap.generated.js`. React renders each placed asset separately, keeping the catalog's draw order and sub-tile artwork offsets while reflecting saved editor moves, additions and removals. Only trusted repository artwork enters the generated markup.

All twelve lights and the hall, mosque, park, lake and recycling point open facility sheets. Their report buttons select their own stable facility ID in the existing report form. Reports remain local demo records. Private homes and decorative trees retain inspection without public reporting.

Current Elmina browser saves upgrade once without clearing reports, profile edits, activities, custom placements or removed original objects. Historical bench records remain linked to their original facility. The subsequent full-screen integration also recognizes the exact untouched six-object pilot and its known partial upgrade, including saves without Elmina home metadata. Ambiguous edited pilot layouts retain their saved layout. See [the current full-screen behavior and verification](FULLSCREEN_MAP.md); the results below describe the preceding integration.

Verification:

- 192 unit tests passed, including distinct reportable facilities, valid data, draw order and non-destructive migration.
- Four touch-enabled mobile Chromium browser tests passed: tapping all 17 shared assets into the correct report form; keyboard/private-home behavior and unchanged selected artwork fills; a newly introduced light report surviving reload with a Reported condition; full-map fit, zoom/reset/home location; saved editor movement and reportable added components.
- Production build passed.
- Focused source lint passed. A later repository-wide lint run also encountered a concurrently generated `output/sdp-workspace-build/` bundle; that generated output is unrelated to this integration.
- Focused code review approved after correcting a legacy selection rule that recolored nested SVG rectangles.

Evidence is in `artifacts/map-overview/`: `integrated-map-mobile.png`, `integrated-light-report.png`, `integrated-app-map.png`, and `browser-results/`.

These are automated Chromium checks, not a physical Android-device test or proof of real server submissions. Whole-tile editor footprints remain an approximation of the artwork bounds.
