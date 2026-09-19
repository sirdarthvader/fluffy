/**
 * Development server for Fluffy apps.
 *
 * This is the current Phase 1 runtime:
 * 1. discover routes from `src/pages`
 * 2. let Vite load the matched page module for SSR
 * 3. render the page to HTML
 * 4. serve a generated browser entry that hydrates the same page
 */
import express from "express";
import { createServer } from "http";
import path from "path";
import react from "@vitejs/plugin-react";
import { createServer as createViteServer, ViteDevServer } from "vite";
import { generateRoutes } from "../../router/generateRoutes";
import type { FluffyConfig, FluffyRoute } from "../../types/core-types";
import { renderFluffyApp } from "../renderer";

/**
 * Create a local dev server for the app in the current working directory.
 */
export async function createFluffyDevServer(config: FluffyConfig = {}) {
  const appRoot = process.cwd();
  const app = express();
  const server = createServer(app);
  const pagesDir = path.resolve(appRoot, config.pagesDir || "src/pages");
  const port = config.port || 3000;

  const vite = await createViteServer({
    root: appRoot,
    appType: "custom",
    plugins: [
      react(),
      {
        name: "fluffy-client-entry",
        resolveId(id) {
          if (id === "/@fluffy/client-entry") {
            return "\0fluffy/client-entry";
          }
        },
        load(id) {
          if (id === "\0fluffy/client-entry") {
            return createClientEntry(generateRoutes(pagesDir, appRoot));
          }
        },
      },
    ],
    server: {
      middlewareMode: true,
    },
  });

  app.use(vite.middlewares);

  app.get("*", async (req, res) => {
    try {
      const routes = generateRoutes(pagesDir, appRoot);
      const route = matchRoute(req.path, routes);

      if (!route) {
        res.status(404).send("Not found");
        return;
      }

      const pageModule = await vite.ssrLoadModule(route.component);
      const { html } = await renderFluffyApp(pageModule, route);
      const document = await renderDocument(req.originalUrl, html, vite);

      res.status(200).setHeader("Content-Type", "text/html").end(document);
    } catch (error) {
      vite.ssrFixStacktrace(error as Error);
      res.status(500).end(`<pre>${escapeHtml(String(error))}</pre>`);
    }
  });

  return {
    listen() {
      return new Promise<void>((resolve) => {
        server.listen(port, () => resolve());
      });
    },
    port,
    server,
  };
}

export const createExpressServer = createFluffyDevServer;

/**
 * Generate the browser entry module for the current route manifest.
 *
 * Vite transforms this string as a virtual module, so `import.meta.glob`
 * becomes concrete imports for the app's page files.
 */
function createClientEntry(routes: FluffyRoute[]) {
  const clientRoutes = routes.map(({ path, clientPath }) => ({
    path,
    clientPath,
  }));

  return `
import React from "react";
import { hydrateRoot } from "react-dom/client";

const modules = import.meta.glob("/src/pages/**/*.{js,jsx,ts,tsx}", { eager: true });
const routes = ${JSON.stringify(clientRoutes)};

function matchRoute(pathname) {
  return routes.find((route) => routeToRegex(route.path).test(pathname));
}

function routeToRegex(routePath) {
  const pattern = routePath
    .replace(/\\\\/g, "/")
    .replace(/:[^/]+/g, "[^/]+")
    .replace(/\\*/g, ".*");
  return new RegExp("^" + pattern + "$");
}

const route = matchRoute(window.location.pathname);
const pageModule = route ? modules[route.clientPath] : null;
const Page = pageModule && pageModule.default;

if (!Page) {
  throw new Error("Fluffy could not find a page component for " + window.location.pathname);
}

hydrateRoot(document.getElementById("root"), React.createElement(Page));
`;
}

/**
 * Wrap server-rendered page HTML in the minimal document needed for hydration.
 */
async function renderDocument(
  url: string,
  appHtml: string,
  vite: ViteDevServer,
) {
  const html = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Fluffy App</title>
  </head>
  <body>
    <div id="root">${appHtml}</div>
    <script type="module" src="/@fluffy/client-entry"></script>
  </body>
</html>`;

  return vite.transformIndexHtml(url, html);
}

/**
 * Match a request path against the file-based route manifest.
 */
function matchRoute(pathname: string, routes: FluffyRoute[]) {
  return routes.find((route) => routeToRegex(route.path).test(pathname));
}

/**
 * Convert Fluffy's `:param` and `*` path syntax into a simple matcher.
 */
function routeToRegex(routePath: string) {
  const pattern = routePath
    .replace(/\\/g, "/")
    .replace(/:[^/]+/g, "[^/]+")
    .replace(/\*/g, ".*");

  return new RegExp(`^${pattern}$`);
}

/**
 * Escape server error text before writing it into a development error page.
 */
function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    switch (character) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      case "'":
        return "&#39;";
      default:
        return character;
    }
  });
}
