const msgForm = document.getElementById('message-form')
const msgInput = document.getElementById('user-message')
const messages = document.getElementById('messages')

const socket = io('http://localhost:8000')
const socket2 = io('http://localhost:8000/admin')

socket.on('connect',() => {
  console.log(socket.id)
})

socket.on('messageFromServer', data => {
  console.log(data)
  socket.emit('dataToServer', { data: 'Data from client' })
})

msgForm.addEventListener('submit', e => {
  e.preventDefault()
  const newMsg = msgInput.value
  socket.emit('messageToServer', newMsg)
})