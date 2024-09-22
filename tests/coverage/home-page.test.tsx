import { HomePage } from '#root/core/presentation/pages/home-page'
import { render, waitFor } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

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
      expect(document.title).toBe('Home Page')
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

    // Verify that each button is rendered with the correct test IDs
    expect(getByTestId('primary-button')).toBeInTheDocument()
    expect(getByTestId('secondary-button')).toBeInTheDocument()
    expect(getByTestId('destructive-button')).toBeInTheDocument()
    expect(getByTestId('outline-button')).toBeInTheDocument()
    expect(getByTestId('ghost-button')).toBeInTheDocument()
    expect(getByTestId('link-button')).toHaveAttribute('href', '/link')
    expect(getByTestId('chevron-button')).toHaveAttribute('aria-label', 'Chevron Button')
    expect(getByTestId('login-button')).toBeInTheDocument()
    expect(getByTestId('loading-button')).toHaveAttribute('disabled')
    expect(getByTestId('hello-world-button')).toHaveAttribute('href', '/hello-world')
  })

  it('renders buttons with icons correctly', () => {
    const { getByTestId } = render(
      <HelmetProvider>
        <MemoryRouter>
          <HomePage />
        </MemoryRouter>
      </HelmetProvider>
    )

    // Check if buttons with icons are present
    expect(getByTestId('chevron-button')).toBeInTheDocument()
    expect(getByTestId('login-button')).toBeInTheDocument()
    expect(getByTestId('loading-button')).toBeInTheDocument()
  })
})
