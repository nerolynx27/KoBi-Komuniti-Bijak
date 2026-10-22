# Report to repair — storyboard revision 01

22 October 2026. User-authorized scope: seven static storyboard frames using Development specimen components and Master World assets, before animation.

The user subsequently approved this storyboard and authorized animation. The playable result and current verification are in [REPORT_TO_REPAIR_ANIMATION.md](REPORT_TO_REPAIR_ANIMATION.md). The still-frame notes below record the storyboard phase.

Preview: `http://127.0.0.1:5182/storyboard.html`.

Run `npx vite --config storyboard.vite.config.js` from the project root. Build independently with `npx vite build --config storyboard.vite.config.js`; the output is `output/storyboard-build/`. No dependency, main-app route, shared component or saved demo data changes are required.

## Sequence

| Frame | Proposed time | Story beat |
|---|---|---|
| 01 | 00:00–00:05 | Establish the approved neighbourhood |
| 02 | 00:05–00:10 | Identify Streetlight #04 |
| 03 | 00:10–00:15 | Select facility and report action |
| 04 | 00:15–00:20 | Describe the issue; photo is optional |
| 05 | 00:20–00:23 | Confirm the staged demo report |
| 06 | 00:23–00:30 | Explicit later update: In progress → Resolved |
| 07 | 00:30–00:38 | Return to neighbourhood and KoBi closing message |

Each frame includes motion, world source, interface source and transition notes. Examples inside frames are inert; scene-navigation links remain interactive. No report submission or storage action occurs. Timing is proposed, not implemented playback.

## Reuse

- Actual shared React `Button`, `ActionLink`, `Card`, `StatusBadge`, `FormField` and `Icon` components; `FrameStyleProvider` uses the specimen's `gateway` context (the approved Bulletin treatment).
- Existing tokens, local Bungee/Yanone Kaffeesatz fonts and shared component CSS. Only the five approved UI colours are used in new styles.
- Existing `public/assets/world/elmina-map.svg` export from the Master World catalog. Streetlight #04 marker uses `approvedArtwork` hit coordinates and `approvedPlacements` identity.
- The catalog page's decorative CSS is not reused. The approved world artwork retains its artwork palette.

The inspected catalog has no worker, resident or wheelchair-user sprite. The storyboard records that gap and uses status panels in this draft. Repair progress/light animation, pointer motion, characters, audio and video export are future production work.

## Verification

`node scripts/verify-storyboard.mjs` checks seven frames, loaded world artwork, no horizontal overflow, panel fit, scene navigation and zero localStorage entries in a fresh browser context. It captures desktop (1440×1000) and mobile (390×844) screenshots under `output/storyboard-review/` and fails on browser page errors. It requires installed Microsoft Edge and the preview server running.

Targeted ESLint, an independent Vite production build and both browser viewport checks passed on 22 October 2026. These checks cover this storyboard; they do not establish full-app regression or physical Android results.
