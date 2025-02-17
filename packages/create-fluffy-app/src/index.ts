import {
  intro,
  outro,
  text,
  spinner,
  multiselect,
  cancel,
  isCancel,
  note,
} from "@clack/prompts";
import pc from "picocolors";
import { mind, rainbow } from "gradient-string";
import fs from "fs-extra";
import path from "path";
import handlebars from "handlebars";
import figlet from "figlet";
import { fileURLToPath } from "url";
import { ProjectOptionsSchema } from "./schemas.js";

// Add directory name helper
const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  console.log("\n");
  console.log(
    mind(figlet.textSync("Create Fluffy App", { font: "Big Money-ne" }))
  );
  console.log(pc.cyan(" 🐶  Welcome to Create Fluffy App!  🐶\n"));
  console.log(pc.cyan(" The comfiest way to build your next web app!"));
  console.log(
    pc.gray(
      "Create Fluffy App is a CLI tool that helps you scaffold a new project with your favorite tools and configurations."
    )
  );

  // Collect project name
  const projectName = await text({
    message: "Enter your project name:",
    placeholder: "my-fluffy-app",
    validate: (input) => {
      if (input.length < 3) {
        return "Project name must be at least 3 characters long!";
      }
      if (input.length > 30) {
        return "Project name must be at most 30 characters long!";
      }
      if (!/^[a-z0-9-]+$/.test(input)) {
        return "Project name must be lowercase and contain only letters, numbers and dashes!";
      }
    },
  });

  if (isCancel(projectName)) {
    cancel("Project creation cancelled!");
    return process.exit(0);
  }

  // Collect fetures
  const features = await multiselect({
    message: "Select the features you want to include:",
    options: [
      { value: "typescript", label: "Typescript" },
      { value: "tailwindcss", label: "Tailwind CSS" },
      { value: "eslint", label: "ESLint" },
      { value: "prettier", label: "Prettier" },
    ],
  });

  if (isCancel(features)) {
    cancel("Project creation cancelled!");
    return process.exit(0);
  }

  //Validation
  const config = ProjectOptionsSchema.safeParse({
    projectName,
    features,
  });

  note(
    `Creating project in ${pc.bold(config.data?.projectName)} with:
    ${config.data?.features.map((f) => pc.green(`✓ ${f}`)).join("\n    ")}`,
    pc.cyan("Project Summary")
  );

  const s = spinner();
  s.start("Scaffolding project, please wait...");

  try {
    const templateDir = path.join(__dirname, "..", "src/template/base");
    const outputDir = path.join(process.cwd(), projectName);

    await fs.copy(templateDir, outputDir);

    // Process template files
    const templateData = {
      projecName: config.data?.projectName,
      useTS: config.data?.features.includes("typescript"),
      useTailwind: config.data?.features.includes("tailwindcss"),
      useEslint: config.data?.features.includes("eslint"),
      usePrettier: config.data?.features.includes("prettier"),
    };

    await processTemplates(outputDir, templateData);

    s.stop("Project created");
    outro(
      pc.green(`\nSuccess! Created ${config.data?.projectName} at ${outputDir}`)
    );
    console.log(pc.cyan("\nNext steps:"));
    console.log(`  cd ${config.data?.projectName}`);
    console.log("  pnpm install");
    console.log("  pnpm dev\n");
  } catch (error) {
    s.stop("Failed to create project");
    cancel(pc.red(error instanceof Error ? error.message : "Unknown error"));
    process.exit(1);
  }
}

async function processTemplates(dir: string, data: any) {
  const files = await fs.readdir(dir);

  await Promise.all(
    files.map(async (file) => {
      const filePath = path.join(dir, file);
      const stats = await fs.stat(filePath);

      if (stats.isDirectory()) {
        return processTemplates(filePath, data);
      }

      if (file.endsWith(".hbs")) {
        const content = await fs.readFile(filePath, "utf8");
        const template = handlebars.compile(content);
        const result = template(data);
        await fs.writeFile(filePath.replace(/\.hbs$/, ""), result);
        await fs.remove(filePath);
      }
    })
  );
}

main().catch(console.error);
