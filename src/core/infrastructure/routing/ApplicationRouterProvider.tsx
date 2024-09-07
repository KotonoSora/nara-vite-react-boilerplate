import { FC, lazy } from 'react'
import { createBrowserRouter, Navigate, RouterProvider as RRProvider } from 'react-router-dom'

const HelloWorld = lazy<FC>(() => import('#root/features/hello-world/presentation/pages'))
const NotFoundPage = lazy<FC>(() => import('#core/presentation/pages/NotFoundPage'))

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
    element: <HelloWorld />,
    children: [
      {
        path: 'hello-world',
        element: <HelloWorld />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])

export const RouterProvider = () => {
  return <RRProvider router={router} />
}
