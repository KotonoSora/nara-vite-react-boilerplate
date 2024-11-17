import { FC, lazy, Suspense } from 'react'
import { HelmetProvider } from 'react-helmet-async'

import { FullScreenSpinner } from '#core/presentation/components/loading'

const RouterProvider = lazy(() => import('#core/infrastructure/routing/application-router-provider'))

export const App: FC = () => {
  return (
    <Suspense fallback={<FullScreenSpinner />}>
      <HelmetProvider>
        <RouterProvider />
      </HelmetProvider>
    </Suspense>
  )
}
