# Repository Guidelines

## Project structure

This repository distributes Codex skills for building Vue 3 admin applications. Start at `skills/ui-template/SKILL.md`, which directs contributors to task-specific skills and references. `skills-index.md` and `skills-index.json` catalog the bundle. Update both when adding, renaming, or removing a skill, and preserve third-party attribution and licenses.

`plugin.json` describes the plugin. Keep its name and version aligned with the compatibility manifest at `.codex-plugin/plugin.json`. The local marketplace entry in `.agents/plugins/marketplace.json` points to the repository root (`./`).

## Style and naming

Use lowercase kebab-case for skill directories, such as `skills/vue-best-practices/`, and name each entry file `SKILL.md`. Keep its YAML frontmatter, write instructions as concrete actions, and link to supporting files with paths relative to the document. Use two-space indentation in JSON.

Use TypeScript for every code example the plugin adds or updates. Follow the language and migration rules in `skills/ui-template/SKILL.md` when adapting companion examples.

## Development and verification

The skills load directly from Markdown. This repository has no application build, dev server, test runner, or coverage threshold. Check changed files with Prettier, for example `pnpm exec prettier --check AGENTS.md`. Follow edited links and verify that indexed paths resolve. Scope formatting, type checks, and tests to the affected files and consumers.

To test plugin discovery locally, run these commands from the repository root with approval to install the plugin. Start a fresh session and invoke the changed skill to verify it loads.

```sh
codex plugin marketplace add .
codex plugin list
codex plugin add vue-admin-template-skills@vue-admin-template
```

## Commits and pull requests

Follow the initial commit’s short, imperative subject style, `feat: publish Vue admin template plugin`. In a PR, identify the affected skills, explain the change, link any related issue, and list the checks performed. Before creating a branch, check `git branch --list codex 'codex/*'`. If one exists, confirm how to handle its work before editing or branching.

## Agent instructions

Use CodeGraph before searching or reading code when `.codegraph/` exists. Otherwise skip it. For API or webhook changes, include complete request and response examples in the plan and update the API documentation alongside the implementation. Before using database tools, confirm the server and environment. Prefer read-only inspection and exclude applicant details and credentials from output.
