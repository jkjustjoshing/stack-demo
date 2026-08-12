# stack-demo

A tiny, dependency-free task tracker used to demonstrate **stacked pull requests** on GitHub.

## Why this shape

The code is deliberately layered, so a single feature naturally splits into a chain of
dependent PRs — each one small enough to review on its own:

```
src/task.js      Layer 1 — the Task model (fields, validation, formatting)
src/store.js     Layer 2 — in-memory storage, depends on the model
src/service.js   Layer 3 — filtering / sorting / summaries, depends on the store
src/cli.js       Layer 4 — user-facing commands, depends on everything
test/            Tests that can grow alongside each layer
```

## Running it

```sh
npm start list
npm start summary
npm test
```

## Suggested demo feature: task priorities

One user-visible feature, four stacked PRs. Each branch is based on the previous one.

| PR | Branch | Change |
|----|--------|--------|
| 1 | `priority/1-model` | Add a `priority` field (`low`/`med`/`high`) to `createTask`, validate it, show it in `formatTask` |
| 2 | `priority/2-store` | Add `TaskStore#byPriority(level)` and let `add()` pass the new field through |
| 3 | `priority/3-service` | Sort `list()` by priority, add a `priority` filter option, add priority counts to `summary()` |
| 4 | `priority/4-cli` | Add `--priority` to `add`, a `top` command that prints high-priority tasks first |

Each PR touches roughly one file, so the diffs stay readable on a projector, and PR 4
is obviously blocked on PR 1 — which is the point of the demo.

### Alternative feature: due dates

Same layering, different vocabulary, if you want a second run-through:
`dueDate` on the model → `overdue()` in the store → `list({ overdue: true })` in the
service → `task due <id> <date>` in the CLI.

## Demo flow

```sh
# 1. Build the stack
git switch -c priority/1-model main
#    ...edit src/task.js, commit
git switch -c priority/2-store          # branches off PR 1, not main
#    ...edit src/store.js, commit

# 2. Push and open PRs, each targeting the branch below it
gh pr create --base main             --head priority/1-model
gh pr create --base priority/1-model --head priority/2-store

# 3. Show the pain point: amend PR 1, then restack
git switch priority/1-model
#    ...more edits, commit
git switch priority/2-store
git rebase --onto priority/1-model @{u} priority/2-store
```

The `gh stack` extension automates steps 2 and 3 — a good contrast to show once the
manual version has landed with the audience.
