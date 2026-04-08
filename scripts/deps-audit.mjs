import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const ROOT_PACKAGE_PATH = path.join(ROOT, "package.json");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function listWorkspacePackageJsonPaths(rootPackageJson) {
  const workspaces = rootPackageJson.workspaces?.packages ?? [];
  const packageJsonPaths = [];

  for (const pattern of workspaces) {
    // This repo uses "packages/*" and we keep this script intentionally strict.
    if (pattern !== "packages/*") {
      continue;
    }

    const packagesRoot = path.join(ROOT, "packages");
    if (!fs.existsSync(packagesRoot)) continue;

    const packageDirs = fs.readdirSync(packagesRoot, { withFileTypes: true });
    for (const dirent of packageDirs) {
      if (!dirent.isDirectory()) continue;
      const packageJsonPath = path.join(
        packagesRoot,
        dirent.name,
        "package.json",
      );
      if (fs.existsSync(packageJsonPath)) {
        packageJsonPaths.push(packageJsonPath);
      }
    }
  }

  return packageJsonPaths;
}

function collectDependencyRecords(manifests) {
  const map = new Map();
  const depFields = ["dependencies", "devDependencies", "peerDependencies"];

  for (const manifest of manifests) {
    for (const field of depFields) {
      const deps = manifest.packageJson[field] ?? {};
      for (const [name, version] of Object.entries(deps)) {
        if (!map.has(name)) {
          map.set(name, []);
        }
        map.get(name).push({
          packageName: manifest.name,
          field,
          version,
        });
      }
    }
  }

  return map;
}

function isInternalDep(name) {
  return name.startsWith("@kotonosora/");
}

function isWorkspaceRange(version) {
  return typeof version === "string" && version.startsWith("workspace:");
}

function isCatalogRange(version) {
  return version === "catalog:";
}

function getDistinct(values) {
  return [...new Set(values)];
}

function rel(filePath) {
  return path.relative(ROOT, filePath).replaceAll("\\", "/");
}

function main() {
  const strict = process.argv.includes("--strict");

  if (!fs.existsSync(ROOT_PACKAGE_PATH)) {
    console.error("Cannot find root package.json");
    process.exit(1);
  }

  const rootPackageJson = readJson(ROOT_PACKAGE_PATH);
  const workspacePackageJsonPaths =
    listWorkspacePackageJsonPaths(rootPackageJson);

  const manifests = [
    {
      name: rootPackageJson.name ?? "root",
      path: ROOT_PACKAGE_PATH,
      packageJson: rootPackageJson,
    },
    ...workspacePackageJsonPaths.map((p) => {
      const pkg = readJson(p);
      return {
        name: pkg.name ?? rel(path.dirname(p)),
        path: p,
        packageJson: pkg,
      };
    }),
  ];

  const catalog = rootPackageJson.workspaces?.catalog ?? {};
  const recordsByDep = collectDependencyRecords(manifests);

  const sharedUncataloged = [];
  const mixedVersions = [];
  const tildeRanges = [];
  const caretRanges = [];

  for (const [depName, records] of recordsByDep.entries()) {
    if (isInternalDep(depName)) continue;

    for (const record of records) {
      if (
        typeof record.version === "string" &&
        record.version.startsWith("~")
      ) {
        tildeRanges.push({ depName, ...record });
      }

      if (
        typeof record.version === "string" &&
        record.version.startsWith("^")
      ) {
        caretRanges.push({ depName, ...record });
      }
    }

    const appearsIn = getDistinct(records.map((r) => r.packageName));
    const nonWorkspaceRecords = records.filter(
      (r) => !isWorkspaceRange(r.version),
    );
    const nonWorkspaceVersions = getDistinct(
      nonWorkspaceRecords.map((r) => r.version),
    );

    if (appearsIn.length >= 2 && !(depName in catalog)) {
      sharedUncataloged.push({ depName, records: nonWorkspaceRecords });
    }

    const normalized = nonWorkspaceVersions.filter((v) => !isCatalogRange(v));
    if (getDistinct(normalized).length > 1) {
      mixedVersions.push({ depName, records: nonWorkspaceRecords });
    }
  }

  console.log("Dependency Audit Summary");
  console.log("- Manifests scanned:", manifests.length);
  console.log("- Catalog entries:", Object.keys(catalog).length);
  console.log("- Shared uncataloged deps:", sharedUncataloged.length);
  console.log("- Mixed non-catalog versions:", mixedVersions.length);
  console.log("- Tilde ranges:", tildeRanges.length);
  console.log("- Caret ranges:", caretRanges.length);

  if (sharedUncataloged.length > 0) {
    console.log("\nShared uncataloged dependencies (appears in 2+ manifests):");
    for (const item of sharedUncataloged.sort((a, b) =>
      a.depName.localeCompare(b.depName),
    )) {
      const usages = item.records
        .map((r) => `${r.packageName}(${r.field}:${r.version})`)
        .join(", ");
      console.log(`- ${item.depName}: ${usages}`);
    }
  }

  if (mixedVersions.length > 0) {
    console.log("\nDependencies with mixed versions (non-catalog):");
    for (const item of mixedVersions.sort((a, b) =>
      a.depName.localeCompare(b.depName),
    )) {
      const usages = item.records
        .map((r) => `${r.packageName}(${r.field}:${r.version})`)
        .join(", ");
      console.log(`- ${item.depName}: ${usages}`);
    }
  }

  if (tildeRanges.length > 0) {
    console.log("\nDependencies using tilde ranges:");
    for (const item of tildeRanges.sort((a, b) =>
      a.depName.localeCompare(b.depName),
    )) {
      console.log(
        `- ${item.depName} in ${item.packageName} (${item.field}:${item.version})`,
      );
    }
  }

  if (caretRanges.length > 0) {
    console.log("\nDependencies using caret ranges:");
    for (const item of caretRanges.sort((a, b) =>
      a.depName.localeCompare(b.depName),
    )) {
      console.log(
        `- ${item.depName} in ${item.packageName} (${item.field}:${item.version})`,
      );
    }
  }

  if (
    strict &&
    (sharedUncataloged.length > 0 ||
      mixedVersions.length > 0 ||
      caretRanges.length > 0)
  ) {
    console.error(
      "\nStrict mode failed: fix uncataloged shared deps, mixed versions, and caret ranges.",
    );
    process.exit(1);
  }
}

main();
