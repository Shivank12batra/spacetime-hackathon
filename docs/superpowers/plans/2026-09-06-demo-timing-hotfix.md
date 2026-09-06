# Demo Timing Hotfix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Cap interactive demo timers at 30 seconds and show crisis verdicts for 10 seconds.

**Architecture:** Change only timing constants in the authoritative SpacetimeDB game configuration. Preserve phase transitions, early completion, schema, reducers, and client code.

**Tech Stack:** TypeScript, SpacetimeDB 2.10, Git

## Global Constraints

- Manifesto, crisis decision, final rally, and election timers are 30 seconds.
- Crisis reaction/verdict timer is 10 seconds.
- Ballot reveal cadence remains 1.6 seconds.
- No functional logic or schema changes.
- Do not add tests, per the project's requested demo scope.

---

### Task 1: Adjust and ship demo timers

**Files:**
- Modify: `spacetimedb/src/game.ts:113-123`

**Interfaces:**
- Consumes: `PHASE_MICROS`, `EVENT_DISCUSSION_MICROS`, and `EVENT_REACTION_MICROS`.
- Produces: Authoritative timer durations consumed by `enterPhase` and `beginReactionStage`.

- [ ] **Step 1: Change static constants**

Set manifesto, everyday, opportunity, values, soapbox, and election to `30_000_000n`. Set `EVENT_DISCUSSION_MICROS` to `30_000_000n` and `EVENT_REACTION_MICROS` to `10_000_000n`. Leave `REVEAL_GAP_MICROS` unchanged.

- [ ] **Step 2: Build the module**

Run: `npm run build` from `spacetimedb`

Expected: exit code 0 and `Build finished successfully.`

- [ ] **Step 3: Verify the diff**

Run: `git diff --check && git diff -- spacetimedb/src/game.ts`

Expected: only numeric timing constants change in `game.ts`.

- [ ] **Step 4: Publish Maincloud**

Run: `spacetime publish campus-whispers-demo-ct5dc --yes -p spacetimedb`

Expected: successful migration and update without data deletion.

- [ ] **Step 5: Commit and push**

Run:

```bash
git add spacetimedb/src/game.ts docs/superpowers/specs/2026-09-06-demo-timing-hotfix-design.md docs/superpowers/plans/2026-09-06-demo-timing-hotfix.md
git commit -m "hotfix: shorten demo timers"
git push origin main
```

Expected: `origin/main` advances to the hotfix commit.
