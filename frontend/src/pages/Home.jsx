import React from 'react'
import Tag from '../components/Tag'

const Home = () => {
  return (
    <div className='flex-grow w-full h-ful flex justify-center flex-col items-center'>
      <header
      className='font-bold text-3xl'>
        MERN AUTH Template 
      </header>
      <Tag />
    </div>
  )
}

export default Home