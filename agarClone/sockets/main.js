const { io } = require('../servers')
const Orb = require('./classes/Orb')
const Player = require('./classes/Player')
const PlayerConfig = require('./classes/PlayerConfig')
const PlayerData = require('./classes/PlayerData')
const { checkForOrbCollisions, checkForPlayerCollisions } = require('./checkCollisions')

let orbs = []
let players = []
let settings = {
  defaultOrbs: 5000,
  defaultSpeed: 6,
  defaultSize: 6,
  defaultZoom: 1.5,
  worldWidth: 5000,
  worldHeight: 5000,
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
    if ((player.playerData.locX < 5 && player.playerData.xVector < 0) || (player.playerData.locX > settings.worldWidth) && (xV > 0)) {
      player.playerData.locY -= speed * yV
    } else if ((player.playerData.locY < 5 && yV > 0) || (player.playerData.locY > settings.worldHeight) && (yV < 0)) {
      player.playerData.locX += speed * xV
    } else {
      player.playerData.locX += speed * xV
      player.playerData.locY -= speed * yV
    }
    const capturedOrb = checkForOrbCollisions(player.playerData, player.playerConfig, orbs, settings)
    capturedOrb.then(data => {
      io.sockets.emit('orbSwitch', {
        orbIndex: data,
        newOrb: orbs[data]
      })
    })
      .catch(err => {})
  })
})

module.exports = io