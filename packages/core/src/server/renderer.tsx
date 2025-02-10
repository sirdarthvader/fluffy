import { renderToPipeableStream } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { FluffyRouter } from "../router/router";
import { FluffyRoute } from "../types/core-types";

interface RenderResult {
  pipe: (res: any) => void;
  ssrData?: Record<string, unknown>;
}

export async function renderFluffyApp(
  url: string,
  routes: FluffyRoute[]
): Promise<RenderResult> {
  const context: { ssrData?: Record<string, unknown> } = {};

  // Check for SSR data requirements
  const matchedRoute = routes.find((route) =>
    new RegExp(`^${route.path.replace(/:\w+/g, "[^/]+")}$`).test(url)
  );

  let ssrData = {};
  if (matchedRoute?.isSSR) {
    const component = await import(matchedRoute.component);
    if (component.getServerProps) {
      ssrData = await component.getServerProps();
    }
  }

  return new Promise((resolve) => {
    const stream = renderToPipeableStream(
      <StaticRouter location={url}>
        <FluffyRouter routes={routes} />
      </StaticRouter>,
      {
        bootstrapModules: ["/src/client/entry-client.tsx"],
        onShellReady() {
          resolve({
            pipe: stream.pipe,
            ssrData: context.ssrData,
          });
        },
      }
    );
  });
}
