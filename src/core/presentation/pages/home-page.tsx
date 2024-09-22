import { Button } from '#shadcn-ui/app/ui/button'
import { ChevronRightIcon, EnvelopeOpenIcon, ReloadIcon } from '@radix-ui/react-icons'
import { FC } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

export const HomePage: FC = () => {
  return (
    <div className='fixed inset-0 flex flex-col flex-wrap gap-2 items-center justify-center'>
      <Helmet>
        <title>Home Page</title>
      </Helmet>
      <Button data-testid='primary-button'>Button</Button>
      <Button
        data-testid='secondary-button'
        variant='secondary'
      >
        Secondary
      </Button>
      <Button
        data-testid='destructive-button'
        variant='destructive'
      >
        Destructive
      </Button>
      <Button
        data-testid='outline-button'
        variant='outline'
      >
        Outline
      </Button>
      <Button
        data-testid='ghost-button'
        variant='ghost'
      >
        Ghost
      </Button>
      <Button
        asChild
        variant='link'
        data-testid='link-button'
      >
        <Link
          to='/link'
          aria-label='Link Button'
        >
          Link
        </Link>
      </Button>
      <Button
        variant='outline'
        size='icon'
        aria-label='Chevron Button'
        data-testid='chevron-button'
      >
        <ChevronRightIcon className='h-4 w-4 flex-shrink-0' />
      </Button>
      <Button data-testid='login-button'>
        <EnvelopeOpenIcon className='mr-2 h-4 w-4' /> Login with Email
      </Button>

      <Button
        disabled
        data-testid='loading-button'
        aria-label='Please Wait'
      >
        <ReloadIcon className='mr-2 h-4 w-4 animate-spin flex-shrink-0' />
        Please wait
      </Button>
      <Button
        asChild
        variant='link'
        data-testid='hello-world-button'
      >
        <Link
          to='/hello-world'
          aria-label='Hello World Button'
        >
          Hello World Page
        </Link>
      </Button>
      <Button
        asChild
        variant='link'
        data-testid='highlight-button'
      >
        <Link
          to='/highlight'
          aria-label='highlight Button'
        >
          Highlight Page
        </Link>
      </Button>
    </div>
  )
}
