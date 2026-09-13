# Right-facing walk study

Open [the self-contained comparison](ronnie-walk-review.html) to play, pause, slow down, enlarge or step through the proposed 16-pose cycle. [The GIF](comparison.gif) is a simple looping alternative. This is an artwork review draft; it does not replace the live game's atlas or change care/save behavior.

Both comparison sides complete a cycle in 1.28 seconds at 1×: the existing eight frames hold for 160 ms each, and the proposed sixteen hold for 80 ms each. Matching duration isolates changes in the drawings. This comparison does not reproduce the game's distance-driven playback, so planted-foot traction during travel must still be checked during integration.

## Scope and acceptance

Josh approved a right-facing preview before integration. Ronnie is a girl. Preserve her tan face, tall ears, natural dark eyes, black saddle, white bib and freckled paws. The proposed walk should have a steadier body, modest steps and a continuous leg sequence. The loop seam and the rear legs need particular scrutiny. Approval of this study does not authorize left-facing artwork, game integration, merging PR #2 or other animations.

## Production record

The built-in image generator produced the artwork from the approved character references. Initial candidates were rejected for a baked checkerboard and nearly static rear-leg positions. A sixteen-phase construction guide made the leg sequence more explicit; a full-sheet repair then addressed guide colors leaking into the coat. Exact selected prompts are saved alongside the assets.

The source sheet contains four rows of four chronological poses. Deterministic processing removes the known magenta key using the hatch-pet extraction routine, crops the sixteen equal slots and applies one shared scale. Every output cell is 192 × 208 with a common baseline of 188. It does not warp limbs, crossfade poses, synthesize in-between drawings, or resize each pose independently. The hatch-pet edge cleanup preserves alpha. `extraction.json` records source bounds and transforms; `chroma-cleanup.json` records edge processing.

`walk-right-current.png` is the unchanged eight-frame row from the approved atlas. `walk-right-16.png` contains the candidate frames in one horizontal strip. The generated source, final prompt and contact sheet preserve provenance. Original dog photographs are not included in this public repository.

The preview uses embedded PNG assets with no network requests, dependency installation or backend. Reduced-motion preference starts it paused. Browser QA checks playback, frame step/wrap, speed, enlarged layout, image loading and mobile overflow; it does not certify anatomical gait or physical iPhone performance.

## Next decision

[Visual QA](visual-qa.md) accepts this as a useful review draft with warnings. Supporting-foot changes at 04→05, 08→09, 12→13 and the 16→01 seam need refinement before game integration. Geometry checks and WebKit controls pass; they do not certify anatomical motion.

Review the small-size loop and frame sheet with Josh. Record visual findings before marking this study accepted. Any left-facing counterpart needs its own identity check because Ronnie's socks are asymmetric. Integration belongs in a later approved change after the motion infrastructure is merged.
