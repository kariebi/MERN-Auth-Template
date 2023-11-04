const User = require('../models/User')
const Token = require('../models/Token')
const jwt = require('jsonwebtoken')
const axios = require('axios')
const { OAuth2Client } = require('google-auth-library');
const { hashPassword, comparePassword, sendOTPEmail, generateRandomToken } = require('../helpers/auth')
require('dotenv').config();

// Google OAuth Config
const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI,
);

// @desc Register
// @route POST /auth
// @access Public
const register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        if (!name) {
            console.log(`Name required for ${email}`)
            return res.json({
                error: 'Name is Required',
            });
        }
        if (!password || password.length < 10) {
            console.log(`Password required or below 10 characters: ${email}`)
            return res.json({
                error: 'Password is Required and should be at least 10 characters long',
            });
        }
        const exist = await User.findOne({ email });
        if (exist) {
            console.log(`User with email ${email} already exists`)
            return res.json({
                error: 'Email is already taken',
            });
        }

        const hashedpassword = await hashPassword(password);

        const user = await User.create({
            username: name,
            email: email,
            password: hashedpassword,
        });

        const newOTP = generateRandomToken();

        const token = await Token.create({
            email: user.email,
            token: newOTP,
            purpose: 'email',
        });

        await sendOTPEmail(user.email, newOTP);

        console.log(token, user);
        return res.json({
            status: 200,
            message: 'Registered Successfully'
        });
    } catch (error) {
        console.log(error);
    }
};



