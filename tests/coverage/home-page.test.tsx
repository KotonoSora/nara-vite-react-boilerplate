import { describe, it, expect } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { MemoryRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import HomePage from '#core/presentation/pages/HomePage'

describe('HomePage Component', () => {
  it('renders the correct content', () => {
    const { getByText, getByRole } = render(
      <HelmetProvider>
        <MemoryRouter>
          <HomePage />
        </MemoryRouter>
      </HelmetProvider>
    )

    // Test for buttons with specific text
    expect(getByText('Button')).toBeInTheDocument()
    expect(getByText('Secondary')).toBeInTheDocument()
    expect(getByText('Destructive')).toBeInTheDocument()
    expect(getByText('Outline')).toBeInTheDocument()
    expect(getByText('Ghost')).toBeInTheDocument()
    expect(getByText('Login with Email')).toBeInTheDocument()
    expect(getByText('Please wait')).toBeInTheDocument()

    // Test for buttons with links
    const linkButton = getByRole('link', { name: /link/i })
    expect(linkButton).toHaveAttribute('href', '/link')

    const helloWorldButton = getByRole('link', { name: /hello world page/i })
    expect(helloWorldButton).toHaveAttribute('href', '/hello-world')
  })

  it('has the correct title in Helmet', async () => {
    render(
      <HelmetProvider>
        <MemoryRouter>
          <HomePage />
        </MemoryRouter>
      </HelmetProvider>
    )

    // Wait for the document title to be updated
    await waitFor(() => {
      expect(document.title).toBe('Home Page')
    })
  })

  it('renders buttons with correct variants', () => {
    const { getByText } = render(
      <HelmetProvider>
        <MemoryRouter>
          <HomePage />
        </MemoryRouter>
      </HelmetProvider>
    )

    // Check default button variant (primary)
    const primaryButton = getByText('Button')
    expect(primaryButton).toHaveClass('bg-slate-900', 'text-slate-50', 'hover:bg-slate-900/90')

    // Check secondary button variant
    const secondaryButton = getByText('Secondary')
    expect(secondaryButton).toHaveClass('bg-slate-100', 'text-slate-900', 'hover:bg-slate-100/80')

    // Check destructive button variant
    const destructiveButton = getByText('Destructive')
    expect(destructiveButton).toHaveClass('bg-red-500', 'text-slate-50', 'hover:bg-red-500/90')

    // Check outline button variant
    const outlineButton = getByText('Outline')
    expect(outlineButton).toHaveClass('border', 'border-slate-200', 'bg-white')

    // Check ghost button variant
    const ghostButton = getByText('Ghost')
    expect(ghostButton).toHaveClass('hover:bg-slate-100', 'hover:text-slate-900')

    // Check link button variant
    const linkButton = getByText('Link')
    expect(linkButton).toHaveClass('text-slate-900', 'hover:underline')
  })

  it('renders buttons with icons', () => {
    const { getByText, getByRole } = render(
      <HelmetProvider>
        <MemoryRouter>
          <HomePage />
        </MemoryRouter>
      </HelmetProvider>
    )

    // Check for ChevronRightIcon inside the button
    const chevronIconButton = getByRole('button', { name: '' })
    const chevronIcon = chevronIconButton.querySelector('svg') // Icon rendered as an SVG
    expect(chevronIcon).toBeInTheDocument()

    // Check for the EnvelopeOpenIcon in the "Login with Email" button
    const loginButton = getByText('Login with Email')
    const envelopeIcon = loginButton.querySelector('svg') // The icon is an SVG inside the button
    expect(envelopeIcon).toBeInTheDocument()

    // Check for the ReloadIcon in the disabled button
    const disabledButton = getByText('Please wait')
    const reloadIcon = disabledButton.querySelector('svg.animate-spin') // Select SVG with animation
    expect(reloadIcon).toBeInTheDocument()
  })
})
