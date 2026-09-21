# Fluffy Phase 1 Writing Package

This document turns Phase 1 into a publishable story for promax.dev and short
social posts. The goal is not to pretend the path was perfectly straight. The
goal is to teach why each decision was made and what a reader can learn from the
tradeoffs.

## Series Positioning

Working series title:

> Building Fluffy: Writing a React Framework to Understand Frameworks

The series should feel like an engineering journal with finished artifacts, not
a marketing launch. Each phase should answer three questions:

1. What did we try to make possible?
2. What decisions did we make, and why?
3. What can someone learn by reading the code?

Suggested tags for promax.dev:

- `#systems`
- `#architecture`
- `#engineering`

## Phase 1 Article

Suggested title:

> Building Fluffy, Part 1: The Smallest Useful React Framework

Alternate titles:

- `Building Fluffy: Routing, SSR, and Hydration in One Vertical Slice`
- `Reviving Fluffy: A React Framework Built for Learning`
- `What a React Framework Actually Has to Do Before It Feels Real`

Suggested summary:

> Fluffy is a learning-focused React framework. In Phase 1, I built the first
> working vertical slice: scaffold an app, run `fluffy dev`, discover a file
> route, render it on the server, hydrate it in the browser, and release it like
> a real package.

## Reader Promise

By the end, the reader should understand:

- why the project is intentionally not trying to be Next.js
- where the "from scratch" line is drawn
- how file-based routing, SSR, and hydration connect
- why the example app exists beside the framework
- why DX details like port handling, smoke tests, linting, formatting, and
  release automation matter even in a learning project
- how the detours shaped the final system

## Article Outline

### 1. The Real Thesis

Open with the revival framing:

> I did not want to build "another React framework" because the world needs one.
> I wanted to build one because frameworks are easier to understand when you
> assemble the moving parts yourself.

Key points:

- Fluffy is a teaching project.
- The thesis is: routing, server rendering, and hydration are easier to
  understand as one connected pipeline.
- "Everything Next.js does" is not a thesis. It is a trap.

### 2. Drawing the From-Scratch Boundary

Explain the most important early decision:

- Fluffy owns the framework layer.
- Vite owns bundling, transformation, HMR, and dev-server plumbing.
- React and React DOM own rendering internals.
- Express is acceptable server plumbing while the framework interface is still
  taking shape.

Teaching angle:

> "From scratch" is not a purity contest. It is a boundary. If the goal is to
> learn how frameworks stitch routing, SSR, and hydration together, writing a
> bundler first would bury the interesting part under unrelated complexity.

### 3. One Vertical Slice Beats Ten Half-Features

Describe the Phase 1 scope:

- `@fluffy-ts/create-app` scaffolds an app.
- `fluffy dev` starts a local dev server.
- `src/pages/index.tsx` becomes `/`.
- The route renders to HTML on the server.
- The same route hydrates in the browser.

Stress why static generation, RSC, image optimization, plugins, deployment
adapters, and production build were kept out.

Teaching angle:

> A framework does not become understandable by having many features. It becomes
> understandable when one complete path can be followed end to end.

### 4. The Package Shape

Explain the monorepo split:

- `@fluffy/core`: runtime, routing, SSR, hydration.
- `@fluffy/cli`: developer commands.
- `@fluffy-ts/create-app`: scaffolding.
- `examples/minimal`: permanent downstream fixture.

Important point:

The example app is not a throwaway test folder. It is the first consumer. Every
future phase should keep it working because it demonstrates the public contract.

### 5. Routing, SSR, and Hydration as a Pipeline

Explain the runtime flow:

1. Discover page files from `src/pages`.
2. Convert file paths into route records.
3. Match the incoming request path.
4. Load the matched page through Vite SSR.
5. Render the React component to HTML.
6. Return a minimal HTML document with a hydration script.
7. Generate a browser entry that imports the same page module and calls
   `hydrateRoot`.

Keep this section technical but readable. This is the heart of the article.

Potential diagram:

```txt
src/pages/index.tsx
        |
        v
route discovery
        |
        v
request "/" -> route match -> Vite SSR load -> renderToString
        |
        v
HTML + /@fluffy/client-entry
        |
        v
browser imports same page -> hydrateRoot(...)
```

