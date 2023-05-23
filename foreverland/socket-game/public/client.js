const socket = io();
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const players = {};

socket.on('currentPlayers', (data) => {
  Object.keys(data).forEach((id) => {
    if (id === socket.id) {
      players[id] = { ...data[id], color: 'blue', radius: 20 }; // Set the current player's color to blue
    } else {
      players[id] = { ...data[id], color: 'red', radius: 20 };
    }
  });
  drawPlayers();
});

socket.on('newPlayer', (playerId, data) => {
  players[playerId] = { ...data, color: 'red', radius: 20 };
  drawPlayers();
});

socket.on('playerDisconnected', (id) => {
  delete players[id];
  drawPlayers();
});

socket.on('playerMove', (data) => {
  players[data.id].x = data.x;
  players[data.id].y = data.y;
  drawPlayers();
});

function drawPlayers() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  Object.values(players).forEach((player) => {
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, 2 * Math.PI);
    ctx.fillStyle = player.color;
    ctx.fill();
  });
}

function movePlayer(e) {
  const speed = 5;
  const currentPlayer = players[socket.id];
  if (!currentPlayer) return;
  
  switch (e.key) {
    case 'w':
      currentPlayer.y -= speed;
      break;
    case 'a':
      currentPlayer.x -= speed;
      break;
    case 's':
      currentPlayer.y += speed;
      break;
    case 'd':
      currentPlayer.x += speed;
      break;
  }
  drawPlayers();
  socket.emit('playerMove', { x: currentPlayer.x, y: currentPlayer.y });
}

document.addEventListener('keydown', movePlayer);