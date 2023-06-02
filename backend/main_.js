import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io'
import cors from 'cors';
import { isValid } from './utils.js';

const app = express();
const httpServer = createServer(app);

const games = {}

app.use(cors());


const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173"
  }
});

app.get('/:game_id', (req, res) => {
  console.log('got a fucking request');
  const game_id = req.params.game_id;

  games[game_id] = io.of(`/${game_id}`);

  games[game_id].on('connect', (socket) => {
    console.log(`Socket connection id: ${socket.id}`);
    if (Object.keys(connections) > 1) {
      return;
    }

    console.log(`Socket connected ${socket.id}`);
    connections[socket.id] = socket;

    socket.emit('fen', fen);

    if (Object.keys(sides).length === 0)
      sides[socket.id] = Math.random() < 0.5 ? 'white' : 'black';

    else
      sides[socket.id] = sides[Object.keys(sides)[0]] === 'white' ? 'black' : 'white';

    for (const socId of Object.keys(sides)) {
      connections[socId].emit('side', sides[socId]);
    }

    // Here s-move and r-move are move signals from perspective of client
    // s-move := move sent from client
    // r-move := move recieved by client
    socket.on('s-move', (move) => {
      const conn_keys = Object.keys(connections);
      const socketIndex = conn_keys.indexOf(socket.id);
      const opponentSocketId = conn_keys.slice(socketIndex - 1)[0];
      const isValidMove = isValid(move.from, fen, sides[socket.id][0]);
      if (isValidMove) {
        connections[opponentSocketId].emit('r-move', move);
      }
    });

    socket.on('fen', (fen_) => fen = fen_);

    socket.on('disconnect', () => {
      console.log(`Socket disconnected ${socket.id}`);
      delete connections[socket.id];
      delete sides[socket.id];
    });
  });
})


httpServer.listen(3000, () => {
  console.log("Server live on port: 3000");
});
