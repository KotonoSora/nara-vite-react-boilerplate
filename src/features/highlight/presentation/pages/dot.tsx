import React from 'react'

export const HighlightSquare: React.FC = () => {
  return (
    <div className='fixed inset-0 flex flex-col flex-wrap gap-2 items-center justify-center'>
      <div className='relative w-[5px] h-[5px]'>
        <div className='absolute inset-0 bg-[#FF8A00] rounded-full' />
        <div className='absolute inset-0 w-full h-full bg-[#FF8A00] rounded-full opacity-20 animate-ping-slower-extended' />
        <div className='absolute inset-0 w-full h-full bg-[#FF8A00] rounded-full opacity-20 animate-ping-slower-extended delay-1000' />
        <div className='absolute inset-0 w-full h-full bg-[#FF8A00] rounded-full opacity-20 animate-ping-slower-extended delay-2000' />
      </div>
    </div>
  )
}
