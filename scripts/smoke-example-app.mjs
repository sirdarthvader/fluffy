import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { fileURLToPath } from "node:url";
import { setTimeout as delay } from "node:timers/promises";
import { buildFramework } from "./build-framework.mjs";

const exampleAppRoot = fileURLToPath(new URL("../examples/minimal", import.meta.url));

run().catch((error) => {
  console.error(`\nSmoke test failed:\n${error.message}`);
  process.exit(1);
});

async function run() {
  console.log("Example app smoke test\n");

  buildFramework();

  const port = await findAvailablePort(3211);
  const baseUrl = `http://127.0.0.1:${port}`;
  const server = spawn(
    "node",
    ["../../packages/cli/dist/index.js", "dev", "--port", String(port)],
    {
      cwd: exampleAppRoot,
      stdio: ["ignore", "pipe", "pipe"],
    },
  );

  let output = "";
  server.stdout.on("data", (chunk) => {
    output += chunk.toString();
  });
  server.stderr.on("data", (chunk) => {
    output += chunk.toString();
  });

  try {
    await runAsyncStep("Start example app dev server", () =>
      waitForServer(baseUrl, server, () => output),
    );

    const html = await fetchText(`${baseUrl}/`);
    await runAsyncStep("Assert server-rendered page HTML", () =>
      assertIncludes(html, "<h1>fluffy-ts Example App</h1>", "server-rendered page"),
    );
    await runAsyncStep("Assert HTML includes hydration script", () =>
      assertIncludes(html, "/@fluffy-ts/client-entry", "hydration script"),
    );

    const clientEntry = await fetchText(`${baseUrl}/@fluffy-ts/client-entry`);
    await runAsyncStep("Assert hydration entry calls hydrateRoot", () =>
      assertIncludes(clientEntry, "hydrateRoot", "hydration entry"),
    );
    await runAsyncStep("Assert hydration entry imports the page module", () =>
      assertIncludes(clientEntry, "/src/pages/index.tsx", "page module import"),
    );

    console.log("\nExample app smoke test passed.");
  } finally {
    server.kill("SIGINT");
  }
}

async function runAsyncStep(label, action) {
  process.stdout.write(`- ${label}... `);
  await action();
  console.log("ok");
}

async function waitForServer(url, server, getOutput) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < 20000) {
    if (server.exitCode !== null) {
      throw new Error(`Dev server exited early:\n${getOutput()}`);
    }

    try {
      await fetchText(url);
      return;
    } catch {
      await delay(100);
    }
  }

  throw new Error(`Timed out waiting for dev server:\n${getOutput()}`);
}

async function fetchText(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`${url} returned ${response.status}`);
  }

  return response.text();
}

function findAvailablePort(port) {
  return new Promise((resolve, reject) => {
    const probe = createServer();

    probe.once("error", (error) => {
      if (error.code === "EADDRINUSE") {
        resolve(findAvailablePort(port + 1));
        return;
      }

      reject(error);
    });

    probe.listen(port, () => {
      probe.close(() => resolve(port));
    });
  });
}

function assertIncludes(value, expected, label) {
  if (!value.includes(expected)) {
    throw new Error(`Expected ${label} to include ${expected}`);
  }
}
