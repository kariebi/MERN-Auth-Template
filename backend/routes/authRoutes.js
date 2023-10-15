const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const loginLimiter = require('../middleware/loginLimiter')

router.route('/login')
    .post(loginLimiter, authController.login)

router.route('/register')
    .post(authController.register)

// router.route('/profile')
//     .get(authController.getprofile)

router.route('/logout')
    .post(authController.logout)

module.exports = router