# Curled-sleep breathing — visual checkpoint

[Open the preview](index.html). Josh approved revision 2 of this isolated breathing motion on 2026-09-14 after reviewing the stronger effect. The approved motion uses a maximum 3 px column lift and a four-second cycle. [PR #6](https://github.com/joshpled/ronnie-game/pull/6) merged on 2026-09-14 as `02d9c9f`; the motion is not integrated into the approved sheet or bedtime sequence.

Run `python3 -m http.server 8772 --bind 127.0.0.1 --directory docs/animation-library` from the repository root, then open `http://127.0.0.1:8772/curled-sleep-breathing/`. The HTML also supports direct file opening. Play starts a continuous loop; Rest pose, Full inhale and the cycle slider pause playback for comparison. The left pose stays at rest. Layer controls apply to both comparisons and the enlarged view. Playback pauses when the page is hidden.

## Motion and preservation

The source is frame 0 of the existing approved `../curled-sleep/candidate.png`, exactly the pose used at the end of the approved bedtime sequence. The independent `../curled-sleep/bed.png` retains its original size and the dog's approved placement `(32, -44)`. The original atlas remains the character/style authority. No source image, approved sheet, previous preview or app file is edited.

This candidate animates the existing bitmap in Canvas; it does not generate or save replacement raster artwork. Every frame starts from the same approved pose, avoiding the head/ear/coat changes in the older eight-pose loop. Only upper-left torso columns move. Within source coordinates `18 ≤ x < 104`, the region from `y96` to the anchored lower edge at `y154` stretches upward. Lift tapers smoothly to zero at the left/right boundaries and remains at most 3 source pixels at the region's top; visible fur moves less than that. The head, ears, paws, haunch and remaining pixels stay fixed.

Revision 2 increases the lift from 2 to 3 source pixels (+50%) following Josh's feedback that the first version was too subtle. Timing, source pose, moving region and protected features are unchanged.

One cycle lasts 4000 ms: 1400 ms inhale, 2000 ms exhale, 600 ms exact rest. Cosine easing gives zero velocity at the inhale/exhale turn and rest join. `requestAnimationFrame` uses elapsed time, so monitor refresh rate does not set the breath duration. There is no automatic playback, including for reduced-motion users.

The tradeoff is local resampling: the small stretch can soften or shimmer the moving fur slightly, especially at 2×. It preserves the source's markings and limits movement more reliably than generating a new pose family. Josh accepted the revised breath's readability and naturalness; that approval does not erase this interpolation caveat. It does not repair the previously disclosed approach gait or settling joins.

## Validation and review

Revision 2 browser pixel sampling at 20 ms intervals across the full cycle (201 samples) found:

- Zero pixel changes outside the torso rectangle.
- Actual changed-pixel bounds: x24–99, y104–152; maximum 2559 changed pixels at one sample.
- All samples from 3400 through 4000 ms equal the original rest render exactly.
- Bed is a separate static image; source placement is unchanged.

Actual-size and enlarged render inspections show the approved curled composition retained, with a small upper-back rise and fixed face/paws. These checks establish preservation and operation, not visual approval. Full-cycle browser timer measurement is not claimed.

Browser controls passed: Play advances the cycle, Pause stops it, Full inhale selects 1400 ms, and Ronnie-only/bed-only modes show the separate layers. Preview JavaScript parsing and local links pass. `npm run check` passes typecheck, lint, all 5 care-model tests and production build. The canonical atlas SHA-256 remains `b7f6304beea6f7fe16a6201ab82d7b25b97b19ab3824aaf8342ebea41085bd6e`; Git records no existing raster or app-file changes. No dependencies were added.

The implementation is confined to this standalone preview and documentation. For maintenance, adjust the local column weights only after checking the protected regions again; moving the right boundary risks touching the head. The 600 ms rest and frame-0 source allow a future exact join from the approved bedtime endpoint. Any export, promotion or app integration requires its own subsequent authorized step.
