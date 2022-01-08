const express = require('express')
const socketio = require('socket.io')

const PORT = process.env.PORT || 8000
const app = express()
app.use(express.static(__dirname + '/public'))

const expressServer = app.listen(PORT, () => console.log(`Listening at http://localhost:${PORT}`))

const io = socketio(expressServer)

io.on('connection', socket => {
  socket.emit('messageFromServer', { data: 'Wecome to socketio server'})
  socket.on('messageToServer', dataFromClient => {
    console.log(dataFromClient)
  })
})

io.of('/admin').on('connection', socket => {
  socket.of('/admin').emit('messageFromServer', { data: 'Wecome to admin channel'})
})