import { createServer as createViteServer } from "vite";
import { FluffyConfig } from "../../types/core-types";

export async function createViteDevMiddleware() {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "custom",
  });

  return {
    middlewares: vite.middlewares,
    transformIndexHtml: vite.transformIndexHtml,
  };
}
