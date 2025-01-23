const app = require('./app')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const socketServer = require('./socketServer')
dotenv.config({ path: './config.env' })
const PORT = process.env.PORT || process.env.API_PORT
const http = require('http')
const server = http.createServer(app)
socketServer.registerSocketServer(server)
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connection successfull')
    server.listen(PORT, () => {
      console.log(`server is listening on ${PORT}`)
    })
  })
  .catch(err => {
    console.log('database connection failed.Server not started')
    console.log(err)
  })
