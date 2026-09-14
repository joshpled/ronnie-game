# Ears pulled back — sad-expression checkpoint

[Open revision 2](index.html) · [Public phone preview](https://joshpled.github.io/ronnie-game/previews/ears-pulled-back/?v=2)

This is a **still pose**, awaiting Josh's visual approval. Josh approved the
sad-expression revision after requesting that Ronnie's face look sad when her
ears are back. Softer, slightly lowered eyelids and a subtly downturned closed
mouth replace the earlier fixed-face constraint. Her original head shape,
markings and body remain the design authority. The proposed 2.4-second animation
waits for approval of this revised endpoint.

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

The page compares original neutral with revision 2, then offers larger views.
Both poses stay side by side on narrow phone screens. The page explicitly labels
this as a still-pose review, not completed animation playback. Comparison PNGs
use nearest-neighbor enlargement; the browser uses normal image scaling.

At Josh's request, the standalone review is published beneath
`previews/ears-pulled-back/` on the existing `gh-pages` branch. Revision-specific
image filenames prevent the previous face from being reused from cache.
Deployment changes only the standalone preview. It does not merge the candidate
into `main`, change the game, or establish physical-device validation.

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

After revised endpoint approval, create intermediate poses and playback:
neutral 400 ms → ears back with sad face 400 ms → hold 800 ms → return 500 ms →
neutral 300 ms. Then pause for motion review. No gameplay emotion trigger, app
integration or approved-atlas promotion is included. Physical iPhone testing
waits until Josh declares the potentially expanding animation set complete and
selects an integrated build.
