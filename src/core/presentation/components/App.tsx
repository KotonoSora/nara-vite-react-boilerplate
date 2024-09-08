import { FC, Suspense } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { RouterProvider } from '#core/infrastructure/routing/ApplicationRouterProvider'
import { FullScreenSpinner } from '#core/presentation/components/Loading'

const App: FC = () => {
  return (
    <Suspense fallback={<FullScreenSpinner />}>
      <HelmetProvider>
        <RouterProvider />
      </HelmetProvider>
    </Suspense>
  )
}

export default App
