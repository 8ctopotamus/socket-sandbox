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
    const username = nsSocket.handshake.query.username
    console.log(`${username} has joined ${namespace.endpoint}`)
    
    nsSocket.emit('nsRoomLoad', namespace.rooms)

    nsSocket.on('joinRoom', roomTitle => {
      // leave previously connected nsSocket
      const roomToLeaveTitle = [...nsSocket.rooms][1]
      nsSocket.leave(roomToLeaveTitle)

      // join next nsSocket
      nsSocket.join(roomTitle)
      updateUsersInRoom(namespace, roomToLeaveTitle)
      
      const nsRoom = namespace.rooms.find(room => room.roomTitle === roomTitle)
      nsSocket.emit('historyCatchUp', nsRoom.history)
      updateUsersInRoom(namespace, roomTitle)
    })

    nsSocket.on('newMessageToServer', msg => {
      const roomTitle = [...nsSocket.rooms][1]
      const fullMsg = {
        ...msg,
        time: Date.now(),
        username,
        avatar: 'https://via.placeholder.com/30',
      }
      const nsRoom = namespace.rooms.find(room => room.roomTitle === roomTitle)
      if (nsRoom) {
        nsRoom.addMessage(fullMsg)
        io.of(namespace.endpoint).to(roomTitle).emit('messageToClients', fullMsg)
      }
    })
  })
})


function updateUsersInRoom(namespace, roomTitle) {
  io.of(namespace.endpoint).in(roomTitle).fetchSockets().then(clients => {
    io.of(namespace.endpoint).in(roomTitle).emit('updateMembersCount', clients.length)
  })
}