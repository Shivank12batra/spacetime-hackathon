# Demo Timing Hotfix

## Goal

Keep every interactive demo window at 30 seconds or less while preserving the existing early-completion behavior.

## Timing

- Manifesto: 30 seconds.
- Each crisis decision: 30 seconds.
- Crisis verdict and committee reaction: 10 seconds.
- Final rally: 30 seconds.
- Election voting: 30 seconds.
- Ballot reveal cadence remains 1.6 seconds per ballot because it is an animation, not an interactive timer.

## Behavior

Existing early-completion rules remain authoritative: candidate decisions reveal when both candidates submit, committee reactions finish when all required reactions arrive, and voting closes when every seated committee head votes.

## Scope and verification

Only server timing constants change. Build the SpacetimeDB module, publish it to `campus-whispers-demo-ct5dc` without deleting data, then commit and push the hotfix to `main`.
