# KoBi Product and Design System — Pixel Stickers

Version 1.1 · 19 October 2026 · Platform: mobile web

**19 October 2026 — approved palette and fonts implemented.** The user authorized the font replacement and subsequent colour-plan execution. The current UI uses only the five colours in Section 3, with Bungee/Yanone Kaffeesatz roles from Section 4. Future pixel-world artwork is exempt from the palette restriction; React/DOM controls, labels and panels over it are not. The two-font rule applies across the project, including future world text. See [current colour-migration verification](../verification/UI_COLOUR_MIGRATION.md). Historical evidence describes the earlier build.

**Selected direction: 03 — Pixel Stickers.** This is the implementation specification for the whole KoBi interface: resident screens, SDP screens, and world editor controls. The user confirmed the style and English language; the construction rules below settle the implementation choices for that selection. This specifies future work, not components or tests already completed.

## 1. Authority, product, and language

- Read this file before implementing UI. It owns visual tokens, component construction, English copy, and asset-format decisions. [TECHNICAL_DOCUMENTATION.md](TECHNICAL_DOCUMENTATION.md) owns behavior/data contracts; [MVP_UI_ASSETS.md](MVP_UI_ASSETS.md) owns UI-01–UI-20 and world asset dimensions; [PROJECT_TIMELINE.md](PROJECT_TIMELINE.md) owns implementation order.
- The latest user instruction wins. For visual or language conflicts with older documents, this file wins. [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) is a pointer and historical production note, not a competing specification.
- **Conversation, new documentation, and all visible app UI use English.** Malay instructions from the user do not change output language. Use Malay output only when explicitly requested. Keep KoBi — Komuniti Bijak as the proper name. Historical Malay prose and image labels are not production copy.
- KoBi lets residents select a facility, report a problem, follow repairs, and join community/recycling activities. SDP staff manage reports, activities, and the available world components. The pixel map connects tasks to places; it is not a game economy.
- Android Chrome first. JavaScript/JSX, React, plain CSS, Vite, Phaser **3.90.0**. Complete and test the shell before the pixel world; backend remains optional afterward. No new UI kit, CSS framework, graphics runtime, icon package, or state library is needed for this system.
- Show `Demo mode` persistently, `Sample data` near example records, and `Saved on this browser` for local changes. Resident/SDP switching is a demo view switch, not authentication. No passwords in storage or claims of real delivery/protected staff access.

## 2. Visual authority and production decision

Reference: [03-pixel-stickers.png](../../art/ui-button-explorations/03-pixel-stickers.png), 2048×2048. Original prompts, IDs, and result URLs: [generation-record.json](../../art/ui-button-explorations/generation-record.json).

Preserve stepped outlines, offset hard shadows, clipped ticket ends and small folded filter tabs. Apply the five-colour palette below: gold main actions, wine lettering, vanilla surfaces and cherry fold accents. The app should feel like a friendly 16-bit civic toolkit. Actions carry the sticker treatment; long forms stay calm and readable. The older concept sheet remains a geometry reference, not the current palette or typography authority.

Do not copy generated text, gradients, inconsistent line widths, exact image measurements, or extra colors. The source has an opaque cream background and is not a sprite atlas. Submission requested Nano Banana Pro, but completion reported Nano Banana 2; verified Pro provenance cannot be claimed. The other three concept sheets are archived alternatives, not another component family to mix into the app.

**Build all shell controls with semantic React HTML, CSS tokens, and code-authored inline SVG frames/icons. The generated PNG is visual reference only.** Do not crop PNG buttons or generate separate controls per label/size. PNG is for world artwork and photo content. This settles SVG versus PNG for the shell.

## 3. Color system

