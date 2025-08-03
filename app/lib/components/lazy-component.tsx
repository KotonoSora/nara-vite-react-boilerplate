import { lazy, Suspense } from "react";
import type { ComponentType, LazyExoticComponent } from "react";

import { cn } from "~/lib/utils";

interface LazyComponentWrapperProps {
  fallback?: React.ReactNode;
  className?: string;
}

/**
 * Creates a lazy-loaded component with a loading fallback
 */
export function createLazyComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback?: React.ReactNode,
): LazyExoticComponent<T> {
  return lazy(importFn);
}

/**
 * Component wrapper that provides Suspense boundary for lazy components
 */
export function LazyComponentWrapper({
  children,
  fallback,
  className,
}: LazyComponentWrapperProps & { children: React.ReactNode }) {
  const defaultFallback = (
    <div className={cn("flex items-center justify-center min-h-[200px]", className)}>
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <Suspense fallback={fallback || defaultFallback}>
      {children}
    </Suspense>
  );
}

/**
 * Higher-order component that wraps a lazy component with Suspense
 */
export function withLazyWrapper<T extends ComponentType<any>>(
  LazyComponent: LazyExoticComponent<T>,
  fallback?: React.ReactNode,
) {
  return function WrappedLazyComponent(props: React.ComponentProps<T>) {
    return (
      <LazyComponentWrapper fallback={fallback}>
        <LazyComponent {...props} />
      </LazyComponentWrapper>
    );
  };
}