import type { 
  Plugin, 
  PluginConfig,
  PluginManager as IPluginManager,
  PluginInstallationStatus,
  InstallOptions,
  PluginSearchOptions,
  RemotePluginInfo,
  PluginPackage,
  PluginSource
} from "./types";
import { pluginRegistry } from "./registry";
import { defaultRegistryClient, createRegistryClient } from "./remote-registry";

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
   * Install a plugin from a source
   */
  async install(source: string, options: InstallOptions = {}): Promise<PluginInstallationStatus> {
    try {
      console.log(`Installing plugin from: ${source}`);
      
      // Determine source type
      const sourceInfo = this.parseSource(source);
      
      switch (sourceInfo.type) {
        case "npm":
          return await this.installFromNpm(sourceInfo, options);
        case "git":
          return await this.installFromGit(sourceInfo, options);
        case "url":
          return await this.installFromUrl(sourceInfo, options);
        case "local":
          return await this.installFromLocal(sourceInfo, options);
        default:
          throw new Error(`Unsupported source type: ${sourceInfo.type}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`Failed to install plugin from '${source}':`, errorMessage);
      
      return {
        id: this.extractIdFromSource(source),
        installed: false,
        enabled: false,
        error: errorMessage,
        source: this.parseSource(source)
      };
    }
  }

  /**
   * Install plugin from npm registry
   */
  private async installFromNpm(source: PluginSource, options: InstallOptions): Promise<PluginInstallationStatus> {
    if (!source.url) {
      throw new Error("NPM source missing package name");
    }

    const registryClient = options.registry ? 
      createRegistryClient("custom", options.registry) : 
      defaultRegistryClient;

    // Get plugin info
    const pluginInfo = await registryClient.getPlugin(source.url, options.version);
    if (!pluginInfo) {
      throw new Error(`Plugin '${source.url}' not found in registry`);
    }

    // Check if already installed
    const existingStatus = this.getStatus(pluginInfo.id);
    if (existingStatus?.installed && !options.force) {
      if (existingStatus.version === pluginInfo.version) {
        return existingStatus;
      }
      if (!options.force) {
        throw new Error(`Plugin '${pluginInfo.id}' is already installed. Use --force to reinstall.`);
      }
    }

    // Download plugin package
    const pluginPackage = await registryClient.download(pluginInfo.id, pluginInfo.version);
    
    // Install plugin locally
    await this.installPluginPackage(pluginPackage, {
      ...source,
      version: pluginInfo.version
    });

    return {
      id: pluginInfo.id,
      installed: true,
      enabled: false,
      version: pluginInfo.version,
      source,
      installedAt: new Date()
    };
  }

  /**
   * Install plugin from git repository
   */
  private async installFromGit(source: PluginSource, options: InstallOptions): Promise<PluginInstallationStatus> {
    if (!source.url) {
      throw new Error("Git source missing repository URL");
    }

    // This would require git operations - for now, throw an error
    throw new Error("Git installation not implemented yet. Use npm packages or local files.");
  }

  /**
   * Install plugin from URL
   */
  private async installFromUrl(source: PluginSource, options: InstallOptions): Promise<PluginInstallationStatus> {
    if (!source.url) {
      throw new Error("URL source missing download URL");
    }

    // Download from URL
    const response = await fetch(source.url);
    if (!response.ok) {
      throw new Error(`Failed to download from URL: ${response.statusText}`);
    }

    const buffer = await response.arrayBuffer();
    
    // Extract and install (simplified - would need proper extraction logic)
    throw new Error("URL installation not fully implemented yet. Use npm packages or local files.");
  }

  /**
   * Install plugin from local path
   */
  private async installFromLocal(source: PluginSource, options: InstallOptions): Promise<PluginInstallationStatus> {
    if (!source.url) {
      throw new Error("Local source missing file path");
    }

    const pluginPath = source.url;
    
    // Load plugin from local path
    const plugin = await this.loadPluginFromPath(pluginPath);
    if (!plugin) {
      throw new Error(`Failed to load plugin from '${pluginPath}'`);
    }

    // Register with plugin system
    pluginRegistry.register(plugin);

    return {
      id: plugin.config.id,
      installed: true,
      enabled: plugin.config.enabled,
      version: plugin.config.version,
      source,
      installedAt: new Date()
    };
  }

  /**
   * Install plugin package to local filesystem
   */
  private async installPluginPackage(pluginPackage: PluginPackage, source: PluginSource): Promise<void> {
    if (typeof window !== "undefined" || typeof process === "undefined") {
      throw new Error("Plugin installation only supported in Node.js environment");
    }

    const fs = await import("fs");
    const path = await import("path");

    const pluginDir = path.join(this.pluginsDir, pluginPackage.config.id);

    // Create plugin directory
    if (!fs.existsSync(pluginDir)) {
      fs.mkdirSync(pluginDir, { recursive: true });
    }

    // Write plugin files
    for (const [filename, content] of Object.entries(pluginPackage.files)) {
      const filePath = path.join(pluginDir, filename);
      const dir = path.dirname(filePath);
      
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(filePath, content, "utf-8");
    }

    // Write source metadata
    const metadataPath = path.join(pluginDir, ".plugin-source.json");
    fs.writeFileSync(metadataPath, JSON.stringify(source, null, 2));

    console.log(`Plugin '${pluginPackage.config.id}' installed to ${pluginDir}`);
  }

  /**
   * Load plugin from filesystem path
   */
  private async loadPluginFromPath(pluginPath: string): Promise<Plugin | null> {
    if (typeof window !== "undefined" || typeof process === "undefined") {
      return null;
    }

    try {
      const path = await import("path");
      const fs = await import("fs");

      // Resolve absolute path
      const absolutePath = path.resolve(pluginPath);
      
      if (!fs.existsSync(absolutePath)) {
        throw new Error(`Plugin path does not exist: ${absolutePath}`);
      }

      // Check if it's a directory or file
      const stats = fs.statSync(absolutePath);
      
      if (stats.isDirectory()) {
        // Load from directory
        return await this.loadPlugin(path.basename(absolutePath));
      } else if (absolutePath.endsWith(".tgz") || absolutePath.endsWith(".tar.gz")) {
        // Extract and load from tarball
        throw new Error("Tarball installation not implemented yet");
      } else {
        throw new Error("Unsupported plugin file format");
      }
    } catch (error) {
      console.error(`Failed to load plugin from path '${pluginPath}':`, error);
      return null;
    }
  }

  /**
   * Parse plugin source string
   */
  private parseSource(source: string): PluginSource {
    // npm package: @scope/name or package-name
    if (source.match(/^[@a-z0-9-_]+\/[a-z0-9-_]+$/) || source.match(/^[a-z0-9-_]+$/)) {
      return { type: "npm", url: source };
    }

    // git repository
    if (source.startsWith("git+") || source.includes("github.com") || source.includes(".git")) {
      return { type: "git", url: source };
    }

    // http/https URL
    if (source.startsWith("http://") || source.startsWith("https://")) {
      return { type: "url", url: source };
    }

    // local file/directory
    if (source.startsWith("./") || source.startsWith("/") || source.startsWith("~/")) {
      return { type: "local", url: source };
    }

    // default to npm
    return { type: "npm", url: source };
  }

  /**
   * Extract plugin ID from source string
   */
  private extractIdFromSource(source: string): string {
    const parsed = this.parseSource(source);
    
    if (parsed.type === "npm" && parsed.url) {
      // Extract from npm package name
      if (parsed.url.includes("/")) {
        return parsed.url.split("/").pop() || source;
      }
      return parsed.url;
    }

    if (parsed.type === "git" && parsed.url) {
      // Extract from git URL
      const match = parsed.url.match(/\/([^\/]+)(?:\.git)?$/);
      return match ? match[1] : source;
    }

    return source;
  }

  /**
   * Search remote plugins
   */
  async search(options: PluginSearchOptions): Promise<RemotePluginInfo[]> {
    try {
      return await defaultRegistryClient.search(options);
    } catch (error) {
      console.error("Plugin search failed:", error);
      return [];
    }
  }

  /**
   * Publish plugin to registry
   */
  async publish(pluginPath: string, registry?: string): Promise<boolean> {
    try {
      const pluginPackage = await this.package(pluginPath);
      const registryClient = registry ? 
        createRegistryClient("custom", registry) : 
        defaultRegistryClient;

      // Note: Real publishing would require authentication
      return await registryClient.publish(pluginPackage, {});
    } catch (error) {
      console.error("Plugin publishing failed:", error);
      return false;
    }
  }

  /**
   * Package plugin for distribution
   */
  async package(pluginPath: string): Promise<PluginPackage> {
    if (typeof window !== "undefined" || typeof process === "undefined") {
      throw new Error("Plugin packaging only supported in Node.js environment");
    }

    const fs = await import("fs");
    const path = await import("path");

    const absolutePath = path.resolve(pluginPath);
    
    if (!fs.existsSync(absolutePath)) {
      throw new Error(`Plugin path does not exist: ${absolutePath}`);
    }

    // Load plugin configuration
    const configPath = path.join(absolutePath, "plugin.config.ts");
    if (!fs.existsSync(configPath)) {
      throw new Error("Plugin missing plugin.config.ts");
    }

    const configModule = await import(configPath);
    const config: PluginConfig = configModule.default || configModule.config;

    // Read all plugin files
    const files: Record<string, string> = {};
    const pluginFiles = this.getPluginFiles(absolutePath);

    for (const file of pluginFiles) {
      const filePath = path.join(absolutePath, file);
      if (fs.existsSync(filePath)) {
        files[file] = fs.readFileSync(filePath, "utf-8");
      }
    }

    // Create manifest
    const manifest = {
      name: config.name,
      version: config.version,
      description: config.description,
      author: config.author,
      files: pluginFiles,
      checksum: this.calculateChecksum(files)
    };

    return {
      config,
      files,
      manifest
    };
  }

  /**
   * Get list of files to include in plugin package
   */
  private getPluginFiles(pluginPath: string): string[] {
    const fs = require("fs");
    const path = require("path");

    const files: string[] = [];
    const entries = fs.readdirSync(pluginPath, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.name.startsWith(".")) continue; // Skip hidden files
      
      if (entry.isFile()) {
        files.push(entry.name);
      } else if (entry.isDirectory() && ["routes", "api", "components", "database"].includes(entry.name)) {
        // Include specific plugin directories
        const subFiles = this.getPluginFilesRecursive(path.join(pluginPath, entry.name), entry.name);
        files.push(...subFiles);
      }
    }

    return files;
  }

  /**
   * Recursively get plugin files
   */
  private getPluginFilesRecursive(dirPath: string, basePath: string): string[] {
    const fs = require("fs");
    const path = require("path");

    const files: string[] = [];
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const relativePath = path.join(basePath, entry.name);
      
      if (entry.isFile()) {
        files.push(relativePath);
      } else if (entry.isDirectory()) {
        const subFiles = this.getPluginFilesRecursive(
          path.join(dirPath, entry.name), 
          relativePath
        );
        files.push(...subFiles);
      }
    }

    return files;
  }

  /**
   * Calculate checksum for plugin files
   */
  private calculateChecksum(files: Record<string, string>): string {
    // Simple checksum calculation - in production, use proper hashing
    const content = Object.entries(files)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([name, content]) => `${name}:${content}`)
      .join("|");

    // Simple hash function (not cryptographically secure)
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return Math.abs(hash).toString(16);
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