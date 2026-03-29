import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const UI_ROOT = process.cwd();
const COMPONENTS_DIR = path.join(UI_ROOT, "src", "components", "ui");
const METADATA_PATH = path.join(UI_ROOT, ".component-metadata.json");

function formatDate(value) {
  const yyyy = value.getUTCFullYear();
  const mm = String(value.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(value.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function toPascalCase(input) {
  return input
    .split("-")
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join("");
}

function isKebabCase(value) {
  return /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(value);
}

function ensureMetadataFile() {
  if (!fs.existsSync(METADATA_PATH)) {
    const initial = {
      $schema: "./components.json",
      components: {},
    };
    fs.writeFileSync(
      METADATA_PATH,
      `${JSON.stringify(initial, null, 2)}\n`,
      "utf8",
    );
  }
}

function createComponentFile(componentName) {
  const pascalName = toPascalCase(componentName);
  const componentFile = path.join(COMPONENTS_DIR, `${componentName}.tsx`);

  if (fs.existsSync(componentFile)) {
    throw new Error(`Component already exists: ${componentName}`);
  }

  const template = `import { cn } from "@/lib/utils";

type ${pascalName}Props = React.ComponentProps<"div">;

export function ${pascalName}({ className, ...props }: ${pascalName}Props) {
  return (
    <div
      data-slot="${componentName}"
      className={cn("", className)}
      {...props}
    />
  );
}
`;

  fs.writeFileSync(componentFile, template, "utf8");
}

function updateMetadata(componentName) {
  ensureMetadataFile();

  const metadata = JSON.parse(fs.readFileSync(METADATA_PATH, "utf8"));
  const today = formatDate(new Date());

  metadata.components ??= {};
  metadata.components[componentName] = {
    source: "manual",
    style: "radix-vega",
    lastSync: today,
    notes: "Created via packages/ui/scripts/add-component.mjs",
  };

  const sorted = Object.fromEntries(
    Object.entries(metadata.components).sort((a, b) =>
      a[0].localeCompare(b[0]),
    ),
  );
  metadata.components = sorted;

  fs.writeFileSync(
    METADATA_PATH,
    `${JSON.stringify(metadata, null, 2)}\n`,
    "utf8",
  );
}

function runSyncExports() {
  const result = spawnSync("node", ["scripts/sync-exports.mjs"], {
    cwd: UI_ROOT,
    stdio: "inherit",
    shell: true,
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function main() {
  const componentName = process.argv[2];

  if (!componentName) {
    console.error("Usage: bun run ui:add -- <component-name>");
    process.exit(1);
  }

  if (!isKebabCase(componentName)) {
    console.error("Component name must be kebab-case, for example: stats-card");
    process.exit(1);
  }

  if (!fs.existsSync(COMPONENTS_DIR)) {
    console.error("Cannot find packages/ui component directory");
    process.exit(1);
  }

  createComponentFile(componentName);
  updateMetadata(componentName);
  runSyncExports();

  console.log(`Component created: src/components/ui/${componentName}.tsx`);
  console.log("Updated: package exports/files and .component-metadata.json");
}

main();
