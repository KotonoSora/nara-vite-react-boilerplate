// forceUpgradeVersion.test.ts
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { Mock } from 'vitest'

import { forceUpgradeVersion } from '#core/infrastructure/providers/force-upgrade-version'

describe('forceUpgradeVersion', () => {
  let originalNavigator: Navigator
  let originalLocation: Location
  let originalConfirm: (message?: string) => boolean
  let mockConfirm: Mock

  beforeEach(() => {
    vi.stubEnv('PROD', true)

    originalNavigator = global.navigator

    const serviceWorkerRegistrationMock = {
      installing: null,
      addEventListener: vi.fn(),
    }

    const serviceWorkerMock = {
      controller: {},
      addEventListener: vi.fn(),
      register: vi.fn().mockResolvedValue(serviceWorkerRegistrationMock),
    }

    Object.defineProperty(global, 'navigator', {
      value: { ...global.navigator, serviceWorker: serviceWorkerMock },
      writable: true,
    })

    originalLocation = window.location
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...window.location, reload: vi.fn() },
    })

    originalConfirm = global.confirm
    mockConfirm = vi.fn().mockReturnValue(true)
    global.confirm = mockConfirm
  })

  afterEach(() => {
    global.navigator = originalNavigator
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: originalLocation,
    })
    global.confirm = originalConfirm

    vi.unstubAllEnvs()
    vi.clearAllMocks()
  })

  it('should not register service worker if not in production', () => {
    vi.stubEnv('PROD', false)

    forceUpgradeVersion()

    expect(navigator.serviceWorker.register).not.toHaveBeenCalled()
  })

  it('should register service worker if in production', () => {
    vi.stubEnv('PROD', true)

    forceUpgradeVersion()

    const serviceWorkerUrl = import.meta.env.BASE_URL + 'sw.js'

    expect(navigator.serviceWorker.register).toHaveBeenCalledWith(serviceWorkerUrl)
  })

  it('should reload the page when controllerchange event is fired', () => {
    let controllerChangeCallback: () => void = () => {}
    navigator.serviceWorker.addEventListener = vi.fn((event, callback) => {
      if (event === 'controllerchange') {
        controllerChangeCallback = callback
      }
    })

    forceUpgradeVersion()

    controllerChangeCallback()

    expect(window.location.reload).toHaveBeenCalledTimes(1)
  })

  it('should not reload the page multiple times', () => {
    let controllerChangeCallback: () => void = () => {}
    navigator.serviceWorker.addEventListener = vi.fn((event, callback) => {
      if (event === 'controllerchange') {
        controllerChangeCallback = callback
      }
    })

    forceUpgradeVersion()

    controllerChangeCallback()
    controllerChangeCallback()

    expect(window.location.reload).toHaveBeenCalledTimes(1)
  })

  it('should prompt user when new service worker is installed', async () => {
    const newWorkerPostMessage = vi.fn()
    const newWorker = {
      state: 'installed',
      addEventListener: vi.fn((event: string, callback: () => void) => {
        if (event === 'statechange') {
          callback()
        }
      }),
      postMessage: newWorkerPostMessage,
    }

    const registration = {
      installing: newWorker,
      addEventListener: vi.fn((event: string, callback: () => void) => {
        if (event === 'updatefound') {
          callback()
        }
      }),
    }

    navigator.serviceWorker.register = vi.fn().mockResolvedValue(registration)

    forceUpgradeVersion()

    await Promise.resolve()

    expect(confirm).toHaveBeenCalledWith('New version available. Do you want to update?')
    expect(newWorker.postMessage).toHaveBeenCalledWith({ type: 'SKIP_WAITING' })
  })

  it('should not prompt if there is no new worker', async () => {
    const registration = {
      installing: null,
      addEventListener: vi.fn(),
    }

    navigator.serviceWorker.register = vi.fn().mockResolvedValue(registration)

    forceUpgradeVersion()

    await Promise.resolve()

    expect(confirm).not.toHaveBeenCalled()
  })

  it('should not send SKIP_WAITING if user cancels the update', async () => {
    mockConfirm.mockReturnValue(false)

    const newWorkerPostMessage = vi.fn()
    const newWorker = {
      state: 'installed',
      addEventListener: vi.fn((event: string, callback: () => void) => {
        if (event === 'statechange') {
          callback()
        }
      }),
      postMessage: newWorkerPostMessage,
    }

    const registration = {
      installing: newWorker,
      addEventListener: vi.fn((event: string, callback: () => void) => {
        if (event === 'updatefound') {
          callback()
        }
      }),
    }

    navigator.serviceWorker.register = vi.fn().mockResolvedValue(registration)

    forceUpgradeVersion()

    await Promise.resolve()

    expect(newWorker.postMessage).not.toHaveBeenCalled()
  })

  // Add this test case to your forceUpgradeVersion.test.ts

  it('should return early when newWorker is falsy', async () => {
    const registration = {
      installing: null, // newWorker will be null
      addEventListener: vi.fn((event: string, callback: () => void) => {
        if (event === 'updatefound') {
          callback() // Simulate updatefound event
        }
      }),
    }

    navigator.serviceWorker.register = vi.fn().mockResolvedValue(registration)

    forceUpgradeVersion()

    await Promise.resolve()

    // Since newWorker is falsy, confirm should not be called
    expect(confirm).not.toHaveBeenCalled()
    // Ensure that newWorker's event listener was not added
    expect(registration.installing).toBeNull()
  })
})
