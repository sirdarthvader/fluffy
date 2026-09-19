import React, { ComponentType } from "react";
import { renderToString } from "react-dom/server";
import { FluffyRoute } from "../types/core-types";

export interface RenderResult {
  html: string;
}

export async function renderFluffyApp(
  pageModule: Record<string, unknown>,
  route: FluffyRoute
): Promise<RenderResult> {
  const Page = pageModule.default;

  if (typeof Page !== "function") {
    throw new Error(`Route ${route.path} must default export a React component.`);
  }

  return {
    html: renderToString(React.createElement(Page as ComponentType)),
  };
}
