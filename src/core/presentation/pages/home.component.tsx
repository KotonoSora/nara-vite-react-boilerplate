import { Helmet } from 'react-helmet-async'
import { Link, useLoaderData } from 'react-router'

import { Button } from '#shadcn-ui/components/ui/button'

export default function HomePage() {
  const data = useLoaderData()

  return (
    <>
      <Helmet>
        <title>{data.title}</title>
      </Helmet>

      <div className='min-h-screen bg-gray-100 flex flex-col items-center justify-center'>
        <header
          className='text-4xl font-bold text-gray-900'
          data-testid='header-text'
        >
          Welcome to the Home Page
        </header>
        <p
          className='mt-4 text-lg text-gray-700'
          data-testid='description-text'
        >
          This is the main landing page of the website.
        </p>
        <Button
          asChild
          size='lg'
          className='mt-6 bg-blue-600 hover:bg-blue-700'
          data-testid='get-started-button'
        >
          <Link to='/'>Get Started</Link>
        </Button>
      </div>
    </>
  )
}
