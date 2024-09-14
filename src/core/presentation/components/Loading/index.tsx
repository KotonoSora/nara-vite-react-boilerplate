import { FC } from 'react'

export const FullScreenSpinner: FC = () => (
  <div
    className='fixed inset-0 flex items-center justify-center bg-gray-100 z-50'
    data-testid='fullscreen-wrapper'
    aria-label='Loading...'
  >
    <div
      className='w-12 aspect-[1/1] grid rounded-full border-4 border-transparent border-r-[#25b09b] animate-spin relative before:absolute before:inset-0 before:m-[2px] before:border-[inherit] before:rounded-full before:animate-[spin_2s_infinite_linear] after:absolute after:inset-0 after:m-[8px] after:border-[inherit] after:rounded-full after:animate-[spin_3s_infinite_linear]'
      data-testid='spinner'
    />
  </div>
)
