import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import http from 'http';
import { Server } from 'socket.io';
import { logEvent, logError } from './logging/loggingUtils.js';
import sessionSocket from './socket/sessionSocket.js';
import dotenv from 'dotenv';

dotenv.config({ path: './config/.env' });

const app = express();
const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 8080;
const MONGODB_URL = process.env.MONGODB_URL;
const HOST = '0.0.0.0';

app.use(cors());
app.use(express.json());

if (!MONGODB_URL) {
  logError('MongoDB URL not found');
  process.exit(1);
}

mongoose
  .connect(MONGODB_URL, { dbName: 'worduel' })
  .then(() => console.log('Connected to database'))
  .catch((error) => console.log(error));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  logEvent('User connected');
  sessionSocket(socket, io);
});

// Health check route
app.get('/health', (req, res) => {
  res.status(200).send({ status: 'Server is running' });
});

server.listen(PORT, HOST, () => {
  console.log(`Server listening on port ${PORT}...`);
});
