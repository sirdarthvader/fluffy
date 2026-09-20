import { execFileSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";

const repoRoot = fileURLToPath(new URL("..", import.meta.url));
const packages = ["@fluffee/core", "@fluffee/cli"];

export function buildFramework() {
  for (const packageName of packages) {
    runStep(`Build ${packageName}`, () =>
      runCommand("pnpm", ["--filter", packageName, "build"]),
    );
  }
}

export function runStep(label, action) {
  process.stdout.write(`- ${label}... `);
  action();
  console.log("ok");
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
    throw new Error(`${command} ${args.join(" ")} failed\n${output}`, {
      cause: error,
    });
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    console.log("Preparing framework packages\n");
    buildFramework();
  } catch (error) {
    console.error(`\nBuild failed:\n${error.message}`);
    process.exit(1);
  }
}
