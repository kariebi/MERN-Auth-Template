import React, { useContext } from 'react'
import { UserContext } from "../contexts/userContext"

const Dashboard = () => {
  const { user } = useContext(UserContext)
  return (
    <div>
      <div>Dashboard</div>
      {!!user && <h1> Hi {user.name}!</h1>}
    </div >
  )
}

export default Dashboard