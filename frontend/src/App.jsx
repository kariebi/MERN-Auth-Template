import { Routes, Route } from 'react-router-dom'
import PrimaryLayout from './layouts/PrimaryLayout'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import DashLayout from './layouts/DashLayout'
import SignIn from './pages/SignIn'
import Register from './pages/Register'
import Missing from './pages/Missing'
import './App.css'
import { BASE_URL } from '../constants'
import axios from 'axios'

axios.defaults.baseURL = BASE_URL
axios.defaults.withCredentials = true

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<PrimaryLayout />}>
          <Route index element={<Home />} />
          <Route path='signin' element={<SignIn />} />
          <Route path='register' element={<Register />} />
          {/* Protected Routes */}
          <Route path='userdashboard' element={<DashLayout />}>
            <Route index element={<Dashboard />} />
          </Route>
          <Route path='*' element={<Missing/>}/>
        </Route>
      </Routes>
    </>
  )
}

export default App
