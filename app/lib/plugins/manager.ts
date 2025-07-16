import type { 
  Plugin, 
  PluginConfig,
  PluginManager as IPluginManager,
  PluginInstallationStatus 
} from "./types";
import { pluginRegistry } from "./registry";

/**
 * Plugin discovery and management
 */
export class PluginManager implements IPluginManager {
  private pluginsDir: string;
  private installedPlugins = new Map<string, PluginInstallationStatus>();

  constructor(pluginsDir: string = "./plugins") {
    this.pluginsDir = pluginsDir;
    this.loadInstalledPlugins();
  }

  /**
   * Discover and load all plugins from the plugins directory
   * This is a simplified version that works in both Node.js and browser environments
   */
  async discoverPlugins(): Promise<Plugin[]> {
    const plugins: Plugin[] = [];

    // In a real implementation, you'd use fs operations in Node.js
    // and fetch operations in browser/worker environments
    if (typeof window === "undefined" && typeof process !== "undefined") {
      // Node.js environment (CLI, build tools)
      try {
        const fs = await import("fs");
        const path = await import("path");
        
        if (!fs.existsSync(this.pluginsDir)) {
          console.log(`Plugins directory '${this.pluginsDir}' does not exist`);
          return plugins;
        }

        const pluginDirs = fs.readdirSync(this.pluginsDir, { withFileTypes: true })
          .filter(dirent => dirent.isDirectory())
          .map(dirent => dirent.name);

        for (const pluginDir of pluginDirs) {
          try {
            const plugin = await this.loadPlugin(pluginDir);
            if (plugin) {
              plugins.push(plugin);
            }
          } catch (error) {
            console.error(`Failed to load plugin '${pluginDir}':`, error);
          }
        }
      } catch (error) {
        console.warn("Failed to discover plugins:", error);
      }
    } else {
      // Browser/Worker environment - plugins would be pre-built or fetched differently
      console.log("Plugin discovery not implemented for browser/worker environments");
    }

    return plugins;
  }

  /**
   * Load a specific plugin by directory name
   */
  async loadPlugin(pluginDir: string): Promise<Plugin | null> {
    if (typeof window !== "undefined" || typeof process === "undefined") {
      // Not in Node.js environment
      return null;
    }

    try {
      const path = await import("path");
      const fs = await import("fs");
      
      const pluginPath = path.join(this.pluginsDir, pluginDir);
      const configPath = path.join(pluginPath, "plugin.config.ts");
      const entryPath = path.join(pluginPath, "index.ts");

      // Check if plugin has required files
      if (!fs.existsSync(configPath)) {
        console.warn(`Plugin '${pluginDir}' missing plugin.config.ts`);
        return null;
      }

      if (!fs.existsSync(entryPath)) {
        console.warn(`Plugin '${pluginDir}' missing index.ts`);
        return null;
      }

      // Import plugin configuration
      const configModule = await import(configPath);
      const config: PluginConfig = configModule.default || configModule.config;

      // Import plugin implementation
      const pluginModule = await import(entryPath);
      const plugin: Plugin = pluginModule.default || pluginModule.plugin;

      // Validate plugin structure
      if (!this.validatePlugin(plugin, config)) {
        console.error(`Plugin '${pluginDir}' failed validation`);
        return null;
      }

      // Merge configuration
      plugin.config = { ...config, ...plugin.config };

      return plugin;
    } catch (error) {
      console.error(`Failed to import plugin '${pluginDir}':`, error);
      return null;
    }
  }

  /**
   * Register discovered plugins with the registry
   */
  async registerDiscoveredPlugins(): Promise<void> {
    const plugins = await this.discoverPlugins();
    
    for (const plugin of plugins) {
      try {
        pluginRegistry.register(plugin);
        this.updatePluginStatus(plugin.config.id, {
          installed: true,
          enabled: plugin.config.enabled,
          version: plugin.config.version
        });
      } catch (error) {
        console.error(`Failed to register plugin '${plugin.config.name}':`, error);
        this.updatePluginStatus(plugin.config.id, {
          installed: true,
          enabled: false,
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }
  }

  /**
   * Install a plugin from a source (placeholder implementation)
   */
  async install(source: string): Promise<PluginInstallationStatus> {
    // This is a simplified implementation
    // In a real scenario, this would download from npm, git, etc.
    throw new Error("Plugin installation from external sources not implemented yet");
  }

  /**
   * Uninstall a plugin
   */
  async uninstall(id: string): Promise<boolean> {
    try {
      pluginRegistry.unregister(id);
      this.installedPlugins.delete(id);
      return true;
    } catch (error) {
      console.error(`Failed to uninstall plugin '${id}':`, error);
      return false;
    }
  }

  /**
   * List all plugin installation statuses
   */
  list(): PluginInstallationStatus[] {
    return Array.from(this.installedPlugins.values());
  }

  /**
   * Update a plugin (placeholder implementation)
   */
  async update(id: string): Promise<PluginInstallationStatus> {
    throw new Error("Plugin updates not implemented yet");
  }

  /**
   * Get plugin installation status
   */
  getStatus(id: string): PluginInstallationStatus | undefined {
    return this.installedPlugins.get(id);
  }

  /**
   * Validate plugin structure
   */
  private validatePlugin(plugin: Plugin, config: PluginConfig): boolean {
    if (!plugin.config && !config) {
      console.error("Plugin missing configuration");
      return false;
    }

    const finalConfig = plugin.config || config;

    if (!finalConfig.id || !finalConfig.name || !finalConfig.version) {
      console.error("Plugin configuration missing required fields (id, name, version)");
      return false;
    }

    return true;
  }

  /**
   * Update plugin installation status
   */
  private updatePluginStatus(id: string, updates: Partial<PluginInstallationStatus>): void {
    const current = this.installedPlugins.get(id) || {
      id,
      installed: false,
      enabled: false
    };

    this.installedPlugins.set(id, { ...current, ...updates });
  }

  /**
   * Load installed plugins from persistent storage
   */
  private loadInstalledPlugins(): void {
    try {
      if (typeof window === "undefined" && typeof process !== "undefined") {
        // Node.js environment only
        const fs = require("fs");
        const path = require("path");
        const statusFile = path.join(this.pluginsDir, ".plugin-status.json");
        
        if (fs.existsSync(statusFile)) {
          const data = JSON.parse(fs.readFileSync(statusFile, "utf-8"));
          for (const [id, status] of Object.entries(data)) {
            this.installedPlugins.set(id, status as PluginInstallationStatus);
          }
        }
      }
    } catch (error) {
      console.warn("Failed to load plugin status:", error);
    }
  }

  /**
   * Save installed plugins to persistent storage
   */
  private saveInstalledPlugins(): void {
    try {
      if (typeof window === "undefined" && typeof process !== "undefined") {
        // Node.js environment only
        const fs = require("fs");
        const path = require("path");
        const statusFile = path.join(this.pluginsDir, ".plugin-status.json");
        const data = Object.fromEntries(this.installedPlugins);
        fs.writeFileSync(statusFile, JSON.stringify(data, null, 2));
      }
    } catch (error) {
      console.warn("Failed to save plugin status:", error);
    }
  }
}

/**
 * Global plugin manager instance
 */
export const pluginManager = new PluginManager();