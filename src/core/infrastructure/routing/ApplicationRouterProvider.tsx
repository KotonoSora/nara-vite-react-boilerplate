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
      const module = await import('#core/presentation/pages/HomePage')
      return { Component: module.default }
    },
  },
  {
    path: '/hello-world',
    lazy: async () => {
      const module = await import('#root/features/hello-world/presentation/pages/HelloWorldPage')
      return { Component: module.default }
    },
  },
  {
    path: '/fullscreen-spinner',
    lazy: async () => {
      const module = await import('#core/presentation/components/Loading')
      return { Component: module.FullScreenSpinner }
    },
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
