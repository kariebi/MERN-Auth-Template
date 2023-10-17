import { Routes, Route } from 'react-router-dom'
import PrimaryLayout from './layouts/PrimaryLayout'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import DashLayout from './layouts/DashLayout'
import SignIn from './pages/SignIn'
import Register from './pages/Register'
import Missing from './pages/Missing'
import './App.css'
import { Toaster } from 'react-hot-toast'
import PersistLogin from './auth/PersistLogin'
import RequireAuth from './auth/RequireAuth'
import { ROLES } from './config/roles'
import useTitle from './hooks/useTitle';
import OTPVerification from './pages/OTPVerification'

function App() {
  useTitle('MERN AUTH Template')

  return (
    <>
      <Toaster position='top-center' toastOptions={{ duration: 2000 }} />
      <Routes>
        <Route path='/' element={<PrimaryLayout />}>
          <Route index element={<Home />} />
          <Route path='signin' element={<SignIn />} />
          <Route path='register' element={<Register />} />
          <Route path='otpverification' element={<OTPVerification/>}/>
          {/* Protected Routes */}
          <Route element={<PersistLogin />}>
            <Route element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />}>
              <Route path='userdashboard' element={<DashLayout />}>
                <Route index element={<Dashboard />} />
              </Route>
            </Route>
          </Route>
          <Route path='*' element={<Missing />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
