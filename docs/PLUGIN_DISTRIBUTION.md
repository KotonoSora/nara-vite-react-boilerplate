# Plugin Distribution System

The NARA boilerplate includes a comprehensive plugin distribution system that allows developers to share and install plugins remotely, fostering a rich ecosystem of modular features.

## Overview

The distribution system provides:

- **Remote Installation**: Install plugins from npm, GitHub, or custom registries
- **Plugin Search**: Discover plugins through search functionality
- **Package Management**: Version control and dependency management
- **Publishing**: Share plugins with the community
- **Security**: Validation and verification of remote plugins

## Installing Plugins

### From NPM Registry

The easiest way to install plugins is from the npm registry:

```bash
# Install a scoped plugin
bun plugin install @nara-plugin/blog

# Install with specific version
bun plugin install @nara-plugin/ecommerce --version 2.1.0

# Force reinstall
bun plugin install @nara-plugin/auth --force
```

### From GitHub

Install directly from GitHub repositories:

```bash
# Install from GitHub user/repo
bun plugin install username/nara-blog-plugin

# Install from specific branch or tag
bun plugin install username/nara-plugin-name --version main
```

### From Custom Registry

Use custom plugin registries:

```bash
# Install from custom registry
bun plugin install my-plugin --registry https://plugins.example.com
```

### From Local Sources

Install from local directories during development:

```bash
# Install from local directory
bun plugin install ./my-local-plugin

# Install from tarball
bun plugin install ./plugin-package.tgz
```

## Searching Plugins

Discover available plugins using the search command:

```bash
# Search by keyword
bun plugin search "blog"

# Search by category
bun plugin search "ecommerce"

# Search by author
bun plugin search "authentication"
```

Search results show:
- Plugin name and description
- Version information
- Author details
- Download statistics
- Compatibility information

## Plugin Development for Distribution

### Preparing for Distribution

1. **Plugin Structure**: Ensure your plugin follows the standard structure:
   ```
   my-plugin/
   ├── plugin.config.ts    # Plugin configuration
   ├── index.ts           # Main entry point
   ├── package.json       # NPM package info
   ├── README.md          # Documentation
   ├── routes/            # Plugin routes (optional)
   ├── api/               # API endpoints (optional)
   ├── components/        # React components (optional)
   └── database/          # Database schemas (optional)
   ```

2. **Package Configuration**: Create a proper `package.json`:
   ```json
   {
     "name": "@nara-plugin/my-awesome-plugin",
     "version": "1.0.0",
     "description": "An awesome plugin for NARA",
     "keywords": ["nara-plugin", "awesome", "productivity"],
     "author": "Your Name <your.email@example.com>",
     "license": "MIT",
     "repository": {
       "type": "git",
       "url": "https://github.com/username/my-plugin.git"
     },
     "homepage": "https://github.com/username/my-plugin#readme",
     "main": "index.ts",
     "types": "index.ts",
     "files": [
       "plugin.config.ts",
       "index.ts",
       "routes/**/*",
       "api/**/*",
       "components/**/*",
       "database/**/*",
       "README.md"
     ],
     "peerDependencies": {
       "@nara-plugin/core": "^1.0.0"
     }
   }
   ```

3. **Plugin Configuration**: Ensure proper plugin metadata:
   ```typescript
   // plugin.config.ts
   import type { PluginConfig } from "~/lib/plugins/types";

   export const config: PluginConfig = {
     id: "my-awesome-plugin",
     name: "My Awesome Plugin",
     description: "Adds awesome functionality to NARA applications",
     version: "1.0.0",
     author: "Your Name",
     type: "feature",
     enabled: false,
     dependencies: ["core-auth"], // Optional dependencies
     entry: "./index.ts"
   };
   ```

### Packaging Plugins

Package your plugin for distribution:

```bash
# Package current directory
bun plugin package .

# Package specific directory
bun plugin package ./path/to/plugin
```

This creates a distributable package with:
- Validated plugin structure
- Compressed file bundle
- Manifest with checksums
- Dependency information

### Publishing Plugins

Publish your plugin to make it available to others:

```bash
# Publish to default registry (npm)
bun plugin publish ./my-plugin

# Publish to custom registry
bun plugin publish ./my-plugin --registry https://custom-registry.com
```

**Publishing to NPM:**

1. Ensure you have an npm account and are logged in:
   ```bash
   npm login
   ```

2. Use the standard npm publish workflow:
   ```bash
   cd my-plugin
   npm publish
   ```

3. Tag your plugin with the `nara-plugin` keyword for discoverability.

