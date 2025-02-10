import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { FluffyRoute } from "../types/core-types";

interface FluffyRouterProps {
  routes: FluffyRoute[];
}

export function FluffyRouter({ routes }: FluffyRouterProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        {routes.map(({ path, component: Element }) => (
          <Route key={path} path={path} element={<Element />} />
        ))}
      </Routes>
    </Suspense>
  );
}
