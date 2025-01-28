const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    jobTitle: {
      type: String,
      trim: true
    },
    bio: {
      type: String,
      trim: true
    },
    country: {
      type: String
    },
    avatar: {
      type: String
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      validate: {
        validator: function (email) {
          return validator.isEmail(email)
        },
        message: props => `Email (${props.value}) is invalid`
      },
      unique: true
    },
    password: {
      type: String
    },
    passwordChangedAt: {
      type: Date
    },
    verified: {
      type: Boolean,
      default: false
    },
    otp: {
      type: String
    },
    otp_expiry_time: {
      type: Date
    },
    status: {
      type: String,
      enum: ['Online', 'Offline'],
      default: 'Offline'
    },
    socketId: {
      type: String
    }
  },
  {
    timestamps: true
  }
)
// PRE SAVE HOOK
userSchema.pre('save', async function (next) {
  if (this.isModified('password') && this.password) {
    this.password = await bcrypt.hash(this.password.toString(), 12)
    console.log(this.password.toString(), 'from PRE SAVE HOOK ( password )')
  }
  // running this function if only otp modified
  if (this.isModified('otp') && this.otp) {
    // Hash otp with cost of 12
    this.otp = await bcrypt.hash(this.otp.toString(), 12)
    console.log(this.otp.toString(), 'from PRE SAVE HOOK ( otp )')
  }
  next()
})
// METHOD
userSchema.methods.correctOTP = async function (candidateOTP, userOTP) {
  return await bcrypt.compare(candidateOTP, userOTP)
}
// METHOD
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword)
}
// Changing password after token was issued
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    )
    return JWTTimestamp < changedTimestamp
  }
  return false
}
const User = new mongoose.model('User', userSchema)
module.exports = User
