const User = require('../Models/User');
const catchAsync = require('../utilities/catchAsync');
const otpGenerator = require('otp-generator');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const Mailer = require('../services/mailer');
// Sign JWT Token
const signToken = userId => jwt.sign({ userId }, process.env.TOKEN_KEY);
// Register new user
exports.register = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;
  const existing_user = await User.findOne({ email });
  if (existing_user && existing_user.verified === true) {
    return res.status(400).json({ status: 'error', message: 'Email already in use' });
  } else if (existing_user && existing_user.verified === false) {
    await User.findOneAndDelete({ email });
  }
  const new_user = await User.create({ name, email, password });
  req.userId = new_user._id;
  next();
});
// Send OTP
exports.sendOTP = catchAsync(async (req, res, next) => {
  const { userId } = req;
  const new_otp = otpGenerator.generate(4, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
  const otp_expiry_time = Date.now() + 10 * 60 * 1000;
  const user = await User.findByIdAndUpdate(userId, { otp_expiry_time }, { new: true, validateModifiedOnly: true });
  user.otp = new_otp;
  await user.save();
  Mailer({ name: user.name, email: user.email, otp: new_otp });
  res.status(200).json({ status: 'success', message: 'OTP sent successfully' });
});
// Resend OTP
exports.resendOTP = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ status: 'error', message: 'Email is invalid' });
  }
  const new_otp = otpGenerator.generate(4, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
  user.otp_expiry_time = Date.now() + 10 * 60 * 1000;
  user.otp = new_otp;
  await user.save();
  Mailer({ name: user.name, email: user.email, otp: new_otp });
  res.status(200).json({ status: 'success', message: 'OTP sent successfully' });
});
// Verify OTP
exports.verifyOTP = catchAsync(async (req, res, next) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email, otp_expiry_time: { $gt: Date.now() } });
  if (!user) {
    return res.status(400).json({ status: 'error', message: 'Email is Invalid or OTP expired' });
  }
  if (user.verified) {
    return res.status(400).json({ status: 'error', message: 'Email is already verified' });
  }
  if (!(await user.correctOTP(otp, user.otp))) {
    return res.status(400).json({ status: 'error', message: 'OTP is incorrect' });
  }
  user.verified = true;
  user.otp = undefined;
  await user.save({ validateModifiedOnly: true });
  const token = signToken(user._id);
  res.status(200).json({ status: 'success', message: 'Email verified successfully', token, user_id: user._id });
});
// Login
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ status: 'error', message: 'Email and Password are required' });
  }
  const user = await User.findOne({ email }).select('+password');
  if (!user || !user.password || !(await user.correctPassword(password, user.password))) {
    return res.status(400).json({ status: 'error', message: 'Email or Password is incorrect' });
  }
  const token = signToken(user._id);
  res.status(200).json({ status: 'success', message: 'Logged in successfully', token, user_id: user._id });
});
// Protect route
exports.protect = catchAsync(async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }
    if (!token) {
      return res.status(401).json({ status: 'error', message: 'You are not logged in. Please log in to access the application' });
    }
    const decoded = await promisify(jwt.verify)(token, process.env.TOKEN_KEY);
    const this_user = await User.findById(decoded.userId);
    if (!this_user) {
      return res.status(401).json({ status: 'error', message: 'Token no longer belongs to this user' });
    }
    if (this_user.changedPasswordAfter(decoded.iat)) {
      return res.status(401).json({ status: 'error', message: 'The password was changed recently. Please log in again.' });
    }
    req.user = this_user;
    next();
  } catch (error) {
    console.error('Protection endpoint failed:', error);
    res.status(400).json({
      status: 'error',
      message: 'Authentication failed',
      token: token || 'Token Not provided'
    });
  }
});
