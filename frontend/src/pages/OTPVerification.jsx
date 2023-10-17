import React,
{
  useEffect
}
  from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const OTPVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const redirectUser = () => {

    const isRedirectedFromDashboard = location.state?.from === 'dashboard';

    if (isRedirectedFromDashboard) {
      navigate('/dashboard');
    } else {
      navigate('/signin');
    }
  }

  // useEffect(() => {

  // }, [location, navigate]);

  return (
    <div className='w-full h-full flex-grow flex justify-center items-center'>
      <section className='w-full h-full flex justify-center items-center'>
        <form className='bg-black/90 px-5 py-5 rounded-2xl'>
          <div className='bg-white px-2 py-2 rounded-2xl'>
            <input
              className='placeholder:text-center text-center h-10 w-28 text-2xl'
              type='text'
              placeholder='XXXXXX'
              maxLength={6}
              required
            />
          </div>
          <section className=''>
            <button>
              Verify
            </button>
          </section>
        </form>
      </section>
    </div>
  );
};

export default OTPVerification;
