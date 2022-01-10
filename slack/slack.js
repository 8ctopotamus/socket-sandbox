const express = require('express')
const socketio = require('socket.io')
const namespaces = require('./data/namespaces')

const PORT = process.env.PORT || 8000
const app = express()

app.use(express.static(__dirname + '/public'))

const expressServer = app.listen(PORT, () => console.log(`Listening at http://localhost:${PORT}`))

const io = socketio(expressServer)

io.on('connection', socket => {
  // build array to send img and endpoint for each NS
  let nsData = namespaces.map(ns => ({
    img: ns.img,
    endpoint: ns.endpoint
  }))
  socket.emit('nsList', nsData)
})

// loop thru namespaces and listen for a connection
namespaces.forEach(namespace => {
  io.of(namespace.endpoint).on('connection', nsSocket => {
    console.log(`${nsSocket.id} has joined ${namespace.endpoint}`)
    
    nsSocket.emit('nsRoomLoad', namespaces[0].rooms)
    
    nsSocket.on('joinRoom', (roomName, numMembersCallback) => {
      nsSocket.join(roomName)

      io.of('/wiki').in(roomName).fetchSockets().then((clients) => {
        numMembersCallback(clients.length)
      })
    })
  })
})