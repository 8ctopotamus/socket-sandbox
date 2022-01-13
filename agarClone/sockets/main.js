const { io } = require('../servers')

const Orb = require('./classes/Orb')
let orbs = []

function initGame() {
  for (let i = 0; i < 500; i++) {
    orbs.push(new Orb())
  }
}

initGame()

io.sockets.on('connect', socket => {
  socket.emit('init', { orbs })
})

module.exports = io