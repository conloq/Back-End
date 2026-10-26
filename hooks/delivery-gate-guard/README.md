# delivery-gate-guard v0.2

This hook keeps only an objective delivery invariant:

> the state being delivered must match the state approved by `delivery-quality-gate`.

It does not decide whether the implementation is correct. That belongs to the model + skill.

Commands:

- `approve`: store the fingerprint after the skill explicitly passes the gate.
- `check`: compare current state with the approved state.
- `status`: inspect both states.

State is stored locally in `.agent-state/delivery-gate.json`.
