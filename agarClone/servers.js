const express = require('express')
const helmet = require('helmet')
const PORT = 8080
const app = express()
app.use(express.static(`${__dirname}/public`))
const socketio = require('socket.io')
const expressServer = app.listen(PORT)
const io = socketio(expressServer)
app.use(helmet)
console.log(`Express and SocketIO listening on http://localhost:${PORT}`)

module.exports = { app, io }
