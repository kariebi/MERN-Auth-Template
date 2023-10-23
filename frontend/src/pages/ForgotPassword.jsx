import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useSendForgotPasswordOTPMutation, useVerifyForgotPasswordOTPMutation, useResetPasswordMutation } from '../auth/authApiSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"
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

    // Timer state
    const [timer, setTimer] = useState(60);

    // Mutations
    const [sendOTPLoading, setSendOTPLoading] = useState(false);
    const [verifyOTPLoading, setVerifyOTPLoading] = useState(false);
    const [resetPasswordLoading, setResetPasswordLoading] = useState(false);
    const [PasswordVisible, setPasswordVisibility] = useState(false);
    const [ConfirmPasswordVisible, setConfirmPasswordVisibility] = useState(false);

    const [sendOTP] = useSendForgotPasswordOTPMutation();
    const [verifyOTP] = useVerifyForgotPasswordOTPMutation();
    const [resetPassword] = useResetPasswordMutation();

    const HandlePasswordVisibility = () => {
        setPasswordVisibility(!PasswordVisible);
    };
    const HandleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisibility(!ConfirmPasswordVisible);
    };

    // Effect to handle countdown
    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
        } else {
            clearInterval(interval);
        }

        // Cleanup the interval on component unmount
        return () => clearInterval(interval);
    }, [timer]);

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setSendOTPLoading(true);
        try {
            const response = await sendOTP({ email });
            if (response.error) {
                toast.error(response.error.data.message);
            } else {
                toast.success('OTP sent successfully!');
                setEmailSubmitted(true);
            }
        } catch (error) {
            toast.error('Failed to send OTP. Please try again.');
        } finally {
            setSendOTPLoading(false);
        }
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        setVerifyOTPLoading(true);
        try {
            const response = await verifyOTP({ email, OTP: otp });
            if (response.error) {
                console.log(response.error)
                toast.error(response.error.data.message);
            } else {
                setOtpSubmitted(true);
                toast.success('OTP verification successful!');
            }
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
                const response = await resetPassword({ email, OTP: otp, password });
                if (response.error) {
                    console.log(response.error)
                    toast.error(response.error.data.message);
                } else {
                    setPasswordSubmitted(true);
                    toast.success('Password reset successful!');
                    navigate('/signin');
                }
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

    const handleResendOTP = async () => {
        setTimer(60); // Reset the timer when OTP is resent
        try {
            // Implement your OTP resend logic here
            const response = await sendOTP({ email });
            if (response.error) {
                toast.error(response.error.data.message);
            } else {
                toast.success('OTP resent successfully!');
            }
        } catch (error) {
            toast.error('Failed to resend OTP. Please try again.');
        }
    };

    return (
        <div className='w-full h-full flex-grow flex flex-col justify-center items-center text-center'>
            {emailSubmitted ? (
                otpSubmitted ? (
                    passwordSubmitted ? (
                        <div className='w-full h-full flex flex-col text-center justify-center items-center'>
                            <p>Password Reset Successful!</p>
                            <Link to='/login'>Click here to Login</Link>
                        </div>
                    ) : (
                        <form
                            onSubmit={handlePasswordSubmit}
                            className='bg-black/90 px-3 py-3 flex flex-col text-center justify-center items-center rounded-3xl'
                        >
                            <div
                                className=' mb-2 w-full flex bg-white px-3 py-2 rounded-3xl'>
                                <input
                                    className='bg-transparent focus:outline-none placeholder:text-black/70'
                                    placeholder='New Password'
                                    type={PasswordVisible ? "text" : "password"}
                                    id='password'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <div type='' onClick={HandlePasswordVisibility}>
                                    <FontAwesomeIcon
                                        icon={PasswordVisible ? faEye : faEyeSlash}
                                        size="sm"
                                        style={{ color: "#000000", marginLeft: 'auto' }} />
                                </div>
                            </div>
                            <div
                                className=' mb-2 w-full flex bg-white px-3 py-2 rounded-3xl'
                            >
                                <input
                                    className='bg-transparent focus:outline-none placeholder:text-black/70'
                                    placeholder='Confirm Password'
                                    type={ConfirmPasswordVisible ? "text" : "password"}
                                    id='confirmPassword'
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                                <div type='' onClick={HandleConfirmPasswordVisibility}>
                                    <FontAwesomeIcon
                                        icon={ConfirmPasswordVisible ? faEye : faEyeSlash}
                                        size="sm"
                                        style={{ color: "#000000", marginLeft: 'auto' }} />
                                </div>
                            </div>
                            <div
                                className='text-black/90 bg-white rounded-xl mt-2 px-2 py-2 border-transparent border hover:border-white hover:text-white hover:bg-transparent transition duration-300'>
                                {resetPasswordLoading ? (
                                    <PulseLoader size={8} color='#FFFFFF' />
                                ) : (
                                    <button type='submit'>Submit Password</button>
                                )}
                            </div>
                        </form>
                    )
                ) : (
                    <>
                        <form
                            onSubmit={handleOtpSubmit}
                            className='bg-black/90 px-3 py-3 flex flex-col text-center justify-center items-center rounded-3xl'
                        >
                            <div
                                className=' mb-2 w-full flex bg-white px-3 py-2 rounded-3xl'>
                                <input
                                    className='bg-transparent focus:outline-none placeholder:text-black/70'
                                    placeholder='Enter OTP'
                                    type='text'
                                    id='otp'
                                    maxLength={6}
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    required
                                />
                            </div>
                            <div className='text-black/90 bg-white rounded-xl mt-2 px-2 py-2 border-transparent border hover:border-white hover:text-white hover:bg-transparent transition duration-300'>
                                {verifyOTPLoading ? (
                                    <PulseLoader size={8} color='#ffffff' />
                                ) : (
                                    <button type='submit'>Verify OTP</button>
                                )}
                            </div>
                        </form>
                        <div className='text-sm text-gray-800 pt-1'>
                            {timer > 0 ? (
                                <p>Resend OTP in <b>{timer}</b> seconds</p>
                            ) : (
                                <button
                                    type='button'
                                    onClick={handleResendOTP}
                                >
                                    Resend OTP
                                </button>
                            )}
                        </div>
                    </>
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
