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
    
    nsSocket.on('joinRoom', (roomTitle, numMembersCallback) => {
      nsSocket.join(roomTitle)

      io.of('/wiki').in(roomTitle).fetchSockets().then((clients) => {
        numMembersCallback(clients.length)
      })

      const nsRoom = namespace.rooms.find(room => room.roomTitle === roomTitle)
      if (nsRoom) {
        nsSocket.emit('historyCatchUp', nsRoom.history)
      }
    })

    nsSocket.on('newMessageToServer', msg => {
      const roomTitle = [...nsSocket.rooms][1]
      const fullMsg = {
        ...msg,
        time: Date.now(),
        username: 'Testttttt',
        avatar: 'https://via.placeholder.com/30',
      }
      const nsRoom = namespace.rooms.find(room => room.roomTitle === roomTitle)
      if (nsRoom) {
        nsRoom.addMessage(fullMsg)
        io.of('/wiki').to(roomTitle).emit('messageToClients', fullMsg)
      }
    })
  })
})