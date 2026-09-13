# How Ronnie's game fits together

The page owns the care state and controls. Phaser owns the room and Ronnie's movement. The two communicate through callbacks; neither animation frames nor canvas coordinates decide hunger or happiness.

## Files and responsibilities

| File                          | Responsibility                                                                                                              |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `src/care.ts`                 | Pure care rules, save validation, elapsed time, stat limits. No browser or Phaser dependencies.                             |
| `src/main.ts`                 | Loads and saves progress, updates the HTML meters, routes care buttons to the room, and listens for completed interactions. |
| `src/Room.ts`                 | Draws the room and props, handles floor/pet touches, and sequences walks and care interactions.                             |
| `src/RonnieMotion.ts`         | Owns a single route or pose, preserves momentum when retargeted, and reports completion once.                               |
| `src/motion.ts`               | Renderer-independent acceleration, braking, pace and room bounds.                                                           |
| `src/clips.ts`                | Ordered frame timings, gait frames/stride length, still poses, and a pure clip playhead.                                    |
| `src/style.css`, `index.html` | Responsive shell, accessible buttons and status, help dialog.                                                               |
| `public/assets/room.svg`      | Scenery as editable vector shapes. No network art dependency.                                                               |
| `public/assets/ronnie.webp`   | Approved pet sprite sheet, copied without modifying Ronnie's appearance.                                                    |

## One complete interaction

1. **Feed** asks the room to perform feeding.
2. The room locks other care interactions, walks Ronnie to the bowl, and plays the complete snack clip.
3. Once the interaction finishes, the room emits `complete('feed')`.
4. The page applies the care rule, saves the result, updates the fullness meter, and unlocks the controls.

Rewarding completion, rather than the initial tap, prevents rapid taps from awarding multiple meals while only one animation runs. Normal floor walking can be retargeted; care interactions cannot overlap. Closing the page before an interaction completes does not award it.

## Time and persistence

The save key is `ronnie-care-v1`. It contains three bounded need values, the completed-care count, rest state, and a timestamp. It never contains a photo, user identifier, or credential.

Time is advanced on startup, every ten seconds while visible, visibility changes, page exit, and completed actions. Hidden tabs skip periodic updates so they cannot repeatedly apply decay beyond the eight-hour absence cap. Each advance updates the timestamp, so resuming does not charge elapsed time twice. Active and offline behavior use the same rules. There is no background process running on the phone.

- Fullness decreases 5 points/hour.
- Happiness decreases 3 points/hour.
- Energy decreases 3 points/hour awake, or increases 24 points/hour resting.
- Feed adds 25 fullness; pet adds 8 happiness.
- Play adds 16 happiness, uses 8 energy and 3 fullness.
- Values stay between 0 and 100. There is no death or irreversible loss.

Rest persists across reloads. Invalid/unsupported saves start a fresh state; finite but out-of-range values are clamped. Future saved timestamps are corrected on load. Storage errors leave the current session playable and are shown beside the save indicator.

## Rendering

The room uses a fixed 390 × 450 coordinate space, fitted into the available screen area. Need meters and controls stay HTML for text sizing, focus, and accessibility. A velocity-based controller accelerates toward a target and brakes based on stopping distance. Retargeting preserves velocity, so Ronnie slows before reversing. Substeps make the same path behave consistently on 30/60/120 Hz screens.

Steps advance by distance travelled, scaled by the configured stride length. This stops foot cycling while the body is stationary. Drawing scale changes slightly with vertical position for depth; a very small anchored breathing change operates only in calm poses.

Atlas cells remain 192 × 208 pixels in an 8 × 11 grid. `clips.ts` defines nonuniform timings for idle, affection, jump, snack, sit/stand and settled turns. Rest uses the calmer row-8 seated poses instead of the paw-moving waiting loop. One-shots hold their final frame before emitting completion; they do not run on unrelated reward timers. Frame `lift` metadata adjusts the jump's ground shadow. `prefers-reduced-motion` removes autonomous wandering, breathing and hearts, skips travel, and keeps one still pose while preserving action completion timing.

The clip player and movement math have no Phaser dependency and are unit tested. `RonnieMotion` accepts the sprite's minimal position/frame interface so interruption and callback behavior can also be tested without a browser. See [docs/motion.md](docs/motion.md) for extension rules and limits of the existing art.

## Delivery

Vite bundles the application and copies public assets. GitHub Actions runs the required checks on pushes and pull requests. GitHub Pages serves a static `dist` build from the generated `gh-pages` branch; it does not run care logic on a server. No service worker is present yet, so a fresh page load needs connectivity. Capacitor packaging for an iOS app is deliberately deferred until the care loop feels right.
