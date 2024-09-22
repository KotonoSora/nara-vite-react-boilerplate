import { RouterProvider } from '#root/core/infrastructure/routing/application-router-provider'
import { FullScreenSpinner } from '#root/core/presentation/components/loading'
import { FC, Suspense } from 'react'
import { HelmetProvider } from 'react-helmet-async'

export const App: FC = () => {
  return (
    <Suspense fallback={<FullScreenSpinner />}>
      <HelmetProvider>
        <RouterProvider />
      </HelmetProvider>
    </Suspense>
  )
}
