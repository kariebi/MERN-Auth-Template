import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useSendForgotPasswordOTPMutation, useVerifyForgotPasswordOTPMutation, useResetPasswordMutation } from '../auth/authApiSlice';
import useTitle from '../hooks/useTitle';
import { PulseLoader } from 'react-spinners';

const ForgotPassword = () => {
    useTitle('Forgot Password');
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
    const [sendOTPLoading, setSendOTPLoading] = useState(false);
    const [verifyOTPLoading, setVerifyOTPLoading] = useState(false);
    const [resetPasswordLoading, setResetPasswordLoading] = useState(false);

    const [sendOTP] = useSendForgotPasswordOTPMutation();
    const [verifyOTP] = useVerifyForgotPasswordOTPMutation();
    const [resetPassword] = useResetPasswordMutation();

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setSendOTPLoading(true);
        try {
            await sendOTP({ email });
            setEmailSubmitted(true);
            toast.success('OTP sent successfully!');
        } catch (error) {
            console.error(error);
            toast.error('Failed to send OTP. Please try again.');
        } finally {
            setSendOTPLoading(false);
        }
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        setVerifyOTPLoading(true);
        try {
            await verifyOTP({ email, otp });
            setOtpSubmitted(true);
            toast.success('OTP verification successful!');
        } catch (error) {
            console.error(error);
            toast.error('Invalid OTP. Please try again.');
        } finally {
            setVerifyOTPLoading(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setResetPasswordLoading(true);
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
            } finally {
                setResetPasswordLoading(false);
            }
        } else {
            toast.error('Passwords do not match. Please try again.');
            setResetPasswordLoading(false);
        }
    };

    return (
        <div className='w-full h-full flex-grow flex flex-col justify-center items-center text-center'>
            {emailSubmitted ? (
                otpSubmitted ? (
                    passwordSubmitted ? (
                        <div className='w-full h-full flex flex-col text-center justify-center items-center'>
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
                            <div>
                                {resetPasswordLoading ? (
                                    <PulseLoader size={8} />
                                ) : (
                                    <button type='submit'>Submit Password</button>
                                )}
                            </div>
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
                        <div>
                            {verifyOTPLoading ? (
                                <PulseLoader size={8} />
                            ) : (
                                <button type='submit'>Verify OTP</button>
                            )}
                        </div>
                    </form>
                )
            ) : (
                <>
                    <div className='text-sm py-2 '>
                        Input your email address to change your password
                    </div>
                    <form onSubmit={handleEmailSubmit}
                        className='bg-black/90 px-3 py-3 flex flex-col text-center justify-center items-center rounded-3xl'>
                        <div
                            className=' mb-2 w-full flex bg-white px-3 py-2 rounded-3xl'>
                            <input
                                className='bg-transparent focus:outline-none placeholder:text-black/70'
                                placeholder='Email'
                                type='email'
                                id='email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className='text-black/90 bg-white rounded-xl mt-2 px-2 py-2 border-transparent border hover:border-white hover:text-white hover:bg-transparent transition duration-300'>
                            {sendOTPLoading ? (
                                <PulseLoader size={8} />
                            ) : (
                                <button
                                    type='submit'>
                                    Send OTP
                                </button>
                            )}
                        </div>
                    </form>
                </>
            )}
        </div>
    );
};

export default ForgotPassword;
