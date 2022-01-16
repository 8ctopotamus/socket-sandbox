const { io } = require('../servers')
const Orb = require('./classes/Orb')
const Player = require('./classes/Player')
const PlayerConfig = require('./classes/PlayerConfig')
const PlayerData = require('./classes/PlayerData')

let orbs = []
let players = []
let settings = {
  defaultOrbs: 500,
  defaultSpeed: 6,
  defaultSize: 6,
  defaultZoom: 1.5,
  worldWidth: 500,
  worldHeight: 500,
}

function initGame() {
  for (let i = 0; i < settings.defaultOrbs; i++) {
    orbs.push(new Orb(settings))
  }
}

initGame()

io.sockets.on('connect', socket => {
  let player = {}
  
  socket.on('init', data => {
    socket.join('game')
    const playerConfig = new PlayerConfig(settings)
    const playerData = new PlayerData(data.playerName, settings)
    player = new Player(socket.id, playerConfig, playerData)
    // issue a message to EVERY connected socket 30 fps
    setInterval(() => {
      if (players.length > 0) {
        io.to('game').emit('tock', { 
          players,
          playerX: player.playerData.locX,
          playerY: player.playerData.locY, 
        })
      }
    }, 33) // there are 30 33s in 1000 milliseconds, or 1/30th of a second, or 1 of 30fps
    socket.emit('initReturn', { orbs })
    players.push(playerData)
  })

  socket.on('tick', data => {
    if (Object.keys(player).length === 0 || !data.xVector || !data.yVector) return
    const speed = player.playerConfig.speed
    const xV = player.playerConfig.xVector = data.xVector
    const yV = player.playerConfig.yVector = data.yVector
    if ((player.playerData.locX < 5 && player.playerData.xVector < 0) || (player.playerData.locX > 500) && (xV > 0)) {
      player.playerData.locY -= speed * yV
    } else if ((player.playerData.locY < 5 && yV > 0) || (player.playerData.locY > 500) && (yV < 0)) {
      player.playerData.locX += speed * xV
    } else {
      player.playerData.locX += speed * xV
      player.playerData.locY -= speed * yV
    }
  })
})

module.exports = io