import type { 
  Plugin, 
  PluginRegistry as IPluginRegistry,
  PluginContext 
} from "./types";

/**
 * Default plugin registry implementation
 */
export class PluginRegistry implements IPluginRegistry {
  private plugins = new Map<string, Plugin>();
  private enabledPlugins = new Set<string>();

  /**
   * Get all registered plugins
   */
  getPlugins(): Plugin[] {
    return Array.from(this.plugins.values());
  }

  /**
   * Get plugin by ID
   */
  getPlugin(id: string): Plugin | undefined {
    return this.plugins.get(id);
  }

  /**
   * Register a new plugin
   */
  register(plugin: Plugin): void {
    if (this.plugins.has(plugin.config.id)) {
      throw new Error(`Plugin with ID '${plugin.config.id}' is already registered`);
    }

    // Validate plugin dependencies
    this.validateDependencies(plugin);

    this.plugins.set(plugin.config.id, plugin);
    
    if (plugin.config.enabled) {
      this.enabledPlugins.add(plugin.config.id);
    }

    console.log(`Plugin '${plugin.config.name}' (${plugin.config.id}) registered`);
  }

  /**
   * Unregister a plugin
   */
  unregister(id: string): void {
    const plugin = this.plugins.get(id);
    if (!plugin) {
      throw new Error(`Plugin with ID '${id}' is not registered`);
    }

    // Check if other plugins depend on this one
    this.checkDependents(id);

    this.plugins.delete(id);
    this.enabledPlugins.delete(id);

    console.log(`Plugin '${plugin.config.name}' (${id}) unregistered`);
  }

  /**
   * Get enabled plugins
   */
  getEnabledPlugins(): Plugin[] {
    return Array.from(this.enabledPlugins)
      .map(id => this.plugins.get(id))
      .filter((plugin): plugin is Plugin => plugin !== undefined);
  }

  /**
   * Enable a plugin
   */
  enable(id: string): void {
    const plugin = this.plugins.get(id);
    if (!plugin) {
      throw new Error(`Plugin with ID '${id}' is not registered`);
    }

    // Check if dependencies are enabled
    this.checkDependenciesEnabled(plugin);

    this.enabledPlugins.add(id);
    plugin.config.enabled = true;

    console.log(`Plugin '${plugin.config.name}' (${id}) enabled`);
  }

  /**
   * Disable a plugin
   */
  disable(id: string): void {
    const plugin = this.plugins.get(id);
    if (!plugin) {
      throw new Error(`Plugin with ID '${id}' is not registered`);
    }

    // Check if enabled plugins depend on this one
    this.checkEnabledDependents(id);

    this.enabledPlugins.delete(id);
    plugin.config.enabled = false;

    console.log(`Plugin '${plugin.config.name}' (${id}) disabled`);
  }

  /**
   * Check if plugin is enabled
   */
  isEnabled(id: string): boolean {
    return this.enabledPlugins.has(id);
  }

  /**
   * Initialize all enabled plugins
   */
  async initializePlugins(context: PluginContext): Promise<void> {
    const enabledPlugins = this.getEnabledPlugins();
    
    // Sort plugins by dependencies to ensure proper initialization order
    const sortedPlugins = this.sortPluginsByDependencies(enabledPlugins);

    for (const plugin of sortedPlugins) {
      try {
        if (plugin.init) {
          await plugin.init(context);
          console.log(`Plugin '${plugin.config.name}' initialized`);
        }
      } catch (error) {
        console.error(`Failed to initialize plugin '${plugin.config.name}':`, error);
        throw error;
      }
    }
  }

  /**
   * Destroy all plugins
   */
  async destroyPlugins(): Promise<void> {
    const enabledPlugins = this.getEnabledPlugins();
    
    // Destroy in reverse dependency order
    const sortedPlugins = this.sortPluginsByDependencies(enabledPlugins).reverse();

    for (const plugin of sortedPlugins) {
      try {
        if (plugin.destroy) {
          await plugin.destroy();
          console.log(`Plugin '${plugin.config.name}' destroyed`);
        }
      } catch (error) {
        console.error(`Failed to destroy plugin '${plugin.config.name}':`, error);
      }
    }
  }

  /**
   * Validate plugin dependencies
   */
  private validateDependencies(plugin: Plugin): void {
    if (!plugin.config.dependencies) return;

    for (const depId of plugin.config.dependencies) {
      if (!this.plugins.has(depId)) {
        throw new Error(
          `Plugin '${plugin.config.name}' depends on '${depId}' which is not registered`
        );
      }
    }
  }

  /**
   * Check if dependencies are enabled
   */
  private checkDependenciesEnabled(plugin: Plugin): void {
    if (!plugin.config.dependencies) return;

    for (const depId of plugin.config.dependencies) {
      if (!this.isEnabled(depId)) {
        throw new Error(
          `Plugin '${plugin.config.name}' depends on '${depId}' which is not enabled`
        );
      }
    }
  }

  /**
   * Check if other plugins depend on this one
   */
  private checkDependents(id: string): void {
    for (const plugin of this.plugins.values()) {
      if (plugin.config.dependencies?.includes(id)) {
        throw new Error(
          `Cannot unregister plugin '${id}' because '${plugin.config.name}' depends on it`
        );
      }
    }
  }

  /**
   * Check if enabled plugins depend on this one
   */
  private checkEnabledDependents(id: string): void {
    for (const plugin of this.getEnabledPlugins()) {
      if (plugin.config.dependencies?.includes(id)) {
        throw new Error(
          `Cannot disable plugin '${id}' because enabled plugin '${plugin.config.name}' depends on it`
        );
      }
    }
  }

  /**
   * Sort plugins by dependencies (topological sort)
   */
  private sortPluginsByDependencies(plugins: Plugin[]): Plugin[] {
    const sorted: Plugin[] = [];
    const visited = new Set<string>();
    const visiting = new Set<string>();

    const visit = (plugin: Plugin) => {
      if (visiting.has(plugin.config.id)) {
        throw new Error(`Circular dependency detected involving plugin '${plugin.config.name}'`);
      }
      
      if (visited.has(plugin.config.id)) {
        return;
      }

      visiting.add(plugin.config.id);

      // Visit dependencies first
      if (plugin.config.dependencies) {
        for (const depId of plugin.config.dependencies) {
          const dep = plugins.find(p => p.config.id === depId);
          if (dep) {
            visit(dep);
          }
        }
      }

      visiting.delete(plugin.config.id);
      visited.add(plugin.config.id);
      sorted.push(plugin);
    };

    for (const plugin of plugins) {
      visit(plugin);
    }

    return sorted;
  }
}

/**
 * Global plugin registry instance
 */
export const pluginRegistry = new PluginRegistry();