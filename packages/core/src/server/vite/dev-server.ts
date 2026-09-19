import { createServer as createViteServer } from "vite";

export async function createViteDevMiddleware() {
  const vite = await createViteServer({
    root: process.cwd(),
    server: { middlewareMode: true },
    appType: "custom",
  });

  return {
    middlewares: vite.middlewares,
    transformIndexHtml: vite.transformIndexHtml,
  };
}
