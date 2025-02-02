const User = require('../Models/User')
const startTypingHandler = async (socket, data, io) => {
  const { userId, conversationId } = data
  // this is userId of another participant in the conversation who should receive typing status
  // Fetch the user by userId
  const user = await User.findById(userId)
  if (user && user.status === 'Online' && user.socketId) {
    const dataToSend = {
      conversationId,
      typing: true
    }
    // Emit start-typing event to the socketId of the user
    io.to(user.socketId).emit('start-typing', dataToSend)
  } else {
    // User is offline and dont emit any event
    console.log(`User with Id ${userId} is offline. Not emit typing status`)
  }
}
module.exports = startTypingHandler
