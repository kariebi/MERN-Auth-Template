import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import { useRegisterMutation } from '../auth/authApiSlice';
import useTitle from '../hooks/useTitle'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"
import PulseLoader from 'react-spinners/PulseLoader'
import { faGoogle } from '@fortawesome/free-brands-svg-icons'


const Register = () => {
  useTitle('Register')

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [PasswordVisible, setPasswordVisibility] = useState(false);

  const navigate = useNavigate()

  const [register, { isLoading }] = useRegisterMutation()

  const HandlePasswordVisibility = () => {
    setPasswordVisibility(!PasswordVisible);
    // console.log(PasswordVisible);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await register({ name, email, password }).unwrap()
      // Handle successful registration, e.g., set user state or redirect
      if (response.error) {
        toast.error(response.error)
      } else {
        setName('')
        setEmail('')
        setPassword('')
        toast.success('Registration Successful')
        navigate('/signin')
      }
      // console.log('Registration successful:', response.data);
    } catch (error) {
      // Display error using react-hot-toast
      toast.error('Failed to register. Please try again.');
      console.error('Registration Error:', error);
    }
  };

  return (
    <div className='w-full h-full flex-grow flex justify-center items-center'>
      <section
        className='bg-black/90 max-w-[282px] px-5 py-5 rounded-2xl'
      >
        <form onSubmit={handleRegister}>

          <h1
            className='w-full text-white mb-1 mt-3 text-center font-bold text-2xl'>
            SignUp
          </h1>
          <p
          className='text-white/80 w-full text-center text-sm'
          >Let's get you started</p>
          <div
            className='mt-4 w-full flex bg-white px-3 py-2 rounded-3xl'
          >
            <input
              className='bg-transparent focus:outline-none placeholder:text-black/70'
              placeholder='Name'
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required />

          </div>
          <div
            className='mt-4 w-full flex bg-white px-3 py-2 rounded-3xl'
          >
            <input
              className='bg-transparent focus:outline-none placeholder:text-black/70'
              placeholder='Email'
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required />
          </div>


          <div
            className='mt-4 w-full flex bg-white px-3 py-2 rounded-3xl'
          >
            <input
              className='bg-transparent focus:outline-none placeholder:text-black/70'
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
            className='mt-5 mb-1 w-full justify-center flex transition duration-300 bg-white hover:bg-transparent border border-transparent hover:border-white hover:text-white px-3 py-3 rounded-lg'
            type="submit">
            {
              isLoading ?
                <div className='text-black'>
                  <PulseLoader size='sm' />
                </div>
                :
                'Sign Up'
            }
          </button>
          <section className='w-full justify-center items-center '>
            <div
              className='w-full cursor-pointer justify-center text-center transition duration-300 bg-white hover:bg-transparent border border-transparent hover:border-white hover:text-white px-3 py-2 mt-3 rounded-3xl'>
              <FontAwesomeIcon
                icon={faGoogle}
                size="lg"
                className='px-0.5' />
              <span>
                Sign up with Google
              </span>
            </div>
          </section>
          <section
            className='w-full text-center text-white text-sm mt-3'
          >
            Already have an account?
            <Link
              to="/signin"
              className='text-gray-400 underline hover:text-white'
            > SignIn</Link>
          </section>
        </form>
      </section>
    </div>
  );
};

export default Register;
