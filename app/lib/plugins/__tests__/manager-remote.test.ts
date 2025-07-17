import { describe, it, expect, beforeEach, vi } from "vitest";
import type { Mock } from "vitest";
import { PluginManager } from "../manager";
import type { InstallOptions, PluginSource } from "../types";

describe("PluginManager Remote Features", () => {
  let manager: PluginManager;

  beforeEach(() => {
    manager = new PluginManager("./test-plugins");
    vi.clearAllMocks();
  });

  describe("parseSource", () => {
    it("should parse npm package sources", () => {
      const manager = new PluginManager();
      
      // Access private method for testing
      const parseSource = (manager as any).parseSource.bind(manager);
      
      expect(parseSource("@nara-plugin/blog")).toEqual({
        type: "npm",
        url: "@nara-plugin/blog"
      });
      
      expect(parseSource("simple-package")).toEqual({
        type: "npm",
        url: "simple-package"
      });
    });

    it("should parse git repository sources", () => {
      const manager = new PluginManager();
      const parseSource = (manager as any).parseSource.bind(manager);
      
      expect(parseSource("https://github.com/user/repo.git")).toEqual({
        type: "git",
        url: "https://github.com/user/repo.git"
      });
      
      expect(parseSource("git+https://github.com/user/repo")).toEqual({
        type: "git",
        url: "git+https://github.com/user/repo"
      });
    });

    it("should parse URL sources", () => {
      const manager = new PluginManager();
      const parseSource = (manager as any).parseSource.bind(manager);
      
      expect(parseSource("https://example.com/plugin.tgz")).toEqual({
        type: "url",
        url: "https://example.com/plugin.tgz"
      });
    });

    it("should parse local sources", () => {
      const manager = new PluginManager();
      const parseSource = (manager as any).parseSource.bind(manager);
      
      expect(parseSource("./local/plugin")).toEqual({
        type: "local",
        url: "./local/plugin"
      });
      
      expect(parseSource("/absolute/path")).toEqual({
        type: "local",
        url: "/absolute/path"
      });
    });
  });

  describe("extractIdFromSource", () => {
    it("should extract plugin ID from various source formats", () => {
      const manager = new PluginManager();
      const extractId = (manager as any).extractIdFromSource.bind(manager);
      
      expect(extractId("@nara-plugin/blog")).toBe("blog");
      expect(extractId("simple-package")).toBe("simple-package");
      expect(extractId("https://github.com/user/my-plugin.git")).toBe("my-plugin");
      expect(extractId("./local/awesome-plugin")).toBe("awesome-plugin");
    });
  });

  describe("install", () => {
    it("should handle npm installation", async () => {
      const { defaultRegistryClient } = await import("../remote-registry");
      
      const mockPluginInfo = {
        id: "test-plugin",
        name: "Test Plugin",
        version: "1.0.0",
        description: "Test",
        author: "Test Author",
        lastUpdated: new Date(),
        source: { type: "npm" as const, url: "test-plugin" }
      };
      
      const mockPackage = {
        config: {
          id: "test-plugin",
          name: "Test Plugin",
          version: "1.0.0",
          type: "feature" as const,
          enabled: false,
          description: "Test",
          author: "Test Author"
        },
        files: {
          "plugin.config.ts": "export const config = {};",
          "index.ts": "export const plugin = {};"
        },
        manifest: {
          name: "Test Plugin",
          version: "1.0.0",
          files: ["plugin.config.ts", "index.ts"],
          checksum: "abc123"
        }
      };

      (defaultRegistryClient.getPlugin as any).mockResolvedValue(mockPluginInfo);
      (defaultRegistryClient.download as any).mockResolvedValue(mockPackage);

      // Mock filesystem operations
      const mockFs = {
        existsSync: vi.fn().mockReturnValue(false),
        mkdirSync: vi.fn(),
        writeFileSync: vi.fn()
      };
      
      vi.doMock("fs", () => mockFs);

      const result = await manager.install("test-plugin");

      expect(result).toMatchObject({
        id: "test-plugin",
        installed: true,
        enabled: false,
        version: "1.0.0"
      });
    });

    it("should handle installation errors gracefully", async () => {
      const { defaultRegistryClient } = await import("../remote-registry");
      
      (defaultRegistryClient.getPlugin as any).mockResolvedValue(null);

      const result = await manager.install("non-existent-plugin");

      expect(result).toMatchObject({
        id: "non-existent-plugin",
        installed: false,
        enabled: false,
        error: expect.stringContaining("not found")
      });
    });

    it("should respect force option", async () => {
      const { defaultRegistryClient } = await import("../remote-registry");
      
      const mockPluginInfo = {
        id: "existing-plugin",
        name: "Existing Plugin",
        version: "2.0.0",
        description: "Test",
        author: "Test Author",
        lastUpdated: new Date(),
        source: { type: "npm" as const, url: "existing-plugin" }
      };

      (defaultRegistryClient.getPlugin as any).mockResolvedValue(mockPluginInfo);

      // Mock existing installation
      const existingStatus = {
        id: "existing-plugin",
        installed: true,
        enabled: true,
        version: "1.0.0"
      };
      
      vi.spyOn(manager, "getStatus").mockReturnValue(existingStatus);

      const options: InstallOptions = { force: true };
      
      // Should not throw error with force option
      await expect(manager.install("existing-plugin", options)).resolves.toBeDefined();
    });
  });

  describe("search", () => {
    it("should search remote plugins", async () => {
      const { defaultRegistryClient } = await import("../remote-registry");
      
      const mockResults = [
        {
          id: "plugin1",
          name: "Plugin 1",
          description: "First plugin",
          version: "1.0.0",
          author: "Author 1",
          lastUpdated: new Date(),
          source: { type: "npm" as const }
        }
      ];

      (defaultRegistryClient.search as any).mockResolvedValue(mockResults);

      const results = await manager.search({ query: "test" });

      expect(results).toEqual(mockResults);
      expect(defaultRegistryClient.search).toHaveBeenCalledWith({ query: "test" });
    });

    it("should handle search errors", async () => {
      const { defaultRegistryClient } = await import("../remote-registry");
      
      (defaultRegistryClient.search as any).mockRejectedValue(new Error("Network error"));

      const results = await manager.search({ query: "test" });

      expect(results).toEqual([]);
    });
  });

  describe("publish", () => {
    it("should publish plugins to registry", async () => {
      const { defaultRegistryClient } = await import("../remote-registry");
      
      (defaultRegistryClient.publish as any).mockResolvedValue(true);

      // Mock package method
      vi.spyOn(manager, "package").mockResolvedValue({
        config: {
          id: "test-plugin",
          name: "Test Plugin",
          version: "1.0.0",
          type: "feature",
          enabled: false,
          description: "Test",
          author: "Test Author"
        },
        files: {},
        manifest: {
          name: "Test Plugin",
          version: "1.0.0",
          description: "Test plugin description",
          author: "Test Author",
          files: [],
          checksum: "abc123"
        }
      });

      const result = await manager.publish("./test-plugin");

      expect(result).toBe(true);
      expect(manager.package).toHaveBeenCalledWith("./test-plugin");
    });
  });

  describe("package", () => {
    it("should create plugin packages", async () => {
      // Mock filesystem operations
      const mockFs = {
        existsSync: vi.fn().mockReturnValue(true),
        readdirSync: vi.fn().mockReturnValue([
          { name: "plugin.config.ts", isFile: () => true, isDirectory: () => false },
          { name: "index.ts", isFile: () => true, isDirectory: () => false },
          { name: "routes", isFile: () => false, isDirectory: () => true }
        ]),
        readFileSync: vi.fn().mockReturnValue("file content")
      };

      const mockPath = {
        resolve: vi.fn().mockReturnValue("/absolute/path"),
        join: vi.fn((...args) => args.join("/"))
      };

      vi.doMock("fs", () => mockFs);
      vi.doMock("path", () => mockPath);

      // Mock dynamic import of config
      const mockConfig = {
        id: "test-plugin",
        name: "Test Plugin",
        version: "1.0.0",
        type: "feature" as const,
        enabled: false,
        description: "Test plugin",
        author: "Test Author"
      };

      vi.doMock("/absolute/path/plugin.config.ts", () => ({
        default: mockConfig,
        config: mockConfig
      }));

      const result = await manager.package("./test-plugin");

      expect(result).toMatchObject({
        config: mockConfig,
        files: expect.any(Object),
        manifest: {
          name: "Test Plugin",
          version: "1.0.0",
          files: expect.any(Array),
          checksum: expect.any(String)
        }
      });
    });

    it("should handle missing plugin configuration", async () => {
      const mockFs = {
        existsSync: vi.fn()
          .mockReturnValueOnce(true)  // Plugin path exists
          .mockReturnValueOnce(false) // Config file doesn't exist
      };

      const mockPath = {
        resolve: vi.fn().mockReturnValue("/absolute/path"),
        join: vi.fn((...args) => args.join("/"))
      };

      vi.doMock("fs", () => mockFs);
      vi.doMock("path", () => mockPath);

      await expect(manager.package("./invalid-plugin"))
        .rejects.toThrow("Plugin missing plugin.config.ts");
    });
  });

  describe("calculateChecksum", () => {
    it("should generate consistent checksums", () => {
      const manager = new PluginManager();
      const calculateChecksum = (manager as any).calculateChecksum.bind(manager);
      
      const files1 = {
        "file1.ts": "content1",
        "file2.ts": "content2"
      };
      
      const files2 = {
        "file2.ts": "content2",
        "file1.ts": "content1"
      };
      
      // Should generate same checksum regardless of order
      expect(calculateChecksum(files1)).toBe(calculateChecksum(files2));
      
      // Different content should generate different checksum
      const files3 = {
        "file1.ts": "different content",
        "file2.ts": "content2"
      };
      
      expect(calculateChecksum(files1)).not.toBe(calculateChecksum(files3));
    });
  });
});