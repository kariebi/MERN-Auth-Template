import React, { useEffect } from 'react'
import useAuth from '../hooks/useAuth'
import {
  useNavigate,
  Link,
  useLocation
} from 'react-router-dom'
import { useSendLogoutMutation } from '../auth/authApiSlice'


const Dashboard = () => {

  const { username, status } = useAuth()
  const navigate = useNavigate()
  // const { pathname } = useLocation()

  const [sendLogout, {
    isLoading,
    isSuccess,
    isError,
    error
  }] = useSendLogoutMutation()



  useEffect(() => {
    if (isSuccess) navigate('/')
  }, [isSuccess, navigate])

  return (
    <div>
      <div>Dashboard</div>
      <section>
        <p>Current User: {username}</p>
        <p>Status: {status}</p>
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