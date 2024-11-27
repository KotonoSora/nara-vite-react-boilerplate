import { Helmet } from 'react-helmet-async'
import { useLoaderData } from 'react-router'

export async function clientLoader() {
  return {
    title: 'Home Page',
  }
}

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
        <button
          className='mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700'
          data-testid='get-started-button'
        >
          Get Started
        </button>
      </div>
    </>
  )
}
