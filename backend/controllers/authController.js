const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

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

        const user = await User.create({
            name, email, password
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
    // const { username, password } = req.body

    // if (!username || !password) {
    //     return res.status(400).json({ message: 'All fields are required' })
    // }

    // const foundUser = await User.findOne({ username }).exec()

    // if (!foundUser || !foundUser.active) {
    //     return res.status(401).json({ message: 'Unauthorized' })
    // }

    // const match = await bcrypt.compare(password, foundUser.password)

}




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
    logout
}