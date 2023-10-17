const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const loginLimiter = require('../middleware/loginLimiter')

router.route('/login')
    .post(loginLimiter, authController.login)

router.route('/register')
    .post(authController.register)

router.route('/refresh')
    .get(authController.refresh)

router.route('/verifyemail')
    .post(authController.VerifyEmail)

router.route('/createnewOTP')
    .post(authController.createNewOTP)

router.route('/logout')
    .post(authController.logout)

module.exports = router