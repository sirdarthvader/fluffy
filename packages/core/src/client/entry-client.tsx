import { hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { FluffyRouter } from "../router/router";
import { generateRoutes } from "../router/generate-routes";

declare global {
  interface Window {
    __SSR_DATA__: Record<string, unknown>;
  }
}

const ssrData = window.__SSR_DATA__ || {};
const pagesDir =
  document.getElementById("root")?.dataset.pagesDir || "src/pages";
const routes = generateRoutes(pagesDir);

hydrateRoot(
  document.getElementById("root")!,
  <BrowserRouter>
    <FluffyRouter routes={routes} ssrData={ssrData} />
  </BrowserRouter>
);
