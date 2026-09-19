# Fluffy Roadmap

This roadmap is the source of truth for what Fluffy is trying to prove, what is intentionally out of scope, and what must be true before each release window.

## Thesis

Fluffy demonstrates how a React framework stitches together file-based routing, server rendering, and browser hydration, using Vite as the build and development substrate.

## From-Scratch Boundary

Fluffy owns the framework layer:

- file-based routing conventions
- route discovery
- server rendering orchestration
- browser hydration
- CLI commands
- app scaffolding
- documentation and release cadence

Fluffy does not own platform plumbing:

- bundling
- TypeScript transformation
- hot module replacement
- package installation
- React rendering internals
- production hosting infrastructure

For now, Vite is the bundler and development substrate. React and React DOM are the renderer. Node and Express are acceptable server plumbing while the framework interface is still taking shape.

## Roadmap Format

Each phase should keep this shape:

```md
## Phase N: Name

Status: Planned | Active | Complete | Deferred

### Goal

One sentence describing the user-visible capability.

### Success Criteria

- A verifiable outcome.
- Another verifiable outcome.

### In Scope

- Work that belongs in this phase.

### Out Of Scope

- Work that should not be pulled into this phase.

### Verification

- Commands, examples, or manual checks that prove the phase works.

### Release Notes

- What changed.
- What someone can try after the tag is published.
```

## Phase 1: First Working Vertical Slice

Status: Active

### Goal

A developer can scaffold a Fluffy app, run it locally, render a file-based route on the server, and hydrate it in the browser.

### Success Criteria

- `create-fluffy-app` creates an app with `src/pages/index.tsx`.
- The generated app installs and runs with documented commands.
- `fluffy dev` starts the development server.
- Files in `src/pages` are discovered as routes.
- The root route renders HTML on the server.
- The client hydrates the server-rendered route without replacing the app contract.
- The README explains the thesis, package layout, phase 1 status, and non-goals.

### In Scope

- Keep the existing package split: `@fluffy/core`, `@fluffy/cli`, and `create-fluffy-app`.
- Use Vite middleware for development.
- Use file-based routing through a `src/pages` convention.
- Support one server-rendered React route end to end.
- Keep the route module interface small.
- Document the working path from scaffold to local dev server.
- Keep `examples/minimal` as the permanent fixture for Phase 1 behavior.

### Out Of Scope

- React Server Components
- static site generation
- image optimization
- API routes
- nested layouts
- metadata conventions
- deployment adapters
- custom bundling
- framework plugins
- production performance work beyond the basic SSR path

### Verification

- `pnpm build`
- `pnpm typecheck`
- `pnpm smoke:example`
- Create a fresh app with `create-fluffy-app`.
- Run the generated app with `fluffy dev`.
- Open the app in a browser and confirm the route is server-rendered and hydrated.

### Release Notes

- Tag this phase once the scaffold, CLI, SSR route, hydration path, and README are all true.
- The write-up should explain the route discovery, SSR, and hydration pipeline as one connected flow.

## Phase 2: Route Data And Error Boundaries

Status: Planned

### Goal

Page modules can load server data and fail in understandable ways.

### Success Criteria

- A route can export a server data function.
- Server data is serialized safely into the HTML response.
- Hydration can read the same data without refetching.
- Route-level failures return useful development errors.

### In Scope

- A small route data interface.
- Request and params context for server data.
- Safe data serialization.
- Development error pages for route and data failures.

### Out Of Scope

- streaming data
- mutations
- client-side data cache
- form actions
- parallel route loading

### Verification

- Add a page that reads params and server data.
- Refresh the page and confirm server HTML contains the result.
- Hydrate the page and confirm it does not fetch the same data again.

### Release Notes

- Explain the page module contract and the data handoff from server to browser.

## Phase 3: Production Build

Status: Planned

### Goal

A Fluffy app can be built and started in production mode.

### Success Criteria

- `fluffy build` creates server and client output.
- `fluffy start` serves the built app.
- Client assets are loaded from the production build.
- The build output is documented.

### In Scope

- Vite production build integration.
- Server entry generation or resolution.
- Client asset manifest handling.
- Production start command.

### Out Of Scope

- multi-platform deployment adapters
- edge runtime support
- static export
- advanced chunk optimization

### Verification

- Build a generated app.
- Start the production server.
- Confirm a route renders and hydrates using built assets.

### Release Notes

- Explain the difference between development middleware and production output.

## Stable Release Window

Status: Planned

Fluffy can be considered for its first stable release window when these are true:

- A new user can create an app from scratch using only the README.
- The core route, SSR, hydration, and production build paths are covered by tests or documented verification steps.
- The package interfaces are small and documented.
- Non-goals are still explicit.
- Releases are tagged and accompanied by short write-ups.
- The public README describes what works today, not what might work later.

## Standing Non-Goals

These should stay out unless the roadmap is deliberately revised:

- replacing Vite
- competing with Next.js feature-for-feature
- React Server Components
- image optimization
- deployment platform integrations
- large plugin architecture
- broad styling or UI opinions
