# Ronnie's motion guide

## What changed

| Motion     | Before                                  | Refined                                                                         |
| ---------- | --------------------------------------- | ------------------------------------------------------------------------------- |
| Walking    | Immediate 100 px/s, abrupt stop         | 60 px/s maximum, gradual acceleration and braking                               |
| Wandering  | Same speed, frequent departures         | 48 px/s, longer 20–32 second quiet intervals                                    |
| Ball chase | Same movement as walking                | 84 px/s maximum, a slower toss with a small arc and grounded shadow             |
| Steps      | Clock-driven at 9 frames/s              | Advance with distance, slowing with the body                                    |
| Idle       | Full sequence repeats every 1.2 seconds | About 5 seconds with relaxed holds, a brief blink and subtle anchored breathing |
| Affection  | Rapidly looping wave cut off by a timer | One raise-and-lower paw gesture with a settled ending                           |
| Jump       | Loop cut off after 750 ms               | Anticipation, lift, descent and a 450 ms landing hold; reward on completion     |
| Rest       | Seated paw-moving waiting loop          | Calm seated/blinking cycle and short sit/stand transitions                      |
| Feeding    | Sudden head-down still                  | Lower, small nose adjustments, raise, look back; existing gaze artwork          |

Room pixels are logical coordinates, not physical display pixels. Travel duration depends on distance and braking, so interaction times vary with Ronnie's position.

## Where to tune

`src/motion.ts` contains maximum paces, acceleration, braking and floor bounds. `stepTravel` calculates velocity and position in small substeps. It preserves momentum on a changed destination and limits large frame deltas to avoid jumps on resume.

`src/clips.ts` is the animation catalogue. Each pose has an atlas frame number, duration in milliseconds and optional lift metadata for the ground shadow. A clip loops or plays once. Its `still` frame is used for reduced motion. `GAITS` lists the left/right frames and distance covered by one complete cycle; change the stride when new footwork has a different step length.

`src/RonnieMotion.ts` owns the current route, stride phase or clip. `moveTo` can replace a route while keeping momentum. `stopThen` brakes before a stationary gesture. `play` replaces the current pose and completion callback. Completed callbacks are cleared before calling the next step, so changing clips cannot award an old interaction again.

`src/Room.ts` composes interactions: walk to bowl → snack clip → care completion. Care values remain in `src/care.ts`.

## Adding higher-quality or new animations

1. Create consistent frames using Ronnie's approved character as the reference. Preserve her markings, scale and foot placement.
2. Load the new frame sheet and extend the frame lookup/catalogue when its layout differs from the current atlas. The current catalogue assumes the existing `ronnie` texture; multiple textures need an explicit texture key, not silently reused frame indices.
3. Define durations, a reduced-motion still, and loop/one-shot behavior. Hold relaxed or planted poses longer; keep blinks and rapid transitions brief.
4. For an existing care action, change the clip sequence in the room. Keep its reward callback at completion. Do not change saved-care rules just to add animation frames.
5. Review at phone size and normal playback speed. Check direction changes, foot sliding, body/scale jumps, landing and repeated interactions.

Natural walking, eating and curled-up sleeping still need dedicated drawings. This pass does not synthesize in-between limb poses, deform the art, or turn the trot into a fully rigged walk. The timed catalogue is ready for denser sequences, but the current sprite texture still supplies the existing frame count.

## Review notes and checks

The movement tests cover speed limits, gradual starts/stops, reversal, frame-rate consistency, close targets, room edges, cancelled routes, stationary gestures after braking, and reduced-motion completion. Clip tests cover final-frame holds and completion exactly once. Care/save tests continue unchanged.

Before-and-after WebKit recordings exercised the same floor taps, a reversal, petting, feeding, ball play, rest, reload and wake. Repeated Feed taps counted once; petting during travel completed after braking. In that run ball play took about 3.5 seconds, up from 1.8 seconds. These are emulation observations, not measurements on the owner's physical iPhone.

The final Chrome and WebKit checks both passed with zero page exceptions, three completed care rewards, and rest/reload/wake working. Source review also caught and fixed a near-target case: tapping Ronnie's current location while she is moving must still brake, rather than immediately zero her velocity. A regression test covers it. Care rules and the sprite image are unchanged.

**Before merging:** Why should gait frames advance with distance rather than a fixed FPS? When we add more eating frames, which layer should continue to own the fullness reward?
