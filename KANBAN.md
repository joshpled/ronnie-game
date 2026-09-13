# Ronnie's project board

Last reconciled: **2026-09-13**. Ronnie is a girl (she/her). The product is an iPhone pet-care game built without Swift application code.

This file is the canonical board. Card details below own scope, evidence and next actions; the table is an index. A live preview does not mean a pull request has merged. Ideas are not authorization to implement them.

| Ideas                                                      | Ready | In progress | Review                                       | Done                                            |
| ---------------------------------------------------------- | ----- | ----------- | -------------------------------------------- | ----------------------------------------------- |
| [RON-004 — Physical iPhone validation (pending)](#ron-004) | —     | —           | [RON-002 — Refine existing motion](#ron-002) | [RON-001 — First playable room](#ron-001)       |
| [RON-006 — Eating animation](#ron-006)                     |       |             |                                              | [RON-003 — Project manager and board](#ron-003) |
| [RON-007 — Sleeping animation](#ron-007)                   |       |             |                                              |                                                 |
| [RON-008 — Toy carrying](#ron-008)                         |       |             |                                              |                                                 |
| [RON-009 — Capacitor iPhone package](#ron-009)             |       |             |                                              |                                                 |

Outside the active pipeline: [RON-005 — Withdrawn](#ron-005).

## How the board moves

- **Ideas:** Possible work awaiting Josh's scope and priority decision.
- **Ready:** Josh selected the scope and acceptance criteria are clear; no implementation started.
- **In progress:** The single active implementation item. Currently empty; RON-002 remains in Review. RON-005 is withdrawn and must not be promoted back into the pipeline without a new explicit user instruction.
- **Review:** Deliverable exists and validation is recorded; review, acceptance or merge remains.
- **Done:** Acceptance criteria have evidence. Repository changes require a verified merged PR; device testing requires an actual device report.
- **Withdrawn:** Rejected or cancelled work, kept outside the pipeline as a minimal tombstone. It is not Done and must not be used as a future design reference.

Maintain at most one item in progress. The project manager reconciles the board when invoked and at planning, implementation, review and merge handoffs. It does not silently promote ideas, merge PRs or claim to monitor between invocations. Record blockers and the next person who can act. Preserve IDs and update both the index and card together.

## Change history

- **2026-09-13:** RON-005 withdrawn at Josh's request, rejected and excluded from future design references. Original game atlas and original photos remain the only character references. Related local material is removed and the public withdrawal notice is verified without artwork; persistent reference rules are in place.
- **2026-09-13:** Moved RON-003 to Done after the coordinating agent verified PR #3 merged at 17:32:59 UTC as `91bc668afa58cdac8389956e482382f8414325c5`; remote and local setup branches were deleted.
- **2026-09-13:** Moved RON-003 to Review after [PR #3](https://github.com/joshpled/ronnie-game/pull/3) opened. Role/workflow, board initialization, implementation review, TOML validation, local links/anchors, formatting and main-derived source checks (5 tests) are complete, as reported by the coordinating agent. No active implementation remains; PRs #2 and #3 are pending review/merge.
- **2026-09-13:** Initialized from the documented prototype and motion work plus current PR status supplied by the coordinating agent: PR #1 merged, PR #2 open. Added the explicitly requested PM setup and retained future work and pending device validation without claiming approval or completion.

## Cards

<a id="ron-001"></a>

### RON-001 — First playable room

- **Status:** Done
- **Owner:** Codex implementation; Josh product owner
- **Source / evidence:** [Merged PR #1](https://github.com/joshpled/ronnie-game/pull/1); [architecture](ARCHITECTURE.md); [prototype validation](docs/validation.md).
- **Acceptance:** Playable portrait room with movement, pet/feed/play/rest/wake, bounded needs and browser saves; source checks and browser interaction checks recorded; PR merged. These conditions are documented as complete. Physical iPhone validation is tracked separately in RON-004.
- **Next action:** Maintain the care/save behavior as later animations change.
- **Dependency / limitation:** Feeding and rest use temporary poses. Browser saves do not sync across devices.

<a id="ron-002"></a>

### RON-002 — Refine existing motion

- **Status:** Review
- **Owner:** Codex implementation; Josh acceptance and merge decision
- **Source / evidence:** Josh requested slower, smoother existing movements; [open PR #2](https://github.com/joshpled/ronnie-game/pull/2); [motion guide at the reviewed commit](https://github.com/joshpled/ronnie-game/blob/6f1d3836ac1d4ece4add4b8800ac302e1dbc98d0/docs/motion.md); [live preview](https://joshpled.github.io/ronnie-game/); [before/after comparison](https://joshpled.github.io/ronnie-game/motion-review.html).
- **Acceptance:** Gradual starts, braking and turns; gait follows distance; calmer idle/rest and complete gestures; care rewards still occur once; extension guide present; typecheck, lint, 13 tests, build and Chrome/WebKit emulation checks pass; reviewed PR merged. Implementation and documented checks are complete; merge remains outstanding.
- **Next action:** Josh reviews the pacing and the PR's maintenance questions, then decides whether to request changes or merge. Recheck current PR checks before a merge.
- **Blocker / limitation:** Awaiting acceptance/merge. Existing eight-pose trot still limits limb smoothness; no new in-between drawings or physical iPhone pass is claimed.

<a id="ron-003"></a>

### RON-003 — Project manager and board

- **Status:** Done
- **Owner:** Codex project manager and coordinating agent; Josh workflow owner
- **Source / evidence:** Josh requested a project manager agent and Kanban. [PR #3](https://github.com/joshpled/ronnie-game/pull/3) merged on 2026-09-13 at 17:32:59 UTC as [91bc668](https://github.com/joshpled/ronnie-game/commit/91bc668afa58cdac8389956e482382f8414325c5), verified by the coordinating agent. [Agent role](.codex/agents/project_manager.toml), [workflow](docs/project-management.md) and board initialization are complete. Recorded checks: valid TOML fields, local links/anchors and formatting, `npm run check` on the main-derived setup branch (5 tests), and implementation review.
- **Acceptance:** Reusable role and invocation workflow, versioned board with owners/criteria/evidence, one-active-item rule, reviewed documentation and merged setup PR are complete.
- **Next action:** Reuse this PM at bounded project checkpoints and record only evidence-backed status changes.
- **Dependency / boundary:** Remote and local setup branches are confirmed deleted. This organization setup does not authorize future game features.

<a id="ron-004"></a>

### RON-004 — Validate on Josh's physical iPhone

- **Status:** Ideas — required validation is pending; awaiting Josh's selection of a testing checkpoint
- **Owner:** Josh performs device checks; Codex project manager records results and separates any fixes
- **Source / evidence:** [Outstanding device checks](docs/validation.md#still-needs-the-owners-device). Existing Chrome/WebKit emulation is not physical device evidence.
- **Acceptance:** Record iPhone model, iOS version and tested build/PR; exercise movement and every care action; assess pacing and touch comfort; close/reopen and background/resume; verify rest restoration; try Add to Home Screen; record observed save behavior and any defects. A failed check produces a linked defect card rather than a claimed pass.
- **Next action:** When Josh is ready, test the [live preview](https://joshpled.github.io/ronnie-game/) and provide observations tied to the tested build.
- **Dependency / limitation:** Requires Josh's device access and feedback. No device test has been completed. Safari and Home Screen storage may differ.

<a id="ron-005"></a>

### RON-005 — Withdrawn

- **Status:** Withdrawn / rejected — outside the active pipeline; excluded from future design references.
- **Authority:** Josh explicitly requested removal. Use only the original [game atlas](public/assets/ronnie.webp) and original photos as Ronnie's character references.
- **Cleanup:** Local material and README links removed; no matching saved-memory/index entries found. Original-reference rules are enforced, all three original-atlas copies are verified unchanged, and the public withdrawal notice is verified without artwork (Pages `9ba1cddd`, deployment `34786622026` succeeded). Typecheck, lint, 5 tests and build pass. [PR #4](https://github.com/joshpled/ronnie-game/pull/4) remains a retirement/reference-policy draft pending merge; this card stays Withdrawn.

<a id="ron-006"></a>

### RON-006 — Dedicated eating animation

- **Status:** Ideas — implementation not approved
- **Owner:** Josh scope decision; implementer unassigned
- **Source / evidence:** [Prototype art decision](docs/decisions.md#2026-09-13--reuse-approved-art-for-the-first-care-loop); feeding currently reuses gaze artwork.
- **Proposed acceptance:** Ronnie visibly approaches and eats at the bowl, then settles; character and bowl alignment remain consistent; the sequence finishes once and fullness changes only through the existing care completion boundary; reduced-motion behavior is defined.
- **Next action:** Agree on the eating poses and duration before creating artwork.
- **Dependency:** RON-002 catalogue integration; approved art scope. This idea does not include new food systems or rewards.

<a id="ron-007"></a>

### RON-007 — Dedicated sleeping animation

- **Status:** Ideas — implementation not approved
- **Owner:** Josh scope decision; implementer unassigned
- **Source / evidence:** [Prototype art decision](docs/decisions.md#2026-09-13--reuse-approved-art-for-the-first-care-loop); current rest is seated.
- **Proposed acceptance:** A consistent curl-up, quiet sleeping loop and wake transition; resting persists through reload; energy rules remain unchanged; reduced-motion still is defined.
- **Next action:** Agree on Ronnie's sleeping posture and transition scope using her approved character references.
- **Dependency:** RON-002 catalogue integration; approved art scope.

<a id="ron-008"></a>

### RON-008 — Toy-carrying animation

- **Status:** Ideas — implementation not approved
- **Owner:** Josh scope decision; implementer unassigned
- **Source / evidence:** [README's future artwork](README.md#what-is-implemented) lists toy carrying as unfinished.
- **Proposed acceptance:** Ronnie visibly picks up or carries the chosen toy with consistent mouth/toy alignment; entry and exit transitions are defined; play rewards remain once per completed interaction.
- **Next action:** Decide whether toy carrying is a visual addition to existing Play or part of a separately scoped return-the-ball interaction.
- **Dependency:** Approved interaction and artwork scope; RON-002 catalogue integration. Do not assume a fetch system is authorized.

<a id="ron-009"></a>

### RON-009 — Evaluate Capacitor packaging for iPhone

- **Status:** Ideas — implementation not approved
- **Owner:** Josh delivery decision; implementer unassigned
- **Source / evidence:** [Browser-first architecture decision](docs/decisions.md#2026-09-13--start-with-phasertypescript-in-safari); Josh wants iPhone without coding in Swift.
- **Proposed acceptance:** Document the selected delivery target, Apple tooling/account requirements and save behavior; if packaging is approved, demonstrate a device build with the current care loop and record device validation. Define these details before implementation.
- **Next action:** Revisit packaging after the browser care loop and physical iPhone experience are accepted.
- **Dependency / limitation:** RON-004 feedback and explicit packaging approval. No native project, TestFlight/App Store release, offline support or cloud saves are included by this card yet.