## Plugin Registry

### Default Registry (NPM)

By default, plugins are discovered through the npm registry with the following criteria:
- Package names starting with `@nara-plugin/`
- Packages tagged with `nara-plugin` keyword
- Packages tagged with `nara-boilerplate` keyword

### Custom Registries

You can configure custom plugin registries:

```typescript
// In your application
import { createRegistryClient } from "~/lib/plugins";

const customRegistry = createRegistryClient("custom", "https://plugins.example.com");
```

### Registry API

Custom registries should implement the following endpoints:

- `GET /search?q=query` - Search plugins
- `GET /plugin/:name` - Get plugin information
- `GET /plugin/:name/:version/download` - Download plugin
- `POST /plugin` - Publish plugin (with authentication)

## Plugin Verification

### Security Measures

1. **Checksum Validation**: All downloads are verified against checksums
2. **Source Verification**: Plugin sources are validated
3. **Dependency Scanning**: Dependencies are checked for conflicts
4. **Sandbox Execution**: Plugins run in controlled environments

### Verification Badges

Plugins can receive verification badges for:
- ✅ **Verified Publisher**: Trusted plugin author
- 🔒 **Security Scanned**: Passed security analysis
- 🧪 **Tested**: Includes comprehensive tests
- 📚 **Documented**: Well-documented with examples

## Version Management

### Semantic Versioning

Plugins should follow [Semantic Versioning](https://semver.org/):
- `MAJOR.MINOR.PATCH`
- Breaking changes increment MAJOR
- New features increment MINOR
- Bug fixes increment PATCH

### Update Management

```bash
# Update specific plugin
bun plugin update my-plugin

# Update all plugins
bun plugin update --all

# Update to specific version
bun plugin update my-plugin --version 2.0.0
```

### Compatibility

Plugins should specify compatibility in their configuration:

```typescript
export const config: PluginConfig = {
  // ... other config
  compatibility: {
    nara: "^4.0.0",        // NARA version compatibility
    node: ">=18.0.0",      // Node.js version
    react: "^18.0.0"       // React version
  }
};
```

## Best Practices

### For Plugin Developers

1. **Clear Documentation**: Provide comprehensive README files
2. **Semantic Versioning**: Follow semver for version management
3. **Testing**: Include unit and integration tests
4. **Type Safety**: Use TypeScript for better developer experience
5. **Dependencies**: Minimize dependencies and declare them properly
6. **Security**: Follow security best practices

### For Plugin Users

1. **Verification**: Check plugin verification status
2. **Reviews**: Read community reviews and ratings
3. **Maintenance**: Prefer actively maintained plugins
4. **Compatibility**: Ensure version compatibility
5. **Testing**: Test plugins in development before production

## Troubleshooting

### Common Issues

**Plugin Not Found:**
```bash
# Check registry connection
bun plugin search "plugin-name"

# Try different registry
bun plugin install plugin-name --registry https://registry.npmjs.org
```

**Installation Failures:**
```bash
# Clear cache and retry
rm -rf node_modules/.cache
bun plugin install plugin-name --force

# Check network connectivity
curl -I https://registry.npmjs.org
```

**Version Conflicts:**
```bash
# Check plugin dependencies
bun plugin info plugin-name

# Update dependencies
bun plugin update --all
```

### Debug Mode

Enable debug mode for detailed logging:

```bash
DEBUG=nara:plugins bun plugin install my-plugin
```

## Examples

### Installing a Blog Plugin

```bash
# Search for blog plugins
bun plugin search "blog"

# Install the blog plugin
bun plugin install @nara-plugin/blog

# Enable the plugin
bun plugin enable blog

# Verify installation
bun plugin info blog
```

### Creating and Publishing a Plugin

```bash
# Create new plugin
bun plugin create "Weather Widget"

# Develop your plugin...
cd plugins/weather-widget

# Package for distribution
bun plugin package .

# Publish to npm
npm publish

# Or publish via plugin CLI
bun plugin publish .
```

## Community

### Plugin Registry

Official plugin registry: [https://plugins.nara.dev](https://plugins.nara.dev)

### Resources

- [Plugin Development Guide](./PLUGIN_SYSTEM.md)
- [API Documentation](./API.md)
- [Community Forum](https://community.nara.dev)
- [GitHub Discussions](https://github.com/KotonoSora/nara-vite-react-boilerplate/discussions)

### Contributing

We welcome plugin contributions! Please see our [Contributing Guide](../CONTRIBUTING.md) for details on:
- Plugin submission guidelines
- Code review process
- Community standards
- Quality requirements