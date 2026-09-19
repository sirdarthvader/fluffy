import { ComponentType, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { FluffyRoute } from "../types/core-types.js";

interface FluffyRouterProps {
  routes: FluffyRoute[];
}

export function FluffyRouter({ routes }: FluffyRouterProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        {routes.map(({ path, component }) => {
          const Element = component as unknown as ComponentType;

          return <Route key={path} path={path} element={<Element />} />;
        })}
      </Routes>
    </Suspense>
  );
}
