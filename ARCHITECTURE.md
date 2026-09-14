# How Ronnie's game fits together

The page owns the care state and controls. Phaser owns the room and Ronnie's movement. The two communicate through callbacks; neither animation frames nor canvas coordinates decide hunger or happiness.

## Files and responsibilities

| File                          | Responsibility                                                                                                              |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `src/care.ts`                 | Pure care rules, save validation, elapsed time, stat limits. No browser or Phaser dependencies.                             |
| `src/main.ts`                 | Loads and saves progress, updates the HTML meters, routes care buttons to the room, and listens for completed interactions. |
| `src/Room.ts`                 | Draws the room, creates sprite animations, handles floor/pet touches, and sequences walks and interactions.                 |
| `src/style.css`, `index.html` | Responsive shell, accessible buttons and status, help dialog.                                                               |
| `public/assets/room.svg`      | Scenery as editable vector shapes. No network art dependency.                                                               |
| `public/assets/ronnie.webp`   | Approved pet sprite sheet, copied without modifying Ronnie's appearance.                                                    |

## One complete interaction

1. **Feed** asks the room to perform feeding.
2. The room locks other care interactions, walks Ronnie to the bowl, and shows her looking down.
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

The room uses a fixed 390 × 450 coordinate space, fitted into the available screen area. Need meters and controls stay HTML for text sizing, focus, and accessibility. Ronnie's position is independent from her animation: walking interpolates her location while the left/right sprite loop advances. Drawing scale changes slightly with vertical position for depth.

Atlas cells are 192 × 208 pixels in an 8 × 11 grid. Current loops are idle (row 0), right/left run (1/2), wave (3), jump (4), and sitting (6). Downward gaze is frame 80. `prefers-reduced-motion` removes autonomous wandering and decorative hearts, uses still poses, and shortens essential transitions.

## Delivery

Vite bundles the application and copies public assets. GitHub Actions runs the required checks on pushes and pull requests. GitHub Pages serves a static `dist` build from the generated `gh-pages` branch; it does not run care logic on a server. No service worker is present yet, so a fresh page load needs connectivity. Capacitor packaging for an iOS app is deliberately deferred until the care loop feels right.

## Project coordination

`KANBAN.md` records project status outside the game runtime. `.codex/agents/project_manager.toml` defines the PM role; `AGENTS.md` requests its use at work checkpoints. The [workflow](docs/project-management.md) defines evidence for each status and separates project tracking from gameplay changes. This adds no application dependency, server or scheduled background job.

## Animation artwork library

`docs/animation-library/` contains reviewed sprite families, timing metadata and standalone HTML/GIF previews. Its extended sheet preserves the original 11 rows and adds five base movements; curled sleep, approach/circle and settling remain separate families. Props are separate assets. The library is documentation/artwork and is not imported by Vite or the game. Future integration must route completion through the existing care callbacks. See the [library contract](docs/animation-library/README.md).
