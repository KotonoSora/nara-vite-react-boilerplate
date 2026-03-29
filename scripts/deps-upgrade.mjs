import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

function parseArgs(argv) {
  const args = {
    check: false,
    dryRun: false,
    target: "",
    scope: "all-using",
  };

  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];

    if (arg === "--check") args.check = true;
    if (arg === "--dry-run") args.dryRun = true;
    if (arg === "--target") args.target = argv[i + 1] ?? "";
    if (arg === "--scope") args.scope = argv[i + 1] ?? "all-using";

    if (arg === "--target" || arg === "--scope") {
      i += 1;
    }
  }

  return args;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function findWorkspaceManifests(rootPackageJson) {
  const manifests = [];
  const packagePatterns = rootPackageJson.workspaces?.packages ?? [];

  for (const pattern of packagePatterns) {
    if (pattern !== "packages/*") continue;

    const packagesRoot = path.join(ROOT, "packages");
    if (!fs.existsSync(packagesRoot)) continue;

    for (const dirent of fs.readdirSync(packagesRoot, {
      withFileTypes: true,
    })) {
      if (!dirent.isDirectory()) continue;
      const pkgPath = path.join(packagesRoot, dirent.name, "package.json");
      if (fs.existsSync(pkgPath)) {
        manifests.push({
          path: pkgPath,
          cwd: path.dirname(pkgPath),
          packageJson: readJson(pkgPath),
        });
      }
    }
  }

  return manifests;
}

function run(command, args, cwd, dryRun) {
  const commandString = `${command} ${args.join(" ")}`;
  if (dryRun) {
    console.log(`[dry-run] ${cwd}: ${commandString}`);
    return 0;
  }

  const result = spawnSync(command, args, {
    cwd,
    stdio: "inherit",
    shell: true,
  });
  return result.status ?? 1;
}

function runOutdated() {
  return (
    spawnSync("bun", ["outdated"], { cwd: ROOT, stdio: "inherit", shell: true })
      .status ?? 1
  );
}

function getDepField(pkgJson, depName) {
  if (pkgJson.dependencies?.[depName]) return "dependencies";
  if (pkgJson.devDependencies?.[depName]) return "devDependencies";
  if (pkgJson.peerDependencies?.[depName]) return "peerDependencies";
  return "";
}

function buildInstallArgs(depSpec, depField) {
  if (depField === "devDependencies") {
    return ["add", "-d", depSpec];
  }

  if (depField === "peerDependencies") {
    return ["add", "--peer", depSpec];
  }

  return ["add", depSpec];
}

function usage() {
  console.log("Usage:");
  console.log("- node scripts/deps-upgrade.mjs --check");
  console.log(
    "- node scripts/deps-upgrade.mjs --target <name@version> [--scope root|all-using|workspace:<pkg>] [--dry-run]",
  );
}

function main() {
  const args = parseArgs(process.argv);
  const rootPackagePath = path.join(ROOT, "package.json");
  const rootPackageJson = readJson(rootPackagePath);

  if (args.check || !args.target) {
    if (!args.check && !args.target) {
      usage();
      console.log("\nRunning check mode because no target was provided.\n");
    }

    const status = runOutdated();
    process.exit(status);
  }

  const depName = args.target.split("@").filter(Boolean)[0];
  if (!depName || !args.target.includes("@")) {
    console.error("Invalid --target. Expected format like react@19.2.4");
    usage();
    process.exit(1);
  }

  const workspaceManifests = findWorkspaceManifests(rootPackageJson);
  const installTargets = [];

  if (args.scope === "root") {
    const depField = getDepField(rootPackageJson, depName) || "dependencies";
    installTargets.push({
      cwd: ROOT,
      depField,
      label: rootPackageJson.name ?? "root",
    });
  } else if (args.scope.startsWith("workspace:")) {
    const workspaceName = args.scope.replace("workspace:", "");
    const found = workspaceManifests.find(
      (m) => m.packageJson.name === workspaceName,
    );

    if (!found) {
      console.error(`Workspace not found: ${workspaceName}`);
      process.exit(1);
    }

    const depField = getDepField(found.packageJson, depName) || "dependencies";
    installTargets.push({ cwd: found.cwd, depField, label: workspaceName });
  } else {
    const rootField = getDepField(rootPackageJson, depName);
    if (rootField) {
      installTargets.push({
        cwd: ROOT,
        depField: rootField,
        label: rootPackageJson.name ?? "root",
      });
    }

    for (const manifest of workspaceManifests) {
      const field = getDepField(manifest.packageJson, depName);
      if (!field) continue;
      installTargets.push({
        cwd: manifest.cwd,
        depField: field,
        label: manifest.packageJson.name ?? manifest.cwd,
      });
    }

    if (installTargets.length === 0) {
      installTargets.push({
        cwd: ROOT,
        depField: "dependencies",
        label: rootPackageJson.name ?? "root",
      });
    }
  }

  console.log(`Preparing upgrade for ${args.target}`);
  console.log(`Scope: ${args.scope}`);
  console.log(`Targets: ${installTargets.map((t) => t.label).join(", ")}`);

  for (const target of installTargets) {
    const installArgs = buildInstallArgs(args.target, target.depField);
    const status = run("bun", installArgs, target.cwd, args.dryRun);
    if (status !== 0) {
      process.exit(status);
    }
  }

  console.log("\nUpgrade command completed.");
  console.log("Recommended next step: bun run deps:validate");
}

main();
