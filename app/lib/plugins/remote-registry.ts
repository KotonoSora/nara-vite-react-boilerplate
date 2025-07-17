import type {
  PluginRegistryClient,
  RemotePluginInfo,
  PluginPackage,
  PluginSearchOptions,
  RegistryAuth,
  RegistryInfo
} from "./types";

/**
 * Default registry client implementation
 * This can be extended to support different registry backends (npm, custom, etc.)
 */
export class DefaultRegistryClient implements PluginRegistryClient {
  private baseUrl: string;
  private timeout: number;

  constructor(baseUrl: string = "https://registry.npmjs.org", timeout: number = 10000) {
    this.baseUrl = baseUrl;
    this.timeout = timeout;
  }

  /**
   * Search plugins in registry
   */
  async search(options: PluginSearchOptions): Promise<RemotePluginInfo[]> {
    try {
      const params = new URLSearchParams();
      
      // Build search query for npm-style registry
      let searchQuery = options.query || "";
      if (options.keywords?.length) {
        searchQuery += ` keywords:${options.keywords.join(",")}`;
      }
      if (searchQuery) {
        params.append("text", searchQuery);
      }
      
      params.append("size", String(options.limit || 20));
      params.append("from", String(options.offset || 0));
      
      const url = `${this.baseUrl}/-/v1/search?${params}`;
      const response = await this.fetchWithTimeout(url);
      
      if (!response.ok) {
        throw new Error(`Registry search failed: ${response.statusText}`);
      }

      const data = await response.json() as { objects?: any[] };
      
      // Convert npm registry format to our format
      return this.convertNpmResultsToPluginInfo(data.objects || []);
    } catch (error) {
      console.error("Plugin search failed:", error);
      return [];
    }
  }

