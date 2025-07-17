import { describe, it, expect, beforeEach, vi } from "vitest";
import { DefaultRegistryClient } from "../remote-registry";
import type { PluginSearchOptions, RemotePluginInfo } from "../types";

// Mock fetch for testing
global.fetch = vi.fn();

describe("DefaultRegistryClient", () => {
  let client: DefaultRegistryClient;

  beforeEach(() => {
    client = new DefaultRegistryClient("https://test-registry.com");
    vi.clearAllMocks();
  });

  describe("search", () => {
    it("should search for plugins", async () => {
      const mockResponse = {
        objects: [
          {
            package: {
              name: "@nara-plugin/test-plugin",
              description: "A test plugin",
              version: "1.0.0",
              author: { name: "Test Author" },
              keywords: ["nara-plugin", "test"],
              "dist-tags": { latest: "1.0.0" },
              versions: {
                "1.0.0": {
                  dist: {
                    tarball: "https://registry.com/download.tgz",
                    shasum: "abc123"
                  }
                }
              }
            }
          }
        ]
      };

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const options: PluginSearchOptions = {
        query: "test",
        limit: 10
      };

      const results = await client.search(options);

      expect(results).toHaveLength(1);
      expect(results[0]).toMatchObject({
        id: "test-plugin",
        name: "@nara-plugin/test-plugin",
        version: "1.0.0",
        author: "Test Author"
      });
      expect(results[0].description).toBeDefined();
      expect(results[0].source.type).toBe("npm");
    });

    it("should handle search errors gracefully", async () => {
      (fetch as any).mockResolvedValueOnce({
        ok: false,
        statusText: "Internal Server Error"
      });

      const options: PluginSearchOptions = {
        query: "test"
      };

      const results = await client.search(options);
      expect(results).toEqual([]);
    });

    it("should filter non-NARA plugins", async () => {
      const mockResponse = {
        objects: [
          {
            package: {
              name: "regular-npm-package",
              keywords: ["other"],
              "dist-tags": { latest: "1.0.0" }
            }
          },
          {
            package: {
              name: "@nara-plugin/valid-plugin",
              keywords: ["nara-plugin"],
              "dist-tags": { latest: "1.0.0" }
            }
          }
        ]
      };

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const results = await client.search({ query: "test" });
      
      expect(results).toHaveLength(1);
      expect(results[0].id).toBe("valid-plugin");
    });
  });

  describe("getPlugin", () => {
    it("should get plugin information", async () => {
      const mockPackage = {
        name: "@nara-plugin/test-plugin",
        description: "A test plugin",
        "dist-tags": { latest: "1.0.0" },
        versions: {
          "1.0.0": {
            name: "@nara-plugin/test-plugin",
            description: "A test plugin",
            version: "1.0.0",
            author: { name: "Test Author" },
            keywords: ["nara-plugin"],
            dist: {
              tarball: "https://registry.com/download.tgz",
              shasum: "abc123"
            }
          }
        }
      };

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockPackage)
      });

      const result = await client.getPlugin("test-plugin");

      expect(result).toMatchObject({
        id: "test-plugin",
        name: "@nara-plugin/test-plugin",
        description: "A test plugin",
        version: "1.0.0",
        author: "Test Author"
      });
    });

    it("should return null for non-existent plugins", async () => {
      (fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 404
      });

      const result = await client.getPlugin("non-existent");
      expect(result).toBeNull();
    });
  });

  describe("download", () => {
    it("should download plugin package", async () => {
      const mockPluginInfo: RemotePluginInfo = {
        id: "test-plugin",
        name: "Test Plugin",
        description: "A test plugin",
        version: "1.0.0",
        author: "Test Author",
        lastUpdated: new Date(),
        source: {
          type: "npm",
          url: "https://registry.com/download.tgz",
          checksum: "abc123"
        }
      };

      // Mock getPlugin call
      vi.spyOn(client, "getPlugin").mockResolvedValue(mockPluginInfo);

      // Mock download
      (fetch as any).mockResolvedValueOnce({
        ok: true,
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(1024))
      });

      const result = await client.download("test-plugin");

      expect(result).toMatchObject({
        config: {
          id: "test-plugin",
          name: "Test Plugin",
          version: "1.0.0"
        },
        manifest: {
          name: "Test Plugin",
          version: "1.0.0",
          checksum: "abc123"
        }
      });
    });
  });

  describe("normalizePackageName", () => {
    it("should normalize plugin IDs to npm package names", () => {
      const client = new DefaultRegistryClient();
      
      // Access private method via any cast for testing
      const normalize = (client as any).normalizePackageName.bind(client);
      
      expect(normalize("test-plugin")).toBe("@nara-plugin/test-plugin");
      expect(normalize("@custom/plugin")).toBe("@custom/plugin");
    });
  });

  describe("extractPluginId", () => {
    it("should extract plugin ID from npm package names", () => {
      const client = new DefaultRegistryClient();
      
      // Access private method via any cast for testing
      const extract = (client as any).extractPluginId.bind(client);
      
      expect(extract("@nara-plugin/test-plugin")).toBe("test-plugin");
      expect(extract("regular-package")).toBe("regular-package");
    });
  });

  describe("isNaraPlugin", () => {
    it("should identify NARA plugins correctly", () => {
      const client = new DefaultRegistryClient();
      
      // Access private method via any cast for testing
      const isNara = (client as any).isNaraPlugin.bind(client);
      
      expect(isNara({ name: "@nara-plugin/test", keywords: [] })).toBe(true);
      expect(isNara({ name: "test", keywords: ["nara-plugin"] })).toBe(true);
      expect(isNara({ name: "test", keywords: ["nara-boilerplate"] })).toBe(true);
      expect(isNara({ name: "test", keywords: ["other"] })).toBe(false);
    });
  });
});