import { useEffect, useRef } from "react";

/**
 * Hook for measuring component render performance
 */
export function usePerformanceMonitor(componentName?: string) {
  const renderStartTime = useRef<number>(performance.now());
  const renderCount = useRef<number>(0);

  useEffect(() => {
    renderCount.current += 1;
    const renderTime = performance.now() - renderStartTime.current;
    
    if (componentName && process.env.NODE_ENV === "development") {
      console.log(
        `${componentName} render #${renderCount.current}: ${renderTime.toFixed(2)}ms`,
      );
    }
    
    renderStartTime.current = performance.now();
  });

  return {
    renderCount: renderCount.current,
  };
}

/**
 * Hook for detecting slow renders
 */
export function useSlowRenderDetection(threshold = 16, componentName?: string) {
  const startTime = useRef<number>(performance.now());

  useEffect(() => {
    const renderTime = performance.now() - startTime.current;
    
    if (renderTime > threshold && process.env.NODE_ENV === "development") {
      console.warn(
        `Slow render detected${componentName ? ` in ${componentName}` : ""}: ${renderTime.toFixed(2)}ms (threshold: ${threshold}ms)`,
      );
    }
    
    startTime.current = performance.now();
  });
}

/**
 * Hook for measuring async operation performance
 */
export function useAsyncPerformance() {
  const measureAsync = async <T>(
    operation: () => Promise<T>,
    operationName?: string,
  ): Promise<T> => {
    const startTime = performance.now();
    
    try {
      const result = await operation();
      const duration = performance.now() - startTime;
      
      if (operationName && process.env.NODE_ENV === "development") {
        console.log(`${operationName} completed in ${duration.toFixed(2)}ms`);
      }
      
      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      
      if (operationName && process.env.NODE_ENV === "development") {
        console.error(`${operationName} failed after ${duration.toFixed(2)}ms:`, error);
      }
      
      throw error;
    }
  };

  return { measureAsync };
}

/**
 * Utility function to create a performance timer
 */
export function createPerformanceTimer(name?: string) {
  const startTime = performance.now();
  
  return {
    end: () => {
      const duration = performance.now() - startTime;
      if (name && process.env.NODE_ENV === "development") {
        console.log(`${name}: ${duration.toFixed(2)}ms`);
      }
      return duration;
    },
  };
}