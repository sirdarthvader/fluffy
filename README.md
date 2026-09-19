# Fluffy

Fluffy is a learning-focused React framework that demonstrates how file-based routing, server rendering, and browser hydration fit together.

It is intentionally small. Fluffy uses Vite for bundling and dev-server plumbing so the project can focus on the framework layer: routing conventions, the SSR pipeline, hydration, the CLI, and project scaffolding.

## Project Status

Fluffy is being revived from an early prototype. The current goal is not to compete with production frameworks; it is to build one complete, understandable vertical slice.

The first milestone is documented in [ROADMAP.md](./ROADMAP.md).

## Phase 1 Goal

Phase 1 is successful when a developer can:

1. Scaffold a new app with `create-fluffy-app`.
2. Start it with `fluffy dev`.
3. Add a page in `src/pages`.
4. See that page render on the server.
5. See the same page hydrate in the browser.

## Packages

- `@fluffy/core`: framework runtime, routing, SSR, and hydration.
- `@fluffy/cli`: developer commands such as `fluffy dev`.
- `create-fluffy-app`: project scaffolding.

## Non-Goals For Now

Fluffy is not trying to implement every modern framework feature. These are intentionally out of scope for the first phase:

- React Server Components
- static site generation
- image optimization
- API routes
- plugin systems
- custom bundling
- deployment adapters

## Development

This repository uses pnpm workspaces, Turborepo, and Changesets.

```sh
pnpm install
pnpm build
pnpm typecheck
```

## Why This Exists

Frameworks can feel mysterious because many concepts arrive bundled together. Fluffy is a place to pull those concepts apart, implement them deliberately, and write about each phase as it becomes real.
