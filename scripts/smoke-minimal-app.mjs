import { execFileSync, spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { setTimeout as delay } from "node:timers/promises";

const port = 3210;
const baseUrl = `http://127.0.0.1:${port}`;
const repoRoot = fileURLToPath(new URL("..", import.meta.url));
const minimalAppRoot = fileURLToPath(new URL("../examples/minimal", import.meta.url));

run().catch((error) => {
  console.error(error);
  process.exit(1);
});

async function run() {
  runCommand("pnpm", ["--filter", "@fluffy/core", "build"]);
  runCommand("pnpm", ["--filter", "@fluffy/cli", "build"]);

  const server = spawn(
    "node",
    ["../../packages/cli/dist/index.js", "dev", "--port", String(port)],
    {
      cwd: minimalAppRoot,
      stdio: ["ignore", "pipe", "pipe"],
    }
  );

  let output = "";
  server.stdout.on("data", (chunk) => {
    output += chunk.toString();
  });
  server.stderr.on("data", (chunk) => {
    output += chunk.toString();
  });

  try {
    await waitForServer(baseUrl, server, () => output);

    const html = await fetchText(`${baseUrl}/`);
    assertIncludes(html, "<h1>Minimal Fluffy App</h1>", "server-rendered page");
    assertIncludes(html, "/@fluffy/client-entry", "hydration script");

    const clientEntry = await fetchText(`${baseUrl}/@fluffy/client-entry`);
    assertIncludes(clientEntry, "hydrateRoot", "hydration entry");
    assertIncludes(clientEntry, "/src/pages/index.tsx", "page module import");

    console.log("Minimal app smoke test passed.");
  } finally {
    server.kill("SIGINT");
  }
}

function runCommand(command, args) {
  execFileSync(command, args, {
    cwd: repoRoot,
    stdio: "inherit",
  });
}

async function waitForServer(url, server, getOutput) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < 10000) {
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

function assertIncludes(value, expected, label) {
  if (!value.includes(expected)) {
    throw new Error(`Expected ${label} to include ${expected}`);
  }
}
