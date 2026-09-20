/**
 * Public entry point for @fluffy-ts/core.
 *
 * The CLI imports from this file instead of reaching into internal folders.
 * Keeping this surface small makes it easier to see what the framework
 * currently promises to other packages.
 */
export { createFluffyTsDevServer, createExpressServer } from "./server/express/server";
export { generateRoutes } from "./router/generateRoutes";
export type {
  FluffyTsConfig,
  FluffyTsRoute,
  GetServerProps,
  ServerPropsContext,
} from "./types/core-types";
