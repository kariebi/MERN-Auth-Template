import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth'

const Navbar = () => {

  const { isLoggedIn } = useAuth()

  return (
    <nav
      className='w-screen px-2 text-white/90 bg-black/90 h-12 justify-between flex items-center'
    >
      <div>
        <Link
          to='/'
        >
          <h1 className='text-lg font-bold'>
            {'<MAT/>'}
          </h1>
        </Link>
      </div>
      <div
        className='text-white/70'>
        <Link
          className='px-1 hover:text-white transition duration-300'
          to="/">Home</Link>
        {isLoggedIn ?
          <>
            <Link
              className='px-1 hover:text-white transition duration-300'
              to="/userdashboard">Dashboard</Link>
          </> :
          <>
            <Link
              className='px-1 hover:text-white transition duration-300'
              to="/signin">Sign In</Link>

            <Link
              className='px-1 hover:text-white transition duration-300'
              to="/register">Register</Link>
          </>
        }
      </div>
    </nav>
  );
};

export default Navbar;
