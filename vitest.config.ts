import { defineConfig, mergeConfig } from 'vitest/config'

import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      setupFiles: './tests/vitest-global-setup.ts',
      globals: true,
      coverage: {
        enabled: true,
        provider: 'v8',
        reporter: ['lcov'],
        reportsDirectory: './coverage',
        all: true,
        include: ['src/**/*.{ts,tsx}', 'plugins/**/*.{ts,tsx}'],
        exclude: ['node_modules/', 'tests/', 'dist/', '.yarn', '.vscode', '**/*.d.ts', 'src/**/__tests__/**'],
      },
    },
  })
)
