import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const skipRemove = args.includes("--skip-remove");
const withInit = args.includes("--with-init");
const skipInit = args.includes("--skip-init") || !withInit;
const SCRIPT_PATH = fileURLToPath(import.meta.url);
const SCRIPT_DIR = path.dirname(SCRIPT_PATH);
const UI_ROOT = path.resolve(SCRIPT_DIR, "..");
const REPO_ROOT = path.resolve(UI_ROOT, "..", "..");
const POLICY_SCRIPT_PATH = path.join(
  REPO_ROOT,
  "scripts",
  "deps-policy-enforce.mjs",
);
const SONNER_PATH = path.join(UI_ROOT, "src", "components", "ui", "sonner.tsx");
const PACKAGE_JSON_PATH = path.join(UI_ROOT, "package.json");

const PACKAGE_DEP_KEYS = [
  "dependencies",
  "devDependencies",
  "peerDependencies",
  "optionalDependencies",
];

function readPackageJson() {
  if (!fs.existsSync(PACKAGE_JSON_PATH)) {
    return null;
  }

  try {
    return JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH, "utf8"));
  } catch {
    return null;
  }
}

function hasNextThemesDependency() {
  const pkg = readPackageJson();
  if (!pkg) {
    return false;
  }

  return PACKAGE_DEP_KEYS.some((key) => Boolean(pkg?.[key]?.["next-themes"]));
}

function removeNextThemesFromManifest() {
  const pkg = readPackageJson();
  if (!pkg) {
    console.warn(
      `Skipped manifest cleanup: file not found at ${PACKAGE_JSON_PATH}`,
    );
    return false;
  }

  let changed = false;

  for (const depKey of PACKAGE_DEP_KEYS) {
    if (pkg?.[depKey]?.["next-themes"]) {
      delete pkg[depKey]["next-themes"];
      changed = true;
    }
  }

  if (!changed) {
    return false;
  }

  if (dryRun) {
    console.log("[dry-run] would remove next-themes from package.json.");
    return true;
  }

  fs.writeFileSync(
    PACKAGE_JSON_PATH,
    `${JSON.stringify(pkg, null, 2)}\n`,
    "utf8",
  );
  console.log("Removed next-themes from package.json.");
  return true;
}

function run(command, commandArgs, options = {}) {
  const effectiveOptions = {
    cwd: UI_ROOT,
    ...options,
  };
  const commandString = `${command} ${commandArgs.join(" ")} (cwd: ${effectiveOptions.cwd})`;

  if (dryRun) {
    console.log(`[dry-run] ${commandString}`);
    return 0;
  }

  const result = spawnSync(command, commandArgs, {
    stdio: "inherit",
    shell: false,
    ...effectiveOptions,
  });

  return result.status ?? 1;
}

function runRequired(command, commandArgs, options = {}) {
  const code = run(command, commandArgs, options);
  if (code !== 0) {
    process.exit(code);
  }
}

function runBestEffort(command, commandArgs, options = {}) {
  const code = run(command, commandArgs, options);
  if (code !== 0) {
    console.warn(
      `Skipped with non-zero exit: ${command} ${commandArgs.join(" ")}`,
    );
  }
}

function applyPostRefreshFixes() {
  if (dryRun) {
    console.log(`[dry-run] apply post-refresh Sonner fixes to ${SONNER_PATH}`);
    console.log(
      "[dry-run] no files are modified. Run without --dry-run to persist fixes.",
    );
    return;
  }

  if (!fs.existsSync(SONNER_PATH)) {
    console.warn(`Skipped Sonner patch: file not found at ${SONNER_PATH}`);
    return;
  }

  const before = fs.readFileSync(SONNER_PATH, "utf8");

  let after = before;
  after = after.replace(
    /import\s+\{[^}]*\buseTheme\b[^}]*\}\s+from\s+["']next-themes["'];?/g,
    'import { Theme, useTheme } from "remix-themes";',
  );
  after = after.replace(
    /import\s+\{\s*useTheme\s*\}\s+from\s+["']remix-themes["'];?/g,
    'import { Theme, useTheme } from "remix-themes";',
  );
  after = after.replace(
    /const\s*\{\s*theme(?:\s*=\s*["'][^"']+["'])?\s*\}\s*=\s*useTheme\(\);?/g,
    "const [theme = Theme.LIGHT] = useTheme();",
  );
  after = after.replace(
    /const\s*\[\s*theme(?:\s*=\s*[^\]]+)?\s*\]\s*=\s*useTheme\(\);?/g,
    "const [theme = Theme.LIGHT] = useTheme();",
  );
  after = after.replace(
    /theme=\{\s*\(\s*theme\s*\?\?\s*["'][^"']+["']\s*\)\s*as\s*ToasterProps\["theme"\]\s*\}/g,
    'theme={theme as ToasterProps["theme"]}',
  );
  after = after.replace(
    /theme=\{\s*theme\s*\}/g,
    'theme={theme as ToasterProps["theme"]}',
  );
  after = after.replace(
    /theme=\{\s*theme\s+as\s+ToasterProps\["theme"\]\s*\}/g,
    'theme={theme as ToasterProps["theme"]}',
  );

  if (before !== after) {
    fs.writeFileSync(SONNER_PATH, after, "utf8");
    console.log("Applied post-refresh Sonner fixes (remix-themes).");
  } else {
    console.log("No post-refresh Sonner fixes needed.");
  }
}

function main() {
  console.log("Running shadcn refresh for packages/ui");
  console.log(`- uiRoot: ${UI_ROOT}`);
  console.log(`- dryRun: ${dryRun}`);
  console.log(`- skipRemove: ${skipRemove}`);
  console.log(`- withInit: ${withInit}`);
  console.log(`- skipInit: ${skipInit}`);

  if (!skipInit) {
    // In workspace packages (without full app framework files), init may fail
    // framework detection. We treat init as best-effort and continue with add.
    runBestEffort("bunx", [
      "--bun",
      "shadcn@latest",
      "init",
      "--base",
      "radix",
      "--template",
      "react-router",
      "--preset",
      "vega",
      "--yes",
      "--no-reinstall",
      "--force",
    ]);
  }

  runRequired("bunx", [
    "--bun",
    "shadcn@latest",
    "add",
    "--all",
    "--overwrite",
    "--yes",
  ]);

  if (!skipRemove) {
    // Keep this best-effort since next-themes may not be present.
    runBestEffort("bun", ["remove", "next-themes"]);
    const removedFromManifest = removeNextThemesFromManifest();

    if (dryRun) {
      if (!removedFromManifest) {
        console.log(
          "[dry-run] next-themes not found in package.json. Nothing to remove.",
        );
      }
    }
  } else {
    console.log("Skipped dependency removal (--skip-remove).");
  }

  if (!dryRun && hasNextThemesDependency()) {
    console.error("next-themes is still declared after refresh.");
    process.exit(1);
  }

  applyPostRefreshFixes();
  runRequired("node", ["scripts/sync-exports.mjs"]);
  runRequired(
    "node",
    [POLICY_SCRIPT_PATH, "--write", "--workspace", "@kotonosora/ui"],
    { cwd: REPO_ROOT },
  );

  console.log(
    "Done. Suggested next step from repo root: bun run deps:validate",
  );
}

main();
