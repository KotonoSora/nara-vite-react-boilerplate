import { createBrowserRouter, RouteObject } from 'react-router'
import { RouterProvider } from 'react-router/dom'

type Module<T> = {
  default: T
}

function convert<A, L, C, E>([clientAction, clientLoader, Component, ErrorBoundary]: [
  Module<A>,
  Module<L>,
  Module<C>,
  Module<E>,
]) {
  return {
    action: clientAction.default,
    loader: clientLoader.default,
    Component: Component.default,
    ErrorBoundary: ErrorBoundary.default,
  }
}

function convertModule<D>(module: Module<D>) {
  return { Component: module.default }
}

const routers: RouteObject[] = [
  {
    path: '/',
    index: true,
    lazy: async () =>
      Promise.all([
        import('#core/presentation/pages/home.action'),
        import('#core/presentation/pages/home.loader'),
        import('#core/presentation/pages/home.component'),
        import('#core/presentation/pages/error-boundary.component'),
      ]).then(convert),
  },
  {
    path: '/403',
    lazy: async () =>
      Promise.all([
        import('#core/presentation/pages/forbidden.action'),
        import('#core/presentation/pages/forbidden.loader'),
        import('#core/presentation/pages/forbidden.component'),
        import('#core/presentation/pages/error-boundary.component'),
      ]).then(convert),
  },
  {
    path: '/*',
    lazy: async () =>
      Promise.all([
        import('#core/presentation/pages/not-found.action'),
        import('#core/presentation/pages/not-found.loader'),
        import('#core/presentation/pages/not-found.component'),
        import('#core/presentation/pages/error-boundary.component'),
      ]).then(convert),
  },
  {
    path: '/sample',
    children: [
      {
        path: 'login',
        lazy: async () => await import('@/app/login-01/page').then(convertModule),
      },
      {
        path: 'sidebar-01',
        lazy: async () => await import('@/app/dashboard-01/page').then(convertModule),
      },
    ],
  },
]

const configs = {
  basename: import.meta.env.BASE_URL,
  future: {
    v7_relativeSplatPath: true,
    v7_startTransition: true,
    v7_fetcherPersist: true,
    v7_normalizeFormMethod: true,
    v7_partialHydration: true,
    v7_skipActionErrorRevalidation: true,
  },
}

const browserRouterConfig = createBrowserRouter(routers, configs)

export default function ApplicationRouterProvider() {
  return <RouterProvider router={browserRouterConfig} />
}
