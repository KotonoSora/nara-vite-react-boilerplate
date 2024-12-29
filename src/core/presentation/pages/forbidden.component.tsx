import { Link } from 'react-router'

import { Alert, AlertDescription, AlertTitle } from '#root/components/ui/alert'
import { Button } from '#root/components/ui/button'

export default function ForbiddenPage() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
      <Alert
        variant='destructive'
        className='max-w-md'
      >
        <AlertTitle>403 - Forbidden</AlertTitle>
        <AlertDescription>You don’t have permission to access this page.</AlertDescription>
      </Alert>
      <Button
        asChild
        className='mt-4'
        data-testid='go-back-link'
      >
        <Link to='/'>Go Back Home</Link>
      </Button>
    </div>
  )
}
