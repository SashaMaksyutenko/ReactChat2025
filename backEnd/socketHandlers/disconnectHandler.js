const User = require('../Models/User')
const disconnectHandler = async socket => {
  const { userId } = socket.user
  // Log the disconnection
  console.log(`User disconnected: ${socket.id}`)
  // Update user doccument: set socketId to undefined and status to Offline
  const user = await User.findOneAndUpdate(
    {
      socketId: socket.id
    },
    {
      socketId: undefined,
      status: 'Offline'
    },
    {
      new: true,
      validateModifiedOnly: true
    }
  )
  if (user) {
    // Broadcast to everyone that the user is offline
    socket.broadcast.emit('user-disconnected', {
      message: `user ${user.name} has disconnected`,
      userId: user._id,
      status: 'Offline'
    })
  } else {
    console.log(`User with Id ${socket.id} not found`)
  }
}
module.exports = disconnectHandler
