const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const PORT = 8080;
app.use(cors());

/*
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
*/

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('updatePlayer1Name', (name) => {
    io.emit('player1NameUpdated', name);
  });

  socket.on('updatePlayer2Name', (name) => {
    io.emit('player2NameUpdated', name);
  });

  socket.on('updateSessionCode', (code) => {
    io.emit('sessionCodeUpdated', code);
  });

  socket.on('updateRounds', (rounds) => {
    io.emit('roundsUpdated', rounds);
  });

  socket.on('updateSpellCheckEnabled', (enabled) => {
    io.emit('spellCheckEnabledUpdated', enabled);
  });

  socket.on('updateBlockProfanityEnabled', (enabled) => {
    io.emit('blockProfanityEnabledUpdated', enabled);
  });

  socket.on('updateRoundTimerEnabled', (enabled) => {
    io.emit('roundTimerEnabledUpdated', enabled);
  });

  socket.on('updateRoundTimerDuration', (duration) => {
    io.emit('roundTimerDurationUpdated', duration);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});