/**
 * Shared framework types for the current Phase 1 runtime.
 *
 * These types describe the small contract between route discovery, the dev
 * server, rendering, and future data-loading work.
 */

/**
 * A page file after Fluffy has discovered it in the app's `src/pages` folder.
 */
export interface FluffyRoute {
  /** URL path exposed by the framework, such as `/` or `/blog/:slug`. */
  path: string;
  /** Browser import path used by the generated hydration entry. */
  clientPath: string;
  /** Absolute filesystem path used by Vite's SSR loader on the server. */
  component: string;
  /** Whether the page currently exports `getServerProps`. Reserved for Phase 2. */
  isSSR: boolean;
}

/**
 * Context passed to future server data functions.
 */
export interface ServerPropsContext {
  params: Record<string, string>;
  request?: Request;
}

/**
 * Future page-level server data hook.
 */
export type GetServerProps<T = any> = (context: ServerPropsContext) => Promise<T> | T;

/**
 * Runtime options accepted by the Fluffy dev server.
 */
export interface FluffyConfig {
  pagesDir?: string;
  port?: number;
  staticDir?: string;
  ssr?: boolean;
}

export interface FluffyRouterProps {
  routes: FluffyRoute[];
  ssrData?: Record<string, unknown>;
}
