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
    }
  },
  {
    timestamps: true
  }
)
// PRE SAVE HOOK
userSchema.pre('save', async function (next) {
  // running this function if only otp modified
  if (!this.isModified('otp') || this.otp) return next()
  // Hash otp with cost of 12
  this.otp = await bcrypt.hash(this.otp.toString(), 12)
  console.log(this.otp.toString(), 'from PRE SAVE HOOK')
  next()
})
// PRE SAVE HOOK
userSchema.pre('save', async function (next) {
  // running this function if only password modified
  if (!this.isModified('password') || this.password) return next()
  // Hash password with cost of 12
  this.password = await bcrypt.hash(this.password.toString(), 12)
  console.log(this.password.toString(), 'from PRE SAVE HOOK')
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
const User = new mongoose.model('User', userSchema)
module.exports = User
