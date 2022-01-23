const mongoose = require('mongoose')


function socketMain(io, socket) {
  // console.log(`Socket ${socket.id} connected`)

  socket.on('clientAuth', key => {
    if (key === 'nodeClient_XXXXXXXXXXXXXXXXXX') {
      // valide nodeClient 
      socket.join('clients')
    } else if (key === 'reactClient_XXXXXXXXXXXXXXXXXX') {
      // valid ui client
      socket.join('ui')
    } else {
      // invalid client trying to join... goodbye
      socket.disconnect(true)
    }
  })

  socket.on('perfData', data => {
    console.log(data)
  })
}

module.exports = socketMain