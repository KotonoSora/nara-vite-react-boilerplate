import { FullScreenSpinner } from '#root/core/presentation/components/loading'
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

describe('FullScreenSpinner Component', () => {
  it('renders the spinner container with status role', () => {
    const { getByTestId } = render(<FullScreenSpinner />)

    // Verify the container is rendered with the correct role and label
    const spinnerContainer = getByTestId('fullscreen-wrapper')
    expect(spinnerContainer).toBeInTheDocument()
  })

  it('renders the spinner element with the correct styling and animation', () => {
    const { getByTestId } = render(<FullScreenSpinner />)

    // Verify the spinner element is rendered with the correct styles
    const spinnerElement = getByTestId('spinner')
    expect(spinnerElement).toBeInTheDocument()

    // Check if the spinner has the correct Tailwind pseudo-element classes
    expect(spinnerElement).toHaveClass(
      'before:absolute',
      'before:m-[2px]',
      'before:border-[inherit]',
      'before:rounded-full',
      'before:animate-[spin_2s_infinite_linear]'
    )
    expect(spinnerElement).toHaveClass(
      'after:absolute',
      'after:m-[8px]',
      'after:border-[inherit]',
      'after:rounded-full',
      'after:animate-[spin_3s_infinite_linear]'
    )
  })
})
