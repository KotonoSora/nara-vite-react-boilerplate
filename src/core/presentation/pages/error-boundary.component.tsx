import { HomeIcon, RefreshCwIcon as RefreshIcon } from 'lucide-react'
import { isRouteErrorResponse, useNavigate, useRouteError } from 'react-router'

import { Alert, AlertDescription, AlertTitle } from '#root/components/ui/alert'
import { Button } from '#root/components/ui/button'

export default function ErrorBoundary() {
  const error = useRouteError()
  const navigate = useNavigate()

  const handleGoHome = () => {
    navigate('/')
  }

  const handleRetry = () => {
    window.location.reload()
  }

  const logError = (error: unknown) => {
    console.error(error)
  }

  if (error) {
    logError(error)
  }

  if (isRouteErrorResponse(error)) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
        <Alert
          variant='destructive'
          className='max-w-md'
        >
          <AlertTitle>
            {error.status} {error.statusText}
          </AlertTitle>
          <AlertDescription>{error.data}</AlertDescription>
        </Alert>
        <div className='mt-4 space-x-2'>
          <Button
            className='mt-4'
            onClick={handleGoHome}
          >
            <HomeIcon />
            Go to Home
          </Button>
          <Button
            className='mt-4'
            onClick={handleRetry}
            variant='outline'
          >
            <RefreshIcon />
            Try Again
          </Button>
        </div>
      </div>
    )
  } else if (error instanceof Error) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
        <Alert
          variant='destructive'
          className='max-w-md'
        >
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
        <div className='mt-4 space-x-2'>
          <Button
            className='mt-4'
            onClick={handleGoHome}
          >
            <HomeIcon />
            Go to Home
          </Button>
          <Button
            className='mt-4'
            onClick={handleRetry}
            variant='outline'
          >
            <RefreshIcon />
            Try Again
          </Button>
        </div>
      </div>
    )
  } else {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
        <Alert
          variant='destructive'
          className='max-w-md'
        >
          <AlertTitle>Unknown Error</AlertTitle>
          <AlertDescription>Something went wrong!</AlertDescription>
        </Alert>
        <div className='mt-4 space-x-2'>
          <Button
            className='mt-4'
            onClick={handleGoHome}
          >
            <HomeIcon />
            Go to Home
          </Button>
          <Button
            className='mt-4'
            onClick={handleRetry}
            variant='outline'
          >
            <RefreshIcon />
            Try Again
          </Button>
        </div>
      </div>
    )
  }
}
