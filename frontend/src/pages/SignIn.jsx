import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate()

  const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/auth/login/', { email, password });
      // Handle successful login, e.g., set user state or redirect
      if (response.error){
        toast.error(response.error)
      }else{
        setName('')
        setEmail('')
        setPassword('')
        toast.success('Login Successful')
        navigate('/userdashboard')
      }
      // console.log('Registration successful:', response.data);
    } catch (error) {
      // Display error using react-hot-toast
      toast.error('Failed to sign in. Please check your credentials.');
      console.error('Sign In Error:', error);
    }
  };

  return (
    <div>
      <h2>Sign In</h2>
      <form onSubmit={handleSignIn}>
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        <button type="submit">Sign In</button>
      </form>
    </div>
  );
};

export default SignIn;
