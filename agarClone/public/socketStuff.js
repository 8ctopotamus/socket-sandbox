const socket = io.connect('http://localhost:8080')

function init() {
  draw()
  socket.emit('init', { playerName: player.name })
}

socket.on('initReturn', data => {
  orbs = data.orbs
  // start ticking
  setInterval(() => {
    socket.emit('tick', { 
      xVector: player.xVector, 
      yVector: player.yVector, 
    })
  })
})

socket.on('tock', data => {
  console.log(data)
  players = data.players
})