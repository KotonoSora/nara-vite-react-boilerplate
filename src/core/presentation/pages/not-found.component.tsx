import { Helmet } from 'react-helmet-async'
import { Link, useLoaderData } from 'react-router'

import { Button } from '#root/components/ui/button'

export default function NotFoundPage() {
  const data = useLoaderData()

  return (
    <>
      <Helmet>
        <title>{data.title}</title>
      </Helmet>

      <div
        className='fixed inset-0 bg-gray-100 flex flex-col justify-center items-center'
        data-testid='not-found-page'
      >
        <h1
          className='text-6xl font-bold text-gray-800'
          aria-level={1}
          data-testid='not-found-heading'
        >
          404
        </h1>
        <h2
          className='text-2xl font-semibold text-gray-700 mt-4'
          aria-level={2}
          data-testid='not-found-subheading'
        >
          Page Not Found
        </h2>
        <p
          className='text-gray-500 mt-2'
          data-testid='not-found-message'
        >
          Sorry, the page you are looking for does not exist.
        </p>

        <Button
          asChild
          className='mt-6'
          data-testid='go-back-link'
        >
          <Link to='/'>Go Back Home</Link>
        </Button>
      </div>
    </>
  )
}
