import { FullScreenSpinner } from '#core/presentation/components/loading'
import { createBrowserRouter, Navigate, RouterProvider as RRProvider } from 'react-router-dom'

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
      const module = await import('#core/presentation/pages/home-page')
      return { Component: module.HomePage }
    },
  },
  {
    path: '/hello-world',
    lazy: async () => {
      const module = await import('#features/hello-world/presentation/pages/app')
      return { Component: module.App }
    },
  },
  {
    path: '/highlight',
    lazy: async () => {
      const module = await import('#features/highlight/presentation/pages/dot')
      return { Component: module.HighlightSquare }
    },
  },
  {
    path: '/fullscreen-spinner',
    element: <FullScreenSpinner />,
  },
  {
    path: '*',
    lazy: async () => {
      const module = await import('#core/presentation/pages/not-found-page')
      return { Component: module.NotFoundPage }
    },
  },
])

export const RouterProvider = () => {
  return <RRProvider router={router} />
}
