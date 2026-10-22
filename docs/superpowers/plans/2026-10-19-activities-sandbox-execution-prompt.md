# Activities Design Sandbox Native Execution Prompt

Implement the isolated Activities Design Sandbox completely in `c:\Users\123\Kobi-work` using the approved implementation plan at `docs/superpowers/plans/2026-10-19-activities-sandbox.md`.

---

## 1. Role & Objective

You are an expert Senior Frontend Systems Engineer pairing with the user to implement the complete **Activities Design Sandbox** natively in this session. 

You must execute all 4 tasks from `docs/superpowers/plans/2026-10-19-activities-sandbox.md` from start to finish, following the approved design direction:
- **Default Landing Page (Set 3)**: Ticket-notched `ACTIVITIES` banner, `2026` Notice Board with top binder clips, and colour-classified tilted mini-poster notes (`Gotong-Royong Garden`, `E-Waste & Plastic Drive`, `Upcycling Craft Workshop`, `Morning Tai Chi Session`) held by pushpins, plus an interactive **Activity Detail Pop-Out Modal** with `Join Activity` / confirmed `Leave Activity` workflows.
- **Hanging Polaroid Gallery & Tapped Modal (Set 3 + Set 1)**: Sagging catenary string line carousel with clipped Polaroid frames (`G1`–`G4`) featuring slide & swing physics, where tapping any Polaroid centers it with a Warm Gold rim and opens the **Set 1 Gallery Preview Modal** with full metadata and a full-width Brick Red `CLOSE PREVIEW` button.

Do not stop after scaffolding or ask for unnecessary permission between tasks. Execute the plan task-by-task to completion.

---

## 2. Governing Context & Specifications

Read and adhere to the following project documents:
1. `AGENTS.md` — Core working rules, verification gates, and 5-colour/font decisions.
2. `docs/product/product.md` — Authoritative Pixel Stickers system, token definitions, and English copy rules.
3. `docs/superpowers/plans/2026-10-19-activities-sandbox.md` — Complete task specifications, interfaces, and code contracts.
4. Visual references:
   - Wireframe sketch: `.user_uploaded/media_1792399382765_aeab0a2f.jpg`
   - Default Landing Page (Set 3): `art/activities-explorations/03-illustrated-flyers-default.jpg`
   - Gallery Tapped Modal (Set 1): `art/activities-explorations/01-classic-bulletin-gallery-tapped.jpg`
   - Reference geometry: `art/ui-button-explorations/03-pixel-stickers.png`

---

## 3. Strict Project Constraints & Invariants

### A. 5-Colour Palette ONLY
Every authored element, SVG path, CSS rule, and state indicator in the sandbox must strictly use only:
- `--color-wine`: `#6C1A21` (Ink outlines, text, hard 4px shadows, catenary string line, modal backdrop)
- `--color-cherry`: `#B92C2C` (Pushpin heads, Recycling category top header bands, `CLOSE PREVIEW` button, folded corner accents)
- `--color-gold`: `#CEA257` (`ACTIVITIES` banner fill, Community note card fill, Community badges, selected Polaroid highlight rim, primary `Join Activity` button)
- `--color-sand`: `#D1BF9A` (`2026` notice board backing, quiet button surfaces, secondary card fills)
- `--color-vanilla`: `#E5E0CD` (Page background, Polaroid external frames, modal card surfaces, inverse text on Wine/Cherry)

*Contrast invariant:* Never place Cherry text on Sand (3.36:1) or Gold (2.58:1). Use Wine text on Vanilla/Sand/Gold, and Vanilla text on Cherry/Wine.

### B. Typography
- **Bungee** (`--font-heading`, `--font-action`, `--font-brand`, 400): Headers (`ACTIVITIES`, `2026`, `GALLERY`), modal titles, category badges, and all buttons.
- **Yanone Kaffeesatz** (`--font-body`, `--font-ui`, 400/700): Activity dates, times, locations, participant counts, descriptions, and Polaroid caption strips.

### C. Zero New Runtime Dependencies
- Plain React 19.3.1 + plain CSS + inline SVG (`shapeRendering="crispEdges"`).
- Do not install Tailwind, Framer Motion, or any third-party carousel library. Implement the polaroid-line-carousel catenary curve and swing physics natively in React and plain CSS.

### D. Isolated Sandbox Boundary
- Keep existing production routes and `reports-sandbox.html` intact.
- The new sandbox lives exclusively in:
  - `activities-sandbox.html` (root entry)
  - `src/dev/activities-sandbox/`
  - `tests/unit/activitiesSandbox.test.js`
  - `tests/e2e/activities-sandbox.spec.js`

---

## 4. Task-by-Task Implementation Sequence

### Task 1: Sandbox Data Contract, Pure State Helpers & Entry Point
1. Create `tests/unit/activitiesSandbox.test.js` with failing unit tests covering:
   - Initial sample activities (Community and Recycling) and Gallery items (`G1`–`G4`).
   - Idempotent `joinSandboxActivity` (increments count by 1, sets `joined: true`) and `leaveSandboxActivity` (decrements count, sets `joined: false`).
   - `filterSandboxActivities` by `'all' | 'community' | 'recycling' | 'joined'`.
