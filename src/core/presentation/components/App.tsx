import { FC, Suspense } from 'react'
import { RouterProvider } from '#core/infrastructure/routing/ApplicationRouterProvider'
import { FullScreenSpinner } from '#core/presentation/components/Loading'

const App: FC = () => {
  return (
    <Suspense fallback={<FullScreenSpinner />}>
      <RouterProvider />
    </Suspense>
  )
}

export default App
