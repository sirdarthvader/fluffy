import * as fs from "fs";
import * as path from "path";

const templateDir = path.join(__dirname, "../templates/basic");

function copyFiles(targetDir: string) {
  const files = fs.readdirSync(templateDir);
  files.forEach((file) => {
    fs.copyFileSync(path.join(templateDir, file), path.join(targetDir, file));
  });
}

function main() {
  const projectName = process.argv[2];
  if (!projectName) {
    console.error("Please provide a project name");
    process.exit(1);
  }

  const targetDir = path.join(process.cwd(), projectName);
  fs.mkdirSync(targetDir);
  copyFiles(targetDir);

  console.log(`Created project at ${targetDir}`);
}

main();
