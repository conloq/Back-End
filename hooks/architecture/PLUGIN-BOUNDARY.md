# Plugin Boundary — OpenCode V2

## Decision

`project-workflow` is primarily an integration/orchestration plugin.

### Plugin may
- subscribe to OpenCode V2 events;
- collect Git/diff/state evidence;
- invoke hook collectors/guards;
- expose objective workflow status;
- invalidate a stale delivery approval;
- route the agent toward the relevant skill.

### Plugin must not
- classify semantic impact as low/medium/high;
- decide which project components must change;
- interpret acceptance criteria;
- decide whether documentation is semantically sufficient;
- resolve requirement/architecture conflicts;
- duplicate the reasoning rules already owned by skills.

## Allowed deterministic rule

Mechanical invariants are allowed when they do not interpret project meaning.

Example:
`current fingerprint != approved fingerprint` => previous delivery approval is stale.

## Semantic owner

Project interpretation belongs to:
**model + project-local skills + evidence/tools**.
