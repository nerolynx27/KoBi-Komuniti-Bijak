# Review — 22 October 2026

Revision 03: moved the opening title card to the right-side panel alignment (right 65px, top 180px). Reduced the logo from 225px to 180px (20%) and placed it on a vanilla specimen Card with 12px/16px padding. Found that standalone capture could serialize a card's SVG before its font-driven resize completed; the exporter now waits for every panel and logo frame to match the final layout dimensions. Browser playback regression, logo size/backing checks, lint/build and HyperFrames check passed. Inspected opening snapshots at 2s and the 4.768s transition; revised frames are in snapshots-opening-revised/.

Revision 02: removed the top-right demo label and replaced the top-left text badge with the user's transparent PNG logo, moved into the main project's `public/assets/brand/kobi-logo.png` and copied into this project's `assets/brand/`. Original bytes and aspect ratio preserved. Fixed the React preview's double-scaled SVG frames by measuring layout pixels in PixelFrame. A focused scaled-frame regression failed before the fix and passed afterward; the storyboard and playback browser checks passed again, along with lint/build and HyperFrames validation.

Approved storyboard translated into a continuous-map demonstration. Native seekable camera motion, UI panel entrances, pointer actions, staged submission, explicit later maintenance update, light restoration and closing are implemented. All UI is from the current specimen; all scenery is from Master World.

Measured: 38-second finite duration; exact animation-time/transform/opacity equality after backwards seeking; seven panel bounds and isolation; keyboard/play/pause/replay/scene navigation; fullscreen bounds; 390px page fit; zero storage writes and runtime errors. HyperFrames check passed with zero errors and 43 passing contrast checks.

Looked at: seven browser scene frames plus resolved payoff; standalone HyperFrames snapshots of form, resolved state and closing. Earlier-scene ghosting was found and fixed by holding each faded-out state through the end of the composition. The confirmation/opening panels were fitted above the caption zone.

Retained warnings: 18 structural authoring warnings because the exported composition preserves the actual nested React-generated SVG card/button markup in one standalone file; one deliberate-silence warning. Map-label text is decorative source artwork, marked data-layout-ignore; essential copy is in the readable specimen panels. The inspected Canva timeline had no audio track, and this version preserves that silence.

Weakest shot: maintenance is represented by the approved status card and light returning, because the inspected Master World catalog has no worker sprite. Character animation requires compatible artwork and is not claimed here.

Final MP4 export is separate from this playable animation handoff. No physical Android test was performed.
