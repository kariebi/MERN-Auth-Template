import { useRef, useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setCredentials } from '../auth/authSlice'
import { useLoginMutation } from '../auth/authApiSlice'
import usePersist from '../hooks/usePersist'
import useTitle from '../hooks/useTitle'
import toast from 'react-hot-toast';
import PulseLoader from 'react-spinners/PulseLoader'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"

const SignIn = () => {
  useTitle('SignIn')


  const emailRef = useRef()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [persist, setPersist] = usePersist()
  const [PasswordVisible, setPasswordVisibility] = useState(false);

  const [login, { isLoading }] = useLoginMutation()
  const handleToggle = () => setPersist(prev => !prev)

  const HandlePasswordVisibility = () => {
    setPasswordVisibility(!PasswordVisible);
    // console.log(PasswordVisible);
  };

  useEffect(() => {
    emailRef.current.focus()
  }, [])

  const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      const { accessToken } = await login({ email, password }).unwrap()
      dispatch(setCredentials({ accessToken }))
      // Handle successful login, e.g., set user state or redirect
      setEmail('')
      setPassword('')
      setPersist(true)
      toast.success('Login Successful')
      navigate('/userdashboard')
      // console.log('Registration successful:', response.data);
    } catch (error) {
      // Display error using react-hot-toast
      toast.error('Failed to sign in. Please check your credentials.');
      console.error('Sign In Error:', error);
    }
  };

  return (
    <div className='w-full h-full flex-grow flex justify-center items-center'>
      <section
        className='bg-black/90 max-w-[282px] px-5 py-5 rounded-2xl'
      >
        <form
          onSubmit={handleSignIn}
          className='flex flex-col justify-center'
        >
          <h1
            className='w-full text-white mb-4 mt-3 text-center font-bold text-2xl'>
            Welcome Back
          </h1>

          <div
            className='mt-4 w-full flex bg-white px-3 py-2 rounded-3xl'
          >
            <input
              className='bg-transparent focus:outline-none'
              placeholder='Email'
              type="email"
              value={email}
              ref={emailRef}
              onChange={(e) => setEmail(e.target.value)}
              required />
          </div>

          <div
            className='mt-4 w-full flex bg-white px-3 py-2 rounded-3xl'
          >
            <input
              className='bg-transparent focus:outline-none'
              placeholder='Password'
              type={PasswordVisible ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required />
            <div type='' onClick={HandlePasswordVisibility}>
              <FontAwesomeIcon
                icon={PasswordVisible ? faEye : faEyeSlash}
                size="sm"
                style={{ color: "#000000", marginLeft: 'auto' }} />
            </div>
          </div>

          <button 
          className='mt-5 mb-1 w-full justify-center flex bg-white px-3 py-3 rounded-xl'
          type="submit">Sign In</button>

          <section className='w-full justify-center items-center'>
            <div
              className='w-full cursor-pointer justify-center text-center bg-white px-3 py-2 mt-3 rounded-3xl'>
              Sign in with Google
            </div>
          </section>
          <section
          className='w-full text-center text-sm mt-3'
          >
            <Link
              to="/register"
              className='text-gray-400 underline'
            > 
            Forgot Password?
            </Link>
          </section>
          <section
          className='w-full text-center text-white text-sm mt-1'
          >
            Don't have an account?
            <Link
              to="/register"
              className='text-gray-400 underline'
            > SignUp</Link>
          </section>
        </form>
      </section>
    </div>
  );
};

export default SignIn;
