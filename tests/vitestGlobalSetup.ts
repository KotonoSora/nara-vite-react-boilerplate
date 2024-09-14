import '@testing-library/dom'

/* eslint-disable no-var */
import { vi } from 'vitest'

// Extend the global object type to include window, navigator, and document in Node.js
declare global {
  var window: Window & typeof globalThis
  var document: Document
  var navigator: Navigator
}

// Mock the global document object
const documentMock = () => {
  global.document = {
    createElement: vi.fn(() => ({
      id: '',
      innerHTML: '',
      appendChild: vi.fn(),
      removeChild: vi.fn(),
    })),
    getElementById: vi.fn(() => ({
      id: '',
      innerHTML: '',
      appendChild: vi.fn(),
      removeChild: vi.fn(),
    })),
    body: {
      appendChild: vi.fn(),
    },
  } as unknown as Document
}

// Mock the global window object, including window.history
const windowMock = () => {
  global.window = {
    location: {
      href: '',
      reload: vi.fn(),
    },
    history: {
      pushState: vi.fn(),
      replaceState: vi.fn(),
      go: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
    },
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    confirm: vi.fn(() => true), // Simulate user confirming update
  } as unknown as Window & typeof globalThis
}

// Mock the global navigator object including serviceWorker
const navigatorMock = () => {
  global.navigator = {
    serviceWorker: {
      controller: {},
      register: vi.fn(() =>
        Promise.resolve({
          installing: {
            state: 'installed',
            addEventListener: vi.fn(),
            postMessage: vi.fn(),
          },
          addEventListener: vi.fn(),
        })
      ),
      addEventListener: vi.fn(),
    },
  } as unknown as Navigator
}

// Set up the mocks
documentMock()
windowMock()
navigatorMock()

/* eslint-enable no-var */
