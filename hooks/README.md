# Project Hooks v0.2

## Architecture

Hooks and the OpenCode plugin are integration mechanisms, not a second reasoning system.

- Hooks collect objective state and signal relevant moments.
- The plugin connects OpenCode V2 events to hooks/skills.
- Skills + model interpret impact, risk, dependencies, documentation, DoD and conflicts.
- Objective invariants may remain deterministic, e.g. a delivery fingerprint no longer matching the validated state.

## Hooks

### structural-change-impact

Despite the historical name, v0.2 does **not** classify low/medium/high risk.
It collects the current Git change set and emits evidence for semantic impact analysis by the model.

### delivery-gate-guard

Maintains the objective fingerprint of the state approved by `delivery-quality-gate`.
If the working state changes, the previous approval is invalid.

## Local state

`.agent-state/` should be ignored by Git.
