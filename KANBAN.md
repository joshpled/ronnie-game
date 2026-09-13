# Ronnie's project board

Last reconciled: **2026-09-13**. Ronnie is a girl (she/her). The product is an iPhone pet-care game built without Swift application code.

This file is the canonical board. Card details below own scope, evidence and next actions; the table is an index. A live preview does not mean a pull request has merged. Ideas are not authorization to implement them.

| Ideas                                                      | Ready | In progress                                     | Review                                       | Done                                      |
| ---------------------------------------------------------- | ----- | ----------------------------------------------- | -------------------------------------------- | ----------------------------------------- |
| [RON-004 — Physical iPhone validation (pending)](#ron-004) | —     | [RON-003 — Project manager and board](#ron-003) | [RON-002 — Refine existing motion](#ron-002) | [RON-001 — First playable room](#ron-001) |
| [RON-005 — Denser walk frames](#ron-005)                   |       |                                                 |                                              |                                           |
| [RON-006 — Eating animation](#ron-006)                     |       |                                                 |                                              |                                           |
| [RON-007 — Sleeping animation](#ron-007)                   |       |                                                 |                                              |                                           |
| [RON-008 — Toy carrying](#ron-008)                         |       |                                                 |                                              |                                           |
| [RON-009 — Capacitor iPhone package](#ron-009)             |       |                                                 |                                              |                                           |

## How the board moves

- **Ideas:** Possible work awaiting Josh's scope and priority decision.
- **Ready:** Josh selected the scope and acceptance criteria are clear; no implementation started.
- **In progress:** The single active work item. The project manager setup is Josh's explicit reprioritization while motion awaits review.
- **Review:** Deliverable exists and validation is recorded; review, acceptance or merge remains.
- **Done:** Acceptance criteria have evidence. Repository changes require a verified merged PR; device testing requires an actual device report.

Maintain at most one item in progress. The project manager reconciles the board when invoked and at planning, implementation, review and merge handoffs. It does not silently promote ideas, merge PRs or claim to monitor between invocations. Record blockers and the next person who can act. Preserve IDs and update both the index and card together.

## Change history

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

- **Status:** In progress
- **Owner:** Codex project manager and coordinating agent; Josh workflow owner
- **Source / evidence:** Josh's request: “Add a project manager agent that keeps track of a kanban board so as to keep us organized from idea to completion.” This board and the setup branch `chore/project-management` are the current artifacts; no PR number has been assigned here yet.
- **Acceptance:** A reusable project manager role and invocation workflow exist; this versioned board records ideas through completion with owners, criteria and evidence; one active item is enforced; current PR status is represented accurately; documentation is reviewed and the setup PR is merged.
- **Next action:** Coordinating agent completes the role/workflow documentation, checks board links and consistency, then opens the setup PR and moves this card to Review.
- **Dependency / boundary:** This setup is the current priority while RON-002 waits in Review. No new game feature is authorized by organizing the backlog.

<a id="ron-004"></a>

### RON-004 — Validate on Josh's physical iPhone

- **Status:** Ideas — required validation is pending; awaiting Josh's selection of a testing checkpoint
- **Owner:** Josh performs device checks; Codex project manager records results and separates any fixes
- **Source / evidence:** [Outstanding device checks](docs/validation.md#still-needs-the-owners-device). Existing Chrome/WebKit emulation is not physical device evidence.
- **Acceptance:** Record iPhone model, iOS version and tested build/PR; exercise movement and every care action; assess pacing and touch comfort; close/reopen and background/resume; verify rest restoration; try Add to Home Screen; record observed save behavior and any defects. A failed check produces a linked defect card rather than a claimed pass.
- **Next action:** When Josh is ready, test the [live preview](https://joshpled.github.io/ronnie-game/) and provide observations tied to the tested build.
- **Dependency / limitation:** Requires Josh's device access and feedback. No device test has been completed. Safari and Home Screen storage may differ.

<a id="ron-005"></a>

### RON-005 — Denser, more natural walking frames

- **Status:** Ideas — implementation not approved
- **Owner:** Josh scope decision; implementer unassigned
- **Source / evidence:** Josh's longer-term request for refined movement and more animations; RON-002's documented eight-pose limitation.
- **Proposed acceptance:** Consistent Ronnie markings, scale and planted feet; additional intermediate poses improve walking at phone size; left/right gait, reversals and stride are checked at normal speed; save/care behavior is unchanged.
- **Next action:** After current review, agree on one walking cycle's art scope and a comparison that demonstrates improvement.
- **Dependency:** Adopt the reviewed animation catalogue from RON-002 before integration. New artwork requires visual review.

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
