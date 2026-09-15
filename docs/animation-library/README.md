# Ronnie animation library

Josh approved the five base movements, curled pose/style, settling and complete bedtime sequence in staged reviews. This library packages those assets and standalone previews for future game integration. The game still uses its original atlas and placeholder care animations.

## Preview

Open the HTML files directly, or run `python3 -m http.server 8768 --directory docs/animation-library` from the repository root and open `http://localhost:8768/bedtime.html`. No API keys or build step are needed for these previews.

| Movement | Preview | Timing | Sprite |
| --- | --- | --- | --- |
| Tail wag | [Preview](preview.html) | 800 ms | [Row](tail-wag/candidate.png) |
| Sniffing | [Preview](sniffing.html) | 1920 ms, including 500 ms nose-down hold | [Row](sniffing/candidate.png) |
| Stretching | [Preview](stretching.html) | 1920 ms | [Row](stretching/candidate.png) |
| Eating | [Preview](eating.html) | 5000 ms | [Row](eating/candidate.png) |
| Sleeping | [Preview](sleeping.html) | 8000 ms; breathing loop 2400 ms | [Row](sleeping/candidate.png) |
| Curled sleep | [Preview](curled-sleep.html) | 4000 ms pose loop; refined breathing unfinished | [Row](curled-sleep/candidate.png) |
| Curled breathing · approved revision 2 | [Preview](curled-sleep-breathing/index.html) | 4000 ms; isolated upper-back motion, maximum 3 px lift | Existing approved curl frame 0, animated in Canvas |
| Approach/circle | [Preview](bed-entry.html) | 9160 ms standalone study | [Approach](bed-entry/approach.png), [circle](bed-entry/circle.png) |
| Settling | [Preview](settling.html) | 5160 ms including endpoint holds | [Row](settling/candidate.png) |
| Complete bedtime | [Preview](bedtime.html) | 13520 ms | Existing assets composed together |

## Additional standalone animations

[RON-013 — Ears pulled back](ears-pulled-back/index.html) is a standalone
2.4-second animation approved by Josh and merged through [PR #10](https://github.com/joshpled/ronnie-game/pull/10).
Revision 3 adds three generated intermediate ear poses and a
responsive player with pause, replay and scrubbing. Both approved endpoints and
all protected pixels remain exact. Use the HTTP server above or the
[public preview](https://joshpled.github.io/ronnie-game/previews/ears-pulled-back/?v=3)
because this player loads a JSON timeline. See the
[review notes](ears-pulled-back/README.md), including the pronounced final ear
tuck. It remains separate from the packaged atlas listed above.

## Files and integration contract

[manifest.json](manifest.json) records zero-based atlas rows, pose order, timings and approval scope. [approved-spritesheet.png](approved-spritesheet.png) is 1536 × 3328: its first 11 rows exactly preserve the original atlas; rows 12–16 contain the five approved base movements. Curled sleep and bed-entry assets remain separate families, with their own pose/timeline metadata. The original atlas remains the style authority; these additions do not redefine Ronnie’s design.

The eating sprites contain no bowl. [The bed](curled-sleep/bed.png) is a separate 256 × 224 asset. All dog cells are 192 × 208. Generated source families were extracted with common scaling and floor registration, then received one final chroma-edge cleanup. Eating poses 5–8 have the approved 6 px alignment correction. No accepted artwork was re-cleaned during packaging.

For bed entry, the JSON timeline records source atlas, pose, duration and world position; the same data is embedded in HTML for file-based playback. GIFs use identical timing. Full bedtime joins the existing studies, removes the redundant checkpoint hold and aligns the path to the approved curled placement. See [composition details](bedtime/README.md). HTML stops at the end; GIFs repeat for review.

Future game integration must preserve action completion semantics: animation frames do not award care rewards. Import the chosen assets and timings in a separate implementation PR. No app code, save rules, public runtime assets or deployment configuration changes here.

## Approval and limitations

User approvals are distinct from technical validation. Existing face/fur differences, the fuller turn torso, foot sliding/repeated headings, missing bed-rim step, and the settling hip-drop/head-tuck joins remain disclosed. The original curled breathing is visually indistinct. Josh approved revision 2 of the separate [breathing refinement](curled-sleep-breathing/README.md), which animates the approved resting pose with fixed head, ears, paws and bed. The final bedtime preview still holds the exact approved curled pose; the breathing refinement has not been integrated into that sequence.

Per-stage `job.json`, cleanup/registration reports and comparison media retain review evidence. [Motion research](bed-entry/research.md) distinguishes inspected video behavior from generated motion. Original photos, external footage and raw generated sources remain outside this repository. The excluded withdrawn walk material is not a design reference.

[Release validation and review](release-review.md) records the packaging checks and maintenance notes for the library merged in PR #5. The approved standalone breathing refinement merged in [PR #6](https://github.com/joshpled/ronnie-game/pull/6). [KANBAN.md](../../KANBAN.md) remains the project status authority.