// @desc Login
// @route POST /auth
// @access Public
const login = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ error: 'All fields are required' })
    }

    const foundUser = await User.findOne({ email }).exec()

    if (!foundUser || !foundUser.active) {
        return res.status(401).json({ error: 'You are not registered' })
    }

    const PasswordsMatch = await comparePassword(password, foundUser.password)

    if (!PasswordsMatch) return res.status(401).json({ message: 'Unauthorized' })

    const accessToken = jwt.sign(
        {
            "UserInfo": {
                "userId": foundUser._id,
                "verified": foundUser.verified,
                "email": foundUser.email,
                "username": foundUser.username,
                "roles": foundUser.roles
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
    )

    const refreshToken = jwt.sign(
        { "username": foundUser.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    )

    // Create secure cookie with refresh token 
    res.cookie('jwt', refreshToken, {
        httpOnly: true, //accessible only by web server 
        secure: true, //https
        sameSite: 'None', //cross-site cookie 
        maxAge: 7 * 24 * 60 * 60 * 1000 //cookie expiry: set to match rT
    })

    // Send accessToken containing username and roles 
    res.json({ accessToken })

}

// @desc Login/Signup using Google
// @route GET /auth/google
// @access Public
const GoogleHandler = (req, res) => {
    // Redirect to Google OAuth endpoint
    const redirectUrl = `https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}&scope=email%20profile&state=some_state`;
    res.redirect(redirectUrl);
};


// @desc Callback for Google OAuth
// @route GET /auth/google/callback
// @access Public
const GoogleCallback = async (req, res) => {
    // const { tokenId } = req.body;

    try {
        const { code } = req.query;
        console.log(process.env.GOOGLE_CLIENT_ID)
        console.log(process.env.GOOGLE_CLIENT_SECRET)
        console.log(process.env.GOOGLE_REDIRECT_URI)
        // Exchange code for access token
        const { tokens } = await client.getToken(code);
        console.log(tokens)
        // Get user info using the access token
        const { data } = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${tokens.access_token}` },
        });

        // Check if the user is already registered in the database
        let user = await User.findOne({ email: data.email }).exec();

        if (!user) {
            // If not registered, create a new user without a password
            user = await User.create({
                username: data.name,
                email: data.email,
                verified: true, // Assuming Google provides verified emails
                isGoogleUser: true, // Add a flag to indicate Google user
            });
        }

        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "userId": user._id,
                    "verified": user.verified,
                    "email": user.email,
                    "username": user.username,
                    "roles": user.roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '15m' }
        );

        const refreshToken = jwt.sign(
            { "username": user.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '7d' }
        )

        // Create secure cookie with refresh token 
        res.cookie('jwt', refreshToken, {
            httpOnly: true, //accessible only by web server 
            secure: true, //https
            sameSite: 'None', //cross-site cookie 
            maxAge: 7 * 24 * 60 * 60 * 1000 //cookie expiry: set to match rT
        })

        res.status(200).json({ success: true, message: 'Authentication successful', accessToken, user });
        res.redirect(`${process.env.VITE_FRONTEND_URL}/userdashboard`);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};


// @desc Verify Email using OTP
// @route POST /auth/verifyemail
const VerifyOTP = async (req, res) => {
    const { email, OTP } = req.body;

    try {
        // Find the token associated with the user's email and purpose
        const token = await Token.findOne({ email, purpose: 'email' }).exec();

        if (!token) {
            // Token not found
            console.log('Token not found');
            return res.status(404).json({ message: 'Token not found', success: false });
        }

        // Check if the user is already verified
        const user = await User.findOne({ email, verified: true }).exec();
        if (user) {
            console.log('User is already verified');
            return res.status(200).json({ message: 'User is already verified', success: true, user });
        }

        // Check if the token has expired
        if (token.expiresAt <= new Date()) {
            // Token has expired
            await token.deleteOne(); // Remove the expired token
            console.log('Token has expired');
            return res.status(401).json({ message: 'Token has expired', success: false });
        }

        // Check if the provided OTP matches the token's OTP
        if (token.token !== OTP) {
            // Incorrect OTP
            console.log('Incorrect OTP');
            return res.status(401).json({ message: 'Incorrect OTP', success: false });
        }

        // Update the user to 'verified: true'
        const updatedUser = await User.findOneAndUpdate({ email }, { verified: true }, { new: true }).exec();

        // Remove the token as it's no longer needed
        await token.deleteOne();

        // Respond with success message and updated user
        console.log(`Email ${email} has been verified`);
        return res.status(200).json({ message: 'Email verification successful', success: true, user: updatedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error', success: false });
    }
};



// @desc Create New OTP
// @route POST /auth/createnewotp
const createNewOTP = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if there is an existing token with the user's email
        const existingToken = await Token.findOne({ email }).exec();

        if (existingToken) {
            // Update the existing token with a new OTP
            const newOTP = generateRandomToken();
            existingToken.token = newOTP;
            await existingToken.save();
            await sendOTPEmail(existingToken.email, newOTP);
            console.log(existingToken);
            return res.status(200).json({ message: 'OTP updated successfully', newOTP });
        } else {
            // Create a new OTP
            const newOTP = generateRandomToken();

            // Create a new token with the userId and the new OTP
            const newToken = await Token.create({
                email: email,
                token: newOTP,
                purpose: 'email',
            });

            // Send OTP email to the user
            await sendOTPEmail(email, newOTP);
            console.log(newToken);
            return res.status(200).json({ message: 'New OTP created successfully', newOTP });
        }
    } catch (error) {
        console.error('Error creating new OTP:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

// @desc Send OTP for password reset
// @route POST /auth/forgotpassword/sendotp
// @access Public
const sendForgotPasswordOTP = async (req, res) => {
    const { email } = req.body;

    try {
        // Check if the user exists
        const user = await User.findOne({ email }).exec();

        if (!user || !user.active) {
            console.log(`User not found with ${email} email`)
            return res.status(401).json({ error: 'User not found', success: false });
        }

        // Check if there is an existing token with the user's email and purpose 'forgotpassword'
        const existingToken = await Token.findOne({ email, purpose: 'forgotpassword' }).exec();

        if (existingToken) {
            // Update the existing token with a new OTP
            const newOTP = generateRandomToken();
            existingToken.token = newOTP;
            await existingToken.save();
            await sendOTPEmail(existingToken.email, newOTP);
            console.log(existingToken);
            return res.status(200).json({ message: 'OTP updated successfully', success: true });
        } else {
            // Create a new OTP
            const newOTP = generateRandomToken();

            // Create a new token with the email, the new OTP, and purpose 'forgotpassword'
            const newToken = await Token.create({
                email: email,
                token: newOTP,
                purpose: 'forgotpassword',
            });

            // Send OTP email to the user
            await sendOTPEmail(email, newOTP);
            console.log(newToken);
            return res.status(200).json({ message: 'OTP sent successfully', success: true });
        }
    } catch (error) {
        console.error('Error sending OTP:', error);
        console.error(error.stack); // Log the stack trace
        return res.status(500).json({ message: 'Internal Server Error', success: false });
    }
};


// @desc Verify OTP for password reset
// @route POST /auth/forgotpassword/verifyotp
// @access Public
const verifyForgotPasswordOTP = async (req, res) => {
    const { email, OTP } = req.body;

    try {
        // Find the token associated with the user's email and purpose 'forgotpassword'
        const token = await Token.findOne({ email, purpose: 'forgotpassword' }).exec();

        if (!token) {
            // Token not found
            console.log('Token not found');
            return res.status(404).json({ message: 'Token not found', success: false });
        }

        // Check if the token has expired
        if (token.expiresAt <= new Date()) {
            // Token has expired
            await token.deleteOne(); // Remove the expired token
            console.log('Token has expired');
            return res.status(401).json({ message: 'Token has expired', success: false });
        }

        // Check if the provided OTP matches the token's OTP
        if (token.token !== OTP) {
            // Incorrect OTP
            console.log('Incorrect OTP');
            return res.status(401).json({ message: 'Incorrect OTP', success: false });
        }

        // Respond with success message
        console.log(`OTP for password reset verified`);
        res.status(200).json({ message: 'OTP verification successful', success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error', success: false });
    }
};

// @desc Reset password
// @route POST /auth/forgotpassword/reset
// @access Public
const resetPassword = async (req, res) => {
    const { email, OTP, password } = req.body;

    try {
        // Find the token associated with the user's email and purpose 'forgotpassword'
        const token = await Token.findOne({ email, purpose: 'forgotpassword' }).exec();

        if (!token) {
            // Token not found
            console.log('Token not found');
            return res.status(404).json({ message: 'Token not found', success: false });
        }

        // Check if the token has expired
        if (token.expiresAt <= new Date()) {
            // Token has expired
            await token.deleteOne(); // Remove the expired token
            console.log('Token has expired');
            return res.status(401).json({ message: 'Token has expired', success: false });
        }

        // Check if the provided OTP matches the token's OTP
        if (token.token !== OTP) {
            // Incorrect OTP
            console.log('Incorrect OTP');
            return res.status(401).json({ message: 'Incorrect OTP', success: false });
        }

        // Update the user's password
        const hashedPassword = await hashPassword(password);
        await User.findOneAndUpdate({ email }, { password: hashedPassword }, { new: true }).exec();

        // Remove the token as it's no longer needed
        await token.deleteOne();

        // Respond with success message
        console.log(`Password reset successful`);
        res.status(200).json({ message: 'Password reset successful', success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error', success: false });
    }
};

// @desc Refresh
// @route GET /auth/refresh
// @access Public - because access token has expired
const refresh = (req, res) => {
    const cookies = req.cookies

    if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' })

    const refreshToken = cookies.jwt

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Forbidden' })

            const foundUser = await User.findOne({ username: decoded.username }).exec()

            if (!foundUser) return res.status(401).json({ message: 'Unauthorized' })

            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": foundUser.username,
                        "roles": foundUser.roles,
                        "verified": foundUser.verified,
                        "email": foundUser.email,
                        "userId": foundUser._id,
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '15m' }
            )

            res.json({ accessToken })
        }
    )
}


// @desc Logout
// @route POST /auth/logout
// @access Public - just to clear cookie if exists
const logout = (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204) //No content
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
    res.json({ message: 'Cookie cleared' })
}

module.exports = {
    login,
    GoogleCallback,
    GoogleHandler,
    refresh,
    createNewOTP,
    VerifyOTP,
    sendForgotPasswordOTP,
    verifyForgotPasswordOTP,
    resetPassword,
    register,
    logout
}