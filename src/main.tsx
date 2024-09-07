import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import RootPage from '#root/core/presentation/pages/root'

const root = document.getElementById('root')

if (root) {
  createRoot(root).render(
    <StrictMode>
      <RootPage />
    </StrictMode>
  )

  if (import.meta.env.PROD) {
    import('#root/core/infrastructure/providers/forceUpgradeVersion')
      .then(module => {
        module.default()
        console.info('Module imported and function executed successfully.')
      })
      .catch(error => {
        console.error('Failed to load the module:', error)
      })
  }
}
