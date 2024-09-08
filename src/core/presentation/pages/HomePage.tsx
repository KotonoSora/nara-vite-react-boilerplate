import { FC } from 'react'
import { Button } from '#shadcn-ui/app/ui/button'

const HomePage: FC = () => {
  return (
    <div className='fixed inset-0 flex items-center justify-center bg-gray-100 z-50'>
      <Button variant='outline'>Button</Button>
      <Button variant='secondary'>Secondary</Button>
    </div>
  )
}

export default HomePage
