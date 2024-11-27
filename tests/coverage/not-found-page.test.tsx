import { render, waitFor } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'

import NotFoundPage from '#core/presentation/pages/not-found.component'

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router')

  return {
    ...actual,
    useLoaderData: vi.fn().mockReturnValue({ title: 'Not Found Page - Mocked Loader Data' }),
  }
})

describe('NotFoundPage Component', () => {
  it('renders the page title correctly', async () => {
    render(
      <HelmetProvider>
        <MemoryRouter>
          <NotFoundPage />
        </MemoryRouter>
      </HelmetProvider>
    )

    // Test that Helmet sets the correct page title
    await waitFor(() => {
      expect(document.title).toBe('Not Found Page - Mocked Loader Data')
    })
  })

  it('renders the correct headings, message, and button', () => {
    const { getByTestId } = render(
      <HelmetProvider>
        <MemoryRouter>
          <NotFoundPage />
        </MemoryRouter>
      </HelmetProvider>
    )

    // Verify the 404 heading is rendered
    expect(getByTestId('not-found-heading')).toBeInTheDocument()
    expect(getByTestId('not-found-heading')).toHaveTextContent('404')

    // Verify the subheading is rendered
    expect(getByTestId('not-found-subheading')).toBeInTheDocument()
    expect(getByTestId('not-found-subheading')).toHaveTextContent('Page Not Found')

    // Verify the message is rendered
    expect(getByTestId('not-found-message')).toBeInTheDocument()
    expect(getByTestId('not-found-message')).toHaveTextContent('Sorry, the page you are looking for does not exist.')

    // Verify the Go Back Home button is rendered
    expect(getByTestId('go-back-link')).toBeInTheDocument()

    // Verify the link inside the button
    const linkElement = getByTestId('go-back-link')
    expect(linkElement).toHaveAttribute('href', '/')
    expect(linkElement).toHaveTextContent('Go Back Home')
  })
})
