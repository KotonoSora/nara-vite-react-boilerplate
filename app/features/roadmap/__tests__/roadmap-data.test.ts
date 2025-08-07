import { describe, it, expect, vi } from "vitest";
import { getRoadmapData, getRequestGuide } from "~/features/roadmap/utils/get-roadmap-data";

// Mock translation function
const mockT = vi.fn((key: string) => key);

describe("Roadmap Data Utils", () => {
  it("should generate roadmap data correctly", () => {
    const roadmapData = getRoadmapData(mockT);
    
    expect(roadmapData).toHaveProperty("current");
    expect(roadmapData).toHaveProperty("development");
    expect(roadmapData).toHaveProperty("planned");
    
    // Check current features
    expect(Object.keys(roadmapData.current)).toContain("reactRouter");
    expect(Object.keys(roadmapData.current)).toContain("typescript");
    expect(Object.keys(roadmapData.current)).toContain("cloudflareWorkers");
    
    // Check development features
    expect(Object.keys(roadmapData.development)).toContain("advancedAuth");
    expect(Object.keys(roadmapData.development)).toContain("realtime");
    
    // Check planned features
    expect(Object.keys(roadmapData.planned)).toContain("mobileApp");
    expect(Object.keys(roadmapData.planned)).toContain("cms");
  });

  it("should generate request guide correctly", () => {
    const requestGuide = getRequestGuide(mockT);
    
    expect(requestGuide).toHaveProperty("steps");
    expect(requestGuide).toHaveProperty("template");
    expect(requestGuide).toHaveProperty("guidelines");
    
    // Check steps
    expect(Object.keys(requestGuide.steps)).toHaveLength(4);
    expect(requestGuide.steps).toHaveProperty("step1");
    expect(requestGuide.steps).toHaveProperty("step4");
    
    // Check template
    expect(requestGuide.template).toHaveProperty("title");
    expect(requestGuide.template).toHaveProperty("content");
    
    // Check guidelines
    expect(requestGuide.guidelines).toHaveProperty("items");
    expect(Object.keys(requestGuide.guidelines.items)).toContain("specific");
  });

  it("should have proper feature status types", () => {
    const roadmapData = getRoadmapData(mockT);
    
    // Check status types are valid
    const validStatuses = ["Stable", "In Progress", "Planning", "Research", "Planned"];
    
    Object.values(roadmapData.current).forEach(feature => {
      expect(validStatuses).toContain(feature.status);
    });
    
    Object.values(roadmapData.development).forEach(feature => {
      expect(validStatuses).toContain(feature.status);
    });
    
    Object.values(roadmapData.planned).forEach(feature => {
      expect(validStatuses).toContain(feature.status);
    });
  });
});