# Decisions

## 2026-09-13 — Version the board and delegate project tracking

**Context:** Ideas, completed work and open reviews were scattered across conversation history. Josh requested a project manager agent and Kanban before further feature work.

**Decision:** Keep `KANBAN.md` in the repository, with a reusable `project_manager` role and explicit checkpoint delegation in `AGENTS.md`.

**Why:** The board and its evidence travel with the code. The PM keeps status current while Josh controls priority and implementation remains in separate feature PRs.

**Alternatives and tradeoff:** A hosted board adds another service and synchronization responsibility; conversation-only tracking disappears on clear. Markdown is easy to review but has no drag-and-drop or background sync. Done requires verified acceptance and merge, even when a preview is already live.

## 2026-09-13 — Separate care rules from sprite behavior

**Context:** New animations will be added as the game grows. Care progress must stay reliable when interactions or artwork change.

**Decision:** Keep care values and persistence in a pure model, with a Phaser scene that reports completed interactions.

**Why:** Eating can change from an existing head-down pose to a new sprite sequence without changing the feeding reward or save format. Model tests run without opening a browser.

**Tradeoff:** Callbacks add a small boundary to understand. Only the model changes stats; the room must report completion exactly once and lock overlapping care actions.

## 2026-09-13 — Reuse approved art for the first care loop

**Context:** Ronnie has a finished desktop pet atlas, but no bespoke eating or sleeping animation yet.

**Decision:** Preserve her atlas and use recognizable existing poses, new movement logic, and an editable vector room for the prototype.

**Why:** We can judge interaction and pacing on a phone before spending time on new animation families.

**Tradeoff:** Feeding is a head-down pose and resting is seated. These are explicitly documented placeholders. Do not describe them as finished eating or sleeping animations.

## 2026-09-13 — Start with Phaser/TypeScript in Safari

**Context:** The owner wants an iPhone pet-care game and does not want to code in Swift.

**Decision:** Build the first 2D care loop in Phaser 3 with TypeScript and Vite. Share a static browser build, then evaluate Capacitor for iOS packaging.

**Why:** The existing sprite sheet maps directly to frame animations, and browser delivery makes phone testing immediate.

**Alternatives:** A Swift app conflicts with the owner's preference. A 3D engine would require a new model and rig. React Native can handle app UI but would add a separate rendering decision for this game.

**Tradeoff:** This is currently a web game. Saves are per browser/device, offline loading is not implemented, and App Store packaging still needs Apple's tooling. Physical iPhone testing remains necessary.
