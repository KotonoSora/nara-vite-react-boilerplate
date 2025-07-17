/**
 * NARA Plugin System
 * 
 * A modular plugin system for the NARA boilerplate that allows features to be
 * installed, enabled, and disabled similar to WordPress plugins.
 * 
 * @example
 * ```typescript
 * import { pluginRegistry, pluginManager } from "~/lib/plugins";
 * 
 * // Discover and register plugins
 * await pluginManager.registerDiscoveredPlugins();
 * 
 * // Initialize plugins
 * await pluginRegistry.initializePlugins(context);
 * ```
 */

// Types
export type * from "./types";

// Core classes
export { PluginRegistry, pluginRegistry } from "./registry";
export { PluginManager, pluginManager } from "./manager";
export { DefaultRegistryClient, createRegistryClient, defaultRegistryClient } from "./remote-registry";

// Utilities
export {
  generatePluginRoutes,
  registerPluginAPIs,
  collectPluginSchemas,
  getPluginComponents,
  getPluginComponent,
  getPluginMigrations,
  validatePluginRoutes,
  validatePluginAPIs,
  getPluginInfo
} from "./utils";

// Import required functions for the initialization
import { pluginManager } from "./manager";
import { pluginRegistry } from "./registry";
import { 
  validatePluginRoutes, 
  validatePluginAPIs, 
  getPluginInfo 
} from "./utils";

/**
 * Initialize the plugin system
 * This should be called during application startup
 */
export async function initializePluginSystem(context?: any): Promise<void> {
  try {
    console.log("Initializing plugin system...");
    
    // Discover and register plugins
    await pluginManager.registerDiscoveredPlugins();
    
    // Validate plugin configuration
    const routeValidation = validatePluginRoutes();
    if (!routeValidation.valid) {
      console.warn("Plugin route conflicts detected:", routeValidation.conflicts);
    }
    
    const apiValidation = validatePluginAPIs();
    if (!apiValidation.valid) {
      console.warn("Plugin API conflicts detected:", apiValidation.conflicts);
    }
    
    // Initialize enabled plugins
    if (context) {
      await pluginRegistry.initializePlugins(context);
    }
    
    const pluginInfo = getPluginInfo();
    console.log(`Plugin system initialized with ${pluginInfo.length} plugins`);
    console.log(`Enabled plugins: ${pluginInfo.filter((p: any) => p.enabled).length}`);
    
  } catch (error) {
    console.error("Failed to initialize plugin system:", error);
    throw error;
  }
}

/**
 * Cleanup plugin system
 * This should be called during application shutdown
 */
export async function cleanupPluginSystem(): Promise<void> {
  try {
    console.log("Cleaning up plugin system...");
    await pluginRegistry.destroyPlugins();
    console.log("Plugin system cleanup complete");
  } catch (error) {
    console.error("Failed to cleanup plugin system:", error);
  }
}