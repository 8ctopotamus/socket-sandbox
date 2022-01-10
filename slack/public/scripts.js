const namespacesDiv = document.querySelector('.namespaces')
const roomList = document.querySelector('.room-list')

const SOCKET_BASE_URL = 'http://localhost:8000'
const socket = io(SOCKET_BASE_URL)

socket.on('connect', () => {
  console.log(`${socket.id} connected!`)
})

socket.on('nsList', nsList => {
  namespacesDiv.innerHTML = ''
  nsList.forEach(ns => namespacesDiv.innerHTML += `
    <div class="namespace" data-ns="${ns.endpoint}">
      <img src="${ns.img}" alt="${ns.endpoint}">
    </div>
  `)
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

