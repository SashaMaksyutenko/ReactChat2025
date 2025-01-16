const authSocket = require('./middleware/authSocket')
const registerSocketServer = server => {
  const io = require('socket.io')(server, {
    cors: {
      origin: '*',
      metodd: ['GET', 'POST']
    }
  })
  io.use((socket, next) => {
    authSocket(socket, next)
  })
  io.on('connection', socket => {
    console.log('user connected')
    console.log(socket.id)
    //newConnectionHandler
  })
  setInterval(() => {
    //emit online user
  }, [1000 * 8])
}
module.exports={registerSocketServer}