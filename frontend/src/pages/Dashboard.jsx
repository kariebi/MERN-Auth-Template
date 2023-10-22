import React, { useEffect } from 'react'
import useAuth from '../hooks/useAuth'
import {
  useNavigate,
  // Link,
  // useLocation
} from 'react-router-dom'
import { useSendLogoutMutation } from '../auth/authApiSlice'


const Dashboard = () => {
  localStorage.removeItem('email')
  const { username, status, verified, isLoggedIn } = useAuth()
  const navigate = useNavigate()
  // const { pathname } = useLocation()

  const [sendLogout, {
    isLoading,
    isSuccess,
    isError,
    error
  }] = useSendLogoutMutation()

  // console.log(verified)

  useEffect(() => {
    if (isSuccess) navigate('/')
  }, [isSuccess, navigate])

  useEffect(() => {
    if (isLoggedIn && !verified) {
      navigate('/otpverification');
    }
  }, [isLoggedIn, verified, navigate]);
  

  return (
    <div className='flex-grow px-2 pt-2'>
      <div>Dashboard</div>
      <section>
        <p>Current User: {username}</p>
        <p>Status: {status}</p>
      </section>
      <button
        className="text-white bg-black/90 px-2 py-1  rounded hover:text-black hover:bg-black/50 "
        title="Logout"
        onClick={sendLogout}
      >
        Logout
      </button>
    </div>
  )
}

export default Dashboard