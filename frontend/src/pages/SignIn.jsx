import { useRef, useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setCredentials } from '../auth/authSlice'
import { useLoginMutation } from '../auth/authApiSlice'
import usePersist from '../hooks/usePersist'
import useTitle from '../hooks/useTitle'
import toast from 'react-hot-toast';

const SignIn = () => {
  useTitle('SignIn')


  const emailRef = useRef()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [persist, setPersist] = usePersist()

  const [login, { isLoading }] = useLoginMutation()

  useEffect(() => {
    emailRef.current.focus()
  }, [])

  const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      const { accessToken } = await login({ email, password }).unwrap()
      dispatch(setCredentials({ accessToken }))
      // Handle successful login, e.g., set user state or redirect
      if (response.error) {
        toast.error(response.error)
      } else {
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
        <input
          type="email"
          value={email}
          ref={emailRef}
          onChange={(e) => setEmail(e.target.value)} 
          required />

        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        <label htmlFor="persist" className="">
          <input
            type="checkbox"
            className=""
            id="persist"
            onChange={handleToggle}
            checked={persist}
          />

          Trust This Device
        </label>

        <button type="submit">Sign In</button>
        <section>
          <Link to="/">Back to Home</Link>
        </section>
      </form>
    </div>
  );
};

export default SignIn;
