import { apiSlice } from "../app/api/apiSlice"
import { logOut, setCredentials } from "./authSlice"

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        login: builder.mutation({
            query: credentials => ({
                url: '/auth/login',
                method: 'POST',
                body: { ...credentials }
            })
        }),
        register: builder.mutation({
            query: credentials => ({
                url: '/auth/register',
                method: 'POST',
                body: { ...credentials }
            })
        }),
        // To send the OTP for the user's email
        createOTP: builder.mutation({
            query: credentials => ({
                url: '/auth/createnewotp',
                method: 'POST',
                body: { ...credentials }
            })
        }),
        // To verify the OTP for the user's email
        verifyOTP: builder.mutation({
            query: credentials => ({
                url: '/auth/verifyotp',
                method: 'POST',
                body: { ...credentials }
            })
        }),
        // send OTP for user's password recreation
        sendForgotPasswordOTP: builder.mutation({
            query: credentials => ({
                url: 'auth/forgotpassword/sendotp',
                method: 'POST',
                body: { ...credentials }
            })
        }),
        // verify the email otp when the user sends the otp
        verifyForgotPasswordOTP: builder.mutation({
            query: credentials => ({
                url: 'auth/forgotpassword/verifyotp',
                method: 'POST',
                body: { ...credentials }
            })
        }),
        //use the otp, email and password to reset the password
        ResetPassword: builder.mutation({
            query: credentials => ({
                url: 'auth/forgotpassword/reset',
                method: 'POST',
                body: { ...credentials }
            })
        }),
        sendLogout: builder.mutation({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled
                    // console.log(data)
                    dispatch(logOut())
                    setTimeout(() => {
                        dispatch(apiSlice.util.resetApiState())
                    }, 1000)
                } catch (err) {
                    console.log(err)
                }
            }
        }),
        refresh: builder.mutation({
            query: () => ({
                url: '/auth/refresh',
                method: 'GET',
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled
                    // console.log(data)
                    const { accessToken } = data
                    dispatch(setCredentials({ accessToken }))
                } catch (err) {
                    console.log(err)
                }
            }
        }),
    })
})

export const {
    useResetPasswordMutation,
    useVerifyForgotPasswordOTPMutation,
    useSendForgotPasswordOTPMutation,
    useVerifyOTPMutation,
    useCreateOTPMutation,
    useLoginMutation,
    useRegisterMutation,
    useSendLogoutMutation,
    useRefreshMutation,
} = authApiSlice 