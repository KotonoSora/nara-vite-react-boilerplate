import '#core/infrastructure/tailwindcss/global.css'
import { App } from '#core/presentation/components/main-app'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

const root = document.getElementById('root')

if (root) {
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>
  )

  if (import.meta.env.PROD) {
    import('#core/infrastructure/providers/force-upgrade-version')
      .then(module => {
        module.forceUpgradeVersion()
        console.info('Module imported and function executed successfully.')
      })
      .catch(error => {
        console.error('Failed to load the module:', error)
      })
  }
}
