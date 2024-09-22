import { RouterProvider } from '#core/infrastructure/routing/ApplicationRouterProvider'
import { FullScreenSpinner } from '#core/presentation/components/Loading'
import { FC, Suspense } from 'react'
import { HelmetProvider } from 'react-helmet-async'

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
