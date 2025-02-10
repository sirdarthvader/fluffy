import express from "express";
import { createServer } from "http";
import path from "path";
import { renderFluffyApp } from "../renderer";
import { FluffyConfig } from "../../types/core-types";
import { generateRoutes } from "@router/generateRoutes";

export async function createExpressServer(config: FluffyConfig) {
  const app = express();
  const server = createServer(app);
  const isProd = process.env.NODE_ENV === "production";
  const pagesDir = path.resolve(process.cwd(), config.pagesDir || "src/pages");

  // Production: Serve static assets
  if (isProd) {
    app.use(express.static(path.join(process.cwd(), "dist/client")));
  }

  // Apply production/development middlewares
  if (isProd) {
    await applyProdMiddlewares(app, pagesDir);
  } else {
    await applyDevMiddlewares(app);
  }

  // Handle all routes
  app.get("*", async (req, res) => {
    try {
      const routes = generateRoutes(pagesDir);
      const { pipe, ssrData } = await renderFluffyApp(req.url, routes);

      res.setHeader("Content-Type", "text/html");
      res.write("<!DOCTYPE html><html><head><script>window.__SSR_DATA__ = ");
      res.write(JSON.stringify(ssrData).replace(/</g, "\\u003c"));
      res.write('</script></head><body><div id="root">');

      pipe(res);
      res.write('</div><script src="/client.js"></script></body></html>');
    } catch (error) {
      res.status(500).send(`<pre>${error}</pre>`);
    }
  });

  return server;
}

async function applyProdMiddlewares(app: express.Express, pagesDir: string) {
  const manifest = await import(
    path.join(process.cwd(), "dist/client/ssr-manifest.json")
  );
  app.locals.manifest = manifest;
}

async function applyDevMiddlewares(app: express.Express) {
  const { createViteDevMiddleware } = await import("../vite/dev-server");
  const vite = await createViteDevMiddleware();
  app.use(vite.middlewares);
}

// FLUFFY_PAGES_DIR=src/pages NODE_ENV=development node --loader ts-node/esm ./src/server/express/server.ts
