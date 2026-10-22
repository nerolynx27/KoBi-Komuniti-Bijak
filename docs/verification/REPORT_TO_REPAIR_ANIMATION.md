# From report to repair — animation revision 01

22 October 2026. The user approved the seven-frame storyboard and authorized animation.

## Revision 02 — supplied logo and browser frame repair

The user requested removing the top-right card/text and replacing the top-left wordmark with `Downloads/logo kobi.png`. The original 1460×493 RGBA PNG was moved unchanged to `public/assets/brand/kobi-logo.png` (SHA-256 `8A2035C91F37FE8E8ED4F8F0EE42F2F1B2DD7ED6465981A6E3899FFF7471F1E4`). The Downloads source no longer exists. The transparent logo displays at 225px logical width, preserving aspect ratio and original artwork. The standalone HyperFrames project receives a packaged copy in `assets/brand/`.

The browser preview had incorrectly sized SVG card backgrounds because PixelFrame measured `getBoundingClientRect()` after an ancestor scale and then applied that scale again to the resulting SVG geometry. PixelFrame now uses the target's untransformed `offsetWidth`/`offsetHeight`; the shared observeSize API and its navigation/carousel callers retain their previous behavior. A new mobile-scale assertion failed before this fix and passed afterward. The seven-scene playback suite, desktop/mobile storyboard checks, targeted ESLint and independent build passed again. HyperFrames validation passed again with zero lint/runtime/layout/contrast errors. Revision screenshots are under `videos/report-to-repair/snapshots-logo/`.

## Result

Revision 03: the opening panel now aligns with later right-side cards at right 65px/top 180px, with the complete text inside its frame. The logo is 180px wide (20% smaller), backed by a vanilla specimen Card. Export waits for final font-driven card dimensions before freezing SVG frame geometry. Playback/logo assertions, targeted ESLint/build and HyperFrames check passed; snapshots in `videos/report-to-repair/snapshots-opening-revised/`.

- Browser player: `http://127.0.0.1:5182/animation.html` (same Vite server/config as the storyboard).
- HyperFrames preview: `http://localhost:3002/#project/report-to-repair` (persistent preview started for review).
- Standalone project: `videos/report-to-repair/`; native paused WAAPI animations, 38 seconds at 1280×720.
- Seven approved beats, continuous approved Master World assembly, Streetlight #04 selected, specimen cards/form/buttons/statuses, animated demonstration pointer, explicit later update, lamp light restored at 27.65 seconds, closing neighbourhood view.
- Browser controls: Play/Pause, Replay, chapter jumps, keyboard-operable seek slider, Fullscreen and a text transcript. Initial playback is paused. Fullscreen preserves the composition aspect ratio.
- No character art, new dependencies in the main app, live submissions or storage writes. Silent, matching the inspected Canva timeline's empty audio track. No MP4 was rendered in this phase.

## Sources and reproduction

`src/dev/storyboard/Film.jsx` uses the actual shared React UI components and `gateway` frame context from the specimen. The inline world is assembled from `approvedScenery` and ordered `approvedArtwork`; the separate light-cone group for `f1-south` stays dark until resolution. Map-label text is artwork detail, not essential narration; all story information is repeated in larger UI text.

`src/dev/storyboard/filmTimeline.mjs` defines the finite, paused native animations. Every rendered state derives from requested seconds. The browser's animation-frame clock drives only the preview player's seek position; it is not included in the standalone composition.

`node scripts/prepare-film-project.mjs` captures the rendered React component markup, SVG frames and shared CSS into standalone HyperFrames HTML, copies the existing two local fonts and icon sheet, and installs the identical animation definitions. Shared component hover/press CSS transitions are omitted from the film snapshot; authored button presses are native keyframes. The project contains the reference catalog `ui-focus-zoom` component; its single-world camera principle informed the native implementation, without adding a GSAP dependency.

## Fresh verification

- Targeted ESLint and independent Vite build passed.
- `node scripts/verify-animation.mjs` passed: all seven panels fit and isolate correctly; scene jumps, keyboard seek, replay and play/pause work; lamp returns and reverses correctly; transforms/opacity/time match exactly after reverse seeking; fullscreen fits; 390px mobile has no page overflow; no localStorage entries or browser errors.
- GPU screenshots at the same seek time differed only by one RGB level in 296 pixels during investigation; exact animation state equality is the repeatability assertion, rather than PNG byte equality.
- HyperFrames `check --json`: overall pass, zero lint/runtime/layout/contrast errors; 43 contrast checks passed. Eighteen structural authoring warnings remain (single generated file, dense tracks, nested cards/caption markup). One craft warning notes the deliberate silent film. These do not claim a warning-free check.
- HyperFrames snapshots at 2, 8, 12, 17, 21, 25, 28, 35 and 36.86 seconds saved in `videos/report-to-repair/snapshots/`. Browser captures are in `output/animation-review/`.
- No physical Android device or audio listening test performed; there is no audio track to assess.

The storyboard stays available at `/storyboard.html` with a Watch animation link. Main-app screens and saved demo data remain outside this change.
