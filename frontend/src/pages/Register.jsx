import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useRegisterMutation } from '../auth/authApiSlice';
import useTitle from '../hooks/useTitle'


const Register = () => {
  useTitle('Register')

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate()

  const [register, { isLoading }] = useRegisterMutation()



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
    <div>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <label>Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />

        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
