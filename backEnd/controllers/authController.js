const User = require('../Models/User')
const catchAsync = require('../utilities/catchAsync')
const otpGenerator = require('otp-generator')
const jwt = require('jsonwebtoken')
const { promisify } = require('util')
const Mailer = require('../services/mailer')
// Sign JWT Token
const signToken = userId => jwt.sign({ userId }, process.env.TOKEN_KEY)
// register new user
exports.register = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body
  const existing_user = await User.findOne({
    email: email
  })
  let new_user
  if (existing_user && existing_user.verified === true) {
    // email already in use
    return res.status(400).json({
      status: 'error',
      message: 'Email already in use'
    })
  } else if (existing_user && existing_user.verified === false) {
    // rewrite document and create new user
    await user.findOneAndDelete({ email: email })
  }
  // if there is no previous record => create new record
  new_user = await User.create({
    name,
    email,
    password
  })
  req.userId = new_user._id
  next()
})
// send OTP
exports.sendOTP = catchAsync(async (req, res, next) => {
  const { userId } = req
  // generate new OTP
  const new_otp = otpGenerator.generate(4, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false
  })
  const otp_expiry_time = Date.now() + 10 * 60 * 1000 // 10 minutes after OTP is created
  const user = await User.findByIdAndUpdate(
    userId,
    {
      otp_expiry_time: otp_expiry_time
    },
    { new: true, validateModifiedOnly: true }
  )
  user.otp = new_otp
  await user.save({})
  // send otp via mail
  Mailer({ name: user.name, email: user.email, otp: new_otp })
  res.status(200).json({
    status: 'success',
    message: 'OTP sent successfully'
  })
})
// resend OTP
exports.resendOTP = catchAsync(async (req, res, next) => {
  const { email } = req.body
  const user = await User.findOne({
    email
  })
  if (!user) {
    return res.status(400).json({
      status: 'error',
      message: 'Email is invalid'
    })
  }
  // generate new OTP
  const new_otp = otpGenerator.generate(4, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false
  })
  const otp_expiry_time = Date.now() + 10 * 60 * 1000 // 10 minutes after OTP is created
  user.otp_expiry_time = otp_expiry_time
  user.otp = new_otp
  await user.save({})
  // send OTP via Email
  Mailer({ name: user.name, email: user.email, otp: new_otp })
  res.status(200).json({
    status: 'success',
    message: 'OTP sent successfully'
  })
})
// verify OTP
exports.verifyOTP = catchAsync(async (req, res, next) => {
  const { email, otp } = req.body
  const user = await User.findOne({
    email,
    otp_expiry_time: { $gt: Date.now() }
  })
  if (!user) {
    return res.status(400).json({
      status: 'error',
      message: 'Email is Invalid or OTP expired'
    })
  }
  if (user.verified) {
    return res.status(400).json({
      status: 'error',
      message: 'Email is already verified'
    })
  }
  if (!(await user.correctOTP(otp, user.otp))) {
    return res.status(400).json({
      status: 'error',
      message: 'OTP is incorrect'
    })
  }
  // OTP is correct
  user.verified = true
  user.otp = undefined
  await user.save({
    new: true,
    validateModifiedOnly: true
  })
  const token = signToken(user._id)
  res.status(200).json({
    status: 'success',
    message: 'Email verified successfully',
    token,
    user_id: user._id
  })
})
// Login
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({
      status: 'error',
      message: 'Email and Password are required'
    })
  }
  const user = await User.findOne({
    email: email
  }).select('+password')
  if (!user || !user.password) {
    return res.status(400).json({
      status: 'error',
      message: 'No record found for this email'
    })
  }
  if (!user || !(await user.correctPassword(password, user.password))) {
    return res.status(400).json({
      status: 'error',
      message: 'Email or Password is incorrect'
    })
  }
  const token = signToken(user._id)
  res.status(200).json({
    status: 'success',
    message: 'Logged in successfully',
    token,
    user_id: user._id
  })
})
// Protect
exports.protect = catchAsync(async (req, res, next) => {
  try {
    // 1) getting token if it exists
    let token
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split('')[1]
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt
    }
    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'You are not logged in. Please Log In to access aplication'
      })
    }
    // 2) token verification
    const decoded = await promisify(jwt.verify)(token, process.env.TOKEN_KEY)
    console.log(decoded)
    // 3) Checking if user exists
    const this_user = await User.findById(decoded.userId)
    if (!this_user) {
      return res.status(401).json({
        message: 'Token does no longer belongs to this user'
      })
    }
    // 4) Checking password changing after token was issued
    if (this_user.changedPasswordAfter(decoded.iat)) {
      return res.status(401).json({
        status: 'error',
        message: 'The password was changed recently.Please Log In again.'
      })
    }
    // Grant access to protected route
    req.user = this_user
    next()
  } catch (error) {
    console.log(error)
    console.log('Protection endpoint failed')
    res.status(400).json({
      status: 'error',
      message: 'Authentication failed',
    })
  }
})
