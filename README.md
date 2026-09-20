# fluffejs

fluffejs is a learning-focused React framework that demonstrates how file-based routing, server rendering, and browser hydration fit together.

It is intentionally small. fluffejs uses Vite for bundling and dev-server plumbing so the project can focus on the framework layer: routing conventions, the SSR pipeline, hydration, the CLI, and project scaffolding.

## Project Status

fluffejs is being revived from an early prototype. The current goal is not to compete with production frameworks; it is to build one complete, understandable vertical slice.

The first milestone is documented in [ROADMAP.md](./ROADMAP.md).

## Phase 1 Goal

Phase 1 is successful when a developer can:

1. Scaffold a new app with `@fluffejs/create-app`.
2. Start it with `fluffejs dev`.
3. Add a page in `src/pages`.
4. See that page render on the server.
5. See the same page hydrate in the browser.

## Packages

- `@fluffejs/core`: framework runtime, routing, SSR, and hydration.
- `@fluffejs/cli`: developer commands such as `fluffejs dev`.
- `@fluffejs/create-app`: project scaffolding.

## Non-Goals For Now

fluffejs is not trying to implement every modern framework feature. These are intentionally out of scope for the first phase:

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

Check formatting and linting:

```sh
pnpm format:check
pnpm lint
```

Apply automatic fixes:

```sh
pnpm fix
```

Run the example app fixture:

```sh
pnpm dev:example
```

Smoke-test the framework against that app:

```sh
pnpm smoke:example
```

## Releases

Changesets drives package versioning and publishing. Merging a PR with a
changeset into `main` versions the packages and pushes the version commit back
to `main` using the release GitHub App. That version commit triggers the release
workflow again, publishes any unpublished package versions to npm, and pushes the
release tags.

The release workflow requires:

- an `NPM_TOKEN` repository secret with publish access to the fluffejs packages
- an `APP_PRIVATE_KEY` repository secret for the release GitHub App
- an `APP_ID` repository variable for the release GitHub App

## Why This Exists

Frameworks can feel mysterious because many concepts arrive bundled together. fluffejs is a place to pull those concepts apart, implement them deliberately, and write about each phase as it becomes real.
