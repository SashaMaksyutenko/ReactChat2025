const Conversation = require('../Models/Conversation')
const User = require('../Models/User')
const catchAsync = require('../utilities/catchAsync')
// get user
exports.getMe = catchAsync(async (req, res, next) => {
  const { user } = req
  res.status(200).json({
    status: 'success',
    message: 'User info was found successfully',
    data: {
      user: user
    }
  })
})
// update user
exports.updateMe = catchAsync(async (req, res, next) => {
  const { name, jobTitle, bio, country } = req.body
  const { _id } = req.user
  const updatedUser = await User.findByIdAndUpdate(
    _id,
    {
      name,
      jobTitle,
      bio,
      country
    },
    {
      new: true,
      validateModifiedOnly: true
    }
  )
  res.status(200).json({
    status: 'success',
    message: 'Profile info updated successfully',
    data: {
      user: updatedUser
    }
  })
})
// update avatar
exports.updateAvatar = catchAsync(async (req, res, next) => {
  const { avatar } = req.body
  const { _id } = req.user
  const updatedUser = await User.findByIdAndUpdate(
    _id,
    {
      avatar
    },
    {
      new: true,
      validateModifiedOnly: true
    }
  )
  res.status(200).json({
    status: 'success',
    message: 'Avatar updated successfully',
    data: {
      user: updatedUser
    }
  })
})
// update password
exports.updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body
  const { _id } = req.user
  const user = await User.findById(_id).select('+password')
  if (!(await user.correctPassword(currentPassword, user.password))) {
    return res.status(400).json({
      status: 'error',
      message: 'Current password is incorrect'
    })
  }
  user.password = newPassword
  user.passwordChangedAt = Date.now()
  await user.save({})
  res.status(200).json({
    status: 'success',
    message: 'Password updated successfully'
  })
})
// get users
exports.getUsers = catchAsync(async (req, res, next) => {
  const { _id } = req.user
  const other_verified_users = await User.find({
    _id: { $ne: _id },
    verified: true
  }).select('name avatar _id status')
  res.status(200).json({
    status: 'success',
    message: 'User found successfully',
    data: {
      users: other_verified_users
    }
  })
})
// start conversation
exports.startConversation = catchAsync(async (req, res, next) => {
  const { userId } = req.body
  const { _id } = req.user
  // check if conversation between two users is already exists
  let conversation = await Conversation.findOne({
    participants: { $all: [userId, _id] }
  })
    .populate('messages')
    .populate('participants')
  if (conversation) {
    return res.status(200).json({
      status: 'success',
      message: 'User info was found successfully',
      data: {
        conversation
      }
    })
  } else {
    // creating new conversation
    let newConversation = await Conversation.create({
      participants: [userId, _id]
    })
    newConversation = await Conversation.findById(newConversation._id)
      .populate('messages')
      .populate('participants')
    return res.status(201).json({
      status: 'success',
      message: 'User info was found successfully',
      data: {
        conversation: newConversation
      }
    })
  }
})
// get conversations
exports.getConversations = catchAsync(async (req, res, next) => {
  const { _id } = req.user
  // Find all conversations where current user is a participant
  const conversations = await Conversation.find({
    _id: { $in: _id }
  })
    .populate('messages')
    .populate('participants')
  // send a list of conversations as a response
  res.status(200).json({
    status: 'success',
    data: {
      conversations
    }
  })
})
