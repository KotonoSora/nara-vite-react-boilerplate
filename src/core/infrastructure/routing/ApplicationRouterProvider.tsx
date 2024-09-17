import { createBrowserRouter, Navigate, RouterProvider as RRProvider } from 'react-router-dom'
import { FullScreenSpinner } from '#core/presentation/components/Loading'

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Navigate
        to='/home'
        replace
      />
    ),
  },
  {
    path: '/home',
    lazy: async () => {
      const module = await import('#core/presentation/pages/HomePage')
      return { Component: module.default }
    },
  },
  {
    path: '/hello-world',
    lazy: async () => {
      const module = await import('#features/hello-world/presentation/pages/HelloWorldPage')
      return { Component: module.default }
    },
  },
  {
    path: '/highlight',
    lazy: async () => {
      const module = await import('#features/highlight/presentation/pages/App')
      return { Component: module.default }
    },
  },
  {
    path: '/fullscreen-spinner',
    element: <FullScreenSpinner />,
  },
  {
    path: '*',
    lazy: async () => {
      const module = await import('#core/presentation/pages/NotFoundPage')
      return { Component: module.default }
    },
  },
])

export const RouterProvider = () => {
  return <RRProvider router={router} />
}
