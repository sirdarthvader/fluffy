import { execFileSync, spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { setTimeout as delay } from "node:timers/promises";

const port = 3211;
const baseUrl = `http://127.0.0.1:${port}`;
const repoRoot = fileURLToPath(new URL("..", import.meta.url));
const exampleAppRoot = fileURLToPath(new URL("../examples/minimal", import.meta.url));

run().catch((error) => {
  console.error(`\nSmoke test failed:\n${error.message}`);
  process.exit(1);
});

async function run() {
  console.log("Example app smoke test\n");

  await runStep("Build @fluffy/core", () =>
    runCommand("pnpm", ["--filter", "@fluffy/core", "build"])
  );
  await runStep("Build @fluffy/cli", () =>
    runCommand("pnpm", ["--filter", "@fluffy/cli", "build"])
  );

  const server = spawn(
    "node",
    ["../../packages/cli/dist/index.js", "dev", "--port", String(port)],
    {
      cwd: exampleAppRoot,
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
    await runStep("Start example app dev server", () =>
      waitForServer(baseUrl, server, () => output)
    );

    const html = await fetchText(`${baseUrl}/`);
    await runStep("Assert server-rendered page HTML", () =>
      assertIncludes(html, "<h1>Fluffy Example App</h1>", "server-rendered page")
    );
    await runStep("Assert HTML includes hydration script", () =>
      assertIncludes(html, "/@fluffy/client-entry", "hydration script")
    );

    const clientEntry = await fetchText(`${baseUrl}/@fluffy/client-entry`);
    await runStep("Assert hydration entry calls hydrateRoot", () =>
      assertIncludes(clientEntry, "hydrateRoot", "hydration entry")
    );
    await runStep("Assert hydration entry imports the page module", () =>
      assertIncludes(clientEntry, "/src/pages/index.tsx", "page module import")
    );

    console.log("\nExample app smoke test passed.");
  } finally {
    server.kill("SIGINT");
  }
}

function runCommand(command, args) {
  try {
    execFileSync(command, args, {
      cwd: repoRoot,
      stdio: "pipe",
      encoding: "utf8",
    });
  } catch (error) {
    const output = [error.stdout, error.stderr].filter(Boolean).join("\n");
    throw new Error(`${command} ${args.join(" ")} failed\n${output}`);
  }
}

async function runStep(label, action) {
  process.stdout.write(`- ${label}... `);
  await action();
  console.log("ok");
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
