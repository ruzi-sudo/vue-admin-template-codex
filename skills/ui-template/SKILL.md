---
name: ui-template
description: Use for from-zero reconstruction, implementation, review, or structural decisions in a Vue admin project. This is the primary guide for establishing the target architecture and a secondary guide for refactoring or migrating an existing project from another standard; it covers architecture, pages, components, routing, API, Mock, permissions, styling, testing, and delivery.
---

# UI Template

This skill is the authoritative development guide for the standalone template. Load it before changing source code, tests, configuration, project documentation, or the local skill bundle. If the target project provides `AGENT.md` or `AGENTS.md`, treat those files as optional bootstrap pointers; this plugin does not depend on them.

## Operating rule

Treat the repository as a self-contained Vue 3 application. The template guide is primarily a from-zero reconstruction guide: when the repository is empty, incomplete, or built to another standard, establish the target architecture before importing business code. Existing-project refactoring and A-to-B migration are supported as a secondary workflow, using explicit adapters, staged slices, compatibility checkpoints, and rollback points. Establish the current project facts from `package.json`, the relevant source files, and the local skill references before editing. The source and configuration win when a document is stale. Keep changes scoped to the requested behavior and preserve existing public paths and contracts unless migration is part of the task.

**TypeScript is required for all code this plugin writes, edits, or suggests.** Use `.ts` for modules, tests, mocks, and scripted configuration, and `.tsx` for JSX. In Vue components, use `<script setup lang="ts">` or `lang="ts"` on an existing standard script block (`lang="tsx"` for JSX). Apply the same rule to code samples in replies and documentation, including examples adapted from companion skills. When editing legacy JavaScript, migrate the affected module or script block and update its references within the same change.

**Target project root:** Only `docs/`, `scripts/`, and `tmp/` may be created as new top-level directories. Inspect the root, including hidden directories, before writing. Reuse existing directories for their established purposes. Apply the allowlist to every operation, including scaffolding, installing, building, and running companion tools. If an operation requires a missing top-level directory outside the list, reuse a suitable existing path or report the conflict before running it.

Use this sequence for every change:

1. Read [template guide](references/template-guide.md) to establish the project boundary, file locations, and implementation order.
2. Read [project rules](references/project-rules.md) and identify the affected layer.
3. Inspect the nearest existing page, component, store, API, route, Mock handler, or test and reuse its established pattern.
4. Load only the companion skills needed for the task from the routing table below.
5. State the structure and data-flow decision before editing when the change crosses layers.
6. Implement the smallest coherent change, including localized copy and failure states.
7. Run the checks required by the affected surface and report exactly what ran.

## Project references

- [Template guide](references/template-guide.md): primary from-zero reconstruction workflow, secondary existing-project migration workflow, layer-to-directory mapping, implementation order, and delivery checks.
- [Complete project rules](references/project-rules.md): authoritative structure, toolchain, implementation, API, Mock, session, permission, i18n, and verification rules.
- [Page and component structure](references/page-component-structure.md): directory layout, SFC order, semantic HTML, component contracts, state ownership, and acceptance checklist.
- [Static and dynamic route sources](references/route-sources.md): route ownership, persistence, account-state conditions, and backend handoff.
- [Routing and RBAC guide](references/routing-rbac.md): dynamic menu loading, route registration, role/button permissions, refresh, logout, and account switching.
- [API contract](references/api-contract.md): current request and response details; use the project rules as the higher-level ownership policy.
- [Mock contract](references/mock-contract.md): current fake-server structure and registration checks; use the project rules as the higher-level ownership policy.

## Companion-skill routing

Load the project skill first, then load only the focused reference that changes the implementation decision:

| Work                                                              | Load next                                                                                                                                                                                            |
| ----------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Vue SFC, Composition API, composables, TSX                        | [vue-best-practices](../vue-best-practices/SKILL.md), [create-adaptable-composable](../create-adaptable-composable/SKILL.md), and [typescript-best-practices](../typescript-best-practices/SKILL.md) |
| Vue runtime errors, warnings, async failures, or hydration issues | [vue-debug-guides](../vue-debug-guides/SKILL.md)                                                                                                                                                     |
| Vue JSX or render functions                                       | [vue-jsx-best-practices](../vue-jsx-best-practices/SKILL.md)                                                                                                                                         |
| Existing Options API code                                         | [vue-options-api-best-practices](../vue-options-api-best-practices/SKILL.md)                                                                                                                         |
| Pinia stores and state management                                 | [vue-pinia-best-practices](../vue-pinia-best-practices/SKILL.md)                                                                                                                                     |
| Vue Router guards, params, or lifecycle behavior                  | [vue-router-best-practices](../vue-router-best-practices/SKILL.md)                                                                                                                                   |
| Vue component and E2E testing                                     | [vue-testing-best-practices](../vue-testing-best-practices/SKILL.md)                                                                                                                                 |
| TypeScript, DTOs, type narrowing, shared utilities                | [typescript-best-practices](../typescript-best-practices/SKILL.md)                                                                                                                                   |
| Any new or changed custom UI component                            | [Element Plus overview](../element-plus-skills/element-plus-design-overview/SKILL.md), then the relevant `el-*` skill and design references                                                          |
| Color, border, layout, typography, dark mode, or theme            | The relevant Element Plus design skill under `../element-plus-skills/` and [tailwind-design-system](../tailwind-design-system/SKILL.md)                                                              |
| Vite, Rolldown, dev server, build configuration                   | [vite](../vite/SKILL.md)                                                                                                                                                                             |
| Vitest or behavior tests                                          | [vitest](../vitest/SKILL.md)                                                                                                                                                                         |

Element Plus component skills are nested under `../element-plus-skills/components/`; use [skills-index.md](../../skills-index.md) when an exact path is needed. Do not infer a top-level path for a nested component skill.

## Non-negotiable project decisions

- New pages belong under `src/views/<domain>/`; page-private components and composables stay near the page until there is a real cross-page reuse case.
- API modules use `src/api/<model>/types.ts` and `route.ts`; shared API types use `src/api/types/index.ts`. Types and request implementations are separate exports.
- Static shell routes stay in `src/router/modules/`. New business routes and hidden details are dynamic by default and are defined under `src/router/dynamic/` for Mock/seed use while the browser still loads them through the dynamic API.
- Requests use the existing `@/utils/http` session layer and the `{ code, message, data }` contract with `code === 0` as success. Pages do not create Axios instances, call `fetch` directly, or hand-build tokens.
- `meta.roles` controls page/menu access; `Auth`/`v-auth`/`hasAuth` reads route `meta.auths`; `Perms`/`v-perms`/`hasPerms` reads login `permissions`. These sources are not interchangeable, and frontend hiding is not backend authorization.
- New or changed custom UI must be based on Element Plus semantics and the existing theme. Preserve light/dark behavior, responsive layout, loading/empty/error states, keyboard submission, and localized copy.
- Dialog and drawer saves close only after successful validation and persistence. On failure, restore loading and keep the user's input.
- Mock is development-only, module-aligned, and registered once per method plus URL. Production build and preview do not enable it.
- Do not add `any`, `@ts-ignore`, a second request/session system, an unrelated UI library, or a copied demo application to hide a type or architecture problem.

## Acceptance

Before completion, verify the affected behavior rather than only reading the diff:

- Compare the top-level directories with the initial inventory, including hidden and ignored directories. Every addition must be named `docs`, `scripts`, or `tmp`.
- TypeScript/Vue change: `pnpm typecheck`, `pnpm lint`, and `pnpm format:check` as applicable.
- HTTP, auth, Mock, or covered behavior: `pnpm test`, with a focused regression test for a new failure branch when warranted.
- Route, dependency, Vite, plugin, or entry change: `pnpm build`.
- Page or component change: exercise the real navigation and relevant loading, empty, error, light, dark, narrow-screen, keyboard, and permission states.

Report changed files, checks actually run, results, and any browser or backend behavior that remains unverified. Do not claim a UI flow passed from Node tests or a successful process start alone.