2. Run `npm test -- tests/unit/activitiesSandbox.test.js` and verify it fails.
3. Create `src/dev/activities-sandbox/activitiesSandboxData.js` exporting:
   - `ACTIVITIES_SANDBOX_STORAGE_KEY = 'kobi.activities.sandbox.v1'`
   - `INITIAL_SANDBOX_ACTIVITIES` and `INITIAL_GALLERY_ITEMS`
   - `joinSandboxActivity`, `leaveSandboxActivity`, and `filterSandboxActivities`
   - `loadSandboxActivities` and `saveSandboxActivities` (browser localStorage with fallback)
4. Create `activities-sandbox.html` at project root preloading fonts and mounting `/src/dev/activities-sandbox/main.jsx`.
5. Run `npm test -- tests/unit/activitiesSandbox.test.js` and verify all tests pass.

### Task 2: Set 3 Header, `2026` Notice Board, Pinned Notes & Activity Detail Pop-Out Modal
1. Create `src/dev/activities-sandbox/components/ActivityIllustrations.jsx`:
   - 5-colour 16-bit pixel-art SVG illustrations for mini-posters and gallery events (`garden-harvest`, `ewaste-bins`, `upcycling-craft`, `tai-chi`, `cleanup-event`, `recycling-drive`, `harvest-day`, `tree-planting`).
2. Create `src/dev/activities-sandbox/components/NoticeBoard.jsx`:
   - Set 3 ticket-notched `ACTIVITIES` banner plaque in Gold with Wine stepped border & 4px hard shadow.
   - `2026` Notice Board with top-left & top-right pixel binder clips, double-stepped frame, `2026` Bungee label, and filter chips.
   - Pinned mini-poster buttons with pixel pushpins, category colour fills (Gold for Community, Sand/Vanilla with Cherry top stripe for Recycling), Bungee titles, dates, participant counts, category badges, and `JOINED` stamps.
3. Create `src/dev/activities-sandbox/components/ActivityDetailModal.jsx`:
   - Pop-out activity poster modal with poster art, category/joined badges, full dates/times/venue/description, and interactive `Join Activity` / confirmed `Leave Activity` button.
   - Accessible modal semantics (`role="dialog"`, `aria-modal="true"`, focus trap, `Escape` key close).
4. Run `npm run lint` and verify 0 errors.

### Task 3: Hanging Polaroid Line Carousel & Set 1 Gallery Preview Modal
1. Create `src/dev/activities-sandbox/components/PolaroidGalleryCarousel.jsx`:
   - `GALLERY` header with Prev/Next stepped pixel arrow buttons and keyboard arrow navigation.
   - Curved catenary SVG string (`<path d="M 0,14 Q 240,54 480,14" />` in `--color-wine`).
   - Hanging Polaroid buttons (`G1`–`G4`) in Cream frames with top binder-clip pegs attached along the string curve.
   - Pointer drag + velocity-based damped swing physics (respecting `prefers-reduced-motion`).
   - Selected Polaroid highlighted with a Warm Gold outer rim.
2. Create `src/dev/activities-sandbox/components/GalleryPreviewModal.jsx`:
   - Exact Set 1 modal layout: Category badge + event date top row, Bungee heading, large 16-bit pixel illustration, summary caption, and full-width Brick Red `CLOSE PREVIEW` button.
   - Accessible dialog semantics (`Escape` key, backdrop click).
3. Run `npm run lint` and verify 0 errors.

### Task 4: Sandbox Shell Assembly, Stylesheet, Build & E2E Verification
1. Create `src/dev/activities-sandbox/activities-sandbox.css`:
   - Contained stylesheet using only tokens from `tokens.css`.
   - Responsive `min(100%, 480px)` mobile shell.
   - Touch targets >= 44×44px, focus outlines with 6px vanilla rings.
2. Create `src/dev/activities-sandbox/ActivitiesSandboxApp.jsx` and `src/dev/activities-sandbox/main.jsx`.
3. Create `tests/e2e/activities-sandbox.spec.js`:
   - Test default Set 3 landing render (headers, notice board, pinned notes, gallery string, 5-colour palette check, no horizontal overflow).
   - Test Activity Detail Modal open + `Join Activity` state update.
   - Test Gallery Polaroid tap + Set 1 `CLOSE PREVIEW` modal open & close.
4. Run full verification:
   - `npm run lint` (must be 0 errors)
   - `npm test` (all 137 existing unit tests + new tests must pass)
   - `npm run build` (vite build must succeed)
   - `npx playwright test tests/e2e/activities-sandbox.spec.js` (must pass)

---

## 5. Acceptance Criteria

Execution is complete when:
- `http://127.0.0.1:5173/activities-sandbox.html` runs cleanly in the browser.
- All 4 tasks are implemented without breaking any existing tests.
- Lint, Unit Tests, Production Build, and Playwright E2E checks are 100% green.
- Actual command outputs are reported as evidence.
