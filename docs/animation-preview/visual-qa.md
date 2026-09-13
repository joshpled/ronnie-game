# Visual review — revision 02

Date: 2026-09-13. Verdict: **pass with warnings for user review**, replacing the rejected image-sequence draft. This is not approval for game integration. Josh’s acceptance and physical iPhone validation remain pending.

## Evidence reviewed

The coordinating agent inspected rendered poses, the mobile layout and the final 16-phase contact sheet. The reusable visual QA agent independently reviewed the final rig, sampled poses and source. The sheet and GIF are exported from the same continuous renderer as the interactive preview.

- The four legs now follow a readable lateral sequence with continuous placement. No specific planted-paw slip was identified in the final sampled phases.
- The leaner torso, face, tall ears, saddle, bib and freckles remain consistent between frames. There are no body scale pops or visible pose-loop discontinuities.
- Bone lengths stay fixed, and the skin follows distance along those bones. Initial rigid part overlays and the overly rounded body were discarded.

## Warnings that remain

- Knee/hock bends remain somewhat tubular, especially in samples 06–08 and 14–16.
- Near/far paws overlap closely around samples 01, 09 and 16, briefly reducing readability.
- The head and torso are unusually steady, so the walk still has a slight puppet quality. More shoulder, hip and head response needs deliberate artwork/rig tuning.
- Limb shading and root attachment remain flatter than a fully authored rig. Reusing whole-leg textures makes this preview manageable but limits muscle/segment detail.

These are visible limitations, not waived integration requirements. The replacement is sufficiently improved for Josh to judge the movement direction; it is not presented as a finished realistic gait.

## Technical validation

- `npm run test:walk`: four tests sample ground locking, lateral order, support count, lift/landing continuity, finite fixed-length joints and repeatable pose coordinates.
- WebKit with iPhone 13 emulation: reduced motion, play/pause, step/wrap, speed, scrub, restart, joint overlay, mobile/enlarged layout and exact rendered loop closure pass. No page errors. See [browser report](rig/browser-qa.json).
- Rendering measurements in the report are desktop CPU submission times. They do not measure physical iPhone GPU performance, battery use or touch acceptance.

## Earlier revision

Josh rejected revision 01 (“The walk is very bad. Try again”). Its independently generated drawings had abrupt supporting-foot changes and inconsistent leg phases. Earlier geometry/browser checks were never evidence that its gait was convincing. Root-level old QA JSON, contact sheet and GIF are historical only; the current artifacts are under `rig/`.
