import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'

const PrimaryLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  )
}

export default PrimaryLayout