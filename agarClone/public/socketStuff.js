const socket = io.connect('http://localhost:8080')

socket.on('init', ({ orbs }) => console.log(orbs))