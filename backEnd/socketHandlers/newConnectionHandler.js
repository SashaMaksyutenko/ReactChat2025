const User = require('../Models/User')
const newConnectionHandler = async (socket, io) => {
  const { userId } = socket.user
  // Log new user connected
  console.log(`User connected: ${socket.id}`)
  // Add SocketId to user record and set status to online
  const user = await User.findByIdAndUpdate(
    userId,
    {
      socketId: socket.id,
      status: 'Online'
    },
    {
      new: true,
      validateModifiedOnly: true
    }
  )
  if (user) {
    // Broadcast to everyone that new user is connected
    socket.broadcast.emit('user-connected', {
      message: `user ${user.name} has connected`,
      userId: user._id,
      status: 'Online'
    })
  } else {
    console.log(`User with Id ${userId} not found`)
  }
}
module.exports = newConnectionHandler
