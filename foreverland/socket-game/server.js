const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

let players = {};

io.on('connection', (socket) => {
  console.log('a user connected');
  
  // Assign a unique ID to each player and store their data
  const playerId = socket.id;
  players[playerId] = {
    x: Math.random() * 800,
    y: Math.random() * 600,
    color: 'red',
  };

  // Send the current players data to the newly connected player
  socket.emit('currentPlayers', players);

  // Update all other players about the new player
  socket.broadcast.emit('newPlayer', playerId, players[playerId]);

  socket.on('disconnect', () => {
    console.log('user disconnected');
    // Remove the player from the players object
    delete players[playerId];
    // Update all players about the disconnected player
    io.emit('playerDisconnected', playerId);
  });

  socket.on('playerMove', (data) => {
    // Update the player's position in the players object
    players[playerId].x = data.x;
    players[playerId].y = data.y;

    // Send the updated position to all other players
    socket.broadcast.emit('playerMove', { id: playerId, x: data.x, y: data.y });
  });
});

const PORT = process.env.PORT || 3000;

http.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
