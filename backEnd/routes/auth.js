const router = require('express').Router()
const authController = require('../controllers/authController')
router.post('/signup', authController.register, authController.sendOTP)
router.post('/resend-otp', authController.resendOTP)
router.post('/verify', authController.verifyOTP)
router.post('/login', authController.login)
module.exports = router
// http://localhost:8000/auth/signup => method:POST
