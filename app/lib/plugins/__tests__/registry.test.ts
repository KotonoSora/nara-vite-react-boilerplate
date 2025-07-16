import { describe, test, expect, beforeEach } from "vitest";
import { PluginRegistry } from "../registry";
import type { Plugin } from "../types";

describe("PluginRegistry", () => {
  let registry: PluginRegistry;

  beforeEach(() => {
    registry = new PluginRegistry();
  });

  const createTestPlugin = (id: string, enabled = true, dependencies: string[] = []): Plugin => ({
    config: {
      id,
      name: `Test Plugin ${id}`,
      description: `Test plugin for ${id}`,
      version: "1.0.0",
      author: "Test Author",
      type: "feature",
      enabled,
      dependencies
    }
  });

  test("should register a plugin", () => {
    const plugin = createTestPlugin("test-plugin");
    
    registry.register(plugin);
    
    expect(registry.getPlugin("test-plugin")).toBe(plugin);
    expect(registry.getPlugins()).toHaveLength(1);
  });

  test("should not allow duplicate plugin registration", () => {
    const plugin1 = createTestPlugin("test-plugin");
    const plugin2 = createTestPlugin("test-plugin");
    
    registry.register(plugin1);
    
    expect(() => registry.register(plugin2)).toThrow("already registered");
  });

  test("should track enabled plugins", () => {
    const enabledPlugin = createTestPlugin("enabled", true);
    const disabledPlugin = createTestPlugin("disabled", false);
    
    registry.register(enabledPlugin);
    registry.register(disabledPlugin);
    
    const enabledPlugins = registry.getEnabledPlugins();
    expect(enabledPlugins).toHaveLength(1);
    expect(enabledPlugins[0].config.id).toBe("enabled");
  });

  test("should enable and disable plugins", () => {
    const plugin = createTestPlugin("test", false);
    registry.register(plugin);
    
    expect(registry.isEnabled("test")).toBe(false);
    
    registry.enable("test");
    expect(registry.isEnabled("test")).toBe(true);
    
    registry.disable("test");
    expect(registry.isEnabled("test")).toBe(false);
  });

  test("should validate dependencies when registering", () => {
    const pluginWithDeps = createTestPlugin("dependent", true, ["missing-dep"]);
    
    expect(() => registry.register(pluginWithDeps)).toThrow("not registered");
  });

  test("should validate dependencies when enabling", () => {
    const depPlugin = createTestPlugin("dep", false);
    const mainPlugin = createTestPlugin("main", false, ["dep"]);
    
    registry.register(depPlugin);
    registry.register(mainPlugin);
    
    expect(() => registry.enable("main")).toThrow("not enabled");
    
    registry.enable("dep");
    registry.enable("main"); // Should not throw
    
    expect(registry.isEnabled("main")).toBe(true);
  });

  test("should prevent disabling plugins with dependents", () => {
    const depPlugin = createTestPlugin("dep", true);
    const mainPlugin = createTestPlugin("main", true, ["dep"]);
    
    registry.register(depPlugin);
    registry.register(mainPlugin);
    
    expect(() => registry.disable("dep")).toThrow("depends on it");
  });

  test("should unregister plugins", () => {
    const plugin = createTestPlugin("test");
    registry.register(plugin);
    
    expect(registry.getPlugin("test")).toBeDefined();
    
    registry.unregister("test");
    
    expect(registry.getPlugin("test")).toBeUndefined();
    expect(registry.getPlugins()).toHaveLength(0);
  });

  test("should prevent unregistering plugins with dependents", () => {
    const depPlugin = createTestPlugin("dep", true);
    const mainPlugin = createTestPlugin("main", true, ["dep"]);
    
    registry.register(depPlugin);
    registry.register(mainPlugin);
    
    expect(() => registry.unregister("dep")).toThrow("depends on it");
  });
});