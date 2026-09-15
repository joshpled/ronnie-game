# Ears pulled back — animation review

[Play revision 3](index.html) · [Public phone preview](https://joshpled.github.io/ronnie-game/previews/ears-pulled-back/?v=3) · [Animated GIF](motion-v3.gif)

Josh approved the revision-2 sad endpoint with “Yes continue.” Revision 3 now
animates neutral → ears back with a sad face → hold → neutral. The full motion
awaits his visual approval. Her original atlas remains the design authority.

## Revision 3 motion

Five 192 × 208 poses live in `motion-v3.png`. The first and last poses are exact
copies of original neutral and the approved sad endpoint. Three intermediate
ear poses were generated together using the attached original and approved
endpoint references; [prompt-motion.txt](prompt-motion.txt) records the request.
The generated head/body pixels are discarded. `motion-ear-layers.png` preserves
only the registered ears; [motion-registration.json](motion-registration.json)
records their common scale and individual placement. Expression pixels blend
toward the approved sad face at 25%, 50% and 75%, only within its existing mask.

`assemble-motion.py` deterministically rebuilds the atlas, contact sheet, GIF,
timeline and [pixel checks](qa-motion.json) from these saved layers. Use the
bundled workspace Python with Pillow and NumPy; no app dependency was added.
Every pose keeps all pixels outside the ear/expression regions exact, including
the entire body from y=85 downward. Both endpoints are pixel-exact, no cell
edges clip her silhouette, and the original atlas SHA-256 is unchanged.

[timeline.json](timeline.json) owns the 2400 ms sequence: 400 ms neutral,
400 ms drawing back, 800 ms sad hold, 500 ms return, 300 ms neutral. These are
discrete pose samples: the full sad pose appears during the last 100 ms of the
pullback too; the final 125 ms return sample is already exact neutral. The GIF
samples at 10 ms, so the 125 ms return steps alternate 130/120 ms; the browser
uses the exact timeline. Both total 2400 ms.

The responsive player autoplays with Pause, Replay, Loop and a scrub slider.
Reduced-motion preference starts paused on the approved sad pose; manual Play
remains available. The HTML player requires HTTP hosting because it loads the
timeline; run a local static server or use the public link above. The GIF can
be opened directly.

Validation: `npm run check` passes typecheck, lint, 13 tests and build. Local
browser checks at 390 px confirm playback advancement, pause, scrub, replay,
loop-off completion at 2400 ms on neutral, and reduced-motion start paused at
800 ms. No browser errors were recorded. Independent contact-sheet QA found
stable identity/body and no conspicuous seams, with a warning: the broad third
intermediate narrows noticeably into the folded endpoint. That final tuck may
read abruptly; five discrete poses also make the stepping visible. The
independent GIF viewer showed only frame 0, so it did not verify live smoothness.
Josh should judge the complete motion in the player.

## Revision 2

The built-in imagegen tool edited a 60 × 60 face crop from revision 1, keeping
her forward-facing head and adding the sad expression. The exact request is in
[prompt-v2.txt](prompt-v2.txt). Generated output was registered as separate eye
and mouth regions, so its other changes do not replace the original artwork.

`expression-layer-v2.png` contains the registered generated regions, and
`expression-mask-v2.png` applies a soft blend around those regions. The mask is
intersected with revision 1's protected face region, keeping every ear pixel
unchanged. `candidate-v2.png` is the current endpoint. `assemble.py` rebuilds both
revisions and their comparison media from the saved layers, using Pillow from
the bundled workspace Python. No new app dependency is required.

The source was 1254 × 1254, normalized to the original 60 × 60 crop. Individual
eye/mouth offsets and mask construction are recorded in
[expression-registration-v2.json](expression-registration-v2.json). Soft masks
avoid hard rectangular joins, while the original alpha channel preserves the
head silhouette exactly. The existing nose and all pixels at y ≥ 85 stay fixed.
Do not expand the expression mask into the ear region or body during revisions.

[Preservation checks](qa-v2.json) find **868 changed pixels** versus revision 1,
confined to x88–129/y43–84. There are zero changes outside the expression mask,
zero ear-pixel changes and an identical silhouette alpha channel. Original atlas,
neutral pose, previously approved artwork and revision-1 assets are unchanged.
Typecheck, lint, all 13 existing tests and the production build pass.

Independent visual QA found aligned eyes, no conspicuous patch seams, preserved
identity and a subdued/sad expression. Minor caveats: the viewer-left eye is a
little more closed; the mouth downturn is faint and softer; at natural size the
expression can also read as sleepy or pleading. Sadness is clearer enlarged.
After review, nine ear-boundary pixels were excluded from the expression mask to
retain the exact existing ears. See the
[previous-versus-revised expression comparison](expression-comparison-v2.png).

## Preview and deployment

At Josh's request, the standalone review is published beneath
`previews/ears-pulled-back/` on the existing `gh-pages` branch. Revision-specific
motion filenames avoid stale image caches. Only the isolated preview changes;
the game, approved library, source merge and formal device-testing status do not.
The old [revision-2 still comparison](endpoint.html) remains as historical evidence.

## Historical revision 1

The neutral pose is original atlas row 0, column 0 (192 × 208). The original atlas
remains the style and identity authority. The first endpoint kept its neutral
face and added only generated ears. Both generation attempts returned an opaque
checkerboard and regenerated body/face detail, so only the ears were extracted.
The actual requests are in [prompt.txt](prompt.txt).

`ear-layer.png` stores that registered ear artwork; `protected-region.png` selects
exact original RGBA pixels in white and ear pixels in black. The extraction
removed neutral-gray pixels (channel range below 22 and all channels above 95),
resized the 1205 × 1305 source to 160 × 173, and placed it at (16, 25). Only the
two ear polygons were retained. The saved layer makes rebuilding independent of
the raw generated output. The original face/body mask protected all y ≥ 61.

`candidate.png`, `comparison.png` and [qa.json](qa.json) retain that historical
endpoint and its checks. Its 1,559 changed pixels were restricted to the ears.
The shortened, nearly horizontal ears read more like airplane ears than tightly
pinned-back ears; their detail is softer when enlarged. Those ear caveats remain
in revision 2. The original neutral-face endpoint was not visually approved.

## Next checkpoint

Josh reviews the full animation, especially the final ear tuck and the sad
expression. No gameplay emotion trigger, app integration or approved-atlas
promotion is included. Physical iPhone testing waits until Josh declares the
potentially expanding animation set complete and selects an integrated build.
