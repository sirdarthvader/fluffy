/**
 * Server-side React renderer for a matched fluffejs route.
 *
 * The dev server asks Vite to load a page module, then this file turns that
 * module's default export into an HTML string. It does not know about Express,
 * routing, or browser hydration; it only renders one page component.
 */
import React, { ComponentType } from "react";
import { renderToString } from "react-dom/server";
import { FluffejsRoute } from "../types/core-types";

/**
 * HTML returned by the server renderer before it is wrapped in a document.
 */
export interface RenderResult {
  html: string;
}

/**
 * Render one page module for one matched route.
 */
export async function renderFluffejsApp(
  pageModule: Record<string, unknown>,
  route: FluffejsRoute,
): Promise<RenderResult> {
  const Page = pageModule.default;

  if (typeof Page !== "function") {
    throw new Error(`Route ${route.path} must default export a React component.`);
  }

  return {
    html: renderToString(React.createElement(Page as ComponentType)),
  };
}
