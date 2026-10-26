# Integrated Validation Report

## Result
The local Git/hook workflow passed all tested behavioral scenarios after one repair.

## Scenarios validated
- no delivery approval -> guard rejects;
- exact approved state -> guard accepts;
- tracked modification -> approval becomes stale;
- staged modification -> approval becomes stale;
- untracked file -> approval becomes stale;
- re-approval of exact state -> guard accepts;
- `.agent-state/` changes do not invalidate approval;
- change evidence reports tracked and untracked project changes;
- internal `.agent-state/` files are filtered from semantic change evidence.

## Repair found during testing
The first run exposed `.agent-state/delivery-gate.json` in `change_evidence` as an untracked project file.
That was internal workflow noise, so the collector was updated to ignore `.agent-state/` and common generated directories.

## Plugin boundary
The plugin remains integration/orchestration only. Semantic decisions remain with model + skills.

## Remaining environment-specific validation
The OpenCode V2 plugin has not been executed inside the user's actual OpenCode runtime in this environment.
Its API surface therefore still requires an installation smoke test in OpenCode V2 before declaring the entire stack production-ready.

## Quality conclusion
- Hooks / local Git mechanics: high confidence after behavioral tests.
- Skill architecture/content: strong baseline, still benefits from final format/interoperability review.
- OpenCode V2 plugin: implemented and statically aligned, but runtime smoke test remains required.
