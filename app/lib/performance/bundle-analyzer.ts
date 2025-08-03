/**
 * Bundle analysis utilities for development
 */

/**
 * Gets the size of a JavaScript object in bytes (approximate)
 */
export function getObjectSize(obj: any): number {
  const jsonString = JSON.stringify(obj);
  return new Blob([jsonString]).size;
}

/**
 * Measures the memory usage of a function
 */
export function measureMemoryUsage<T>(fn: () => T): { result: T; memoryDelta: number } {
  if (!("memory" in performance)) {
    console.warn("Performance.memory is not available in this browser");
    return { result: fn(), memoryDelta: 0 };
  }

  const initialMemory = (performance as any).memory.usedJSHeapSize;
  const result = fn();
  const finalMemory = (performance as any).memory.usedJSHeapSize;
  
  return {
    result,
    memoryDelta: finalMemory - initialMemory,
  };
}

/**
 * Analyzes component render frequency
 */
export class RenderTracker {
  private static instance: RenderTracker;
  private renderCounts = new Map<string, number>();
  private renderTimes = new Map<string, number[]>();

  static getInstance(): RenderTracker {
    if (!RenderTracker.instance) {
      RenderTracker.instance = new RenderTracker();
    }
    return RenderTracker.instance;
  }

  trackRender(componentName: string, renderTime: number): void {
    // Update render count
    const currentCount = this.renderCounts.get(componentName) || 0;
    this.renderCounts.set(componentName, currentCount + 1);

    // Track render times
    const times = this.renderTimes.get(componentName) || [];
    times.push(renderTime);
    
    // Keep only last 10 render times to prevent memory leaks
    if (times.length > 10) {
      times.shift();
    }
    
    this.renderTimes.set(componentName, times);
  }

  getStats(componentName: string): {
    count: number;
    averageTime: number;
    maxTime: number;
    minTime: number;
  } | null {
    const count = this.renderCounts.get(componentName);
    const times = this.renderTimes.get(componentName);

    if (!count || !times || times.length === 0) {
      return null;
    }

    const averageTime = times.reduce((sum, time) => sum + time, 0) / times.length;
    const maxTime = Math.max(...times);
    const minTime = Math.min(...times);

    return {
      count,
      averageTime,
      maxTime,
      minTime,
    };
  }

  getAllStats(): Record<string, ReturnType<RenderTracker["getStats"]>> {
    const stats: Record<string, ReturnType<RenderTracker["getStats"]>> = {};
    
    for (const [componentName] of this.renderCounts) {
      stats[componentName] = this.getStats(componentName);
    }
    
    return stats;
  }

  clear(): void {
    this.renderCounts.clear();
    this.renderTimes.clear();
  }
}

/**
 * Performance budget checker
 */
export class PerformanceBudget {
  private static thresholds = {
    renderTime: 16, // 60fps target
    bundleSize: 250000, // 250KB
    imageSize: 500000, // 500KB
    memoryUsage: 50000000, // 50MB
  };

  static checkRenderTime(time: number, componentName?: string): boolean {
    const withinBudget = time <= this.thresholds.renderTime;
    
    if (!withinBudget && process.env.NODE_ENV === "development") {
      console.warn(
        `Performance budget exceeded${componentName ? ` in ${componentName}` : ""}: ` +
        `${time.toFixed(2)}ms (budget: ${this.thresholds.renderTime}ms)`
      );
    }
    
    return withinBudget;
  }

  static checkBundleSize(size: number): boolean {
    const withinBudget = size <= this.thresholds.bundleSize;
    
    if (!withinBudget && process.env.NODE_ENV === "development") {
      console.warn(
        `Bundle size budget exceeded: ${(size / 1000).toFixed(2)}KB ` +
        `(budget: ${(this.thresholds.bundleSize / 1000).toFixed(2)}KB)`
      );
    }
    
    return withinBudget;
  }

  static setThresholds(newThresholds: Partial<typeof PerformanceBudget.thresholds>): void {
    this.thresholds = { ...this.thresholds, ...newThresholds };
  }

  static getThresholds(): typeof PerformanceBudget.thresholds {
    return { ...this.thresholds };
  }
}