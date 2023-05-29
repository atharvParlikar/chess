import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io'
import cors from 'cors';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173"
  }
});

app.use(cors());

const connections = {}

io.on('connect', (socket) => {
  console.log(`Socket connected ${socket.id}`)
  connections[socket.id] = socket;
  socket.on('s-move', (move) => {
    const conn_keys = Object.keys(connections);
    const socketIndex = conn_keys.indexOf(socket.id);
    const opponentSocketId = conn_keys.slice(socketIndex - 1)[0];
    connections[opponentSocketId].emit('r-move', move);
  });
});

httpServer.listen(3000, () => {
  console.log('Server is live on port: 3000');
});