### 6. The CLI Detour: Commander, Clack, and Modern DX

Be honest about the turn:

- The initial CLI direction used a more traditional command parser approach.
- We switched to Clack because the project should feel modern and pleasant.
- We considered `@bomb.sh/args`, but Phase 1 only needed simple parsing.

Teaching angle:

> A modern CLI is not only about parsing flags. It is also about feedback. A dev
> server should tell you when it starts, where it is running, and what happened
> if the requested port was not available.

### 7. Port Handling Is Framework UX

Explain the port behavior:

- First pass: fail if the requested port is busy.
- Better behavior: check the requested port, then increment until a free port is
  found.
- CLI reports the actual URL.
- A TODO remains for a smarter future behavior: if the same app is already
  running, maybe reuse it instead of silently starting another server.

Teaching angle:

> These details look small until you use the framework every day. Framework DX
> is the accumulation of tiny decisions that remove friction.

### 8. The Example App Replaced Temporary Testing

Explain why `examples/minimal` exists:

- Temporary smoke folders prove less over time.
- A real app living beside the framework becomes documentation, fixture, and
  regression test.
- `pnpm smoke:example` verifies server HTML and hydration entry behavior.

Teaching angle:

> If a framework cannot be tested through an app that looks like something a
> user would actually write, the framework contract is still imaginary.

### 9. ESM, CJS, and the `.js` Import Question

Explain the confusion and resolution:

- TypeScript source imports should stay ergonomic.
- Published packages still need correct ESM/CJS output.
- `tsup` became the boundary: write TypeScript, publish built JavaScript.
- Package `main`, `module`, `types`, and `exports` now point to `dist`.

Teaching angle:

> The source tree is for maintainers. The package boundary is for consumers.
> Confusing those two creates friction on both sides.

### 10. Handlebars Is Still a Known Debt

Be transparent:

- The scaffolder still uses Handlebars.
- That was not settled as the final templating story.
- It is acceptable for Phase 1 because the main milestone was the framework
  vertical slice.
- Future phases can replace it with a more modern template strategy.

Teaching angle:

> Not every discomfort has to be solved in the same phase. The important thing
> is to name the debt so it does not become invisible.

### 11. Formatting and Linting: ESLint to Oxlint

Tell the real turn:

- We first added a conventional ESLint + Prettier setup.
- Then we switched to Oxlint because it fit the project goal better: modern,
  fast, low ceremony.
- Prettier stayed responsible for formatting.
- `pnpm lint` checks.
- `pnpm fix` formats first and then applies oxlint fixes.

Teaching angle:

> Tooling should match the size and purpose of the project. For Phase 1, the
> goal was fast hygiene, not a large custom linting ecosystem.

### 12. Release Automation Matters Earlier Than It Feels

Explain the release work:

- Changesets records package bumps.
- The private example app is ignored.
- GitHub Actions verifies PRs.
- Release automation versions packages, publishes to npm, and keeps retries
  safe.
- The lockfile was cleaned so CI uses the public npm registry, not a corporate
  Nexus URL.
- Turbo now builds dependency packages before typechecking dependents, because
  clean CI does not have local `dist` artifacts.

Teaching angle:

> A learning framework still needs a real release path. Otherwise every article
> ends with "clone my branch and good luck," which is not a useful contract for
> readers.

### 13. What Phase 1 Proves

Close with the proof:

- There is a thesis.
- There is a roadmap.
- There is a package split.
- There is a working app.
- There is a dev server.
- There is server HTML.
- There is browser hydration.
- There is a smoke test.
- There is CI.
- There is a release path.

End with Phase 2:

> Phase 2 is where the framework starts learning about data. A route that can
> render is interesting. A route that can load server data, serialize it safely,
> and hydrate without refetching is where framework design gets sharper.

## Suggested Article Draft Opening

Most side projects do not die because the code is impossible.

They die because the project never becomes small enough to finish.

Fluffy had that smell when I came back to it. It had the shape of a framework
repo: a pnpm workspace, separate packages, Changesets, a CLI package, a core
package, a scaffolder. But it did not yet have a clear proof. It did not answer
the one question every learning project has to answer:

What is this trying to teach?

