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
  const { username, status, verified } = useAuth()
  const navigate = useNavigate()
  // const { pathname } = useLocation()

  const [sendLogout, {
    isLoading,
    isSuccess,
    isError,
    error
  }] = useSendLogoutMutation()

  console.log(verified)

  useEffect(() => {
    if (isSuccess) navigate('/')
  }, [isSuccess, navigate])

  return (
    <div className='flex-grow'>
      <div>Dashboard</div>
      <section>
        <p>Current User: {username}</p>
        <p>Status: {status}</p>
        <p>Email Verified: {verified}</p>
      </section>
      <button
        className=""
        title="Logout"
        onClick={sendLogout}
      >
        Logout
      </button>
    </div>
  )
}

export default Dashboard