const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config({ path: './config/.env' });

const app = express();
const PORT = process.env.PORT || 8080;
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URL, { dbName: 'worduel' })
  .then(() => console.log('Connected to database'))
  .catch((error) => console.log(error));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

const sessionSocket = require('./socket/sessionSocket');
io.on('connection', (socket) => {
  console.log('A user connected');

  sessionSocket(socket, io);
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
