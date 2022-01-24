const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1/perfData', { useNewUrlParser: true })
const Machine = require('./models/Machine')

function socketMain(io, socket) {
  // console.log(`Socket ${socket.id} connected`)
  let macA

  socket.on('clientAuth', key => {
    if (key === 'nodeClient_XXXXXXXXXXXXXXXXXX') {
      // valide nodeClient 
      socket.join('clients')
    } else if (key === 'reactClient_XXXXXXXXXXXXXXXXXX') {
      // valid ui client
      socket.join('ui')
      console.log('A react client has joined!')
      Machine.find({}, (err, docs) => {
        // assume all machines are offline
        docs.forEach(machine => {
          machine.isActive = false
          io.to('ui').emit('data', machine)
        })
      })
    } else {
      // invalid client trying to join... goodbye
      socket.disconnect(true)
    }

    socket.on('disconnect', () => {
      Machine.find({ macA: macA }, (err, docs) => {
        if (docs.length > 0) {
          docs[0].isActive = false
          io.to('ui').emit('data', docs[0])
        }
      })
    })
  })

  socket.on('initPerfData', async data => {
    macA = data.macA
    await checkAndAdd(data)
  })

  socket.on('perfData', data => {
    io.to('ui').emit('data', data)
  })
}

function checkAndAdd(data) {
  return new Promise((resolve) => {
    Machine.findOne(
      { macA: data.macA },
      (err, doc) => {
        if (err) {
          throw err
        } else if (doc === null) {
          let newMachine = new Machine(data)
          newMachine.save()
          resolve('added')
        } else {
          resolve('found')
        }
      }
    )
  })
}

module.exports = socketMain