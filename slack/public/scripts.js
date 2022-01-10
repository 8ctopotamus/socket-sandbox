const namespacesDiv = document.querySelector('.namespaces')
const roomList = document.querySelector('.room-list')
const messageForm = document.getElementById('message-form')
const newMessageInput = document.getElementById('user-message')
const messages = document.getElementById('messages')

const SOCKET_BASE_URL = 'http://localhost:8000'
const socket = io(SOCKET_BASE_URL)

socket.on('connect', () => {
  console.log(`${socket.id} connected!`)
})

function joinNS(endpoint) {
  const nsSocket = io(`${SOCKET_BASE_URL}/wiki`)
  nsSocket.on('nsRoomLoad', nsRooms => {
    roomList.innerHTML = ''
    nsRooms.forEach(room => {
      const glyph = room.privateRoom ? 'lock' : 'globe'
      roomList.innerHTML += `
        <li data-roomid=${room.roomId}>
          <span class="glyphicon glyphicon-${glyph}"></span>${room.roomTitle}
        </li>    
      `
    })
  })
}

socket.on('nsList', nsList => {
  namespacesDiv.innerHTML = ''
  nsList.forEach(ns => namespacesDiv.innerHTML += `
    <div class="namespace" data-ns="${ns.endpoint}">
      <img src="${ns.img}" alt="${ns.endpoint}">
    </div>
  `)
  joinNS(nsList[0].endpoint)
})

roomList.addEventListener('click', ({ target }) => {
  if (target.tagName !== 'UL') {
    const roomId = target.dataset.roomid
    console.log(roomId)
  }
})

namespacesDiv.addEventListener('click', ({ target }) => {
  if (target.tagName === 'IMG') {
    console.log(target.parentElement.dataset.ns)
  }
})

socket.on('messageFromServer', data => console.log('from server'),data)

messageForm.addEventListener('submit', e => {
  preventDefault()
  socket.emit('newMessageToServer', newMessageInput.value)
  newMessageInput.value = ''
})

socket.on('messageToClients', msg => messages.innerHTML += `
  <li>${msg.text}</li>
`)

