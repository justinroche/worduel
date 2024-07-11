const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config({ path: './config/.env' });

const app = express();
const PORT = process.env.PORT || 8080;
const HOST = '0.0.0.0'

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URL, { dbName: 'worduel' })
  .then(() => console.log('Connected to database'))
  .catch((error) => console.log(error));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const sessionSocket = require('./socket/sessionSocket');
io.on('connection', (socket) => {
  console.log('A user connected');

  sessionSocket(socket, io);
});

// Health check route
app.get('/health', (req, res) => {
  res.status(200).send({ status: 'Server is running' });
});

server.listen(PORT, HOST, () => {
  console.log(`Server listening on port ${PORT}...`);
});
