import React, { Suspense, lazy } from 'react'
import '#root/infrastructure/tailwind/tailwind.css'
import Loading from '#root/core/interfaces/ui/Loading.tsx'

const App = lazy(() => import('#root/features/hello-world/interfaces/ui/App'))

const RootPage: React.FC = () => {
  return (
    <Suspense fallback={<Loading />}>
      <App />
    </Suspense>
  )
}

export default RootPage
