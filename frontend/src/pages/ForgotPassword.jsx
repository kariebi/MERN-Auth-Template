import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useSendForgotPasswordOTPMutation, useVerifyForgotPasswordOTPMutation, useResetPasswordMutation } from '../auth/authApiSlice';
import useTitle from '../hooks/useTitle';

const ForgotPassword = () => {
    useTitle('Forgot Password')
    const navigate = useNavigate();

    // Step 1: Enter Email
    const [email, setEmail] = useState('');
    const [emailSubmitted, setEmailSubmitted] = useState(false);

    // Step 2: Enter OTP
    const [otp, setOtp] = useState('');
    const [otpSubmitted, setOtpSubmitted] = useState(false);

    // Step 3: Reset Password
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordSubmitted, setPasswordSubmitted] = useState(false);

    // Mutations
    const [sendOTP] = useSendForgotPasswordOTPMutation();
    const [verifyOTP] = useVerifyForgotPasswordOTPMutation();
    const [resetPassword] = useResetPasswordMutation();

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        try {
            await sendOTP({ email });
            setEmailSubmitted(true);
            toast.success('OTP sent successfully!');
        } catch (error) {
            console.error(error);
            toast.error('Failed to send OTP. Please try again.');
        }
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        try {
            await verifyOTP({ email, otp });
            setOtpSubmitted(true);
            toast.success('OTP verification successful!');
        } catch (error) {
            console.error(error);
            toast.error('Invalid OTP. Please try again.');
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (password === confirmPassword) {
            try {
                await resetPassword({ email, otp, password });
                setPasswordSubmitted(true);
                toast.success('Password reset successful!');
                // Optionally: Redirect to login page after successful password reset
                navigate('/login');
            } catch (error) {
                console.error(error);
                toast.error('Failed to reset password. Please try again.');
            }
        } else {
            toast.error('Passwords do not match. Please try again.');
        }
    };

    return (
        <div className='flex-grow flex justify-center items-center'>
            {emailSubmitted ? (
                otpSubmitted ? (
                    passwordSubmitted ? (
                        <div>
                            <p>Password Reset Successful!</p>
                            <Link
                                to='/login'>
                                Click here to Login
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handlePasswordSubmit}>
                            <label htmlFor='password'>New Password:</label>
                            <input
                                type='password'
                                id='password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <br />
                            <label htmlFor='confirmPassword'>Confirm Password:</label>
                            <input
                                type='password'
                                id='confirmPassword'
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            <br />
                            <button type='submit'>Submit Password</button>
                        </form>
                    )
                ) : (
                    <form onSubmit={handleOtpSubmit}>
                        <label htmlFor='otp'>Enter OTP:</label>
                        <input
                            type='text'
                            id='otp'
                            maxLength={6}
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                        />
                        <br />
                        <button type='submit'>Verify OTP</button>
                    </form>
                )
            ) : (
                <form onSubmit={handleEmailSubmit}>
                    <label htmlFor='email'>Enter Email:</label>
                    <input
                        type='email'
                        id='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <br />
                    <button type='submit'>Send OTP</button>
                </form>
            )}
        </div>
    );
};

export default ForgotPassword;
