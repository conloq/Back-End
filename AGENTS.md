# Back-End repository guide

## Role

This repository contains the current Mash REST API. It owns server-side business rules, API routes, Sequelize models, MySQL access, and executable schema migrations. It is a runtime repository.

## Global context

Read the portable [Conloq/Mash context index](https://github.com/conloq/.github/blob/main/PROJECT_CONTEXT.md) before non-trivial work. Query Project #2, Issues, PRs, branches, checks, and protections live; this file is not an operational-state snapshot.

## Canonical local sources

- `package.json`: declared commands and dependencies.
- `app.js`, `routes/`, `controllers/`, `services/`, and `middlewares/`: mounted API behavior and request handling.
- `config/swagger.json`: published API contract artifact; compare it with mounted routes and actual frontend consumers.
- `models/`, `config/`, and `migrations/`: persistence implementation. Back-End Sequelize migrations are the authority for schema creation/evolution; `conloq/database` contains reference documentation only.
- Code/configuration at the task's target SHA proves current implementation. Issues and documentation express intent or conventions, not implementation proof.

## Commands and validation

- Install declared dependencies: `npm install`.
- Apply pending migrations: `npm run db:migrate`.
- Start the API: `npm start` (the declared `prestart` runs migrations before `nodemon app.js`; use an appropriately configured database).
- `npm test` is currently a placeholder in `package.json` (`echo "Error: no test specified" && exit 1`); it is not a test suite and is expected to fail. Do not report it as a passing validation.
- Do not invent a test command. Select checks from the changed route/contract and task acceptance criteria; never run migrations against a shared or production database for documentation-only validation.

## Cross-repo boundaries

- `frontend` uses EJS and a server-side page controller to call this API with a Bearer token. It connects to the shared MySQL database only for its technical `sessions` table; Back-End still owns domain data, API rules, and executable schema migrations.
- Sequelize uses MySQL. The executable schema source is this repository's migrations, not SQL snapshots or diagrams in `conloq/database`.
- Cloudinary is used for user profile-image uploads. This does not mean iodine images are uploaded or analyzed by the current iodine flow.
- Iodine testing this semester is a frontend simulation. Real image upload/storage, OpenCV analysis, and real query/history are planned for a future semester; confirm code at the target SHA before asserting a feature exists.

## Integration and context impact

Use a branch and Pull Request; do not commit directly to `main`. Required human approvals are zero; peer review may occur but is not a required approval gate. Before claiming a PR is mergeable, query current branch protection, organization rulesets, required checks, conversation-resolution settings, and actor permissions live.

For route, model, migration, or configuration changes, compare implementation, Swagger, tests/validation, frontend consumers, database reference docs, and relevant durable decisions. Update only surfaces actually affected. A local result does not prove cross-repo consistency; link the relevant Issue/PR when one genuinely covers the change.
