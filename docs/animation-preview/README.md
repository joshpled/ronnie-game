# Ronnie’s right-facing walk study

Open [the interactive preview](ronnie-walk-review.html). Revision 02 replaces the rejected sequence of separate drawings with a continuous joint rig. The [GIF](rig/walk.gif) and [16 sampled poses](rig/contact-sheet.png) come from the same renderer. This is a preview awaiting Josh’s visual acceptance, not an integrated game animation.

## What changed

Each paw spends 70% of a 1.6-second cycle on the ground. During contact, its local position moves backward at exactly the speed of forward travel. The scrolling floor uses that same speed. This makes the paw stationary relative to its contact point. A smooth return curve lifts the paw and matches the contact velocity at both ends; landing does not jump between drawings.

The order is near hind, near front, far hind, far front. This lateral sequence is informed by [published observations of dog locomotion](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0133936). The 1.6-second cycle, 70% stance, stride and joint dimensions are authored animation choices, not measurements of Ronnie.

Two fixed-length bones position each foreleg. The hind legs add an ankle segment. A continuous illustrated texture follows a small triangle mesh along those bones. One stable body preserves Ronnie’s face and markings; the replacement body has a slimmer waist. Far legs are darker and sit behind the body. The torso rises and falls by less than one art pixel.

## Files and maintenance

- `rig/gait.mjs`: timing, contact paths, roots and joint calculations. Tests run without a browser.
- `rig/preview.js`: Canvas rendering and preview controls. Bone lengths control the rig; the mesh determines how fur follows it. If a joint looks wrong, inspect the overlay before changing texture geometry.
- `rig/build-preview.mjs`: embeds the five used PNG textures and JavaScript into the standalone HTML. Run `npm run build:walk` after changes.
- `rig/gait.test.mjs`: ground locking, lateral footfall order, support count, continuous position/velocity, bone lengths and loop closure. Included in `npm run check`.
- `rig/browser-qa.mjs`: optional WebKit checks using an existing Playwright installation. Set `PLAYWRIGHT_MODULE` to its package path if it is not installed locally. No Playwright dependency is added to the game.
- `rig/source-generated.png`, `rig/source-body-lean.png`, prompts and extraction reports: exact generated sources and provenance. Five extracted textures are rendered; unused upper-leg pieces remain only as source assets.

The mesh is a preview implementation, not yet a reusable animation system. The renderer assumes this right-facing pose and two ground-depth lanes. Changing stride or roots can make the joint targets unreachable; the gait deliberately throws instead of silently stretching bones. Original photos are not published in this repository.

## Controls and verification

Play/pause, small step, restart, speed, scrub, enlargement and a joint/contact overlay are available. Green contact dots mark supporting paws. Reduced motion starts paused and enabling it while playing pauses the preview. Background time is not accumulated into a large jump. Paused scenes are not repeatedly redrawn.

See [visual QA](visual-qa.md), [browser results](rig/browser-qa.json), and [the architecture decision](../adr/0001-walk-rig-preview.md). Browser tests and mathematical contact checks do not establish anatomical quality or physical iPhone performance. Josh’s visual review remains the acceptance gate.

## Rejected revision 01

Josh rejected the earlier sixteen-drawing walk on 2026-09-13. `walk-right-16.png`, `comparison.gif`, the root-level contact sheet, generated source and original QA JSON files are retained as historical evidence only. Their previous technical passes are not approval of the replacement. Independent drawings changed leg phase and foot contact abruptly; adding more drawings did not fix the gait.

The scope remains a right-facing preview. Left-facing artwork, care-game integration, merging PR #2, and additional animations require the next scope decision.
