# Ronnie game

Ronnie is a girl; use she/her. Preserve her tall ears, tan face, black saddle, white bib and freckled paws. Original photos stay out of this public repository.

## Project manager and Kanban

- Read `KANBAN.md` before substantive work. It is the canonical project board.
- Delegate a bounded board synchronization to `project_manager` at planning, review, blocker and merge checkpoints. Use `.codex/agents/project_manager.toml`; if the role is not loaded, pass its instructions to a normal subagent. See `docs/project-management.md`.
- Before spawning, check the current agent roster. Reuse the existing `project_manager` via follow-up when available; do not create a new PM for every checkpoint. Keep the main agent and PM as the ongoing team. Additional agents require explicit authorization or applicable skill instructions and a bounded task.
- Treat completed QA runs as historical work, not current team members. Report live status separately from saved roles and sidebar history; never claim a partial tool roster is the full sidebar. Preserve useful QA evidence in repo docs before retiring a run, and only claim closure/archive when a supported tool confirms it.
- The PM owns board edits; implementation agents provide evidence and avoid concurrent writes. Keep ideas distinct from authorized scope. A deployed preview is not Done: verify acceptance and merge first.
- Keep one implementation feature active unless Josh explicitly changes the order. PM checkpoint work may accompany it. No unattended polling is configured.

## Commands

- `npm ci` — install pinned dependencies.
- `npm run dev` — Vite, exposed on the LAN for iPhone testing.
- `npm run check` — typecheck, lint, model tests, production build.
- `npm run format` — format source and docs.
- `npm run preview` — inspect a production build.

## Structure and rules

- Reviewed animation artwork and preview contracts: `docs/animation-library/README.md`; these assets are not yet integrated into the game. Preserve the original atlas as design authority.

- Care rules: `src/care.ts`; browser state: `src/main.ts`; animations and movement: `src/Room.ts`.
- Motion ownership: `src/RonnieMotion.ts`; travel math: `src/motion.ts`; pose/gait definitions: `src/clips.ts`. Keep these independent of care rewards.
- One-shot actions complete after their last pose hold. Do not reintroduce separate reward timers or constant-speed position tweens.
- Keep care rules independent of animation timing. Award actions only once, after completion.
- A saved rest must restore on reload. Keep needs bounded and time away capped.
- Dedicated eating/sleeping artwork is approved in the standalone library; gameplay still uses placeholder poses. Integration requires its own authorized scope.
- No accounts, analytics, backend, or native iOS project in the first prototype.
- `main` is the reviewed source branch. `gh-pages` contains generated deployment files, not editable source.
- Update README, ARCHITECTURE and decision notes when behavior changes. Keep secrets and original photographs out of Git.

## Decisions log

- 2026-09-14 — Merge the existing-motion refinement through PR #2 (`798e4a4`) — velocity-driven travel and distance-matched gait make starts/stops calmer; one-shot completion owns reward timing while `care.ts` owns amounts. Review, 13 tests, typecheck, lint, build and fresh care/rest browser smoke checks pass. Eight-pose gait limits and physical iPhone testing remain; the approved library and curled-breathing preview are unchanged and separate from gameplay.

- 2026-09-14 — Animate curled breathing from one approved rest frame in a standalone Canvas preview — a tapered 3 px maximum upper-back lift makes the four-second breath readable while holding head, ears, paws and bed fixed. Josh approved revision 2; PR #6 merged as `02d9c9f`. Preserve the torso boundary when tuning motion; resampling may soften moving fur. No app or bedtime-sequence integration.

- 2026-09-13 — Keep a Markdown Kanban with a reusable project manager agent — project state survives conversation clears without another service; updates happen at active checkpoints and Done requires merge evidence.

- 2026-09-13 — Centralize clips and use velocity-driven travel — calmer acceleration, distance-matched gait and complete gestures; more in-between limb art is still needed for anatomical smoothness.
- 2026-09-13 — Care model separated from Phaser — new art must not change save rules; completed callbacks award rewards once.
- 2026-09-13 — Reuse approved atlas for prototype — validate care interactions first; feeding and rest are temporary poses.
- 2026-09-13 — Phaser/TypeScript browser prototype before Capacitor — phone iteration without Swift; browser saves do not sync across devices.
