#!/usr/bin/env node

/**
 * Plugin CLI for NARA boilerplate
 * 
 * Usage:
 *   bun plugin list                 - List all plugins
 *   bun plugin enable <id>          - Enable a plugin
 *   bun plugin disable <id>         - Disable a plugin
 *   bun plugin info <id>            - Show plugin information
 *   bun plugin create <name>        - Create a new plugin template
 */

import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";

const command = process.argv[2];
const arg = process.argv[3];

async function main() {
  try {
    // Dynamically import plugin system to avoid build-time issues
    const { pluginManager, pluginRegistry, getPluginInfo } = await import("../../app/lib/plugins");
    
    // Initialize plugin system
    await pluginManager.registerDiscoveredPlugins();

    switch (command) {
      case "list":
        await listPlugins(getPluginInfo);
        break;
      case "enable":
        await enablePlugin(arg, pluginRegistry);
        break;
      case "disable":
        await disablePlugin(arg, pluginRegistry);
        break;
      case "info":
        await showPluginInfo(arg, pluginRegistry);
        break;
      case "create":
        await createPlugin(arg);
        break;
      default:
        showHelp();
    }
  } catch (error) {
    console.error("Error:", error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

async function listPlugins(getPluginInfo: any) {
  const plugins = getPluginInfo();
  
  if (plugins.length === 0) {
    console.log("No plugins found.");
    return;
  }

  console.log("\n📦 Installed Plugins:\n");
  console.log("ID".padEnd(20) + "Name".padEnd(25) + "Version".padEnd(10) + "Type".padEnd(12) + "Status");
  console.log("-".repeat(80));
  
  for (const plugin of plugins) {
    const status = plugin.enabled ? "✅ Enabled" : "⭕ Disabled";
    console.log(
      plugin.id.padEnd(20) +
      plugin.name.padEnd(25) +
      plugin.version.padEnd(10) +
      plugin.type.padEnd(12) +
      status
    );
  }
  
  console.log(`\nTotal: ${plugins.length} plugins (${plugins.filter(p => p.enabled).length} enabled)\n`);
}

async function enablePlugin(id: string, pluginRegistry: any) {
  if (!id) {
    console.error("Please specify a plugin ID");
    return;
  }

  try {
    pluginRegistry.enable(id);
    console.log(`✅ Plugin '${id}' enabled successfully`);
  } catch (error) {
    console.error(`❌ Failed to enable plugin '${id}':`, error instanceof Error ? error.message : String(error));
  }
}

async function disablePlugin(id: string, pluginRegistry: any) {
  if (!id) {
    console.error("Please specify a plugin ID");
    return;
  }

  try {
    pluginRegistry.disable(id);
    console.log(`⭕ Plugin '${id}' disabled successfully`);
  } catch (error) {
    console.error(`❌ Failed to disable plugin '${id}':`, error instanceof Error ? error.message : String(error));
  }
}

async function showPluginInfo(id: string, pluginRegistry: any) {
  if (!id) {
    console.error("Please specify a plugin ID");
    return;
  }

  const plugin = pluginRegistry.getPlugin(id);
  if (!plugin) {
    console.error(`Plugin '${id}' not found`);
    return;
  }

  console.log(`\n📦 Plugin Information:\n`);
  console.log(`ID: ${plugin.config.id}`);
  console.log(`Name: ${plugin.config.name}`);
  console.log(`Description: ${plugin.config.description}`);
  console.log(`Version: ${plugin.config.version}`);
  console.log(`Author: ${plugin.config.author}`);
  console.log(`Type: ${plugin.config.type}`);
  console.log(`Status: ${plugin.config.enabled ? "✅ Enabled" : "⭕ Disabled"}`);
  
  if (plugin.config.dependencies && plugin.config.dependencies.length > 0) {
    console.log(`Dependencies: ${plugin.config.dependencies.join(", ")}`);
  }
  
  console.log(`\nCapabilities:`);
  console.log(`  Routes: ${plugin.routes ? "✅" : "❌"}`);
  console.log(`  API: ${plugin.api ? "✅" : "❌"}`);
  console.log(`  Database: ${plugin.database ? "✅" : "❌"}`);
  console.log(`  Components: ${plugin.components ? "✅" : "❌"}`);
  console.log();
}

async function createPlugin(name: string) {
  if (!name) {
    console.error("Please specify a plugin name");
    return;
  }

  const pluginId = name.toLowerCase().replace(/[^a-z0-9-]/g, "-");
  const pluginDir = join("plugins", pluginId);

  if (existsSync(pluginDir)) {
    console.error(`Plugin directory '${pluginDir}' already exists`);
    return;
  }

  // Create plugin directory
  mkdirSync(pluginDir, { recursive: true });

  // Create plugin.config.ts
  const configContent = `import type { PluginConfig } from "~/lib/plugins/types";

export const config: PluginConfig = {
  id: "${pluginId}",
  name: "${name}",
  description: "Description for ${name}",
  version: "1.0.0",
  author: "Your Name",
  type: "feature",
  enabled: true,
  dependencies: [],
  entry: "./index.ts"
};

export default config;`;

  writeFileSync(join(pluginDir, "plugin.config.ts"), configContent);

  // Create index.ts
  const indexContent = `import type { Plugin } from "~/lib/plugins/types";
import { config } from "./plugin.config";

export const plugin: Plugin = {
  config,
  
  // Plugin initialization
  async init(context) {
    console.log(\`Initializing \${config.name} plugin v\${config.version}\`);
    
    // Add your initialization logic here
  },

  // Plugin cleanup
  async destroy() {
    console.log(\`Cleaning up \${config.name} plugin\`);
    
    // Add your cleanup logic here
  }
};

export default plugin;`;

  writeFileSync(join(pluginDir, "index.ts"), indexContent);

  console.log(`✅ Plugin '${name}' created successfully at '${pluginDir}'`);
  console.log("\nNext steps:");
  console.log(`1. Edit ${pluginDir}/plugin.config.ts to configure your plugin`);
  console.log(`2. Edit ${pluginDir}/index.ts to implement your plugin`);
  console.log(`3. Run 'bun plugin list' to see your plugin`);
  console.log(`4. Run 'bun plugin enable ${pluginId}' to enable it`);
}

function showHelp() {
  console.log(`
📦 NARA Plugin CLI

Usage: bun plugin <command> [arguments]

Commands:
  list                    List all plugins
  enable <id>             Enable a plugin
  disable <id>            Disable a plugin
  info <id>               Show plugin information
  create <name>           Create a new plugin template

Examples:
  bun plugin list
  bun plugin enable landing-page
  bun plugin disable showcases
  bun plugin info landing-page
  bun plugin create my-awesome-feature
`);
}

main().catch(console.error);