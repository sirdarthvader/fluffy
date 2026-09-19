import { lazy } from "react";
import { FluffyRoute } from "../types/core-types.js";

export function createRouteObjects(routes: FluffyRoute[]) {
  return routes.map((route) => ({
    path: route.path,
    element: lazy(() => import(/* @vite-ignore */ route.component)),
    ssr: route.isSSR,
  }));
}
