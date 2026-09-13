# Ronnie's project board

Last reconciled: **2026-09-13**. Ronnie is a girl (she/her). The product is an iPhone pet-care game built without Swift application code.

This file is the canonical board. Card details below own scope, evidence and next actions; the table is an index. A live preview does not mean a pull request has merged. Ideas are not authorization to implement them.

| Ideas                                                      | Ready | In progress | Review                                                      | Done                                            |
| ---------------------------------------------------------- | ----- | ----------- | ----------------------------------------------------------- | ----------------------------------------------- |
| [RON-004 — Physical iPhone validation (pending)](#ron-004) | —     | —           | [RON-002 — Refine existing motion](#ron-002)                | [RON-001 — First playable room](#ron-001)       |
| [RON-006 — Eating animation](#ron-006)                     |       |             | [RON-005 — Walk rig (draft review with warnings)](#ron-005) | [RON-003 — Project manager and board](#ron-003) |
| [RON-007 — Sleeping animation](#ron-007)                   |       |             |                                                             |                                                 |
| [RON-008 — Toy carrying](#ron-008)                         |       |             |                                                             |                                                 |
| [RON-009 — Capacitor iPhone package](#ron-009)             |       |             |                                                             |                                                 |

## How the board moves

- **Ideas:** Possible work awaiting Josh's scope and priority decision.
- **Ready:** Josh selected the scope and acceptance criteria are clear; no implementation started.
- **In progress:** The single active work item. Currently empty: RON-005 has returned to draft Review with visual warnings; RON-002 remains in Review.
- **Review:** Deliverable exists and validation is recorded; review, acceptance or merge remains.
- **Done:** Acceptance criteria have evidence. Repository changes require a verified merged PR; device testing requires an actual device report.

Maintain at most one item in progress. The project manager reconciles the board when invoked and at planning, implementation, review and merge handoffs. It does not silently promote ideas, merge PRs or claim to monitor between invocations. Record blockers and the next person who can act. Preserve IDs and update both the index and card together.

## Change history

- **2026-09-13:** Moved RON-005 back to draft Review after independent final QA passed the continuous leg rig with warnings for user review. Typecheck, lint including rig scripts, 5 care tests, 4 gait tests and production build pass. WebKit controls, reduced motion, mobile/enlarged layout and pixel-identical loop checks pass with zero page errors; revision 02 is published and verified byte-for-byte at the public walk study; the live care-game assets were untouched. Tubular joint bends, close paw overlaps, steady head/body and flat attachment depth remain visible. Josh's acceptance, physical iPhone validation and merge remain outstanding; no integration is approved.
- **2026-09-13:** Josh rejected the RON-005 image-sequence draft (“very bad. Try again”). Moved the card from Review to In progress on the existing branch and draft PR #4. The retry uses continuous joint-driven walking, imagegen-created character parts and explicit planted-foot constraints. Scope remains a right-facing preview only; no left-facing work, game integration or PR #2 merge is authorized.
- **2026-09-13:** Moved RON-005 to draft Review with [PR #4](https://github.com/joshpled/ronnie-game/pull/4) and the [walk study](https://joshpled.github.io/ronnie-game/walk-study.html). Sixteen new poses, contact sheet, GIF and controlled before/after preview exist; recorded technical checks pass. Visual QA flags foot-contact transitions 04→05, 08→09, 12→13 and 16→01 for refinement. This is not production-ready or approved for integration; Josh's feedback on identity and calmer movement is next. PR #2 remains open in Review and PR #3 remains Done.
- **2026-09-13:** Moved RON-003 to Done after the coordinating agent verified PR #3 merged at 17:32:59 UTC as `91bc668afa58cdac8389956e482382f8414325c5`; remote and local setup branches were deleted. Moved RON-005 to In progress for Josh's approved 16-frame right-facing walk preview and phone-size before/after loop. This approval excludes game integration, left-facing frames and merging PR #2; other ideas remain uncommitted.
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

### RON-005 — Right-facing continuous walk preview

- **Status:** Review — revision 02 passes with warnings for user review; PR remains draft
- **Owner:** Main coordinating agent and art worker; Josh visual acceptance
- **Source / evidence:** The rejected 16-image draft has been replaced locally on `feature/ronnie-walk-preview`, still [draft PR #4](https://github.com/joshpled/ronnie-game/pull/4). Current artifacts: [interactive preview](docs/animation-preview/ronnie-walk-review.html), [rig GIF](docs/animation-preview/rig/walk.gif), [contact sheet](docs/animation-preview/rig/contact-sheet.png), [browser report](docs/animation-preview/rig/browser-qa.json) and rewritten [visual QA](docs/animation-preview/visual-qa.md). Independent final QA gives **pass with warnings for user review**. `npm run check` passes typecheck, lint including rig scripts, 5 care tests, 4 gait tests and production build. WebKit controls, reduced motion, mobile/enlarged overflow checks and a pixel-identical full loop seam pass with zero page errors. Browser report CPU submission measurements are desktop emulation observations, not actual iPhone performance.
- **Publication:** [Revision 02 walk study](https://joshpled.github.io/ronnie-game/walk-study.html?v=569e581) is published and verified byte-for-byte, recorded in [publication evidence](docs/animation-preview/rig/publication.json). Pages commit `569e581434f1112c6d932577cb793f1b9c765607`; [deployment workflow 34776905242](https://github.com/joshpled/ronnie-game/actions/runs/34776905242) succeeded. Only `walk-study.html` was deployed; live care-game assets were untouched. Publication does not establish acceptance or merge.
- **Current approach:** Continuous fixed-length leg rig with generated textures, slimmer torso and explicit planted-paw constraints. The lateral four-beat cycle lasts 1.6 seconds; the isolated preview includes scrubbing and a joint overlay.
- **Acceptance:** A smooth, continuous four-beat walking cycle with grounded support and stable Ronnie identity, including her tall ears, tan face, black saddle, white bib and freckled paws. An isolated, repeatable preview is checked at normal speed and phone size, with support changes and loop continuity documented. Current sampled phases show no identified planted-paw slip or pose-loop discontinuity, but the visual warnings below remain. Josh's acceptance, physical iPhone validation and a reviewed, merged PR are still required before Done.
- **Next action:** Josh reviews revision 02's movement and identity. Record physical iPhone feedback and resolve requested refinements before any separately approved integration work.
- **Warnings:** Knee/hock bends remain tubular; near/far paws overlap closely in some phases; unusually steady head/body retains a puppet quality; limb-root attachment and shading lack depth. This is a reviewable improvement, not a finished realistic gait or production approval.
- **Dependency / boundary:** Right-facing preview only. Left-facing work, game integration and merging PR #2 remain unauthorized. RON-002 remains in Review and PR #4 remains a draft; other ideas have no new commitments. Prior rejected-draft checks and artifacts are historical, not evidence for revision 02.

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
