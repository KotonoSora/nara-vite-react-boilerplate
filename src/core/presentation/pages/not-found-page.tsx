import { Button } from '#shadcn-ui/app/ui/button'
import { FC } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

export const NotFoundPage: FC = () => {
  return (
    <div
      className='fixed inset-0 bg-gray-100 flex flex-col justify-center items-center'
      data-testid='not-found-page'
    >
      <Helmet>
        <title>Not Found Page</title>
      </Helmet>

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
        <Link to='/home'>Go Back Home</Link>
      </Button>
    </div>
  )
}
