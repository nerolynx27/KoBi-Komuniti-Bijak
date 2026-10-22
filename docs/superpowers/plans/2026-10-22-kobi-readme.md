# KoBi README Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task by task. Steps use checkbox syntax for tracking.

**Goal:** Give GitHub visitors a clear introduction to KoBi, a short resident demo tour, current screenshots, and reliable setup instructions.

**Architecture:** Keep the root README focused on visitors and evaluators. Link to existing product, technical, verification and repository documentation for detail. Follow EcoBiz's reading order while using KoBi's actual features and setup.

**Tech Stack:** GitHub Markdown with limited HTML for screenshot tables; React, JavaScript, plain CSS and Vite for the current app.

**Spec:** User request on 22 October 2026: study EcoBiz's README structure and plan KoBi's README. All screenshots must show the resident side; no SDP workspace screenshots.

## Reference and findings

Reference: [EcoBiz README](https://github.com/nerolynx27/EcoBiz/blob/main/README.md), retrieved 22 October 2026, file SHA `0d39f4c4bc469ec8347ca2dbc704f63f55c233bc`.

EcoBiz's sequence is: banner/name/tagline → introduction and current demo status → jump links → role-based capabilities → Windows setup and quick tour → screenshots → collapsed developer setup/checks → project documents → repository map → current boundaries → license and credits.

The useful pattern is the reading order: understand the project, try it, see it, then explore its technical details. Its explicit demo status, short capability table, curated screenshot gallery and document table are especially relevant.

KoBi's README currently starts with internal design terminology and historical test counts, followed by a long folder guide and Graphify setup before the main product tour. It has no curated screenshot gallery. Storage internals, design decisions and historical evidence links occupy much of the page.

## Global constraints

- Use English and the proper name **KoBi — Komuniti Bijak**.
- All screenshots, including any banner screenshot, come from resident pages. No SDP dashboard, editor, staff view, staff navigation or development specimen captures.
- Staff capabilities may be described briefly in text; the screenshot restriction does not remove them from the product description.
- Describe the current local frontend demo accurately: browser persistence, sample data, simulated roles, no real authentication or shared backend, temporary photo previews.
- Use existing logo assets, approved palette and current app styling. Do not generate replacement UI artwork for the README.
- No EcoBiz launcher equivalent exists in the current KoBi setup. Show verified npm setup; adding a launcher is outside this plan.
- Current package dependencies include React and Vite. Phaser and Supabase are future options, not installed runtime capabilities.
- Do not claim live deployment, an APK, official endorsement, verified community impact, or a fully green CI suite.
- No root LICENSE was found. Do not copy EcoBiz's MIT statement or choose a license on the owner's behalf. Preserve font notices and artwork provenance.

## Proposed README order

| Order | Section | Planned content |
| --- | --- | --- |
| 1 | Brand opening | Existing KoBi logo, project name, proposed tagline: **Your neighbourhood. One shared place.** Optional simple SVG banner using the logo and approved colours. |
| 2 | Introduction and status | Two short paragraphs: a mobile-first community prototype for facility reports, local activities and a pixel neighbourhood; current local demo status and browser-only data. |
| 3 | Jump links | What you can try · Run locally · Resident screenshots · Project documents. |
| 4 | What you can try | Compact Resident / SDP staff table: report and follow up / manage status and notes; discover and join activities / publish and manage activities; explore facilities / edit the demo layout. Keep this to three or four rows. |
| 5 | Run locally | Node prerequisite from package.json, clone repository, npm ci, npm run dev, then open the address Vite prints. Main app Home is the visitor entry. No local setup presented as a public hosted demo. |
| 6 | A quick resident tour | Home → open a facility from the world → submit a sample report → review its history → browse and join an activity. Explain resident demo selection and Reset demo using verified UI labels. |
| 7 | Resident screenshots | Four current captures in a two-by-two table: Home, Reports, Activities and Pixel world. Short captions and useful alt text. |
| 8 | Development and checks | A collapsed details block with stack, lint/unit/build commands, browser setup, e2e/production commands and a link to detailed verification. Advanced SDP preview information belongs here or in a linked developer guide. |
| 9 | Project documents | Small table linking product/design spec, technical documentation, latest report PDF, presentation PDF and repository guide. Label historical/planned material accurately. |
| 10 | Repository map | At most eight major entries: src, public, art, references, docs, scripts, tests, videos. Link the detailed folder guide; omit cache-by-cache narration. |
| 11 | Current boundaries | Concise explanation of demo roles, browser/device separation, temporary media, backend requirements and unverified physical Android behavior. |
| 12 | Credits and asset notices | Bungee/Yanone Kaffeesatz license notices, artwork provenance and development tools where useful. State the code's licensing status accurately after confirming it. |

Target roughly 150–200 Markdown lines, excluding any linked developer guide. Avoid repeating boundaries in multiple sections.

## Screenshot specification

Create these files during implementation, not during planning:

| File | Resident screen and composition |
| --- | --- |
| docs/readme/resident-home-mobile.png | Home bulletin with resident header/nav and readable report/activity content. |
| docs/readme/resident-reports-mobile.png | Resident reports list with sample statuses and the current shared shell. |
| docs/readme/resident-activities-mobile.png | Activity board showing the approved replacement artwork and resident controls. |
| docs/readme/resident-world-mobile.png | Resident pixel world with clear facilities and its actual fullscreen controls. Preserve its intentional header/nav behavior. |

Use a consistent 390 × 844 viewport and roughly 270 px display width. Capture actual rendered UI after fonts/images settle, with no browser chrome, open menu, loading state, toast or pointer obscuring content. Use a clean resident demo state with invented profile details. Keep the world screenshot's original aspect ratio; do not crop away essential controls. Caption the gallery as sample data captured from the resident app.

Do not capture from `sdp-workspace.html`, even when it can display resident pages. Start the main app from its ordinary entry and explicitly select the resident demo persona if the browser remembers staff mode.

## Task 1: Prepare accurate copy and references

**Files:** Modify README.md; create docs/DEVELOPMENT.md if needed to retain useful setup/storage/recovery details.

- [x] Confirm the actual resident demo entry, tour labels, reset location and visible routes in the main app.
- [x] Move useful Graphify, storage-envelope, recovery and advanced preview details into the developer guide; retain existing historical verification files unchanged.
- [x] Replace the README with the proposed section order. Keep the product's purpose above implementation details.
- [x] Use Node `^22.13.0 || >=24.0.0` requirements from package.json. Show clone URL `https://github.com/nerolynx27/KoBi-Komuniti-Bijak.git`, then `cd KoBi-Komuniti-Bijak`, `npm ci`, `npm run dev`.
- [x] Link the latest report to `docs/reports/kobi-report/KoBi-report-technologies.pdf` and presentation to `docs/presentations/presentation.pdf`.
- [x] Put accurate check commands in the collapsed block: `npm run lint`, `npm test`, `npx playwright install chromium`, `npm run test:e2e`, `npm run build`, `npm run test:production`. Build before production tests. Link the known legacy palette-test limitation; do not present historical counts as a fresh suite result.

## Task 2: Capture the resident gallery and finish branding

**Files:** Create the four PNGs under docs/readme/; modify README.md; optionally create docs/readme/banner.svg.

- [x] Start the main app in resident mode, using isolated browser storage so existing demo work is preserved.
- [x] Capture the four specified views at the same viewport; inspect every image for correct resident navigation, current artwork and complete rendering.
- [x] Add a two-by-two HTML image table, descriptive alt text and short captions. Link images to their full-size files if helpful.
- [x] Reuse `public/assets/brand/kobi-logo.png` for branding. If a banner is used, keep it simple and avoid invented app screenshots or extra feature claims.

## Task 3: Verify the README as a GitHub visitor

**Files:** Review README.md, docs/DEVELOPMENT.md if created, and docs/readme/ assets.

- [x] Preview the rendered Markdown at desktop and narrow widths; confirm the gallery remains readable and headings/jump links resolve.
- [x] Check every relative link and image path against tracked files, including case and spaces.
- [x] Verify each setup command against package.json and the actual main-app startup. Do not advertise the SDP preview as a production build entry; current Vite build inputs omit sdp-workspace.html.
- [x] Check every feature claim against the resident tour and current implementation. Clearly distinguish prototype behavior from proposed backend work.
- [x] Confirm all four images show resident pages and no staff controls. Review gallery captions and image alt text as well as pixels.
- [x] Run `git diff --check` for changed text and review the diff. No new unit tests are needed for this documentation-only work.
- [x] Leave changes reviewable; commit/push only when requested.

## Review focus

1. A browser remembering staff mode must not result in staff screenshots.
2. A developer-only preview URL must not be advertised as a shipped production entry.
3. Historical specs mentioning Phaser/Supabase must not become claims about installed technology.
4. Existing generated artwork and font licenses must retain accurate attribution; no unselected code license.
5. Old verification counts and phone-size emulation must not imply current full-suite or physical-device validation.

These checks are covered by Tasks 1–3. This plan changes documentation and creates resident captures only; it adds no app features, launcher, deployment or backend.
