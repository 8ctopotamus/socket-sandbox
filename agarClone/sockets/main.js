const { io } = require('../servers')
const Orb = require('./classes/Orb')
const Player = require('./classes/Player')
const PlayerConfig = require('./classes/PlayerConfig')
const PlayerData = require('./classes/PlayerData')
const { checkForOrbCollisions, checkForPlayerCollisions } = require('./checkCollisions')

let orbs = []
let players = []
let settings = {
  defaultOrbs: 50,
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

function getLeaderBoard() {
  return players
    .sort((a, b) => b.score - a.score)
    .map(player => ({ name: player.name, score: player.score }))
}

initGame()

// issue a message to EVERY connected socket 30 fps
setInterval(() => {
  if (players.length > 0) {
    io.to('game').emit('tock', { 
      players, 
    })
  }
}, 33) // there are 30 33s in 1000 milliseconds, or 1/30th of a second, or 1 of 30fps

io.sockets.on('connect', socket => {
  let player = {}
  
  socket.on('init', data => {
    socket.join('game')
    const playerConfig = new PlayerConfig(settings)
    const playerData = new PlayerData(data.playerName, settings)
    player = new Player(socket.id, playerConfig, playerData)
    // issue a message to this socket 30x/sec
    setInterval(() => {
      socket.emit('tickTock', { 
        playerX: player.playerData.locX,
        playerY: player.playerData.locY, 
        })
    }, 33)
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
    
    // ORB COLLISSION
    const capturedOrb = checkForOrbCollisions(player.playerData, player.playerConfig, orbs, settings)
    capturedOrb.then(data => {
      // every socket needs to know leaderBoard has changed
      io.sockets.emit('updateLeaderBoard', getLeaderBoard())
      io.sockets.emit('orbSwitch', {
        orbIndex: data,
        newOrb: orbs[data]
      })
    }).catch(err => {})

    // PLAYER COLLISION
    const playerDeath = checkForPlayerCollisions(player.playerData, player.playerConfig, players, player.socketId)
    playerDeath.then(data => {
      // every socket needs to know leaderBoard has changed
      io.sockets.emit('updateLeaderBoard', getLeaderBoard())
      // a player was absorbed, let everyone know
      io.sockets.emit('playerDeath', data)
    }).catch(err => {})
  })

  socket.on('disconnect', data => {
    if (player.playerData) {
      // find out who just left
      players.forEach((currPlayer, i) => {
        if (currPlayer.uid == player.playerData.uid) {
          players.splice(i, 1)
          io.sockets.emit('updateLeaderBoard', getLeaderBoard())
        }
      })
      // TODO: save in DB
      // const updateStats = `
      //         UPDATE stats
      //             SET highScore = CASE WHEN highScore < ? THEN ? ELSE highScore END,
      //             mostOrbs = CASE WHEN mostOrbs < ? THEN ? ELSE mostOrbs END,
      //             mostPlayers = CASE WHEN mostPlayers < ? THEN ? ELSE mostPlayers END
      //         WHERE username = ?
      //         `
    }
  })
})

module.exports = io