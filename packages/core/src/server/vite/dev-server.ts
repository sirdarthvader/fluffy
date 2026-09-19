/**
 * Small Vite middleware factory from the original prototype.
 *
 * The active Phase 1 dev server creates Vite directly so it can also register
 * Fluffy's virtual hydration entry. This helper is kept separate for now in
 * case later phases split Vite setup back into its own module.
 */
import { createServer as createViteServer } from "vite";

/**
 * Create Vite in middleware mode for an app rooted at the current directory.
 */
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
