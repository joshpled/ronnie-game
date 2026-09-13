# Review of the first playable room

## What changed

Ronnie now has a playable room instead of an animation gallery. Touches move her or start a care interaction. Fullness, happiness and energy respond to completed actions and persist in the current browser.

## What matters for maintenance

**Care and animation are separate.** `Room.ts` sequences movement and poses. `care.ts` calculates stats. The connection is the completion callback in `main.ts`. To add an eating animation later, replace the head-down pose and delay in the room; leave the meal reward in the model.

**Interactions have one owner.** The scene locks care actions during an interaction and only emits a reward at completion. Floor walking can be interrupted, but a feed/play/rest sequence cannot be replaced halfway through by another care action. This avoids overlapping timers and duplicate rewards.

**Elapsed time comes from timestamps.** The phone is not running a simulated dog in the background. On returning, the game calculates elapsed time once, caps it, changes the needs and saves the new timestamp. Hidden tabs skip periodic updates so the cap works whether the page is closed or merely backgrounded.

## Tradeoffs

Reusing the approved atlas gets the feel of caring for Ronnie onto a phone sooner. The cost is temporary feeding and resting poses, and some softness when a small sprite is enlarged. A browser-only save is simple and private, but moving devices or clearing storage loses progress. No account/backend is added until syncing is actually needed.

The scene uses a fixed logical room size with responsive fitting. This makes touch coordinates and animation predictable; unusually short screens may have margins or require a little vertical scrolling.

## Risks and verification

Source review found and corrected background-timer decay defeating the absence cap. Type, lint, model and build checks pass; Chrome and WebKit interaction tests are documented in [validation.md](validation.md). Remaining uncertainty is actual iPhone performance, Safari lifecycle behavior, and how enjoyable the care pacing feels over several days.

## Before merging — two short checks

1. Why should a meal change Ronnie's fullness when she finishes the interaction, rather than on the initial Feed tap?
2. If we replace the feeding pose with a new animation, which part of the code should stay unchanged?
