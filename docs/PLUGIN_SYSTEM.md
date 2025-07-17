# NARA Plugin System

The NARA boilerplate includes a powerful plugin system that allows you to create modular, reusable features similar to WordPress plugins. This system enables you to build applications with only the features you need, making the codebase clean and maintainable, and includes full support for remote plugin distribution and sharing.

## Overview

The plugin system provides:

- **Modular Architecture**: Features are self-contained plugins with their own routes, APIs, components, and database schemas
- **Dependency Management**: Plugins can depend on other plugins with automatic validation
- **CLI Management**: Easy plugin installation, enabling, and disabling via command line
- **Type Safety**: Full TypeScript support throughout the plugin system
- **Hot Loading**: Plugins are loaded dynamically at runtime (in development)
- **Remote Distribution**: Install and share plugins over the internet
- **Package Management**: Version control and dependency management
- **Plugin Registry**: Discover plugins through search functionality

## Plugin Structure

Each plugin is a directory in the `plugins/` folder with the following structure:

```
plugins/
  my-plugin/
    plugin.config.ts    # Plugin configuration and metadata
    index.ts           # Main plugin implementation
    routes/            # Plugin-specific routes (optional)
    api/               # Plugin API endpoints (optional)
    components/        # Plugin React components (optional)
    database/          # Plugin database schemas (optional)
```

## Creating a Plugin

### Using the CLI

The easiest way to create a new plugin is using the CLI:

```bash
bun plugin create "My Awesome Feature"
```

This creates a new plugin directory with the basic structure and files.

### Manual Creation

1. Create a plugin directory:
   ```bash
   mkdir plugins/my-plugin
   ```

2. Create `plugin.config.ts`:
   ```typescript
   import type { PluginConfig } from "~/lib/plugins/types";

   export const config: PluginConfig = {
     id: "my-plugin",
     name: "My Plugin",
     description: "Description of what this plugin does",
     version: "1.0.0",
     author: "Your Name",
     type: "feature",
     enabled: true,
     dependencies: [], // Other plugins this one depends on
     entry: "./index.ts"
   };

   export default config;
   ```

3. Create `index.ts`:
   ```typescript
   import type { Plugin } from "~/lib/plugins/types";
   import { config } from "./plugin.config";

   export const plugin: Plugin = {
     config,
     
     // Plugin initialization
     async init(context) {
       console.log(`Initializing ${config.name} plugin v${config.version}`);
       // Add your initialization logic here
     },

     // Plugin cleanup
     async destroy() {
       console.log(`Cleaning up ${config.name} plugin`);
       // Add your cleanup logic here
     }
   };

   export default plugin;
   ```

## Plugin Capabilities

### Routes

Plugins can provide their own React Router routes:

```typescript
export const plugin: Plugin = {
  config,
  
  routes: {
    basePath: "/my-feature",
    routes: [
      {
        path: "/",
        file: "routes/_index.tsx"
      },
      {
        path: "/settings",
        file: "routes/settings.tsx"
      }
    ]
  }
};
```

### API Endpoints

Plugins can provide Hono.js API routes:

```typescript
import { Hono } from "hono";

const api = new Hono();

api.get("/", async (c) => {
  return c.json({ message: "Hello from my plugin!" });
});

api.post("/data", async (c) => {
  const body = await c.req.json();
  // Handle POST request
  return c.json({ success: true });
});

export const plugin: Plugin = {
  config,
  
  api: {
    app: api,
    basePath: "/api/my-plugin"
  }
};
```

### Database Schema

Plugins can define their own database tables:

```typescript
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

const myTable = sqliteTable("my_table", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description")
});

export const plugin: Plugin = {
  config,
  
  database: {
    schema: {
      myTable
    },
    migrations: [
      "001_create_my_table.sql"
    ]
  }
};
```

### Components

Plugins can export React components:

```typescript
import { MyComponent } from "./components/MyComponent";
import { AnotherComponent } from "./components/AnotherComponent";

export const plugin: Plugin = {
  config,
  
  components: {
    components: {
      MyComponent,
      AnotherComponent
    },
    metadata: {
      MyComponent: {
        name: "My Component",
        description: "A reusable component from my plugin",
        category: "ui"
      }
    }
  }
};
```

## Installing Plugins

### From Remote Sources

Install plugins from remote sources like npm, GitHub, or custom registries:

