import React from 'react'
import Tag from '../components/Tag'

const Missing = () => {
  return (
    <div className='flex-grow w-full h-ful flex justify-center flex-col items-center'>
      <header
        className='font-bold text-3xl'>
        404 Page Not Found
      </header>
      <Tag />
    </div>
  )
}

export default Missing