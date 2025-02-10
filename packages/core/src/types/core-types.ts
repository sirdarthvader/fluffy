export interface FluffyRoute {
  path: string;
  component: string;
  isSSR: boolean;
}

export interface ServerPropsContext {
  params: Record<string, string>;
  request?: Request;
}

export type GetServerProps<T = any> = (
  context: ServerPropsContext
) => Promise<T> | T;

export interface FluffyConfig {
  pagesDir?: string;
  port?: number;
  staticDir?: string;
  ssr?: boolean;
}

export interface FluffyRouterProps {
  routes: FluffyRoute[];
  ssrData?: Record<string, unknown>;
}
