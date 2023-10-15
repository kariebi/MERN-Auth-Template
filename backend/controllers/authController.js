const User = require('../models/User')
const jwt = require('jsonwebtoken')
const { hashPassword, comparePassword } = require('../helpers/auth')

// @desc Register
// @route POST /auth
// @access Public
const register = async (req, res) => {
    const { name, email, password } = req.body
    try {
        if (!name) {
            return res.json({
                error: 'Name is Required'
            })
        }
        if (!password || password.length < 10) {
            return res.json({
                error: 'Password is Required and should be at least 10 characters long'
            })
        }
        const exist = await User.findOne({ email })
        if (exist) {
            return res.json({
                error: 'Email is already taken'
            })
        }

        const hashedpassword = await hashPassword(password)

        const user = await User.create({
            username: name,
            email: email,
            password: hashedpassword
        })
        return res.json(user)

    } catch (error) {
        console.log(error)
    }
}




// @desc Login
// @route POST /auth
// @access Public
const login = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ error: 'All fields are required' })
        }

        const foundUser = await User.findOne({ email }).exec()

        if (!foundUser) {
            return res.status(401).json({ error: 'You are not registered' })
        }

        const PasswordsMatch = await comparePassword(password, foundUser.password)

        if (PasswordsMatch) {
            jwt.sign({
                email: foundUser.email,
                id: foundUser._id,
                name: foundUser.username,
            }, process.env.ACCESS_TOKEN_SECRET, {},
                (err, token) => {
                    if (err) throw err;
                    res.cookie('token', token).json(foundUser)
                })
            res.status(200).json('Login successful')
        }
        if (!PasswordsMatch) {
            res.json({
                error: 'Incorrect email or password'
            })
        }

    } catch (error) {
        console.log(error)
    }
}

// @desc Refresh
// // @route GET /auth/profile
// const getprofile = (req, res) => {
//     const { token } = req.cookies
//     if (token) {
//         jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, {},
//             (err, user) => {
//                 if (err) throw err;
//                 res.json(user)
//             })
//     } else {
//         res.json(null)
//     }
// }


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
                        "roles": foundUser.roles
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
    refresh,
    getprofile,
    register,
    logout
}