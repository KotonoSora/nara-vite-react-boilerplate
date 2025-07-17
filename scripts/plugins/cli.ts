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
      case "search":
        await searchPlugins(arg, pluginManager);
        break;
      case "install":
        await installPlugin(arg, process.argv.slice(4), pluginManager);
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
      case "update":
        await updatePlugin(arg, pluginManager);
        break;
      case "publish":
        await publishPlugin(arg, pluginManager);
        break;
      case "package":
        await packagePlugin(arg, pluginManager);
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

async function searchPlugins(query: string, pluginManager: any) {
  if (!query) {
    console.error("Please specify a search query");
    return;
  }

  console.log(`🔍 Searching for plugins: "${query}"\n`);

  try {
    const results = await pluginManager.search({
      query,
      limit: 10,
      sortBy: "downloads",
      sortOrder: "desc"
    });

    if (results.length === 0) {
      console.log("No plugins found matching your query.");
      return;
    }

    console.log("Name".padEnd(25) + "Version".padEnd(10) + "Author".padEnd(20) + "Description");
    console.log("-".repeat(85));

    for (const plugin of results) {
      const truncatedDesc = plugin.description.length > 30 
        ? plugin.description.substring(0, 27) + "..." 
        : plugin.description;
      
      console.log(
        plugin.name.padEnd(25) +
        plugin.version.padEnd(10) +
        plugin.author.padEnd(20) +
        truncatedDesc
      );
    }

    console.log(`\nFound ${results.length} plugins. Use 'bun plugin install <name>' to install.`);
  } catch (error) {
    console.error("Search failed:", error instanceof Error ? error.message : String(error));
  }
}

async function installPlugin(source: string, options: string[], pluginManager: any) {
  if (!source) {
    console.error("Please specify a plugin source (npm package, git repo, or local path)");
    return;
  }

  console.log(`📦 Installing plugin from: ${source}`);

  const installOptions: any = {};
  
  // Parse command line options
  for (let i = 0; i < options.length; i++) {
    const option = options[i];
    switch (option) {
      case "--force":
        installOptions.force = true;
        break;
      case "--dev":
        installOptions.dev = true;
        break;
      case "--version":
        installOptions.version = options[i + 1];
        i++; // Skip next argument
        break;
      case "--registry":
        installOptions.registry = options[i + 1];
        i++; // Skip next argument
        break;
    }
  }

  try {
    const result = await pluginManager.install(source, installOptions);
    
    if (result.installed) {
      console.log(`✅ Plugin '${result.id}' installed successfully!`);
      console.log(`   Version: ${result.version}`);
      console.log(`   Status: ${result.enabled ? "Enabled" : "Disabled"}`);
      
      if (!result.enabled) {
        console.log(`\nTo enable the plugin, run: bun plugin enable ${result.id}`);
      }
    } else {
      console.log(`❌ Plugin installation failed: ${result.error}`);
    }
  } catch (error) {
    console.error("Installation failed:", error instanceof Error ? error.message : String(error));
  }
}

async function updatePlugin(id: string, pluginManager: any) {
  if (!id) {
    console.error("Please specify a plugin ID");
    return;
  }

  console.log(`🔄 Updating plugin: ${id}`);

  try {
    const result = await pluginManager.update(id);
    
    if (result.installed) {
      console.log(`✅ Plugin '${result.id}' updated successfully to version ${result.version}!`);
    } else {
      console.log(`❌ Plugin update failed: ${result.error}`);
    }
  } catch (error) {
    console.error("Update failed:", error instanceof Error ? error.message : String(error));
  }
}

async function publishPlugin(pluginPath: string, pluginManager: any) {
  const path = pluginPath || ".";
  
  console.log(`📤 Publishing plugin from: ${path}`);

  try {
    const success = await pluginManager.publish(path);
    
    if (success) {
      console.log(`✅ Plugin published successfully!`);
      console.log("Note: Publishing to public registries requires proper authentication.");
    } else {
      console.log(`❌ Plugin publishing failed`);
    }
  } catch (error) {
    console.error("Publishing failed:", error instanceof Error ? error.message : String(error));
  }
}

async function packagePlugin(pluginPath: string, pluginManager: any) {
  if (!pluginPath) {
    console.error("Please specify a plugin path");
    return;
  }

  console.log(`📦 Packaging plugin from: ${pluginPath}`);

  try {
    const packageInfo = await pluginManager.package(pluginPath);
    
    console.log(`✅ Plugin packaged successfully!`);
    console.log(`   Name: ${packageInfo.config.name}`);
    console.log(`   Version: ${packageInfo.config.version}`);
    console.log(`   Files: ${Object.keys(packageInfo.files).length}`);
    console.log(`   Checksum: ${packageInfo.manifest.checksum}`);
  } catch (error) {
    console.error("Packaging failed:", error instanceof Error ? error.message : String(error));
  }
}

function showHelp() {
  console.log(`
📦 NARA Plugin CLI

Usage: bun plugin <command> [arguments]

Commands:
  list                    List all installed plugins
  search <query>          Search remote plugins
  install <source>        Install plugin from remote source
  enable <id>             Enable a plugin
  disable <id>            Disable a plugin
  info <id>               Show plugin information
  create <name>           Create a new plugin template
  update <id>             Update a plugin to latest version
  publish [path]          Publish plugin to registry
  package <path>          Package plugin for distribution

Install Sources:
  npm-package             Install from npm (e.g., @nara-plugin/blog)
  username/repo           Install from GitHub
  https://...             Install from URL
  ./local/path            Install from local directory

Install Options:
  --force                 Force reinstall
  --version <ver>         Install specific version
  --registry <url>        Use custom registry

Examples:
  bun plugin list
  bun plugin search "blog"
  bun plugin install @nara-plugin/blog
  bun plugin install username/my-plugin
  bun plugin install ./local-plugin --force
  bun plugin enable landing-page
  bun plugin disable showcases
  bun plugin info landing-page
  bun plugin create "My Awesome Feature"
  bun plugin update blog
  bun plugin publish ./my-plugin
  bun plugin package ./my-plugin
`);
}

main().catch(console.error);