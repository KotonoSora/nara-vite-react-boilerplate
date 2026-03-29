import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const ROOT_PACKAGE_PATH = path.join(ROOT, "package.json");
const DEP_FIELDS = [
  "dependencies",
  "devDependencies",
  "peerDependencies",
  "optionalDependencies",
];

function parseArgs(argv) {
  const args = {
    write: false,
    workspace: "",
  };

  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--write") {
      args.write = true;
      continue;
    }

    if (arg === "--workspace") {
      args.workspace = argv[i + 1] ?? "";
      i += 1;
    }
  }

  return args;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, json) {
  fs.writeFileSync(filePath, `${JSON.stringify(json, null, 2)}\n`, "utf8");
}

function listWorkspacePackageJsonPaths(rootPackageJson) {
  const patterns = rootPackageJson.workspaces?.packages ?? [];
  const packageJsonPaths = [];

  for (const pattern of patterns) {
    if (pattern !== "packages/*") continue;

    const packagesRoot = path.join(ROOT, "packages");
    if (!fs.existsSync(packagesRoot)) continue;

    const dirs = fs.readdirSync(packagesRoot, { withFileTypes: true });
    for (const dirent of dirs) {
      if (!dirent.isDirectory()) continue;
      const pkgPath = path.join(packagesRoot, dirent.name, "package.json");
      if (fs.existsSync(pkgPath)) {
        packageJsonPaths.push(pkgPath);
      }
    }
  }

  return packageJsonPaths;
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

function isCaretRange(version) {
  return typeof version === "string" && version.startsWith("^");
}

function normalizeVersion(version) {
  if (typeof version !== "string") return "";
  if (version.startsWith("^")) return version.slice(1);
  return version;
}

function collectRecords(manifests) {
  const byDep = new Map();

  for (const manifest of manifests) {
    for (const field of DEP_FIELDS) {
      const deps = manifest.packageJson[field] ?? {};
      for (const [depName, version] of Object.entries(deps)) {
        if (!byDep.has(depName)) byDep.set(depName, []);
        byDep.get(depName).push({
          manifestName: manifest.name,
          manifestPath: manifest.path,
          field,
          version,
        });
      }
    }
  }

  return byDep;
}

function unique(values) {
  return [...new Set(values)];
}

function getSharedDeps(recordsByDep) {
  const shared = new Set();

  for (const [depName, records] of recordsByDep.entries()) {
    if (isInternalDep(depName)) continue;
    const manifestNames = unique(records.map((r) => r.manifestName));
    if (manifestNames.length >= 2) {
      shared.add(depName);
    }
  }

  return shared;
}

function pickCatalogVersion(depName, recordsByDep, currentCatalogValue) {
  const current = normalizeVersion(currentCatalogValue);
  if (current) return current;

  const records = recordsByDep.get(depName) ?? [];
  const candidates = records
    .map((r) => r.version)
    .filter((v) => !isWorkspaceRange(v) && !isCatalogRange(v))
    .map((v) => normalizeVersion(v));
  const resolved = unique(candidates.filter(Boolean));

  if (resolved.length === 1) return resolved[0];
  return "";
}

function getManifestByName(manifests, name) {
  return manifests.find((m) => m.name === name);
}

function main() {
  const args = parseArgs(process.argv);

  if (!fs.existsSync(ROOT_PACKAGE_PATH)) {
    console.error("Cannot find root package.json");
    process.exit(1);
  }

  const rootPackageJson = readJson(ROOT_PACKAGE_PATH);
  const workspacePaths = listWorkspacePackageJsonPaths(rootPackageJson);

  const manifests = [
    {
      name: rootPackageJson.name ?? "root",
      path: ROOT_PACKAGE_PATH,
      packageJson: rootPackageJson,
    },
    ...workspacePaths.map((pkgPath) => {
      const pkg = readJson(pkgPath);
      return {
        name: pkg.name ?? path.basename(path.dirname(pkgPath)),
        path: pkgPath,
        packageJson: pkg,
      };
    }),
  ];

  const workspaceTarget = args.workspace.trim();
  if (workspaceTarget && !getManifestByName(manifests, workspaceTarget)) {
    console.error(`Workspace not found: ${workspaceTarget}`);
    process.exit(1);
  }

  const recordsByDep = collectRecords(manifests);
  const sharedDeps = getSharedDeps(recordsByDep);

  const catalog = rootPackageJson.workspaces?.catalog ?? {};
  const catalogFixes = [];
  const manifestFixes = [];
  const unresolved = [];

  for (const [depName, catalogValue] of Object.entries(catalog)) {
    if (!isCaretRange(catalogValue)) continue;

    const next = normalizeVersion(catalogValue);
    if (!next) {
      unresolved.push(
        `catalog ${depName} has unsupported range: ${catalogValue}`,
      );
      continue;
    }

    catalogFixes.push({ depName, from: catalogValue, to: next });
    if (args.write) {
      catalog[depName] = next;
    }
  }

  for (const manifest of manifests) {
    if (
      workspaceTarget &&
      manifest.name !== workspaceTarget &&
      manifest.path !== ROOT_PACKAGE_PATH
    ) {
      continue;
    }

    for (const field of DEP_FIELDS) {
      const deps = manifest.packageJson[field];
      if (!deps) continue;

      for (const [depName, rawVersion] of Object.entries(deps)) {
        if (isInternalDep(depName) || isWorkspaceRange(rawVersion)) continue;

        let desired = rawVersion;

        if (sharedDeps.has(depName)) {
          const catalogVersion = pickCatalogVersion(
            depName,
            recordsByDep,
            catalog[depName],
          );

          if (!catalogVersion) {
            unresolved.push(
              `${depName} has conflicting shared versions and cannot be auto-cataloged`,
            );
            continue;
          }

          if (catalog[depName] !== catalogVersion) {
            catalogFixes.push({
              depName,
              from: catalog[depName] ?? "(missing)",
              to: catalogVersion,
            });
            if (args.write) {
              catalog[depName] = catalogVersion;
            }
          }

          desired = "catalog:";
        } else if (isCaretRange(rawVersion)) {
          const staticVersion = normalizeVersion(rawVersion);
          if (!staticVersion) {
            unresolved.push(
              `${manifest.name} ${field}.${depName} has unsupported range: ${rawVersion}`,
            );
            continue;
          }
          desired = staticVersion;
        }

        if (desired !== rawVersion) {
          manifestFixes.push({
            manifestName: manifest.name,
            field,
            depName,
            from: rawVersion,
            to: desired,
          });
          if (args.write) {
            deps[depName] = desired;
          }
        }
      }
    }
  }

  const hasViolations =
    manifestFixes.length > 0 ||
    catalogFixes.length > 0 ||
    unresolved.length > 0;

  console.log("Dependency policy summary");
  console.log(`- workspace scope: ${workspaceTarget || "all"}`);
  console.log(`- catalog fixes needed: ${catalogFixes.length}`);
  console.log(`- manifest fixes needed: ${manifestFixes.length}`);
  console.log(`- unresolved conflicts: ${unresolved.length}`);

  if (catalogFixes.length > 0) {
    console.log("\nCatalog updates:");
    for (const item of catalogFixes) {
      console.log(`- ${item.depName}: ${item.from} -> ${item.to}`);
    }
  }

  if (manifestFixes.length > 0) {
    console.log("\nManifest updates:");
    for (const item of manifestFixes) {
      console.log(
        `- ${item.manifestName} ${item.field}.${item.depName}: ${item.from} -> ${item.to}`,
      );
    }
  }

  if (unresolved.length > 0) {
    console.log("\nUnresolved:");
    for (const item of unresolved) {
      console.log(`- ${item}`);
    }
  }

  if (args.write) {
    if (catalogFixes.length > 0) {
      rootPackageJson.workspaces = rootPackageJson.workspaces ?? {};
      rootPackageJson.workspaces.catalog = catalog;
      writeJson(ROOT_PACKAGE_PATH, rootPackageJson);
    }

    const touched = new Set(manifestFixes.map((item) => item.manifestName));
    for (const name of touched) {
      const manifest = getManifestByName(manifests, name);
      if (manifest && manifest.path !== ROOT_PACKAGE_PATH) {
        writeJson(manifest.path, manifest.packageJson);
      }
    }
  }

  if (!args.write && hasViolations) {
    console.error(
      "\nDependency policy failed. Run with --write to apply safe fixes.",
    );
    process.exit(1);
  }

  if (args.write && unresolved.length > 0) {
    console.error("\nPolicy partially applied. Resolve conflicts manually.");
    process.exit(1);
  }

  console.log(
    args.write ? "\nDependency policy applied." : "\nDependency policy passed.",
  );
}

main();
