import fs from "fs";
import path from "path";
import { FluffyRoute } from "../types/core-types";

export function generateRoutes(pagesDir: string): FluffyRoute[] {
  const routes: FluffyRoute[] = [];

  function walk(dir: string, base = "") {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const routePath = path.join(base, entry.name);

      if (entry.isDirectory()) {
        walk(fullPath, routePath);
      } else if (/\.(t|j)sx?$/.test(entry.name)) {
        const normalizedPath = convertToRoutePath(routePath);
        routes.push({
          path: normalizedPath,
          component: fullPath,
          isSSR: checkForSSRExport(fullPath),
        });
      }
    }
  }

  walk(pagesDir);
  return routes.sort(
    (a, b) => b.path.split("/").length - a.path.split("/").length
  );
}

function convertToRoutePath(filePath: string): string {
  return filePath
    .replace(/\/index\.(t|j)sx?$/, "")
    .replace(/\.(t|j)sx?$/, "")
    .replace(/\[(.*?)\]/g, ":$1")
    .replace(/\/_/g, "/:") // Handle catch-all segments
    .replace(/\*/g, ".*"); // Support wildcard routes
}

function checkForSSRExport(filePath: string): boolean {
  const content = fs.readFileSync(filePath, "utf-8");
  return /export\s+(const|async function)\s+getServerProps/.test(content);
}