  /**
   * Get plugin information
   */
  async getPlugin(id: string, version?: string): Promise<RemotePluginInfo | null> {
    try {
      const packageName = this.normalizePackageName(id);
      const url = `${this.baseUrl}/${packageName}`;
      
      const response = await this.fetchWithTimeout(url);
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Failed to get plugin info: ${response.statusText}`);
      }

      const data = await response.json();
      return this.convertNpmPackageToPluginInfo(data, version);
    } catch (error) {
      console.error(`Failed to get plugin '${id}':`, error);
      return null;
    }
  }

  /**
   * Download plugin package
   */
  async download(id: string, version?: string): Promise<PluginPackage> {
    try {
      const pluginInfo = await this.getPlugin(id, version);
      if (!pluginInfo) {
        throw new Error(`Plugin '${id}' not found`);
      }

      const downloadUrl = pluginInfo.source.url;
      if (!downloadUrl) {
        throw new Error(`No download URL available for plugin '${id}'`);
      }

      const response = await this.fetchWithTimeout(downloadUrl);
      if (!response.ok) {
        throw new Error(`Failed to download plugin: ${response.statusText}`);
      }

      // For now, we'll handle tgz files (npm packages)
      const buffer = await response.arrayBuffer();
      return await this.extractPluginFromTarball(buffer, pluginInfo);
    } catch (error) {
      console.error(`Failed to download plugin '${id}':`, error);
      throw error;
    }
  }

  /**
   * Publish plugin to registry
   * Note: This is a simplified implementation. Real npm publishing requires authentication
   */
  async publish(pluginPackage: PluginPackage, auth: RegistryAuth): Promise<boolean> {
    try {
      // This would require proper npm registry authentication
      // For now, we'll just validate the package structure
      this.validatePluginPackage(pluginPackage);
      
      console.log(`Publishing plugin '${pluginPackage.config.id}' to registry...`);
      console.log("Note: Actual publishing requires npm registry credentials");
      
      // In a real implementation, this would:
      // 1. Create a tarball of the plugin
      // 2. Upload to npm registry with proper authentication
      // 3. Handle npm publish workflow
      
      return true;
    } catch (error) {
      console.error("Failed to publish plugin:", error);
      return false;
    }
  }

  /**
   * Get registry information
   */
  async getRegistryInfo(): Promise<RegistryInfo> {
    return {
      name: "NPM Registry",
      url: this.baseUrl,
      version: "1.0.0",
      totalPlugins: 0, // Would be fetched from registry
      featuredPlugins: []
    };
  }

  /**
   * Normalize package name for npm registry
   */
  private normalizePackageName(id: string): string {
    // Convert plugin ID to npm package name format
    if (id.startsWith("@")) {
      return id; // Already scoped
    }
    return `@nara-plugin/${id}`;
  }

  /**
   * Fetch with timeout
   */
  private async fetchWithTimeout(url: string, options?: RequestInit): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      return response;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Convert npm search results to plugin info
   */
  private convertNpmResultsToPluginInfo(objects: any[]): RemotePluginInfo[] {
    return objects
      .filter(obj => this.isNaraPlugin(obj.package))
      .map(obj => this.convertNpmPackageToPluginInfo(obj.package))
      .filter((info): info is RemotePluginInfo => info !== null);
  }

  /**
   * Check if npm package is a NARA plugin
   */
  private isNaraPlugin(pkg: any): boolean {
    return (
      pkg.keywords?.includes("nara-plugin") ||
      pkg.name?.startsWith("@nara-plugin/") ||
      pkg.keywords?.includes("nara-boilerplate")
    );
  }

  /**
   * Convert npm package to plugin info
   */
  private convertNpmPackageToPluginInfo(pkg: any, version?: string): RemotePluginInfo | null {
    try {
      const targetVersion = version || pkg["dist-tags"]?.latest || Object.keys(pkg.versions || {})[0];
      const versionData = pkg.versions?.[targetVersion] || pkg;

      return {
        id: this.extractPluginId(pkg.name),
        name: versionData.name || pkg.name,
        description: versionData.description || "",
        version: targetVersion,
        author: this.extractAuthor(versionData.author || pkg.author),
        keywords: versionData.keywords || [],
        homepage: versionData.homepage || pkg.homepage,
        repository: this.extractRepository(versionData.repository || pkg.repository),
        license: versionData.license || pkg.license,
        downloads: pkg.downloads?.monthly || 0,
        rating: 0, // npm doesn't provide ratings
        lastUpdated: new Date(versionData.time || pkg.time?.[targetVersion] || Date.now()),
        verified: false, // Would need verification logic
        source: {
          type: "npm",
          url: versionData.dist?.tarball,
          registry: this.baseUrl,
          version: targetVersion,
          checksum: versionData.dist?.shasum
        },
        dependencies: this.extractDependencies(versionData.dependencies),
        readme: versionData.readme || pkg.readme
      };
    } catch (error) {
      console.error("Failed to convert npm package to plugin info:", error);
      return null;
    }
  }

  /**
   * Extract plugin ID from npm package name
   */
  private extractPluginId(name: string): string {
    if (name.startsWith("@nara-plugin/")) {
      return name.replace("@nara-plugin/", "");
    }
    return name;
  }

  /**
   * Extract author from npm author field
   */
  private extractAuthor(author: any): string {
    if (typeof author === "string") {
      return author;
    }
    if (typeof author === "object" && author.name) {
      return author.name;
    }
    return "Unknown";
  }

  /**
   * Extract repository URL
   */
  private extractRepository(repo: any): string | undefined {
    if (typeof repo === "string") {
      return repo;
    }
    if (typeof repo === "object" && repo.url) {
      return repo.url;
    }
    return undefined;
  }

  /**
   * Extract dependencies
   */
  private extractDependencies(deps: Record<string, string> = {}): Array<{ id: string; version: string }> {
    return Object.entries(deps)
      .filter(([name]) => this.isNaraPlugin({ name, keywords: ["nara-plugin"] }))
      .map(([name, version]) => ({
        id: this.extractPluginId(name),
        version
      }));
  }

  /**
   * Extract plugin from downloaded tarball
   * Note: This is a simplified implementation
   */
  private async extractPluginFromTarball(buffer: ArrayBuffer, pluginInfo: RemotePluginInfo): Promise<PluginPackage> {
    // In a real implementation, this would:
    // 1. Extract the .tgz file
    // 2. Parse the package contents
    // 3. Validate plugin structure
    // 4. Return proper PluginPackage

    // For now, return a mock structure
    return {
      config: {
        id: pluginInfo.id,
        name: pluginInfo.name,
        description: pluginInfo.description,
        version: pluginInfo.version,
        author: pluginInfo.author,
        type: "feature",
        enabled: false,
        dependencies: pluginInfo.dependencies?.map(d => d.id) || []
      },
      files: {
        "plugin.config.ts": `export const config = ${JSON.stringify({
          id: pluginInfo.id,
          name: pluginInfo.name,
          description: pluginInfo.description,
          version: pluginInfo.version,
          author: pluginInfo.author,
          type: "feature",
          enabled: false
        }, null, 2)};`,
        "index.ts": "// Plugin implementation would be here",
        "README.md": pluginInfo.readme || `# ${pluginInfo.name}\n\n${pluginInfo.description}`
      },
      manifest: {
        name: pluginInfo.name,
        version: pluginInfo.version,
        description: pluginInfo.description,
        author: pluginInfo.author,
        license: pluginInfo.license,
        repository: pluginInfo.repository,
        homepage: pluginInfo.homepage,
        keywords: pluginInfo.keywords,
        files: ["plugin.config.ts", "index.ts", "README.md"],
        checksum: pluginInfo.source.checksum || ""
      }
    };
  }

  /**
   * Validate plugin package structure
   */
  private validatePluginPackage(pluginPackage: PluginPackage): void {
    if (!pluginPackage.config?.id) {
      throw new Error("Plugin package missing required config.id");
    }
    if (!pluginPackage.config?.name) {
      throw new Error("Plugin package missing required config.name");
    }
    if (!pluginPackage.config?.version) {
      throw new Error("Plugin package missing required config.version");
    }
    if (!pluginPackage.files?.["plugin.config.ts"]) {
      throw new Error("Plugin package missing plugin.config.ts file");
    }
  }
}

/**
 * Create registry client for specified registry type
 */
export function createRegistryClient(type: "npm" | "custom" = "npm", baseUrl?: string): PluginRegistryClient {
  switch (type) {
    case "npm":
      return new DefaultRegistryClient(baseUrl || "https://registry.npmjs.org");
    case "custom":
      return new DefaultRegistryClient(baseUrl || "https://plugins.nara.dev");
    default:
      throw new Error(`Unsupported registry type: ${type}`);
  }
}

/**
 * Default registry client instance
 */
export const defaultRegistryClient = createRegistryClient();