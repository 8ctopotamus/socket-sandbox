const wHeight = $(window).height()
const wWidth = $(window).width()
const $loginModal = $('#loginModal')
const $nameInput = $('#name-input')
const $spawnModal = $('#spawnModal')

const canvas = document.getElementById('the-canvas')
const context = canvas.getContext('2d')

canvas.width = wWidth
canvas.height = wHeight

let player = {}

$(window).load(() => $loginModal.modal('show'))

$('.name-form').submit(e => {
  e.preventDefault()
  const name = $nameInput.val()
  if (name) {
    player.name = name
    $loginModal.modal('hide')
    $spawnModal.modal('show')
    $('.player-name').text(player.name)
  }
})

$('.start-game').click(e => {
  $('.modal').modal('hide')
  $('.hiddenOnStart').removeAttr('hidden')
  init()
})