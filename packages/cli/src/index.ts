import { Command } from "commander";

const program = new Command();

program
  .command("dev")
  .description("Start development server")
  .action(() => {
    console.log("Starting dev server...");
  });

program.parse(process.argv);