```bash
# Install from npm registry
bun plugin install @nara-plugin/blog

# Install from GitHub
bun plugin install username/nara-blog-plugin

# Install from custom registry
bun plugin install my-plugin --registry https://plugins.example.com

# Install from local directory
bun plugin install ./my-local-plugin
```

### Search Available Plugins

Discover plugins available in remote registries:

```bash
# Search for plugins
bun plugin search "blog"
bun plugin search "ecommerce"
bun plugin search "authentication"
```

### Installation Options

```bash
# Install specific version
bun plugin install @nara-plugin/blog --version 2.1.0

# Force reinstall
bun plugin install @nara-plugin/auth --force

# Install from custom registry
bun plugin install my-plugin --registry https://custom-registry.com
```

For complete documentation on plugin distribution, see [Plugin Distribution Guide](./PLUGIN_DISTRIBUTION.md).

## CLI Commands

The plugin system includes a CLI for managing plugins:

### List All Plugins
```bash
bun plugin list
```

### Enable a Plugin
```bash
bun plugin enable plugin-id
```

### Disable a Plugin
```bash
bun plugin disable plugin-id
```

### Show Plugin Information
```bash
bun plugin info plugin-id
```

### Create a New Plugin
```bash
bun plugin create "Plugin Name"
```

### Update a Plugin
```bash
bun plugin update plugin-id
```

### Publish a Plugin
```bash
bun plugin publish ./my-plugin
```

### Package a Plugin
```bash
bun plugin package ./my-plugin
```

## Plugin Dependencies

Plugins can depend on other plugins. Dependencies are validated automatically:

```typescript
export const config: PluginConfig = {
  id: "my-plugin",
  name: "My Plugin",
  dependencies: ["auth", "database"], // This plugin requires auth and database plugins
  // ... other config
};
```

When enabling a plugin, all its dependencies must be enabled first. When disabling a plugin, you cannot disable it if other enabled plugins depend on it.

## Integration with React Router

Plugins integrate seamlessly with React Router v7. Plugin routes are automatically registered and can be file-based or programmatically defined.

## Integration with Hono.js

Plugin APIs are automatically mounted to the main Hono app at the specified base paths. All Cloudflare Workers features are available to plugin APIs.

## Integration with Drizzle ORM

Plugin database schemas are merged with the main application schema, with automatic namespacing to prevent conflicts.

## Best Practices

1. **Use Semantic Versioning**: Follow semver for plugin versions
2. **Namespace Everything**: Use your plugin ID as a prefix for database tables, API routes, etc.
3. **Handle Dependencies**: Clearly define and document plugin dependencies
4. **Type Everything**: Use TypeScript for all plugin code
5. **Test Your Plugins**: Write tests for plugin functionality
6. **Document Your Plugin**: Include clear documentation for plugin usage

## Example Plugins

The NARA boilerplate includes example plugins:

- **landing-page**: A complete landing page with hero, features, and showcase sections
- **showcases**: A project showcase management system with CRUD operations

Study these plugins to understand the full capabilities of the plugin system.

## Advanced Usage

### Custom Plugin Types

You can extend the plugin system with custom plugin types:

```typescript
export type CustomPluginType = PluginType | "custom-type";
```

### Plugin Events

Implement plugin lifecycle events:

```typescript
export const plugin: Plugin = {
  config,
  
  async init(context) {
    // Plugin initialization
    console.log("Plugin starting up");
  },
  
  async destroy() {
    // Plugin cleanup
    console.log("Plugin shutting down");
  }
};
```

### Plugin Communication

Plugins can communicate through the shared context and registry:

```typescript
async init(context) {
  const otherPlugin = context.registry.getPlugin("other-plugin");
  if (otherPlugin) {
    // Interact with another plugin
  }
}
```

## Troubleshooting

### Plugin Not Loading
- Check that `plugin.config.ts` and `index.ts` exist
- Verify the plugin configuration is valid
- Check for dependency issues

### Route Conflicts
- Use unique base paths for plugin routes
- Run `bun plugin list` to see all plugins and their capabilities

### API Conflicts
- Use unique base paths for plugin APIs
- Check the plugin validation output for conflicts

### Database Issues
- Ensure database schemas are properly namespaced
- Run database migrations for plugins with database schemas

## Future Enhancements

The plugin system is designed to be extensible. Planned enhancements include:

- Plugin marketplace integration
- Remote plugin installation
- Plugin versioning and updates
- Plugin hot-reloading in production
- Visual plugin management UI
- Plugin analytics and metrics

The plugin system makes the NARA boilerplate truly modular and adaptable to any project requirements.