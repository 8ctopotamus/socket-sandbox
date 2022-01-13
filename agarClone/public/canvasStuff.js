player.locX = Math.floor(Math.random() * 500 + 100)
player.locY = Math.floor(Math.random() * 500 + 100)

function draw() {
  context.clearRect(0, 0, canvas.width, canvas.height)
  context.setTransform(1, 0, 0, 1, 0, 0)
  // clamp camera
  const camX = -player.locX + canvas.width / 2
  const camY = -player.locY + canvas.height / 2
  context.translate(camX, camY)
  // draw player
  context.beginPath()
  context.fillStyle = 'rgb(255, 0, 0)'
  context.arc(player.locX, player.locY, 10, 0, Math.PI * 2)
  context.fill()
  context.lineWidth = 3
  context.strokeStyle = 'rgb(0,255,0)'
  context.stroke()
  requestAnimationFrame(draw)
}

function init() {
  draw()
}

canvas.addEventListener('mousemove', ({ clientX, clientY }) => {
  const mousePosition = {
    x: clientX,
    y: clientY
  };

  const angleDeg = Math.atan2(mousePosition.y - (canvas.height / 2), mousePosition.x - (canvas.width / 2)) * 180 / Math.PI;
  if (angleDeg >= 0 && angleDeg < 90) {
    xVector = 1 - (angleDeg / 90);
    yVector = -(angleDeg / 90);
  } else if (angleDeg >= 90 && angleDeg <= 180) {
    xVector = -(angleDeg - 90) / 90;
    yVector = -(1 - ((angleDeg - 90) / 90));
  } else if (angleDeg >= -180 && angleDeg < -90) {
    xVector = (angleDeg + 90) / 90;
    yVector = (1 + ((angleDeg + 90) / 90));
  } else if (angleDeg < 0 && angleDeg >= -90) {
    xVector = (angleDeg + 90) / 90;
    yVector = (1 - ((angleDeg + 90) / 90));
  }

  speed = 10
  xV = xVector;
  yV = yVector;

  if ((player.locX < 5 && player.xVector < 0) || (player.locX > 500) && (xV > 0)) {
    player.locY -= speed * yV;
  } else if ((player.locY < 5 && yV > 0) || (player.locY > 500) && (yV < 0)) {
    player.locX += speed * xV;
  } else {
    player.locX += speed * xV;
    player.locY -= speed * yV;
  }
})