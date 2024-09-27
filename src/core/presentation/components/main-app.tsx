import { FC, Suspense } from 'react'
import { HelmetProvider } from 'react-helmet-async'

import { RouterProvider } from '#core/infrastructure/routing/application-router-provider'
import { FullScreenSpinner } from '#core/presentation/components/loading'

export const App: FC = () => {
  return (
    <Suspense fallback={<FullScreenSpinner />}>
      <HelmetProvider>
        <RouterProvider />
      </HelmetProvider>
    </Suspense>
  )
}
