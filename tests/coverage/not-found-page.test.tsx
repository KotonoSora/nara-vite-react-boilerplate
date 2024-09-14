import { describe, it, expect } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { MemoryRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import NotFoundPage from '#core/presentation/pages/NotFoundPage'

describe('NotFoundPage Component', () => {
  it('renders the correct content', () => {
    const { getByText } = render(
      <HelmetProvider>
        <MemoryRouter>
          <NotFoundPage />
        </MemoryRouter>
      </HelmetProvider>
    )

    expect(getByText('404')).toBeInTheDocument()
    expect(getByText('Page Not Found')).toBeInTheDocument()
    expect(getByText('Sorry, the page you are looking for does not exist.')).toBeInTheDocument()
  })

  it('has the correct title in Helmet', async () => {
    render(
      <HelmetProvider>
        <MemoryRouter>
          <NotFoundPage />
        </MemoryRouter>
      </HelmetProvider>
    )

    // Wait for the document title to be updated
    await waitFor(() => {
      expect(document.title).toBe('Not Found Page')
    })
  })

  it('renders the Go Back Home button with a link to /home', () => {
    const { getByRole } = render(
      <HelmetProvider>
        <MemoryRouter>
          <NotFoundPage />
        </MemoryRouter>
      </HelmetProvider>
    )

    // Find the button by its role
    const buttonElement = getByRole('link', { name: /go back home/i })
    expect(buttonElement).toBeInTheDocument()
    expect(buttonElement).toHaveAttribute('href', '/home')
  })
})
