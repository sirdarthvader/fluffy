#!/usr/bin/env node

import { Command } from "commander";
import { createFluffyDevServer } from "@fluffy/core";

const program = new Command();

program
  .name("fluffy")
  .description("Development CLI for Fluffy apps")
  .version("0.0.1-alpha.0");

program
  .command("dev")
  .description("Start development server")
  .option("-p, --port <port>", "Port to run the dev server on", "3000")
  .action(async (options: { port: string }) => {
    const port = Number.parseInt(options.port, 10);

    if (Number.isNaN(port)) {
      throw new Error(`Invalid port: ${options.port}`);
    }

    const devServer = await createFluffyDevServer({ port });
    await devServer.listen();

    console.log(`Fluffy dev server running at http://localhost:${devServer.port}`);
  });

program.parse(process.argv);
