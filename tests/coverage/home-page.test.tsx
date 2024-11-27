import { render, waitFor } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'

import HomePage from '#core/presentation/pages/home.component'

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router')

  return {
    ...actual,
    useLoaderData: vi.fn().mockReturnValue({ title: 'Home Page - Mocked Loader Data' }),
  }
})

describe('HomePage Component', () => {
  it('renders the page title correctly', async () => {
    render(
      <HelmetProvider>
        <MemoryRouter>
          <HomePage />
        </MemoryRouter>
      </HelmetProvider>
    )

    // Test the page title set by Helmet
    await waitFor(() => {
      expect(document.title).toBe('Home Page - Mocked Loader Data')
    })
  })

  it('renders all buttons with correct variants and labels', () => {
    const { getByTestId } = render(
      <HelmetProvider>
        <MemoryRouter>
          <HomePage />
        </MemoryRouter>
      </HelmetProvider>
    )

    // Verify that each element is rendered with the correct test IDs
    expect(getByTestId('header-text')).toBeInTheDocument()
    expect(getByTestId('header-text')).toHaveTextContent('Welcome to the Home Page')
    expect(getByTestId('description-text')).toBeInTheDocument()
    expect(getByTestId('description-text')).toHaveTextContent('This is the main landing page of the website.')
    expect(getByTestId('get-started-button')).toBeInTheDocument()
    expect(getByTestId('get-started-button')).toHaveTextContent('Get Started')
  })
})
