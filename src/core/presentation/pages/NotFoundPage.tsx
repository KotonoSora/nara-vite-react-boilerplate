import { FC } from 'react'
import { Link } from 'react-router-dom'

const NotFoundPage: FC = () => {
  return (
    <div className='min-h-screen bg-gray-100 flex flex-col justify-center items-center'>
      <h1 className='text-6xl font-bold text-gray-800'>404</h1>
      <h2 className='text-2xl font-semibold text-gray-700 mt-4'>Page Not Found</h2>
      <p className='text-gray-500 mt-2'>Sorry, the page you are looking for does not exist.</p>
      <Link
        to='/home'
        className='mt-6 inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded'
      >
        Go Back Home
      </Link>
    </div>
  )
}

export default NotFoundPage
