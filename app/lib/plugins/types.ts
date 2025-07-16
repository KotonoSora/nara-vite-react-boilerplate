import type { RouteConfig } from "@react-router/dev/routes";
import type { Hono } from "hono";
import type { DrizzleD1Database } from "drizzle-orm/d1";

/**
 * Plugin configuration and metadata
 */
export interface PluginConfig {
  /** Unique plugin identifier */
  id: string;
  /** Human-readable plugin name */
  name: string;
  /** Plugin description */
  description: string;
  /** Plugin version */
  version: string;
  /** Plugin author */
  author: string;
  /** Plugin dependencies */
  dependencies?: string[];
  /** Plugin type */
  type: PluginType;
  /** Whether plugin is enabled */
  enabled: boolean;
  /** Plugin entry point */
  entry?: string;
}

/**
 * Types of plugins supported
 */
export type PluginType = 
  | "feature"      // Full-featured plugin with routes, API, components
  | "component"    // UI component library
  | "api"          // API endpoints only
  | "theme"        // Styling and theming
  | "utility";     // Helper functions and utilities

/**
 * Plugin routes configuration
 */
export interface PluginRoutes {
  /** Route configuration for React Router */
  routes?: RouteConfig;
  /** Base path for plugin routes */
  basePath?: string;
}

/**
 * Plugin API configuration
 */
export interface PluginAPI {
  /** Hono app instance for API routes */
  app: Hono<any>;
  /** Base path for API routes */
  basePath: string;
}

/**
 * Plugin database schema
 */
export interface PluginDatabase {
  /** Database schema definitions */
  schema: Record<string, any>;
  /** Migration files */
  migrations?: string[];
}

/**
 * Plugin component exports
 */
export interface PluginComponents {
  /** React components exported by the plugin */
  components: Record<string, React.ComponentType<any>>;
  /** Component metadata */
  metadata?: Record<string, ComponentMetadata>;
}

/**
 * Component metadata for plugin components
 */
export interface ComponentMetadata {
  name: string;
  description?: string;
  props?: Record<string, any>;
  category?: string;
}

/**
 * Main plugin interface that all plugins must implement
 */
export interface Plugin {
  /** Plugin configuration */
  config: PluginConfig;
  /** Plugin routes (optional) */
  routes?: PluginRoutes;
  /** Plugin API endpoints (optional) */
  api?: PluginAPI;
  /** Plugin database schema (optional) */
  database?: PluginDatabase;
  /** Plugin components (optional) */
  components?: PluginComponents;
  /** Plugin initialization function */
  init?: (context: PluginContext) => Promise<void> | void;
  /** Plugin cleanup function */
  destroy?: () => Promise<void> | void;
}

/**
 * Context provided to plugins during initialization
 */
export interface PluginContext {
  /** Database instance */
  db?: DrizzleD1Database<any>;
  /** Environment variables */
  env?: Record<string, any>;
  /** Plugin registry */
  registry: PluginRegistry;
}

/**
 * Plugin registry for managing all plugins
 */
export interface PluginRegistry {
  /** Get all registered plugins */
  getPlugins(): Plugin[];
  /** Get plugin by ID */
  getPlugin(id: string): Plugin | undefined;
  /** Register a new plugin */
  register(plugin: Plugin): void;
  /** Unregister a plugin */
  unregister(id: string): void;
  /** Get enabled plugins */
  getEnabledPlugins(): Plugin[];
  /** Enable a plugin */
  enable(id: string): void;
  /** Disable a plugin */
  disable(id: string): void;
  /** Check if plugin is enabled */
  isEnabled(id: string): boolean;
}

/**
 * Plugin installation status
 */
export interface PluginInstallationStatus {
  id: string;
  installed: boolean;
  enabled: boolean;
  version?: string;
  error?: string;
}

/**
 * Plugin manager for installing and managing plugins
 */
export interface PluginManager {
  /** Install a plugin from a source */
  install(source: string): Promise<PluginInstallationStatus>;
  /** Uninstall a plugin */
  uninstall(id: string): Promise<boolean>;
  /** List all available plugins */
  list(): PluginInstallationStatus[];
  /** Update a plugin */
  update(id: string): Promise<PluginInstallationStatus>;
  /** Get plugin status */
  getStatus(id: string): PluginInstallationStatus | undefined;
}