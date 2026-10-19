# Part Three physical Android record

**Physical Android execution: Not applicable to the revised user scope.** On 18 October 2026 the user explicitly instructed: “Do not try it on a physical Android phone test. Just use inspect and use it at the size of the phone.” No further phone operations will be attempted. Phone-size inspection and touch-enabled emulation remain authorized; the original physical gate is unverified, not passed.

Before that instruction, read-only inventory found Android Debug Bridge 1.0.41, Platform-Tools 37.0.0-14910828 at `C:\Users\user\AppData\Local\Android\Sdk\platform-tools\adb.exe`. `adb devices -l` returned an empty list. Logs: [platform tools](part-3/android/platform-tools-inventory.json), [version](part-3/android/adb-version.txt), [devices](part-3/android/devices.txt).

No phone, emulator, browser profile or device settings were changed; no reverse mapping was created. The adb daemon started for inventory. Browser emulation is supplementary and cannot certify keyboard, picker, hardware Back, lifecycle or TalkBack.

The checklist below is retained as a future human runbook only. It is not an outstanding request to connect a phone. Any later physical testing requires a new instruction from the user. Do not install another tool or publicly deploy to bypass this scope decision.

## Device record to complete on the phone

| Field | Actual observation |
|---|---|
| Tester and local test date/time | Not observed |
| Phone model / Android version | Not observed |
| Installed stable Chrome version | Not observed |
| Keyboard app/version | Not observed |
| Physical display / CSS viewport | Not observed |
| System font scale / Chrome text scale | Not observed |
| Navigation mode / reduced motion | Not observed |
| Computed safe-area top/right/bottom/left | Not observed; zero insets cannot prove nonzero insets |
| Stable disposable origin / selected serial | Not selected; redact serial in shared images |
| Source identity | Use `part-3/source-final.json` with fresh build; no device source has yet been tested |

## Safe setup

1. From this project run `npm run build`, then `npm run preview -- --host 127.0.0.1 --port 4173 --strictPort`. Record source manifest and build output. Use actual device time; create future activities relative to that time.
2. Run the installed absolute adb path with `devices -l`. Select only the user-designated authorized physical phone. Inventory `adb -s <serial> reverse --list`; do not replace another task's mapping.
3. Use a dedicated disposable Chrome profile/origin. Preserve any needed existing localhost data; if occupied, choose another localhost port and use it consistently for the entire run. Create only this task's reverse mapping: `adb -s <serial> reverse tcp:4173 tcp:4173`.
4. Open `http://127.0.0.1:4173/#map` in installed stable Chrome. Confirm production content, local fonts/icons, `isSecureContext === true`, a working `crypto.randomUUID()` and write/read/remove of a task-only storage probe. Do not clear unrelated data. LAN HTTP is not an accepted substitute for missing required capabilities.
5. Record the device fields above before testing. Capture real focused-field/action viewports and checkpoints, naming files `Axx-<step>-<orientation>.png` under `part-3/android/`. Record actual outcome for each grouped S scenario and saved IDs/counts.

## Executable checklist and expected outcomes

All A rows are **Not applicable — excluded by the user's later instruction; not observed on physical hardware**. This status removes them from current execution scope; it does not certify the original device acceptance gate. Desktop checks are separate evidence.

| ID | Actions on physical phone | Required observation / evidence |
|---|---|---|
| A01 | Start each independent script with confirmed Reset using disposable records. Run S01–05, S07–08 and S10–12 through taps. Add hall (27,18), move (28,18), publish future activity there, join as resident, report there, follow both location links, verify removal blocker and reload without resetting mid-journey. | Saved IDs/counts, shared history/status and current map position match UI. Record results for each grouped S row and screenshot checkpoints. |
| A02 | In sign-in/registration, profile, report, SDP note, complete activity and X/Y fields, focus first/last fields, type and scroll to submit with keyboard open. Repeat report/activity landscape; expand/collapse Chrome controls. | Field/error/action reachable without header/nav overlap or page overflow. Dismissing keyboard preserves text. Capture focused field and final action viewport. |
| A03 | Report and resolution pickers: select decodable JPEG/PNG/WebP; cancel; replace; remove/reselect same file; attempt corrupt, unsupported and >5 MB files if picker permits. Use only nonpersonal fixtures. If camera offered, take nonpersonal photo, return and cancel once. | Current valid photo survives cancel/invalid replacement; newer selection wins; no stuck checking state. Save/reload keeps metadata and explains missing preview. Camera absence alone is Not applicable only after gallery path passes. |
| A04 | With keyboard open press Android Back. Exercise Back on facility sheet, photo preview and destructive confirmation; dirty Keep editing/Discard; clean Back/Forward. | No draft loss, destructive replay, stacked dialogs, history loop or map click-through. Record whether Chrome dismisses modal or navigates; either must preserve confirmation/dirty invariants. |
| A05 | Leave report draft+photo, background for 30 seconds and return. Repeat with move preview. Create activity beginning two minutes ahead, join, background beyond start, return. | Surviving session retains draft/preview and recovers controls; no duplicate/surprise save; participation closes at start. If OS reloads, record separately: committed data recovers, transient draft/photo loss follows session-only limitation. |
| A06 | Rotate map, long forms, editor and open sheet portrait→landscape→portrait; use actual Chrome 200% text and system reduced motion; inspect gesture/navigation area, controls and cutout. | Readable labels and reachable controls, no preview commit/overflow/overlap. Record computed safe-area values; disclose unobserved nonzero insets. Restore settings afterward. |
| A07 | Enable TalkBack; traverse navigation, report/error/submit, sheet close, photo preview, Join/Leave and Reset Cancel. Check read-out, accessibility focus and dismissal return. | Understandable English name/role, selected/disabled/status/error announcements, modal containment and meaningful return target. Background controls not actionable. DOM assertions do not pass this row. |
| A08 | On fixed origin reload edited report/activity/layout; cancel Reset, compare; confirm Reset; close/reopen tab and revisit. | Saved data survives reload/tab reopening. Cancel preserves bytes; reset restores coherent samples, clears pending/transient state, leaves unrelated storage alone. Capture before/after and session-photo limitation. |

For a physical defect, record exact reproduction, expected/actual behavior and before/after phone captures in the issue ledger. Add useful desktop regression, fix smallest owning source, rebuild, and repeat affected phone rows. Shared store/navigation/modal/CSS changes require all affected phone flows to be retested against the final source manifest.

At finish restore phone text/accessibility settings, stop only the preview started for this task, and remove only this task's reverse mapping (`adb -s <serial> reverse --remove tcp:4173`). Never reset a normal user origin. No physical row may be marked Passed without actual phone/tester observation.
