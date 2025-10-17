import { useEffect, useRef, useState } from "react";

/**
 * useLazyImport
 * A tiny hook to lazily import a module with in-flight request de-duplication,
 * caching, and unmount safety. Returns the loaded module (or null) and a loader.
 */
export function useLazyImport<T>(importFn: () => Promise<T>) {
  const [mod, setMod] = useState<T | null>(null);

  // Keep a stable ref to the latest import function to avoid stale closures
  const importFnRef = useRef(importFn);
  useEffect(() => {
    importFnRef.current = importFn;
  }, [importFn]);

  // Cache for the in-flight promise and resolved module
  const promiseRef = useRef<Promise<T> | null>(null);
  const modRef = useRef<T | null>(null);

  // Unmount guard to prevent setState after unmount
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const load = async () => {
    if (modRef.current) return; // already loaded

    if (promiseRef.current) {
      const loaded = await promiseRef.current;
      if (!modRef.current) {
        modRef.current = loaded;
        if (mountedRef.current) setMod(loaded);
      }
      return;
    }

    // Start a single import and cache its promise
    promiseRef.current = importFnRef.current();
    const loaded = await promiseRef.current;
    if (!modRef.current) {
      modRef.current = loaded;
      if (mountedRef.current) setMod(loaded);
    }
  };

  return [mod, load] as const;
}
