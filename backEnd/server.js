const app = require('./app')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
dotenv.config({ path: './config.env' })
const PORT = process.env.PORT || process.env.API_PORT
const http = require('http')
const server = http.createServer(app)
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    server.listen(PORT, () => {
      console.log(`server is listening on ${PORT}`)
    })
  })
  .catch(err => {
    console.log('database connection failed.Server not started')
    console.log(err)
  })
