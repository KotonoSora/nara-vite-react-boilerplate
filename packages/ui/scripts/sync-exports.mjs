import fs from "node:fs";
import path from "node:path";

const UI_ROOT = process.cwd();
const PKG_PATH = path.join(UI_ROOT, "package.json");

function ensureFile(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing required file: ${filePath}`);
  }
}

function toPosix(filePath) {
  return filePath.replaceAll("\\", "/");
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function listFiles(dirPath, allowedExtensions) {
  if (!fs.existsSync(dirPath)) return [];

  return fs
    .readdirSync(dirPath, { withFileTypes: true })
    .filter((d) => d.isFile())
    .map((d) => d.name)
    .filter((name) => allowedExtensions.some((ext) => name.endsWith(ext)))
    .sort((a, b) => a.localeCompare(b));
}

function main() {
  ensureFile(PKG_PATH);

  const pkg = readJson(PKG_PATH);
  const uiDir = path.join(UI_ROOT, "src", "components", "ui");
  const hooksDir = path.join(UI_ROOT, "src", "hooks");
  const libUtilsPath = path.join(UI_ROOT, "src", "lib", "utils.ts");
  const stylesGlobalsPath = path.join(UI_ROOT, "src", "styles", "globals.css");

  const componentFiles = listFiles(uiDir, [".tsx"]);
  const hookFiles = listFiles(hooksDir, [".ts", ".tsx"]);

  const exportsMap = {};
  const filesList = [];

  for (const filename of componentFiles) {
    const base = filename.replace(/\.tsx$/, "");
    const rel = `./src/components/ui/${filename}`;
    exportsMap[`./components/ui/${base}`] = rel;
    filesList.push(rel.slice(2));
  }

  for (const filename of hookFiles) {
    const base = filename.replace(/\.tsx?$/, "");
    const rel = `./src/hooks/${filename}`;
    exportsMap[`./hooks/${base}`] = rel;

    // Keep compatibility with the existing typo path in current consumers.
    if (base === "use-mobile") {
      exportsMap["./hooks/use-mobil"] = rel;
    }

    filesList.push(rel.slice(2));
  }

  if (fs.existsSync(libUtilsPath)) {
    exportsMap["./lib/utils"] = "./src/lib/utils.ts";
    filesList.push("src/lib/utils.ts");
  }

  if (fs.existsSync(stylesGlobalsPath)) {
    exportsMap["./styles/globals"] = "./src/styles/globals.css";
    filesList.push("src/styles/globals.css");
  }

  const sortedExports = Object.fromEntries(
    Object.entries(exportsMap).sort((a, b) => a[0].localeCompare(b[0])),
  );
  const sortedFiles = [...new Set(filesList)].sort((a, b) =>
    a.localeCompare(b),
  );

  pkg.exports = sortedExports;
  pkg.files = sortedFiles;

  fs.writeFileSync(PKG_PATH, `${JSON.stringify(pkg, null, 2)}\n`, "utf8");

  console.log("Synced packages/ui exports and files list.");
  console.log(`- components: ${componentFiles.length}`);
  console.log(`- hooks: ${hookFiles.length}`);
  console.log(`- total exports: ${Object.keys(sortedExports).length}`);
}

main();
