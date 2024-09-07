import { FC, Suspense, lazy } from 'react'
import '#core/presentation/styles/tailwind.css'
import FullScreenSpinner from '#root/core/presentation/components/full-screen-spinner'

const HelloWorld = lazy<FC>(() => import('#root/features/hello-world/presentation/pages'))

const RootPage: FC = () => {
  return (
    <Suspense fallback={<FullScreenSpinner />}>
      <HelloWorld />
    </Suspense>
  )
}

export default RootPage
