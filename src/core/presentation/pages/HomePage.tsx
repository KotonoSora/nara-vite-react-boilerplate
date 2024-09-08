import { FC } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ChevronRightIcon, EnvelopeOpenIcon, ReloadIcon } from '@radix-ui/react-icons'
import { Button } from '#shadcn-ui/app/ui/button'

const HomePage: FC = () => {
  return (
    <div className='fixed inset-0 flex flex-col flex-wrap gap-2 items-center justify-center'>
      <Helmet>
        <title>Home Page</title>
      </Helmet>
      <Button>Button</Button>
      <Button variant='secondary'>Secondary</Button>
      <Button variant='destructive'>Destructive</Button>
      <Button variant='outline'>Outline</Button>
      <Button variant='ghost'>Ghost</Button>
      <Button
        variant='link'
        asChild
      >
        <Link to='/link'>Link</Link>
      </Button>
      <Button
        variant='outline'
        size='icon'
      >
        <ChevronRightIcon className='h-4 w-4 flex-shrink-0' />
      </Button>
      <Button>
        <EnvelopeOpenIcon className='mr-2 h-4 w-4' /> Login with Email
      </Button>
      <Button disabled>
        <ReloadIcon className='mr-2 h-4 w-4 animate-spin flex-shrink-0' />
        Please wait
      </Button>
      <Button
        asChild
        variant='link'
      >
        <Link to='/hello-world'>Hello World Page</Link>
      </Button>
    </div>
  )
}

export default HomePage
