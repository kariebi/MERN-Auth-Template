import React, { useEffect } from 'react';
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
    <div>
      <form>
        <input
          type='number'
          placeholder='XXXXXX'
          maxLength={6}
          required
        />
      </form>
    </div>
  );
};

export default OTPVerification;
