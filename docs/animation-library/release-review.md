# Animation library review

The library adds approved tail wagging, sniffing, stretching, eating, sleeping, curled sleep and a composed bedtime sequence. Runtime code and `public/assets/ronnie.webp` are unchanged. The five base additions are in the extended sheet; other families retain separate assets and timing metadata.

The bed and bowl are excluded from dog sprites so a later scene can position and animate props independently. Timelines select existing images and move them through the scene; they cannot create missing footfalls. Care rewards must continue to come from completed game actions, not sprite frames, when integration is implemented.

The original atlas is the design reference. Visual approval accepts disclosed differences and movement limitations: it does not establish exact original likeness, planted-foot motion, a bed-rim step or a refined curled breathing loop. Those remain recorded in stage jobs and Kanban.

HTML embeds timeline data to support opening files directly. That duplicates JSON, so future timing changes must update both. The final scene alignment changes coordinates only and leaves source artwork byte-identical. Keeping this library outside `public` prevents artwork review assets from being bundled into the game before integration is approved.

## Validation

Final packaging results are recorded in [release-checks.json](release-checks.json). Existing per-stage jobs retain the visual/browser review evidence. The standard project gate is `npm run check` (typecheck, lint, model tests, production build). This PR does not add runtime dependencies or tests that merely duplicate the preview implementation.

Final result: typecheck, lint, all five model tests and production build passed. Packaging verified the canonical atlas and all five appended rows, 11 GIF durations, nine HTML scripts and local links, JSON/PNG integrity, and combined position continuity. The implementing agent found no blocking packaging issues. This is not an independent art-quality endorsement; accepted visual caveats remain explicit.
