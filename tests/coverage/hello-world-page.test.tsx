import { App } from '#root/features/hello-world/presentation/pages/app'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

describe('App Component', () => {
  it('renders the App component and verifies static content', async () => {
    render(
      <HelmetProvider>
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </HelmetProvider>
    )

    // Check that the title is set correctly by Helmet
    await waitFor(() => {
      expect(document.title).toBe('Hello World Page')
    })

    // Check if logos are rendered correctly
    const viteLogo = screen.getByTestId('vite-logo')
    const reactLogo = screen.getByTestId('react-logo')
    expect(viteLogo).toBeInTheDocument()
    expect(reactLogo).toBeInTheDocument()

    // Check if links are present and correct
    const viteLink = screen.getByTestId('vite-link')
    const reactLink = screen.getByTestId('react-link')
    expect(viteLink).toHaveAttribute('href', 'https://vitejs.dev')
    expect(reactLink).toHaveAttribute('href', 'https://react.dev')

    // Check the header content
    expect(screen.getByTestId('title')).toHaveTextContent('Vite + React')

    // Check that the button exists with the initial count of 0
    const button = screen.getByTestId('counter-button')
    expect(button).toHaveTextContent('count is 0')
  })

  it('increments count when the button is clicked', () => {
    render(
      <HelmetProvider>
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </HelmetProvider>
    )

    const button = screen.getByTestId('counter-button')
    fireEvent.click(button)

    // Expect the count to increase after click
    expect(button).toHaveTextContent('count is 1')

    fireEvent.click(button)
    expect(button).toHaveTextContent('count is 2')
  })

  it('contains correct footer text', () => {
    render(
      <HelmetProvider>
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </HelmetProvider>
    )

    // Check if the footer text is rendered correctly
    expect(screen.getByTestId('footer-text')).toHaveTextContent('Click on the Vite and React logos to learn more')
  })
})

describe('App Component', () => {
  beforeEach(() => {
    render(
      <HelmetProvider>
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </HelmetProvider>
    )
  })

  it('renders the main elements correctly', () => {
    expect(screen.getByTestId('app-root')).toBeInTheDocument()
    expect(screen.getByTestId('title')).toHaveTextContent('Vite + React')
    expect(screen.getByTestId('counter-button')).toHaveTextContent('count is 0')
    expect(screen.getByTestId('edit-code')).toHaveTextContent('Edit src/App.tsx and save to test HMR')
    expect(screen.getByTestId('footer-text')).toHaveTextContent('Click on the Vite and React logos to learn more')
  })

  it('increments count when button is clicked', () => {
    const button = screen.getByTestId('counter-button')
    fireEvent.click(button)
    expect(button).toHaveTextContent('count is 1')
    fireEvent.click(button)
    expect(button).toHaveTextContent('count is 2')
  })

  it('sets the document title via Helmet', async () => {
    await waitFor(() => {
      expect(document.title).toBe('Hello World Page')
    })
  })

  it('renders the Vite and React logos', () => {
    expect(screen.getByTestId('vite-logo')).toBeInTheDocument()
    expect(screen.getByTestId('react-logo')).toBeInTheDocument()
  })

  it('links to Vite and React websites', () => {
    expect(screen.getByTestId('vite-link')).toHaveAttribute('href', 'https://vitejs.dev')
    expect(screen.getByTestId('react-link')).toHaveAttribute('href', 'https://react.dev')
  })
})
