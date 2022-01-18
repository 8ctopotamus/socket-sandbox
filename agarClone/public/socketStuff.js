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
  players = data.players
})

socket.on('orbSwitch', data => {
  orbs.splice(data.orbIndex, 1, data.newOrb)
})

socket.on('tickTock', data => {
  player.locX = data.playerX
  player.locY = data.playerY
})

socket.on('updateLeaderBoard', data => {
  leaderBoard.innerHTML = ''
  data.forEach(player => leaderBoard.innerHTML += `
    <li class="leaderboard-player">${player.name} - ${player.score}<li>
  `)
})