The answer I settled on was deliberately smaller than "build a React
framework." Fluffy should demonstrate how file-based routing, server rendering,
and browser hydration fit together. Not image optimization. Not React Server
Components. Not deployment adapters. Not a plugin system. Just the smallest
vertical slice that makes a framework feel real.

That became Phase 1.

By the end of this phase, a developer can scaffold a Fluffy app, run
`fluffy dev`, create a page in `src/pages`, see it render on the server, and
watch the browser hydrate the same component.

This post is the story of building that slice, including the turns that did not
survive unchanged.

## Pull Quotes

- "Everything Next.js does is not a roadmap. It is a trap."
- "From scratch is not a purity contest. It is a boundary."
- "A framework contract is imaginary until an app consumes it."
- "Framework DX is the accumulation of tiny decisions that remove friction."
- "The source tree is for maintainers. The package boundary is for consumers."
- "A learning framework still needs a real release path."

## LinkedIn Post

I revived an old side project this week: Fluffy, a tiny React framework I am
building to understand frameworks from first principles.

The goal is not to compete with Next.js. That would be the wrong thesis.

The goal is smaller and more useful:

How do file-based routing, server rendering, and hydration actually fit
together?

Phase 1 now has a complete vertical slice:

- `@fluffy-ts/create-app` scaffolds an app
- `fluffy dev` starts the framework dev server
- `src/pages/index.tsx` becomes a route
- the route renders on the server
- the browser hydrates the same page
- an example app lives beside the framework as a real downstream consumer
- CI, smoke tests, Changesets, and npm release automation are in place

The interesting part was not just the code. It was the decisions:

- using Vite instead of writing a bundler
- choosing Clack for a modern CLI feel
- switching from ESLint to Oxlint for fast project hygiene
- replacing temporary tests with a real example app
- making the dev server find the next available port
- treating release automation as part of the learning contract

I wrote up the full Phase 1 story here:

`https://promax.dev/blog/building-fluffy-part-1`

This is the first post in a series. Phase 2 is route data and error boundaries.

## Twitter / X Thread

1. I revived an old side project: Fluffy, a tiny React framework built for
   learning.

   Not to replace Next.js. To understand the moving parts frameworks usually hide.

2. The Phase 1 thesis:

   Show how file-based routing, server rendering, and hydration fit together in
   one complete vertical slice.

3. The "from scratch" boundary matters.

   Fluffy owns routing, SSR orchestration, hydration wiring, CLI, scaffolding,
   and docs.

   Vite owns bundling, HMR, and transforms.

4. Phase 1 now works:

   `@fluffy-ts/create-app`
   `fluffy dev`
   `src/pages/index.tsx`
   server-rendered HTML
   browser hydration

5. The example app is not a demo folder.

   It is the first downstream consumer. If the framework breaks, the example app
   should catch it.

6. One small DX decision I liked:

   If port 3210 is busy, Fluffy tries 3211, then 3212, and tells you where it
   actually started.

7. Tooling took a turn too.

   I started with ESLint + Prettier, then switched linting to Oxlint. Prettier
   still formats. `pnpm fix` runs both formatting and autofixable lint fixes.

8. Release automation is part of the framework contract.

   If someone reads the article and wants to try the package, the answer should
   not be "clone my branch and hope."

9. Full write-up:

   `https://promax.dev/blog/building-fluffy-part-1`

   Next phase: route data and error boundaries.

## Repo Docs To Add Later

These should be repo docs, not blog posts:

- `docs/architecture/phase-1-runtime.md`: route discovery -> SSR -> hydration.
- `docs/decisions/0001-use-vite-as-substrate.md`: from-scratch boundary.
- `docs/decisions/0002-keep-example-app.md`: why the example app is permanent.
- `docs/decisions/0003-release-from-main.md`: Changesets and release automation.

## Publishing Checklist

- Add final article to promax.dev.
- Link PR and repository near the top or bottom.
- Include one diagram of the request/hydration flow.
- Include a small "What changed in Phase 1" section.
- Include a "What I deliberately did not build" section.
- Publish article first.
- Post LinkedIn with the article link.
- Post Twitter/X thread with the article link.
- Pin the Phase 1 article somewhere on the Fluffy README after the PR lands.
