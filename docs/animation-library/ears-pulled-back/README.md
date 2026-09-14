# Ears pulled back — endpoint checkpoint

[Open the comparison](index.html). This is RON-013's first static pose/style
checkpoint. Josh approved the implementation plan on 2026-09-14; endpoint visual
approval is pending. Intermediate poses and the proposed 2.4-second sequence wait
for that approval. No app integration or approved-atlas promotion.

Josh requested a public phone preview on 2026-09-14:
[open the hosted endpoint comparison](https://joshpled.github.io/ronnie-game/previews/ears-pulled-back/).
Only this preview's HTML and three PNGs are published beneath `previews/ears-pulled-back/`
on the existing `gh-pages` branch. Deployment keeps the game files unchanged and
does not merge this candidate into `main`. Remote pose review is separate from
the deferred integrated-game iPhone validation.

## Artwork and preservation

The exact neutral pose is original atlas row 0, column 0, extracted into a
192 × 208 cell. The original atlas remains the style and identity authority.

The built-in imagegen tool produced the ears-back drawing. Both its initial
output and one correction regenerated the body/face and returned opaque
checkerboard backgrounds, so neither full generated sprite is used. The actual
requests are saved in [prompt.txt](prompt.txt).

Only the generated ear regions were extracted, registered to the original
forehead and eye line, and assembled with original pixels. `ear-layer.png` holds
the isolated registered ear artwork; `protected-region.png` is a binary mask:
white keeps the exact original RGBA pixel, black selects the ear layer.
`assemble.py` reproduces the neutral, candidate and comparison from those inputs.
It uses Pillow from the bundled workspace Python; there is no new app dependency.

For the extraction, the selected 1205 × 1305 source had neutral-gray checkerboard
pixels removed where RGB channel range was below 22 and every channel exceeded 95. It was resized to 160 × 173 and placed at (16, 25) in a 192 × 208 cell.
Only two ear polygons were retained. Those ear pixels are now saved in the
registered layer, so rebuilding does not need the raw generated image.
The mask's face boundary follows the forehead and outer ear roots; every pixel
at y ≥ 61 is protected. Do not expand the editable area into her eyes or face
when adjusting the ear attachment.

## Review and limits

Independent visual QA found clean attachments without conspicuous seams or halos
at natural size, pointed tips, matching tan/brown shading, and a stable face,
body, paws and tail. The ears read outward and back. The nearly horizontal,
shortened silhouette reads more like “airplane ears” than ears pinned tightly
against the skull; Josh should decide whether this is the intended endpoint.
The newly generated ears are softer than the original tall-ear detail when
enlarged. No animation smoothness or transition approval is claimed.

The static page shows both poses at 1× and 2× on larger screens; images shrink
to fit narrow screens, keeping the first comparison side by side. A 390 px
browser-width check confirms the phone layout; this is not physical-device QA.
The comparison PNG uses nearest
neighbor enlargement so source pixels can be inspected directly; the browser
uses normal image scaling. [qa.json](qa.json) records the preservation checks.
Typecheck, lint, all 13 existing tests and production build pass. The original
atlas and all previously approved artwork remain unchanged.

After endpoint approval, build the intermediate ear poses and standalone
playback, then pause for motion review. The proposed timing remains neutral
400 ms → pull back 400 ms → hold 800 ms → return 500 ms → neutral 300 ms.
This pose does not set a gameplay emotion or trigger. Physical iPhone testing
waits until Josh declares the potentially expanding animation set complete and
selects an integrated build.
