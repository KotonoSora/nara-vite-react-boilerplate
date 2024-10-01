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