The sole UI colour source is the [palette image supplied by the user on 19 October 2026](https://i.pinimg.com/736x/78/71/af/7871af2062e7b91f2a7d4672865e71fa.jpg). The five hex codes were read from its printed swatch labels, not sampled from the photograph, texture or gradients. This supersedes the Google Drive overview and the original concept-sheet palette. The image is a reference, not a licensed runtime asset.

Use only these five colours for UI surfaces, text, borders, icons, focus rings, validation, status, disabled controls and editor overlays. Do not add white, black, grey, green or other colours, generated tints, gradients or disabled-opacity treatments. Future pixel-world artwork is exempt; that exemption does not extend to interface controls over it. User/demo photo content is content rather than a UI colour token and is not recoloured.

| Primitive token | Hex | Role |
|---|---|---|
| `--color-wine` | `#6C1A21` | Ink, outlines, hard shadows and strong actions |
| `--color-cherry` | `#B92C2C` | Danger, error indicators and decorative folds |
| `--color-gold` | `#CEA257` | Primary actions and selection |
| `--color-sand` | `#D1BF9A` | Quiet, context and disabled surfaces |
| `--color-vanilla` | `#E5E0CD` | Page, panels, inputs, inner rims and inverse text |

| Semantic token | Primitive |
|---|---|
| `--surface-page`, `--surface-panel`, `--surface-input` | vanilla |
| `--surface-subtle`, `--action-quiet` | sand |
| `--surface-selected`, `--action-primary` | gold |
| `--surface-context`, `--surface-disabled` | sand |
| `--text-primary`, `--border-strong`, `--shadow-hard` | wine |
| `--text-secondary`, `--text-disabled`, `--border-disabled` | wine |
| `--text-inverse` | vanilla |
| `--action-secondary` | vanilla |
| `--action-strong` | wine |
| `--action-danger`, `--text-error` | cherry |
| `--accent-decorative` | cherry |

These values are implemented in `src/styles/tokens.css`; the old primitive names have been removed rather than retained as aliases. Component styles use semantic tokens; feature styles do not repeat hex values. Inline SVG inherits CSS custom properties. No dark theme in scope. Modal backdrops use solid wine rather than the former 48% opacity treatment. Transparent cutouts remain geometry, not extra UI colours. Distinguish disabled and secondary text through words, weight, borders and interaction rather than adding a muted colour.

### Contrast, calculated from exact hex values

| Text / background | Ratio | Decision |
|---|---:|---|
| Wine / vanilla | 8.78:1 | Main/supporting text, neutral buttons |
| Wine / gold | 4.94:1 | Primary/selected controls |
| Wine / sand | 6.43:1 | Quiet, context and disabled surfaces |
| Vanilla / cherry | 4.59:1 | Destructive buttons |
| Cherry / vanilla | 4.59:1 | Inline errors |
| Cherry / sand | 3.36:1 | Do not use for normal-size text |
| Cherry / gold | 2.58:1 | Do not use for text or required control indicators |

These WCAG relative-luminance calculations use the exact specified hex values; they are not a rendered-app accessibility report. Cherry error text needs a vanilla surface. On sand/gold, use wine text with an explicit error word/icon, or place the error in a vanilla region. Cherry folds are decorative and do not carry essential meaning. Status always includes words and an icon, never colour alone. Do not introduce a traffic-light palette. Recheck focus/control contrast against each adjacent surface during the later implementation.

## 4. Typography and font delivery

Use only these two selected font families across the whole project:

- **[Bungee](https://fonts.google.com/specimen/Bungee?preview.script=Latn), normal 400:** page titles, section headers, card/dialog/sheet titles, the KoBi wordmark and all button labels, including filter/segmented buttons and button-styled links. Icon-only buttons keep accessible names. Do not synthesize bold or italic Bungee.
- **[Yanone Kaffeesatz](https://fonts.google.com/specimen/Yanone+Kaffeesatz), normal 400/700:** descriptions, long text, helper copy, field labels/values, inputs, dates, counts, status and other supporting text. Use 700 for emphasis; do not make body text artificially condensed or letter-spaced.

The palette exemption for future world artwork does not exempt world labels or other project text from this two-family rule. Do not retain Play, Press Start 2P or introduce another custom/brand/icon font. A generic `sans-serif` fallback is only a resilience mechanism while the selected font loads or fails, not a third design family. Decorative fonts visible inside supplied reference photos are not typography instructions.

| Token | Size / line height | Family / weight | Usage |
|---|---|---|---|
| `--type-page` | 28 / 36 px | Bungee 400 | One page h1 |
| `--type-section` | 20 / 28 px | Bungee 400 | Section h2 |
| `--type-card` | 18 / 24 px | Bungee 400 | Record, dialog and sheet titles |
| `--type-body` | 16 / 24 px | Yanone Kaffeesatz 400 | Body and inputs |
| `--type-action` | 16 / 24 px | Bungee 400 | All button labels |
| `--type-label` | 14 / 20 px | Yanone Kaffeesatz 700 | Form labels; filter buttons use Bungee 400 |
| `--type-helper` | 14 / 20 px | Yanone Kaffeesatz 400 | Hints, dates and status |
| `--type-nav` | 12 / 16 px | Yanone Kaffeesatz 700 | Navigation link labels; navigation buttons use Bungee 400 |
| `--type-brand` | 20 / 32 px | Bungee 400 | Short KoBi wordmark |

Implement font sizes in rem using a 16 px root reference. Leave zoom enabled. Inputs stay at least 1rem; labels wrap and controls grow. Use sentence case, left-aligned text, real heading levels, and tabular numerals for dates/counts. Target a reading measure near 60 characters.

### Fixed font acquisition recipe

1. **Font replacement authorized and acquired on 19 October 2026:** obtain `Bungee-Regular.ttf` and `YanoneKaffeesatz[wght].ttf` from the official [Bungee directory](https://github.com/google/fonts/tree/main/ofl/bungee) and [Yanone Kaffeesatz directory](https://github.com/google/fonts/tree/main/ofl/yanonekaffeesatz). Official metadata lists Bungee normal 400 and Yanone Kaffeesatz's variable weight axis 200–700. Record the downloaded source commit and SHA-256. The replacement task downloaded both original font files and OFL licenses at Google Fonts revision `47d54ca1ebb14fd864695f1d39dc734f39017c33`; source URLs, SHA-256 hashes and byte counts are recorded in `art/source/fonts/provenance.json`.
2. Preserve originals and each family's `OFL.txt` under `art/source/fonts/`. Retain license notices and Reserved Font Name conditions. Do not subset, redesign glyphs or rename internal metadata for the prototype.
3. The replacement runtime files are `public/assets/ui/bungee-regular.ttf` and `yanone-kaffeesatz-variable.ttf`, with `licenses/bungee-OFL.txt` and `licenses/yanone-kaffeesatz-OFL.txt`. AS-19 covers both families; no third brand font is required. The replacement task removed the active Play/Press Start 2P originals, runtime files and licenses; historical verification evidence is retained.
4. Define two normal-style `@font-face` rules with `font-display: swap` and `format('truetype')`: Bungee weight 400; Yanone Kaffeesatz weight range 200 700, using 400/700 in the UI. Planned aliases: `--font-heading` and `--font-action` map to Bungee; `--font-ui` and `--font-body` map to Yanone Kaffeesatz; `--font-brand` maps to Bungee. No font CDN request at runtime or third custom family. The replacement task updates the preload, manifest and asset ledger along with these font faces.
5. Fallback text renders immediately if a request fails. Verify English punctuation, names, numerals, 200% text, narrow body-font readability, Bungee button wrapping and fallback layout. Grow controls or type sizes when needed rather than compressing text. AI lettering is not a font file or cropped logo. Existing captures/test results do not validate these new fonts.

## 5. Spacing, geometry, elevation, and layout

- Spacing base 4 px. `--space-1` through `--space-8`: 4, 8, 12, 16, 20, 24, 28, 32 px; `--space-12`: 48 px. Use rem for content spacing; integer CSS pixels for frame/icon geometry.
- `--pixel: 2px`; stepped corner depth 4 px; wine outer band 2 px; vanilla inner rim 2 px; hard shadow +4 px right/down. No blur, gradients, pill corners, or smooth bevels. Data separators may be 1 px wine.
- Buttons and selected chips carry the strongest shadow. Cards/dialogs use a 2 px border and at most a 2 px shadow. Inputs are simple square borders without notches. Borders are decorative: never clip the real HTML hit target, label, or focus outline.
- Leave at least 8 px paint clearance around framed controls for shadows/focus. Page gutter 16 px at 360/390 px; 24 px from 768 px. Field gap 16 px; label/input and icon/text gap 8 px; section gap 24 px.
- App width `min(100%, 480px)` centered on wider viewports. At 768 px staff workspaces may expand to 960 px with a 320 px detail column. Resident forms stay at most 480 px. No new desktop-only feature.
- Header minimum 56 px plus top safe area. Bottom navigation minimum 64 px plus bottom safe area. Account pages omit bottom nav. Main scrolling reserves nav height + 16 px; sticky actions reserve their measured height too. Use `100dvh` with `100vh` fallback, flex scroll children with `min-height: 0`, and `env(safe-area-inset-*)` on fixed edges.
- Layer tokens: `--layer-world: 0`, `--layer-world-controls: 10`, `--layer-sticky: 20`, `--layer-navigation: 30`, `--layer-backdrop: 40`, `--layer-dialog: 50`, `--layer-toast: 60`. Keep toast announcements outside modal-inert content. Do not invent higher feature-local z-index values. Native modal dialogs use the browser top layer; render any feedback needed during that dialog inside it so a lower toast cannot carry a hidden essential message.
- When the keyboard opens, focused fields and the form action must remain reachable inside the resized scroll region. Use normal document flow for account/form submission; in sheets keep the action after the form content inside the sheet's scrollable region. Do not pin a submit action beneath the keyboard. Scroll the focused field into view when necessary without moving the map camera.
- Baseline viewports: 360×800, 390×844, 768×1024, 1280×800; also check short landscape and 200% text. No horizontal page scroll. The world can pan internally; forms cannot.
- Use intrinsic sizes and min-heights. Never shrink type to force a fit, crop a required label, or stretch an image control. Long labels wrap and increase height.

## 6. Shared frame: precise SVG construction

Build one `PixelFrame` decoration primitive, behind a semantic control. It has no handlers or labels. Its inline SVG uses `aria-hidden="true"`, `focusable="false"`, `pointer-events: none`, and `shape-rendering="crispEdges"`. Internal CSS properties are `--frame-fill` (variant semantic surface), `--frame-rim` (vanilla), `--frame-ink` (wine), and `--frame-shadow` (wine); disabled maps ink to wine and omits the shadow. These are internal mappings, not feature-level overrides.

| Shape | Usage | Fixed recipe |
|---|---|---|
| `sticker` | Standard buttons, icon controls, selection | Two-step 4 px corners; 2 px wine outer band; 2 px vanilla rim; flat fill; +4/+4 wine shadow |
| `ticket` | Main page/form action | Sticker plus centered 4×8 px bite from each short edge; content inset at least 16 px |
| `folded-tab` | Filters and category controls | Sticker plus fixed 8×8 px top-right stepped cherry fold with wine divider; no side bites |

Do not proportionally stretch a small SVG with `preserveAspectRatio="none"`: that distorts corner pixels. Generate paths at the actual control dimensions:

1. HTML label/padding/min-height determine width W and height H. A shared `ResizeObserver` helper reads the border box after layout. Round decorative coordinates to integer CSS pixels; do not force page layout to a fixed grid. Redraw only on size change.
2. SVG viewport and viewBox are `(W+4)×(H+4)` / `0 0 W+4 H+4`, positioned at the control origin. One SVG unit remains one CSS px; the extra 4 px allows shadow paint without enlarging the hit area. Reserve that paint allowance in surrounding spacing.
3. Clockwise outline `S(W,H)` has points `(4,0), (W-4,0), (W-4,2), (W-2,2), (W-2,4), (W,4), (W,H-4), (W-2,H-4), (W-2,H-2), (W-4,H-2), (W-4,H), (4,H), (4,H-2), (2,H-2), (2,H-4), (0,H-4), (0,4), (2,4), (2,2), (4,2)`, then closes. Every edge is horizontal or vertical.
4. Paint S translated (4,4) in wine for shadow; S at (0,0) in wine for outline; `S(W-4,H-4)` translated (2,2) in vanilla; `S(W-8,H-8)` translated (4,4) in semantic fill. Use filled polygons, not centered strokes. This fixes edge thickness at every width.
5. Ticket side bites are transparent cutouts using even-odd paths. Recompute their location for every inset band and the shadow, so cutouts line up. Do not fake transparency by painting vanilla rectangles: that breaks on other surfaces. Folded tabs add an 8 px stepped corner inside reserved top-right padding, never over text.
6. Labels/icons live in a separate content span above the SVG. Before measurement or if decoration fails, a plain CSS 2 px wine border, semantic fill, and 4 px hard box-shadow keep the control readable. After measurement, make that fallback border/background transparent without changing its box dimensions.
7. Never clip the actual button element or its focus ring. Keep the rectangular native hit area, including near ticket bites. No filters, image masks, gradient textures, or fractional press transforms.

This recipe covers all widths and states. No per-label SVG, per-screen frame, 9-slice PNG, or additional model generation is needed. Geometry still requires visual verification at implementation; it is not claimed to be built now.

## 7. Buttons: variants, sizes, API, and states

`Button` is a native `<button type="button">` by default; form commit explicitly uses `type="submit"`. `ActionLink` is an anchor for navigation with the same visual recipes. `IconButton` always has an accessible English label. Never nest interactive controls. Text is always live HTML.

| Variant | Fill / text | Shape | Purpose |
|---|---|---|---|
| `primary` | gold / wine | ticket | One main commit/continue per action area |
| `secondary` | vanilla / wine | sticker | Edit, preview, map navigation, photo selection |
| `quiet` | sand / wine | sticker | Cancel operation, back to list, exit editor |
| `strong` | wine / vanilla | sticker | Account sign-in entry |
| `danger` | cherry / vanilla | sticker | Confirm remove/reset/cancel event/leave activity |
| `text` | transparent / wine, underlined | no frame | Minor navigation; still 44 px hit height |

Do not expose arbitrary color/radius/shadow overrides to feature code. Only primary uses ticket bites. Compact toolbar Save uses secondary; the form's main Save uses primary. `fullWidth` changes width only.

| Size | Min-height | Min-width | Horizontal padding |
|---|---:|---:|---:|
| `sm` | 44 px | 80 px | 16 px |
| `md` default | 48 px | 120 px | 20 px |
| `lg` | 56 px | 160 px | 24 px |
| `icon` | 44 px | 44 px | Center 20 px glyph |
| Full-width primary | 56 px | Container width | 24 px |

Use at least 10 px vertical padding with 24 px action line-height; these are minimums, not fixed heights. Typical wide action is 328 px at a 360 px viewport. Paired actions are equal flexible columns when content fits; stack primary first below 328 px available width or when labels need more room. Preserve 8 px gaps and paint clearance.

State precedence: unavailable/disabled > loading lock > pressed > hover > rest. Focus-visible remains an independent overlay on focusable controls. Persistent selection belongs to toggle controls, not ordinary actions.

| State | Recipe and behavior |
|---|---|
| Rest | Variant fill/text, 4 px shadow |
| Hover | Fine-pointer devices only: 2 px wine inner keyline inside existing rim; no layout shift |
| Pressed | Frame/content translate (2,2) px; shadow relative offset reduces to (2,2) so absolute shadow stays stable; reset on release, cancellation, or key release |
| Focus-visible | 2 px wine outline with 2 px vanilla gap, outside total paint bounds; never clipped |
| Loading | Retain width; 16 px stepped progress glyph replaces leading icon; explicit loading text; `aria-busy`, `aria-disabled`, and guarded activation retain focus without repeat submit |
| Disabled | Sand fill, wine ink/border, no shadow or hover/pressed response; native `disabled`; explain unavailable action nearby when needed |
| Failure | Re-enable retry, preserve input, persistent inline error; no false success or red flash |
| Success | Update from confirmed store/service result and announce briefly; no permanent success-colored button |

Loading labels: `Signing in…`, `Creating account…`, `Sending…`, `Saving…`, `Joining…`, `Leaving…`, `Publishing…`, `Removing…`, `Resetting…`. Preserve original label's minimum width. Do not invent upload percentages or call local preview a server upload.

Planned props: `variant`, `size`, `fullWidth`, `icon`, `loading`, `loadingLabel`, `disabled`, `type`, native events/accessibility attributes, and `children` label. `IconButton` uses `label` and `icon`. Shared primitives do not know report/activity/backend logic.

## 8. Screen-by-screen action inventory

Use shared variants, not new art. Codes: **P** primary, **S** secondary, **Q** quiet, **D** danger, **K** strong, **T** text, **I** icon. Main page/form action is lg/full-width on mobile; list/toolbar actions sm/md; icon target 44 px minimum.

| Screen | English title / components | Actions and variants |
|---|---|---|
| UI-01 | Sign in; FormField, PasswordField, DemoBanner | Sign in K; Create account T; Show/Hide password I; demo resident/SDP view SegmentedControl |
| UI-02 | Create account; same form primitives | Create account P; Sign in T; Back I; Show/Hide password I |
| UI-03 | Map; AppHeader, MapControls | Zoom in/out I; Reset view I; Retry S on asset failure; facility placeholder buttons S; shared bottom nav |
| UI-04 | Facility details; BottomSheet, StatusBadge | Report a problem P if reportable; View activities S if relevant; Close I |
| UI-05 | Report a problem; FacilityPicker, PhotoPicker, FormField | Send report P; Add/Replace photo S; Remove photo I; Cancel Q; Back I; unsent-input confirmation |
| UI-06 | My reports; RecordList, FilterChip | New report P; Refresh I; Open report row link; filters All/Received/In progress/Resolved |
| UI-07 | Report details; DetailRow, Timeline, PhotoPreview | View on map S; Back I; View photo S; no resident status action |
| UI-08 | Activities; RecordList, FilterChip | Refresh I; View activity row link; filters All/Community/Recycling/Joined |
| UI-09 | Activity details; DetailRow, ParticipationSummary | Join activity P; Leave activity D with confirmation; View on map S; Back I; confirmation Cancel Q |
| UI-10 | Profile; FormField, DetailRow | Save changes P; Settings T; Sign out S with confirmation; SDP workspace S in demo SDP view |
| UI-11 | Settings; HelpPanel, DemoBanner | Back I; Sign out S if needed; no inactive preference switches |
| UI-12 | Shared navigation; BottomNav, AppHeader | Map/Reports/Activities/Profile links; Back/Close I; Enter/Exit SDP workspace S/Q |
| UI-13 | Shared feedback/dialogs | Retry S; Return to list S; destructive confirm D; Discard changes D; Keep editing Q; Close I when dismissible |
| UI-14 | SDP reports; RecordList, FilterChip | Refresh I; status filters; Open report row link |
| UI-15 | SDP report details; StatusTransition, Timeline, PhotoPicker | Start work P for received; Mark resolved P for in_progress; Add/Replace evidence S; Remove evidence I; View on map S; Reload report S after conflict; Back I |
| UI-16 | Manage activities; RecordList, FilterChip | New activity P; Edit S; Preview S; Cancel activity D with confirmation; Draft/Published/Cancelled filters |
| UI-17 | Activity form; FormField, DateTimeField, FacilityPicker | Publish activity P when eligible; Save draft S; Save changes P in edit mode; Preview S; Cancel Q; Back I |
| UI-18 | World editor; EditorToolbar, LocalSaveStatus | Enter editor P; Add component S; Select S toggle; Exit editor Q; Reset demo D with confirmation |
| UI-19 | Component catalog and placement; CatalogCard, PlacementFeedback | Select item card; Place component P only if valid; Cancel Q; Back/Close I; Retry save S |
| UI-20 | Selected object; ObjectPanel, EditorToolbar | Move S toggle; Confirm move P; Cancel Q; Remove D with confirmation; Close I; blocked-removal reason when referenced |

No report delete/reopen, coins, shop, player avatar, catalog upload, or new backend operations. English is the prototype's single UI language; Settings does not gain a language switch.

## 9. Components beyond buttons

### Icons and brand

Author one AS-18 sprite at `public/assets/ui/icons.svg`, consumed by `Icon.jsx`. Each symbol: `20×20` viewBox, integer filled rect/path geometry, `currentColor`, `shape-rendering="crispEdges"`. Default display 20 px; 40 px allowed for empty states. Do not scale to fractional/18/22/24 px glyph sizes. Stair-step diagonal shapes use blocks, not smooth stroked curves. No emoji or mixed libraries.

Required symbol IDs: `map`, `report`, `activity`, `profile`, `settings`, `camera`, `image`, `location`, `calendar`, `clock`, `back`, `close`, `plus`, `minus`, `reset-view`, `refresh`, `check`, `warning`, `edit`, `sign-out`, `eye`, `eye-off`, `catalog`, `move`, `trash`, `reset-demo`, `leaf`, `recycle`, `chevron-right`, `progress`. Related meanings reuse symbols; each button verb does not need its own icon file.

Decorative icons are aria-hidden; meaningful names belong to the control. The brand wordmark is live Bungee text plus a coded fold motif. No cropped AI lettering or invented official SDP logo. Use plain `SDP workspace` unless an authorised brand asset is provided.

### Forms, inputs, and photographs

- `FormField` owns label, required indicator, helper/error text, and ID relationships. Inputs/selects min-height 48 px, textarea min-height 120 px with vertical resize. Vanilla fill, 2 px wine square border, 12 px padding, Yanone Kaffeesatz 16/24. No notches, shadows, or pixel font inside a typing area.
- Focus uses 2 px wine outline/2 px vanilla gap. Invalid uses cherry border, warning icon and English error via `aria-describedby` and `aria-invalid`. Read-only uses sand and readable text. Disabled uses sand/wine plus a reason where necessary. Placeholder never replaces label.
- Password visibility is an adjacent IconButton labeled Show password/Hide password. Use correct email/password input types and autocomplete. Demo data never stores passwords.
- `PhotoPicker` has optional/required label, file name, preview, size/format error, and Add/Replace/Remove. Existing constraint: maximum 5 MB JPEG/PNG/WebP; report photo optional, resolution evidence required. Real photographs render normally with object-fit, never pixelated. Enlarge through an accessible dialog. Say `Preview only` for nonpersisted local previews.
- Use native select/date/time inputs inside FormField for Android behavior, not custom generated calendar assets. Display dates in `en-MY`, timezone `Asia/Kuala_Lumpur`, 12-hour time with am/pm; stored instants remain UTC. Existing validation rules remain in force.

### Cards, records, and detail views

- `Card`: vanilla, 2 px wine border, restrained stepped corner decoration if needed, 16 px inset, at most 2 px hard shadow. `RecordList` is one-column rows with title, location/date, textual status and chevron. A row link is the primary target. Secondary row actions are siblings, never nested controls.
- Titles wrap; IDs/filenames break safely; descriptions use normal wrapping. Do not clamp information needed to act. Catalog selection uses a gold frame/check and aria-pressed on a selection button. `DetailRow` has label/value; `Timeline` is an ordered list with status, time, actor label, note and evidence. Data privacy follows the technical contract.

### Navigation and selection

- `BottomNav`: four equal targets **Map / Reports / Activities / Profile**, 20 px icon and visible label, vanilla surface, 2 px wine top border. Active item uses gold sticker and `aria-current="page"`. Use a navigation landmark, not an ARIA tablist unless implementing actual tab behavior.
- `FilterChip`: folded-tab, Bungee 400 at 14/20, minimum 44 px target height; vanilla/wine at rest, gold/wine selected, cherry fold accent. Buttons use aria-pressed. Wrap filters onto another row; do not truncate essential labels. Retain focus after filtering; announce result count.
- `SegmentedControl`: vanilla square frame, 44 px targets, gold selection plus check. Use native radio inputs for exactly-one selection. Demo roles are views, never permission assignment.
- Checkboxes/radios preserve native semantics with a 20 px indicator inside a 44 px labeled target; optional visual mark is code-authored SVG. No switches for preferences outside scope.

### Status and feedback

| State | English label | Surface / text | Cue |
|---|---|---|---|
| Report `received` | Received | sand / wine | report icon |
| `in_progress` | In progress | sand / wine | edit/tool icon |
| `resolved` | Resolved | gold / wine | check |
| Activity `draft` | Draft | vanilla / wine | edit |
| `published` | Published | sand / wine | calendar |
| `cancelled` | Cancelled | vanilla / cherry | close |
| Participation | Joined | gold / wine | check |
| Event started | Started | vanilla / wine | clock |
| Invalid placement | Cannot place here | vanilla / cherry | warning plus reason |
| Valid placement | Ready to place | sand / wine | check plus explicit Place action |

`StatusBadge` is a label, not a clickable pill; it need not be 44 px. Facility labels are Normal / Reported / Work in progress. Public map markers expose no reporter details.

`FeedbackState` covers initial loading, empty list, not found, unavailable view, expired real session, failed save, and asset failure. Use a small existing icon, clear heading, one explanation and S recovery action. Empty examples: `No reports yet` / `Report a problem when you spot one`; `No upcoming activities` / `Try another filter or check back later`. No new illustration generation.

`Toast` is nonblocking success feedback with polite role=status. It never contains the sole error or essential action. Persistent inline errors explain recovery and retain input. Corrupted/full browser storage offers Retry and confirmed Reset demo, never silent reset. Real backend failure must not become successful demo UI.

### Sheets, dialogs, and overlays

- `BottomSheet`: full mobile width, vanilla, 2 px wine border, restrained stepped top corners, 16 px padding, max-height 85dvh, internal scroll. At 768 px it is centered at up to 480 px. Title and Close always available; no required swipe gesture. One modal at a time.
- A sheet that opens a destructive confirmation keeps its content/state but yields the active modal layer; render the confirmation inside the existing modal host rather than stacking separately focus-trapped dialogs. Restore the sheet action's focus after cancellation. A whole-photo preview follows the same single-modal rule.
- `ConfirmDialog`: use native dialog with showModal and styled backdrop where practical; a custom modal must provide equivalent focus/inert semantics. Trap focus, label title/body, Escape when safe, initially focus least-destructive action, return focus to opener. Block touch/wheel/keyboard from reaching Phaser below.
- Destructive prompts name the target: `Remove bench?`, `Leave activity?`, `Cancel activity?`, `Reset demo?`; confirm D, cancel Q. Reset explains that records and layout return to samples. A referenced facility has a reason and no enabled Remove action.
- Unsaved form prompt: `Discard changes?`, D `Discard changes`, Q `Keep editing`. Pending save cannot be submitted twice or appear undone just because a panel closes.

### Map and editor controls

- React owns controls, forms, sheets, and accessible alternatives; Phaser owns world sprites/camera. Do not draw controls or form text into the canvas. Shell facility buttons open the same panels as later sprites.
- Keep zoom/reset clear of bottom nav/safe areas. Editor actions are labeled: Add component, Select, Move, Remove, Place component, Cancel, Exit editor. Use the same Button/IconButton family.
- Ghost placement has footprint outline, valid/invalid text and check/warning, plus an explicit confirm action. Cancel restores original placement and camera behavior. Save success requires successful local persistence. Existing ID/footprint/data rules remain binding.
- Catalog thumbnails reuse approved world PNGs, nearest-neighbor, in a consistent vanilla preview region with a live name. No per-card image generation. The staff demo switch remains clearly simulated.

## 10. Motion, accessibility, and English content

- Motion tokens: press/release 80 ms, fine-pointer hover 120 ms, sheet appearance 160 ms. Use opacity/transform only; no bouncing controls, parallax, or continuous decoration. State changes remain clear without animation.
- Reduced motion removes displacement transitions and sheet motion; progress glyph is static with live loading text. Background pages pause decoration; Phaser loops follow the existing status contract.
- Tab order follows reading order; keyboard activation and visible focus on all controls. A facility list provides a map-selection alternative. Targets at least 44×44 CSS px; verify 200% text and mobile keyboard-safe submit actions.
- App root `lang="en"`. Shared labels, status names and recovery copy live in `src/content/uiText.js`. Data codes remain unchanged. No i18n library or language switch for this scope. Malaysian dates/time remain local despite English copy.
- Sentence case and concrete verbs. `Report a problem` creates a report; `Reports` is the tab. `Remove` deletes a world component; `Cancel` abandons an operation; `Leave activity` changes participation. Do not use Cancel for all three.
- All validation, accessibility labels, demo notices, sample content, filters and status labels use English. Preserve proper names and user-entered descriptions. Historical Malay UI examples are superseded by the inventory here.

## 11. Planned files and asset-format ownership

These paths describe the target architecture; some already exist in the current shell. Both the font replacement and colour migration are applied. Create remaining files when their timeline section starts; do not generate empty files merely to match this table.

| Path | Ownership |
|---|---|
| `docs/product/product.md` | Authoritative system and decision log |
| `art/ui-button-explorations/03-pixel-stickers.png` | Selected reference only; never runtime-imported |
| `art/ui-button-explorations/generation-record.json` | Preserve original source prompts/model discrepancy |
| `art/source/fonts/` | Original official fonts and licenses |
| `art/ASSET_LEDGER.csv` | Source, revision, SHA-256, author/license, processing, output, QA for downloaded/generated/shipped media/fonts |
| `src/styles/tokens.css` | Primitive/semantic colors, fonts, spacing, geometry, motion, layers |
| `src/styles/app.css` | Reset, responsive shell and safe areas |
| `src/components/ui/PixelFrame.jsx` + `.css` | SVG geometry and size-observer helper |
| `src/components/ui/Button.jsx` + `.css` | Button, ActionLink, IconButton |
| `src/components/ui/Icon.jsx` | Sprite wrapper |
| `src/components/ui/` | FormField, PasswordField, PhotoPicker, Card, StatusBadge, FilterChip, SegmentedControl, FeedbackState, BottomSheet, ConfirmDialog, Toast |
| `src/components/navigation/` | AppHeader and BottomNav |
| `src/features/` | Domain compositions; import shared primitives |
| `src/content/uiText.js` | English shared copy and status mapping |
| `src/dev/DesignSystemPage.jsx` | Development specimen; excluded from production entry |
| `public/assets/ui/icons.svg` | AS-18 pixel symbol sprite |
| `public/assets/ui/bungee-regular.ttf`, `yanone-kaffeesatz-variable.ttf` | AS-19: Bungee 400 for headings/buttons and Yanone Kaffeesatz 400/700 for body/supporting text; acquired and applied on 19 October |
| `public/assets/ui/licenses/` | OFL notices for the two selected families; no third brand font |
| `public/assets/{terrain,buildings,props,characters,markers}/` | Processed AS-01–AS-17 world PNGs |
| `public/assets/manifest.json` | Shipped raster/svg/font metadata only |

UI primitives do not depend on Phaser/Supabase. Both resident and staff screens use them. Component-generated frame paths need no manifest entry; font files/icon sprite do. Keep domain service/data behavior in the existing architecture.

| Asset need | Chosen method | New generation? |
|---|---|---|
| Any button frame/size/state | Inline SVG + CSS tokens + live label | No |
| Nav/filter/fold | Shared frame and state styling | No |
| App icon | Code-authored AS-18 SVG symbol | No |
| Card/input/dialog/feedback | HTML/CSS plus shared icon | No |
| KoBi wordmark | Live licensed font plus coded fold | No |
| Terrain/building/prop/worker | Processed PNG/spritesheet at existing AS dimensions | Separate authorised art task |
| Map marker | Existing planned 24×24 AS PNG; DOM counterpart uses same meaning | Existing world asset workflow |
| Catalog thumbnail | Reuse world sprite without baked label | No extra image |
| Report/evidence photo | Validated real/demo photo, normal rendering | No |
| Empty/error state | Existing SVG icon and text | No |

**No shell UI production depends on another Higgsfield generation.** No 2K sheet in the build, no cropped labels, and no new picture for another verb. A future decorative raster addition needs an actual need and normal provenance/alpha QA; it cannot silently replace this coded control system.

## 12. Build order and maintenance

The shell, subsequent font replacement and approved colour migration are implemented. The following order describes the established dependencies for maintenance and any remaining component work.

1. Acquire specified fonts/licenses, record provenance, create tokens/layout, English text mapping and root language.
2. Build Icon and PixelFrame once, then buttons/links/icon buttons. Check all variants, sizes, states, long labels and font fallback on the development specimen.
3. Build fields, selection, feedback, sheet/dialog primitives; add navigation and demo/local-save notices.
4. Compose UI-01–UI-20 from the screen inventory. Shell placeholders can operate without world artwork.
5. Complete actual shell checks, then build the Phaser world while retaining these React controls. Specification completion does not complete the shell/world checklist.

For every future change:

- New intent chooses an existing variant. New width uses intrinsic sizing. New icon follows the 20×20 recipe. New screen uses the same fields/cards/actions. These do not reopen art direction.
- Add a shared primitive only when an existing one cannot express the real interaction. Do not duplicate a component for staff or introduce speculative configuration systems. Shared visual fixes belong in the shared component.
- Features consume semantic tokens, never recolor SVG internals. Changing palette, font family, silhouette or adding a raster UI family requires a deliberate decision recorded here before propagation.
- Update this document, specimen usage and relevant checks together. Preserve original generation metadata; record selection in this decision log, not by changing the original prompt.
- Keep one visual authority. Positioning/overflow/interaction fixes implement this system; they do not require another concept-selection round.

## 13. Acceptance and evidence

Documentation verification is separate from runtime acceptance. The contrast table uses computed palette ratios and the font links point to inspected official sources. The subsequent font task acquired/applied the two selected fonts and passed 10 targeted browser/layout/font checks, 3 production checks, lint, asset/hash verification and a fresh build. New captures are under `artifacts/font-migration/captures/`. That font-task evidence covered the earlier palette. The subsequent colour task passed 20 targeted browser checks, 3 production checks, 137 unit tests, lint, asset/hash checks and a fresh build; current captures and limitations are recorded in `docs/verification/UI_COLOUR_MIGRATION.md`.

Before calling the system implemented:

- Development specimen shows every button variant/size/state, all required icons, fields/error/read-only states, chips, badges, record row, photo preview, nav, sheet/dialog, feedback states and editor toolbar, using the actual shared primitives. Include long English content.
- Compare the specimen and representative map/form/list/SDP/editor screens to the five-colour/two-font specification, using set 03 for geometry only at 360×800 and 390×844, then 768×1024 and 1280×800. Check crisp, fixed-size corner pixels, no stretched outlines, no shadows covering text and no horizontal page overflow.
- Verify keyboard activation, focus ring, modal trap/return focus, Escape, repeated-submit protection, screen-reader names/status, 200% text, reduced motion, and mobile keyboard behavior. Ticket bites must not shrink hit targets.
- Recheck rendered colors in hover/focus/selected/loading/disabled contexts. Normal text needs 4.5:1; control/focus indicators need 3:1 where applicable. Decorative cherry cannot become a sole state cue or small-text surface.
- Run meaningful lint/build and shell behavioral checks required by the timeline. Failed saves retain input and never claim success. Backend security checks remain conditional on choosing backend integration.
- Verify local font/icon loading, licenses/provenance, no runtime imports from `art/`, and no concept sheet in the bundle. World PNG alpha/frame checks occur separately in world production.
- Record actual commands, captures, results and defects. Do not tick implementation tasks based only on this document.

## 14. Decision log

| Date | Decision |
|---|---|
| 2026-10-16 | User selected set 03 Pixel Stickers. |
| 2026-10-16 | User confirmed English for conversation, documentation and app UI. |
| 2026-10-16 | Adopt inline SVG frames/icons, CSS state tokens and live labels; PNG sheet is reference only. |
| 2026-10-16 | Historical, superseded on 19 October: reserve rose for accents; lime/plum primary and terracotta/cream danger meet small-text contrast. |
| 2026-10-16 | Historical, superseded on 19 October: self-host Play 400/700 and Press Start 2P 400; original TTF baseline, optional WOFF2 optimization later. |
| 2026-10-19 | User selected only #6C1A21, #B92C2C, #CEA257, #D1BF9A and #E5E0CD for UI. Future pixel-world artwork is exempt; UI overlays are included. |
| 2026-10-19 | Only Bungee for titles/headers/all buttons and Yanone Kaffeesatz for body/supporting text across the whole project, including future world text. |
| 2026-10-19 | Documentation only. Existing app code, palette, fonts, assets and historical verification evidence remain unchanged. Implementation and visual validation require a later request. |
| 2026-10-19 | Subsequent user request authorized replacing/deleting old font assets and applying the two selected fonts now, while retaining the existing colour palette. Official files/licenses acquired at revision 47d54ca1ebb14fd864695f1d39dc734f39017c33. |
| 2026-10-19 | Subsequent user approval authorized execution of the saved colour plan. Five-colour UI migration implemented; solid modal/editor paints, readable error surfaces and measured-frame focus separation verified. |

The font replacement and approved colour palette are implemented and verified within the recorded browser scope. Historical completion evidence refers to the earlier build.
