#!/usr/bin/env node

import { intro, outro, cancel, log, spinner } from "@clack/prompts";
import { createFluffyDevServer } from "@fluffejs/core";

const version = "0.0.1-alpha.0";

main().catch((error) => {
  cancel(error instanceof Error ? error.message : String(error));
  process.exit(1);
});

async function main() {
  const [command, ...args] = process.argv.slice(2);

  if (!command || command === "--help" || command === "-h") {
    printHelp();
    return;
  }

  if (command === "--version" || command === "-v") {
    log.message(version);
    return;
  }

  if (command !== "dev") {
    throw new Error(`Unknown command: ${command}`);
  }

  await runDev(args);
}

async function runDev(args: string[]) {
  const port = readPort(args);
  const s = spinner();

  intro("Fluffy");
  s.start("Starting dev server");

  const devServer = await createFluffyDevServer({ port });
  await devServer.listen();

  s.stop("Dev server started");
  if (devServer.port !== port) {
    log.warn(`Port ${port} was busy, so Fluffy used ${devServer.port}.`);
  }
  outro(`Ready at http://localhost:${devServer.port}`);
}

function readPort(args: string[]) {
  const portFlagIndex = args.findIndex((arg) => arg === "--port" || arg === "-p");
  const inlinePortArg = args.find((arg) => arg.startsWith("--port="));

  if (portFlagIndex >= 0 && !args[portFlagIndex + 1]) {
    throw new Error("Missing value for --port.");
  }

  const portValue =
    inlinePortArg?.slice("--port=".length) ??
    (portFlagIndex >= 0 ? args[portFlagIndex + 1] : undefined) ??
    "3000";

  const port = Number.parseInt(portValue, 10);

  if (Number.isNaN(port)) {
    throw new Error(`Invalid port: ${portValue}`);
  }

  return port;
}

function printHelp() {
  intro("Fluffy");
  log.message(`Usage:
  fluffy dev [--port <port>]
  fluffy --help
  fluffy --version`);
  outro("Build tiny, learn deeply.");
}
