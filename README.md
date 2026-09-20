# fluffy-ts

fluffy-ts is a learning-focused React framework that demonstrates how file-based routing, server rendering, and browser hydration fit together.

It is intentionally small. fluffy-ts uses Vite for bundling and dev-server plumbing so the project can focus on the framework layer: routing conventions, the SSR pipeline, hydration, the CLI, and project scaffolding.

Website: [sirdarthvader.github.io/fluffy](https://sirdarthvader.github.io/fluffy/)

## Project Status

fluffy-ts is being revived from an early prototype. The current goal is not to compete with production frameworks; it is to build one complete, understandable vertical slice.

The first milestone is documented in [ROADMAP.md](./ROADMAP.md).

## Phase 1 Goal

Phase 1 is successful when a developer can:

1. Scaffold a new app with `@fluffy-ts/create-app`.
2. Start it with `fluffy dev`.
3. Add a page in `src/pages`.
4. See that page render on the server.
5. See the same page hydrate in the browser.

## Packages

- `@fluffy-ts/core`: framework runtime, routing, SSR, and hydration.
- `@fluffy-ts/cli`: developer commands such as `fluffy dev`.
- `@fluffy-ts/create-app`: project scaffolding.

## Non-Goals For Now

fluffy-ts is not trying to implement every modern framework feature. These are intentionally out of scope for the first phase:

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

Preview the documentation site:

```sh
pnpm site:preview
```

## Documentation Site

The static documentation site lives in `site/` and is deployed by the
`Pages` workflow. GitHub Pages should use **GitHub Actions** as the source.
After the first deployment, add `https://sirdarthvader.github.io/fluffy/` to
the GitHub repository website field.

The site is intentionally dependency-light so the learning material can evolve
with the framework without adding another application layer too early.

## Releases

Changesets drives package versioning and publishing. Merging a PR with a
changeset into `main` versions the packages and pushes the version commit back
to `main` using the release GitHub App. That version commit triggers the release
workflow again, publishes any unpublished package versions to npm, pushes the
release tags, and creates GitHub Releases for those tags.

The release workflow requires:

- npm trusted publishing configured for each published `@fluffy-ts/*` package
- an `APP_PRIVATE_KEY` repository secret for the release GitHub App
- an `APP_ID` repository variable for the release GitHub App

## Why This Exists

Frameworks can feel mysterious because many concepts arrive bundled together. fluffy-ts is a place to pull those concepts apart, implement them deliberately, and write about each phase as it becomes real.
