const authSocket = require('./middleware/authSocket')
const disconnectHandler = require('./socketHandlers/disconnectHandler')
const chatHistoryHandler = require('./socketHandlers/getMessageHistoryHandler')
const newConnectionHandler = require('./socketHandlers/newConnectionHandler')
const startTypingHandler = require('./socketHandlers/startTypingHandler')
const stopTypingHandler = require('./socketHandlers/stopTypingHandler')
const registerSocketServer = server => {
  const io = require('socket.io')(server, {
    cors: {
      origin: '*',
      method: ['GET', 'POST']
    }
  })
  io.use((socket, next) => {
    authSocket(socket, next)
  })
  io.on('connection', socket => {
    console.log('user connected')
    console.log(socket.id)
    // newConnectionHandler
    newConnectionHandler(socket, io)
    // disconnectHadler
    socket.on('disconnect', () => {
      disconnectHandler(socket)
    })
    // TODO: newMessageHandler
    socket.on('new-message', data => {})
    // chatHistoryHandler
    socket.on('direct-chat-history', data => {
      chatHistoryHandler(socket,data)
    })
    // startTypingHandler
    socket.on('start-typing', data => {
      startTypingHandler(socket, data, io)
    })
    // stopTypingHandler
    socket.on('stop-typing', data => {
      stopTypingHandler(socket,data,io)
    })
  })
}
module.exports = { registerSocketServer }
