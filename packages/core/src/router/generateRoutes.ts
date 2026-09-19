/**
 * Converts files in an app's `src/pages` directory into Fluffy route records.
 *
 * This is the first step in the framework pipeline:
 * page files -> route manifest -> SSR match -> browser hydration match.
 */
import fs from "fs";
import path from "path";
import { FluffyRoute } from "../types/core-types";

/**
 * Walk the pages directory and return route records for every JS/TS page file.
 */
export function generateRoutes(
  pagesDir: string,
  appRoot = process.cwd(),
): FluffyRoute[] {
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
        const relativeToRoot = path.relative(appRoot, fullPath);

        routes.push({
          path: normalizedPath,
          component: fullPath,
          clientPath: `/${toPosixPath(relativeToRoot)}`,
          isSSR: checkForSSRExport(fullPath),
        });
      }
    }
  }

  walk(pagesDir);
  return routes.sort((a, b) => b.path.split("/").length - a.path.split("/").length);
}

function convertToRoutePath(filePath: string): string {
  const withoutExtension = toPosixPath(filePath).replace(/\.(t|j)sx?$/, "");
  const withoutIndex =
    withoutExtension === "index" ? "" : withoutExtension.replace(/\/index$/, "");

  const routePath = withoutIndex
    .replace(/\[\.\.\.(.*?)\]/g, "*")
    .replace(/\[(.*?)\]/g, ":$1");

  return routePath ? `/${routePath}` : "/";
}

/**
 * Phase 1 records this flag, but does not execute server data yet.
 */
function checkForSSRExport(filePath: string): boolean {
  const content = fs.readFileSync(filePath, "utf-8");
  return /export\s+(const|async function)\s+getServerProps/.test(content);
}

function toPosixPath(filePath: string): string {
  return filePath.split(path.sep).join("/");
}
