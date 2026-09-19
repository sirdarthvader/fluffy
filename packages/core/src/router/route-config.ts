/**
 * Legacy helper for converting Fluffy routes into React Router route objects.
 *
 * This is not used by the active Phase 1 SSR/hydration path. It remains here
 * from the first prototype and should be revisited when client-side routing
 * becomes an intentional roadmap item.
 */
import { lazy } from "react";
import { FluffyRoute } from "../types/core-types";

/**
 * Lazily import each discovered page for React Router.
 */
export function createRouteObjects(routes: FluffyRoute[]) {
  return routes.map((route) => ({
    path: route.path,
    element: lazy(() => import(/* @vite-ignore */ route.component)),
    ssr: route.isSSR,
  }));
}
