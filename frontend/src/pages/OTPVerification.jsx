import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useVerifyOTPMutation, useCreateOTPMutation } from '../auth/authApiSlice';
import useAuth from '../hooks/useAuth';
import useTitle from '../hooks/useTitle';

const OTPVerification = () => {
  useTitle('Email Verification')
  
  const [resendTimer, setResendTimer] = useState(60);
  const { email: userEmail } = useAuth();
  const navigate = useNavigate();
  const [OTP, setOTP] = useState('');
  const email = localStorage.getItem('email') || userEmail;
  localStorage.setItem('email', email);
  const [verifyOTP, { isLoading: verifyingOTP }] = useVerifyOTPMutation();
  const [createOTP, { isLoading: creatingOTP }] = useCreateOTPMutation();
  const hasSentOTP = localStorage.getItem('hasSentOTP');
  const [isEmailPresent, setIsEmailPresent] = useState(true);

  const createOTPcode = async () => {
    try {
      const response = await createOTP({ email }).unwrap();
      toast.success('Your OTP has been sent!');
      localStorage.setItem('hasSentOTP', 'true');
      setResendTimer(60);
    } catch (error) {
      console.error(error);
    }
  };

  const ConfirmOTP = async () => {
    try {
      const response = await verifyOTP({ email, OTP }).unwrap();
      toast.success('Email verified successfully');
      if (localStorage.getItem('email')) {
        localStorage.removeItem('email');
      }
      if (localStorage.getItem('hasSentOTP')) {
        localStorage.removeItem('hasSentOTP');
      }
      navigate('/signin');
    } catch (error) {
      toast.error('Error');
      console.log('Error:', error);
    }
  };

  const handleResendClick = () => {
    setResendTimer(60);
    createOTPcode();
  };

  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [resendTimer]);

  useEffect(() => {
    // Create OTP on initial load if not sent already
    if (!hasSentOTP) {
      createOTPcode();
    }

    // Check if email is present
    if (!email) {
      setIsEmailPresent(false);
      // Redirect to '/signin' after 2 seconds
      setTimeout(() => {
        navigate('/signin');
      }, 2000);
    }
  }, [email, hasSentOTP, navigate]);


  return (
    <div className='w-full h-full flex-grow flex justify-center items-center'>
      <section className='w-full h-full flex flex-col text-center justify-center items-center'>
        {isEmailPresent ? (
          <>
            <div className='pb-2'>
              <p className='text-sm'>
                An OTP verification code has been sent to <br />
                <b>{email}</b>.
              </p>
              <p className='text-xs'>It will expire in <b>5 minutes</b></p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); ConfirmOTP(); }} className='bg-black/90 px-5 py-5 rounded-2xl'>
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
                <button type='submit' className='w-full h-full' disabled={verifyingOTP || creatingOTP}>
                  Verify
                </button>
              </section>
            </form>

            {resendTimer > 0 ? (
              <p className='mt-3 text-xs'>
                Didn't receive the code?{' '}
                <span className='text-gray-700'>
                  Resend OTP ({resendTimer}s)
                </span>
              </p>
            ) : (
              <p className='mt-3 text-xs'>
                <span className='text-gray-700 cursor-pointer' onClick={handleResendClick}>
                  Resend OTP Code
                </span>
              </p>
            )}
          </>
        ) : (
          <div>
            <p className='text-md text-red-500'>Email not found. Redirecting to SignUp Page...</p>
          </div>
        )}
      </section>
    </div>
  );
}

export default OTPVerification;
