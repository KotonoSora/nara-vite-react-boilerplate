import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import RootPage from '#root/core/interfaces/pages/RootPage'

const root = document.getElementById('root')

if (root) {
  createRoot(root).render(
    <StrictMode>
      <RootPage />
    </StrictMode>
  )

  if (import.meta.env.PROD) {
    import('#root/infrastructure/utils/forceUpgradeVersion.ts')
      .then(module => {
        module.default()
        console.log('Module imported and function executed successfully.')
      })
      .catch(error => {
        console.error('Failed to load the module:', error)
      })
  }
}
