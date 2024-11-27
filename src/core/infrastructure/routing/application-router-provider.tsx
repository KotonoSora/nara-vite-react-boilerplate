import { createBrowserRouter, RouteObject } from 'react-router'
import { RouterProvider as RRProvider } from 'react-router/dom'

function convert(m: any) {
  const { clientLoader, clientAction, default: Component, ...rest } = m

  return {
    ...rest,
    loader: clientLoader,
    action: clientAction,
    Component,
  }
}

const routers: RouteObject[] = [
  {
    path: '/',
    index: true,
    lazy: async () => import('#core/presentation/pages/home-page').then(convert),
  },
  {
    path: '*',
    lazy: async () => import('#core/presentation/pages/not-found-page').then(convert),
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
