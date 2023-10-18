import React,
{
  useEffect,
  useState
}
  from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useVerifyOTPMutation, useCreateOTPMutation } from '../auth/authApiSlice';

const OTPVerification = () => {
  const [submitting, setsubmitting] = useState(false)
  const location = useLocation();
  const navigate = useNavigate();
  const [OTP, setOTP] = useState('')
  const email = localStorage.getItem('email')
  const [verifyOTP, { isLoading }] = useVerifyOTPMutation()
  const [createOTP, { isLoading: creatingOTP }] = useCreateOTPMutation();
  const isRedirectedFromDashboard = location.state?.from === 'dashboard';

  const createOTPcode = async () => {
    try {
      const response = await createOTP({ email }).unwrap();
    } catch (error) {
      console.error(error);
    }
  };


  const redirectUser = () => {
    if (isRedirectedFromDashboard) {
      navigate('/dashboard');
    } else {
      navigate('/signin');
    }
  }

  const ConfirmOTP = async () => {
    try {
      const response = await verifyOTP({ email, OTP }).unwrap()
      localStorage.removeItem('email')
      toast.success('Email verified successfully')
      setsubmitting(true)
    } catch (error) {
      toast.error(error.message)
      console.log(error)
    }
  }

  useEffect(() => {
    // Check if email state changes, and if it does, trigger redirection
    if (submitting) {
      redirectUser();
    }
  }, [submitting]);

  useEffect(() => {
    if (isRedirectedFromDashboard) {
      createOTPcode()
    }
  }, []);

  return (
    <div className='w-full h-full flex-grow flex justify-center items-center'>
      <section className='w-full h-full flex flex-col text-center justify-center items-center'>
        <div
          className='pb-2'
        >
          <p className='text-sm'>An OTP verification code has been sent to <br />
            <b>{email}</b>.</p>
          <p className='text-xs'>It expires in <b>5 minutes</b></p>
        </div>
        <form
          onSubmit={ConfirmOTP}
          className='bg-black/90 px-5 py-5 rounded-2xl'>
          <div className='bg-white px-2 py-2 rounded-2xl'>
            <input
              className='placeholder:text-center focus:outline-none text-center h-10 w-28 text-2xl'
              type='text'
              placeholder='XXXXXX'
              maxLength={6}
              value={OTP}
              onChange={(e) => setOTP(e.target.value)}
              required
            />
          </div>
          <section className='bg-white text-center mt-3 py-1 rounded-lg border-transparent border hover:border-white hover:text-white hover:bg-transparent transition duraation-300'>
            <button type='submit'>
              Verify
            </button>
          </section>
        </form>
      </section>
    </div>
  );
};

export default OTPVerification;
