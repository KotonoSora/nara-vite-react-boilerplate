import { createBrowserRouter, RouteObject } from 'react-router'
import { RouterProvider as RRProvider } from 'react-router/dom'

type Module<T> = {
  default: T
}

function convert<A, L, C>([clientAction, clientLoader, Component]: [Module<A>, Module<L>, Module<C>]) {
  return {
    action: clientAction.default,
    loader: clientLoader.default,
    Component: Component.default,
  }
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
      ]).then(convert),
  },
  {
    path: '*',
    lazy: async () =>
      Promise.all([
        import('#core/presentation/pages/not-found.action'),
        import('#core/presentation/pages/not-found.loader'),
        import('#core/presentation/pages/not-found.component'),
      ]).then(convert),
  },
]

const configs = {
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
  return <RRProvider router={browserRouterConfig} />
}
