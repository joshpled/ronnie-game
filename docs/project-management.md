# Project management

[KANBAN.md](../KANBAN.md) is the shared project record. The `project_manager` agent owns its upkeep; Josh owns requirements and priorities. The development agent owns implementation and supplies evidence. The board lives with the code so it survives cleared conversations and is reviewable on GitHub.

## Use it

Work from the Ronnie repository. Ask “Have the project manager update the board,” “Add this idea to the board,” or “What is blocking the next animation?” The project instructions request a bounded PM synchronization at the start of substantive work and when an item reaches review, is blocked, or merges. During a checkpoint, the development agent can continue independent work, but should not write the board concurrently.

The reusable role is in [`.codex/agents/project_manager.toml`](../.codex/agents/project_manager.toml), using the [official custom-agent format](https://learn.chatgpt.com/docs/agent-configuration/subagents#custom-agents). Its model and permissions inherit from the parent. If the current client has not loaded the custom role, spawn a normal subagent with those instructions and the repository path. This task used that explicit delegation path. Start a new session from this checkout if needed to discover the custom role.

The agent runs at active work checkpoints. There is no background schedule or automatic GitHub webhook synchronization. The board's last-verified date makes that limit visible. A request for unattended monitoring would be separate work.

## Agent roster and reuse

The ongoing team is the main development/coordinating agent and `project_manager`. Before creating a PM, inspect the available roster and send a follow-up to the existing one. If it is no longer available in a new session, load the saved role once for that session. Temporary QA agents are added only when authorized and are not permanent team members.

At the 2026-09-13 cleanup check, the runtime exposed the main agent plus completed `project_manager`, `blind_3`, `standard_qa` and `final_qa` runs. Josh reported 20 subagents in the sidebar; the tool roster was incomplete and cannot account for all sidebar entries. All exposed child runs had completed. No sidebar records were removed: the available controls could not close/archive subagents, and computer control of Codex was blocked.

Keep useful outcomes in validation docs and link temporary work to its Kanban card. After a temporary run, record completion and use a supported close/archive control if available. Do not repeatedly interrupt completed agents or modify application storage to hide records. When listing the team, distinguish ongoing roles, currently running agents, and historical runs.

## Move a card

| Column      | Entry condition                                                              |
| ----------- | ---------------------------------------------------------------------------- |
| Ideas       | Captured possibility; no implementation commitment.                          |
| Ready       | Josh selected the scope and acceptance criteria are clear.                   |
| In progress | Authorized work has started on its own branch.                               |
| Review      | A reviewable result exists; record checks, PR and remaining acceptance work. |
| Done        | Acceptance criteria are met and repository changes are verified merged.      |

Use a blocker field on the card rather than hiding blocked work in another board. Keep one implementation feature active unless Josh explicitly reprioritizes or authorizes parallel work. PR #2 is merged and its motion card is Done.

Each card has a stable `RON-NNN` ID, outcome, owner, source, acceptance criteria, next action, dependency/blocker, and evidence. Preserve IDs and history. Do not invent deadlines or make suggested ideas into commitments. A live preview and green CI are evidence, not permission to merge. Physical iPhone checks require a real device result; browser emulation is labeled separately.

## Current animation phase

Continue creating and refining standalone animations as Josh adds and selects them. New requests enter Ideas until their individual plan is approved. The animation set remains open to additions; finishing the current list does not automatically start iPhone testing.

Physical iPhone validation (RON-004) waits until Josh declares the animation set complete and selects a suitable integrated build. Approved preview artwork is not automatically present in the game. App integration remains a separate approval, and device testing is not a prerequisite for continuing animation previews.

The private GitHub Projects board is a visual trial of the canonical Markdown board. Its draft cards are updated manually at active checkpoints; they do not automatically track PR merges. Keep scope and status consistent without treating the trial as a second source of truth.

## Checkpoint procedure

1. Read the latest board and the user's scope. Check the current branch, open PRs and merges with read-only GitHub queries.
2. Reconcile cards against evidence. Keep previous status and record an unavailable check when the network fails.
3. Update only affected cards, the column table, last-verified date and short change history. Return a concise report to the development agent.
4. Commit board updates alongside the relevant feature on its branch. After a merge, verify it and propose the Done update in the next authorized PR or a focused documentation PR; never commit directly to protected `main`.

The development agent performs commits and PR publication. The PM does not merge, deploy, start new features, or send messages to other people. Branch cleanup and the session recap stay on the completion checklist.

## Why Markdown first

One versioned board avoids a separate service, account, or synchronization layer. GitHub renders it and every checkout contains it. The tradeoff is that it is a checkpoint snapshot without drag-and-drop or background updates. A hosted Kanban tool can be considered later if collaboration needs grow; don't maintain two competing sources of truth.
