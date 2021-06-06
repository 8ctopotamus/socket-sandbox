const express = require('express')
const socketio = require('socket.io')
const faker = require('faker')

const PORT = process.env.PORT || 8000

const app = express()

app.use(express.static(__dirname + '/public'))

const expressServer = app.listen(PORT, () => console.log(`Listening at http://localhost:${PORT}`))
const io = socketio(expressServer)

io.on('connection', socket => {
  socket.emit('newUser', {
    ...faker.helpers.createCard(),
    avatar: faker.image.animals(),
    uuid: faker.datatype.uuid,
  })
  
  socket.on('newMessageToServer', msg => {
    io.emit('incomingMessage', { ...msg, created: new Date() })
  })
})