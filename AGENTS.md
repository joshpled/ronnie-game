# Ronnie game

Ronnie is a girl; use she/her. Preserve her tall ears, tan face, black saddle, white bib and freckled paws. Original photos stay out of this public repository.

## Commands

- `npm ci` — install pinned dependencies.
- `npm run dev` — Vite, exposed on the LAN for iPhone testing.
- `npm run check` — typecheck, lint, model tests, production build.
- `npm run format` — format source and docs.
- `npm run preview` — inspect a production build.

## Structure and rules

- Care rules: `src/care.ts`; browser state: `src/main.ts`; animations and movement: `src/Room.ts`.
- Motion ownership: `src/RonnieMotion.ts`; travel math: `src/motion.ts`; pose/gait definitions: `src/clips.ts`. Keep these independent of care rewards.
- One-shot actions complete after their last pose hold. Do not reintroduce separate reward timers or constant-speed position tweens.
- Keep care rules independent of animation timing. Award actions only once, after completion.
- A saved rest must restore on reload. Keep needs bounded and time away capped.
- Add dedicated eating/sleeping art later; do not silently represent current placeholder poses as finished animations.
- No accounts, analytics, backend, or native iOS project in the first prototype.
- `main` is the reviewed source branch. `gh-pages` contains generated deployment files, not editable source.
- Update README, ARCHITECTURE and decision notes when behavior changes. Keep secrets and original photographs out of Git.

## Decisions log

- 2026-09-13 — Centralize clips and use velocity-driven travel — calmer acceleration, distance-matched gait and complete gestures; more in-between limb art is still needed for anatomical smoothness.
- 2026-09-13 — Care model separated from Phaser — new art must not change save rules; completed callbacks award rewards once.
- 2026-09-13 — Reuse approved atlas for prototype — validate care interactions first; feeding and rest are temporary poses.
- 2026-09-13 — Phaser/TypeScript browser prototype before Capacitor — phone iteration without Swift; browser saves do not sync across devices.
