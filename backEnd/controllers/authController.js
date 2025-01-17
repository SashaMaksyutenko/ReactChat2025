const User = require('../Models/User')
const catchAsync = require('../utilities/catchAsync')
const otpGenerator = require('otp-generator')
const jwt = require('jsonwebtoken')
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
    new_user = await User.findOneAndUpdate(
      { email: email },
      {
        name,
        password
      },
      {
        new: true,
        validateModifiedOnly: true
      }
    )
  } else {
    // if there is no previous record => create new record
    new_user = await User.create({
      name,
      email,
      password
    })
  }
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
      otp: new_otp.toString(),
      otp_expiry_time: otp_expiry_time
    },
    { new: true, validateModifiedOnly: true }
  )
  // TODO => send otp via mail
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
  return res.status(200).json({
    status: 'success',
    message: 'OTP verified successfully',
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
  return res.status(200).json({
    status: 'success',
    message: 'Logged in successfully',
    token,
    user_id: user._id
  })
})
// Protect
