import { Outlet, Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from 'react';
import { useRefreshMutation } from "./authApiSlice";
import usePersist from "../hooks/usePersist";
import { useSelector } from 'react-redux';
import { selectCurrentToken } from "./authSlice";
import PulseLoader from 'react-spinners/PulseLoader';

const PersistLogin = () => {
    const [persist] = usePersist();
    const token = useSelector(selectCurrentToken);
    const navigate = useNavigate();
    const effectRan = useRef(false);

    const [trueSuccess, setTrueSuccess] = useState(false);

    const [refresh, {
        isUninitialized,
        isLoading,
        isSuccess,
        isError,
        error
    }] = useRefreshMutation();

    useEffect(() => {
        // Run the effect only once
        if (effectRan.current === false || process.env.NODE_ENV !== 'development') {
            const verifyRefreshToken = async () => {
                try {
                    // Uncomment the line below if you want to log the verification
                    // console.log('Verifying refresh token');
                    await refresh();
                    // Uncomment the line below if you want to log the success
                    // console.log('Refresh token verification successful');
                    setTrueSuccess(true);
                } catch (err) {
                    // Uncomment the line below if you want to log errors during verification
                    // console.error('Error during refresh token verification:', err);
                }
            };

            // Verify refresh token only if there's no token and persistence is enabled
            if (!token && persist) {
                verifyRefreshToken();
            }

            // Mark the effect as run
            effectRan.current = true;
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Dependencies array is intentionally empty to run the effect only once

    let content;
    if (!persist) {
        // Uncomment the line below if you want to log when there's no persistence
        // console.log('No persistence');
        content = <Outlet />;
    } else if (isLoading) {
        // Uncomment the line below if you want to log when loading
        // console.log('Loading');
        content = <PulseLoader color={"#FFF"} />;
    } else if (isError) {
        // Uncomment the line below if you want to log when there's an error
        // console.log('Error:', error);
        if (error?.status === 401) {
            // Uncomment the line below if you want to log when redirecting due to 401 error
            // console.log('Redirecting to signin due to 401 error');
            return <Outlet/>;
        } else {
            content = (
                <p className='errmsg'>
                    {`${error?.data?.message} - `}
                    <Link to="/signin">Please login again</Link>.
                </p>
            );
        }
    } else if (isSuccess && trueSuccess) {
        // Uncomment the line below if you want to log when there's success
        // console.log('Success');
        content = <Outlet />;
    } else if (token && isUninitialized) {
        // Uncomment the line below if you want to log when token is present and uninitialized
        // console.log('Token and uninitialized');
        content = <Outlet />;
    }

    return content;
};

export default PersistLogin;
