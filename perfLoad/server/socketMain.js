function socketMain(io, socket) {
  // console.log(`Socket ${socket.id} connected`)
  socket.on('perfData', data => {
    console.log(data)
  })
}

module.exports = socketMain