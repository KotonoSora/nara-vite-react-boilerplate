// Test file for lazy loading components - this can be removed after optimization
import { lazy } from "react";

// Example of how we can convert existing route components to lazy-loaded
export const LazyAdminPage = lazy(() => import("~/features/admin/page").then(module => ({ default: module.ContentAdminPage })));
export const LazyDashboardPage = lazy(() => import("~/features/dashboard/page").then(module => ({ default: module.ContentDashboardPage })));
export const LazyLandingPage = lazy(() => import("~/features/landing-page/page").then(module => ({ default: module.ContentPage })));

// Test the lazy component system
export { LazyComponentWrapper, createLazyComponent } from "~/lib/components/lazy-component";