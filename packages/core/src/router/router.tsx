/**
 * Legacy React Router adapter from the early prototype.
 *
 * The active Phase 1 dev server does not use this file; it renders and
 * hydrates the matched page component directly. Keep this file documented
 * until we either remove it or reintroduce a client router at a later phase.
 */
import { ComponentType, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { FluffyRoute } from "../types/core-types";

interface FluffyRouterProps {
  routes: FluffyRoute[];
}

export function FluffyRouter({ routes }: FluffyRouterProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        {routes.map(({ path, component }) => {
          // This cast exists because the legacy adapter expects component values,
          // while the active route manifest stores filesystem paths.
          const Element = component as unknown as ComponentType;

          return <Route key={path} path={path} element={<Element />} />;
        })}
      </Routes>
    </Suspense>
  );
}
