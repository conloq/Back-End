# project-workflow — OpenCode V2 only

Integration/orchestration plugin for the project workflow.

## Responsibilities
- expose objective Git change evidence to the agent;
- expose delivery-gate status;
- intercept a `git commit` attempt and block it when the current state does not match an approved delivery fingerprint;
- keep semantic reasoning in project-local skills + model.

## Non-responsibilities
The plugin does not classify impact, decide what code must change, interpret acceptance criteria, resolve architecture conflicts, or judge documentation quality.

## OpenCode V2
Uses `Plugin.define`, `setup(ctx)`, `ctx.tool.transform(...)`, and `ctx.shell.hook("create.before", ...)`.

## Installation layout
Place this directory at `.opencode/plugins/project-workflow/` or configure it as a local plugin path.

The plugin expects `scripts/` to be available from the project directory. For a project-local installation, copy/symlink the two scripts to `<project>/scripts/`, or adjust paths in `src/index.ts`.

## Important
This guard protects the agent workflow. It is not a security boundary and does not replace CI/branch protection.
