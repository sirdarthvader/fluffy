import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const siteDir = path.join(repoRoot, "site");
const siteIndex = path.join(siteDir, "index.html");
const pagesWorkflow = path.join(repoRoot, ".github/workflows/pages.yml");
const errors = [];

function fail(message) {
  errors.push(message);
}

function readRequiredFile(filePath) {
  if (!fs.existsSync(filePath)) {
    fail(`Missing required file: ${path.relative(repoRoot, filePath)}`);
    return "";
  }

  return fs.readFileSync(filePath, "utf8");
}

const html = readRequiredFile(siteIndex);
const pagesYaml = readRequiredFile(pagesWorkflow);

if (!fs.existsSync(path.join(siteDir, ".nojekyll"))) {
  fail(
    "Missing site/.nojekyll. GitHub Pages may process underscored paths with Jekyll.",
  );
}

for (const assetPath of findLocalAssetReferences(html)) {
  const resolvedPath = path.join(siteDir, assetPath);

  if (!fs.existsSync(resolvedPath)) {
    fail(`Missing site asset referenced by index.html: ${assetPath}`);
  }
}

for (const anchor of findSamePageAnchors(html)) {
  if (!htmlIncludesId(html, anchor)) {
    fail(`Missing same-page anchor target in site/index.html: #${anchor}`);
  }
}

assertIncludes(pagesYaml, "pages: write", "Pages workflow must grant pages: write.");
assertIncludes(
  pagesYaml,
  "id-token: write",
  "Pages workflow must grant id-token: write.",
);
assertIncludes(
  pagesYaml,
  "actions/configure-pages@v5",
  "Pages workflow must configure GitHub Pages before deployment.",
);
assertIncludes(
  pagesYaml,
  "enablement: true",
  "Pages workflow should enable Pages on first deploy.",
);
assertIncludes(
  pagesYaml,
  "actions/upload-pages-artifact@v3",
  "Pages workflow must upload a Pages artifact.",
);
assertIncludes(
  pagesYaml,
  "path: site",
  "Pages workflow must upload the site directory.",
);
assertIncludes(
  pagesYaml,
  "actions/deploy-pages@v4",
  "Pages workflow must deploy the uploaded Pages artifact.",
);

if (errors.length > 0) {
  console.error("Documentation site check failed:");

  for (const error of errors) {
    console.error(`- ${error}`);
  }

  process.exit(1);
}

console.log("Documentation site check passed.");

function assertIncludes(source, expected, message) {
  if (!source.includes(expected)) {
    fail(message);
  }
}

function findLocalAssetReferences(source) {
  const references = [];
  const attributePattern = /\s(?:href|src)=["']([^"']+)["']/g;

  for (const match of source.matchAll(attributePattern)) {
    const value = match[1];

    if (isLocalAssetPath(value)) {
      references.push(value.replace(/^\.\//, ""));
    }
  }

  return references;
}

function findSamePageAnchors(source) {
  const anchors = [];
  const hrefPattern = /\shref=["']#([^"']+)["']/g;

  for (const match of source.matchAll(hrefPattern)) {
    anchors.push(match[1]);
  }

  return anchors;
}

function htmlIncludesId(source, id) {
  const escapedId = escapeRegExp(id);
  return new RegExp(`\\sid=["']${escapedId}["']`).test(source);
}

function isLocalAssetPath(value) {
  if (value.startsWith("#")) {
    return false;
  }

  if (/^[a-z]+:/i.test(value)) {
    return false;
  }

  return value.startsWith("./") || !value.startsWith("/");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
