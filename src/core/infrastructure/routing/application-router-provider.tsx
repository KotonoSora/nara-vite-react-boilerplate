import { createBrowserRouter, RouteObject } from 'react-router'
import { RouterProvider as RRProvider } from 'react-router/dom'

const routers: RouteObject[] = [
  {
    path: '/',
    lazy: async () => {
      const module = await import('#core/presentation/pages/home-page')
      return { Component: module.HomePage }
    },
  },
  {
    path: '*',
    lazy: async () => {
      const module = await import('#core/presentation/pages/not-found-page')
      return { Component: module.NotFoundPage }
    },
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

export default () => {
  return <RRProvider router={browserRouterConfig} />
}
