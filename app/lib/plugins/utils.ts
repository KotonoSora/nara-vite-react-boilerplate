import type { RouteConfig } from "@react-router/dev/routes";
import type { Hono } from "hono";
import type { Plugin } from "./types";
import { pluginRegistry } from "./registry";

/**
 * Plugin utilities for integrating with React Router and Hono
 */

/**
 * Generate dynamic routes from enabled plugins
 * Note: This is simplified for now and would need more sophisticated
 * route handling in a production system
 */
export function generatePluginRoutes(): RouteConfig {
  const enabledPlugins = pluginRegistry.getEnabledPlugins();
  const routes: RouteConfig = [];

  for (const plugin of enabledPlugins) {
    if (plugin.routes?.routes) {
      // This is a simplified implementation
      // In practice, you'd need more sophisticated route merging
      console.log(`Plugin '${plugin.config.name}' provides routes`);
    }
  }

  return routes;
}

/**
 * Register plugin API routes with a Hono app
 */
export function registerPluginAPIs(app: Hono<any>): void {
  const enabledPlugins = pluginRegistry.getEnabledPlugins();

  for (const plugin of enabledPlugins) {
    if (plugin.api?.app) {
      const basePath = plugin.api.basePath || `/${plugin.config.id}`;
      app.route(basePath, plugin.api.app);
      console.log(`Registered API routes for plugin '${plugin.config.name}' at '${basePath}'`);
    }
  }
}

/**
 * Collect all plugin database schemas
 */
export function collectPluginSchemas(): Record<string, any> {
  const enabledPlugins = pluginRegistry.getEnabledPlugins();
  const schemas: Record<string, any> = {};

  for (const plugin of enabledPlugins) {
    if (plugin.database?.schema) {
      // Merge plugin schemas with namespace prefix
      for (const [key, value] of Object.entries(plugin.database.schema)) {
        const namespacedKey = `${plugin.config.id}_${key}`;
        schemas[namespacedKey] = value;
      }
    }
  }

  return schemas;
}

/**
 * Get all plugin components
 */
export function getPluginComponents(): Record<string, React.ComponentType<any>> {
  const enabledPlugins = pluginRegistry.getEnabledPlugins();
  const components: Record<string, React.ComponentType<any>> = {};

  for (const plugin of enabledPlugins) {
    if (plugin.components?.components) {
      // Merge plugin components with namespace prefix
      for (const [key, component] of Object.entries(plugin.components.components)) {
        const namespacedKey = `${plugin.config.id}/${key}`;
        components[namespacedKey] = component;
      }
    }
  }

  return components;
}

/**
 * Get plugin component by namespaced name
 */
export function getPluginComponent(name: string): React.ComponentType<any> | undefined {
  const components = getPluginComponents();
  return components[name];
}

/**
 * Get all migration files from enabled plugins
 */
export function getPluginMigrations(): Array<{ plugin: string; file: string }> {
  const enabledPlugins = pluginRegistry.getEnabledPlugins();
  const migrations: Array<{ plugin: string; file: string }> = [];

  for (const plugin of enabledPlugins) {
    if (plugin.database?.migrations) {
      for (const migration of plugin.database.migrations) {
        migrations.push({
          plugin: plugin.config.id,
          file: migration
        });
      }
    }
  }

  return migrations;
}

/**
 * Validate plugin routes for conflicts
 */
export function validatePluginRoutes(): { valid: boolean; conflicts: string[] } {
  const enabledPlugins = pluginRegistry.getEnabledPlugins();
  const routes = new Set<string>();
  const conflicts: string[] = [];

  for (const plugin of enabledPlugins) {
    if (plugin.routes?.routes) {
      // Simplified route validation
      const basePath = plugin.routes.basePath || `/${plugin.config.id}`;
      
      if (routes.has(basePath)) {
        conflicts.push(`Route conflict: '${basePath}' (plugin: ${plugin.config.name})`);
      } else {
        routes.add(basePath);
      }
    }
  }

  return {
    valid: conflicts.length === 0,
    conflicts
  };
}

/**
 * Validate plugin API routes for conflicts
 */
export function validatePluginAPIs(): { valid: boolean; conflicts: string[] } {
  const enabledPlugins = pluginRegistry.getEnabledPlugins();
  const apis = new Set<string>();
  const conflicts: string[] = [];

  for (const plugin of enabledPlugins) {
    if (plugin.api?.basePath) {
      const basePath = plugin.api.basePath;
      
      if (apis.has(basePath)) {
        conflicts.push(`API conflict: '${basePath}' (plugin: ${plugin.config.name})`);
      } else {
        apis.add(basePath);
      }
    }
  }

  return {
    valid: conflicts.length === 0,
    conflicts
  };
}

/**
 * Get plugin metadata for debugging
 */
export function getPluginInfo(): Array<{
  id: string;
  name: string;
  version: string;
  type: string;
  enabled: boolean;
  hasRoutes: boolean;
  hasAPI: boolean;
  hasDatabase: boolean;
  hasComponents: boolean;
}> {
  const allPlugins = pluginRegistry.getPlugins();
  
  return allPlugins.map(plugin => ({
    id: plugin.config.id,
    name: plugin.config.name,
    version: plugin.config.version,
    type: plugin.config.type,
    enabled: pluginRegistry.isEnabled(plugin.config.id),
    hasRoutes: !!plugin.routes,
    hasAPI: !!plugin.api,
    hasDatabase: !!plugin.database,
    hasComponents: !!plugin.components
  }));
}