import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'

const PrimaryLayout = () => {
  return (
    <div className='min-h-screen w-screen flex flex-col justify-center bg-black/10'>
      <Navbar />
      <Outlet />
    </div>
  )
}

export default PrimaryLayout