# structural-change-impact v0.2

This hook is a collector/trigger.

It does **not** decide:
- whether a change is structurally important;
- whether impact is low/medium/high;
- which consumers must be changed;
- whether Graphify or another context tool is required.

It reports objective Git evidence:
- base revision;
- changed files;
- staged files;
- unstaged files;
- untracked files;
- diff summary.

The model, guided by the relevant skill, performs semantic impact analysis.
