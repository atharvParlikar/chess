import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io'
import cors from 'cors';
import { isValid } from './utils.js';

// TODO: Replace socket_id with something that does not change after every reconnection
//       a long term solution would be to use player-id but for anonymous chess we
//       might use player's IP address as that is constant.

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173"
  }
});

app.use(cors());

const connections = {}
const liveGames = {}

io.on('connect', (socket) => {
  console.log(`Socket connected ${socket.id}`);

  // Here s-move and r-move are move signals from perspective of client
  // s-move := move sent from client
  // r-move := move recieved by client
  socket.on('s-move', ({ move, game_id }) => {
    const turn = liveGames[game_id].fen.split(' ')[1]
    const isValidMove = isValid(move.from, liveGames[game_id].fen, turn);
    console.log(isValidMove)
    if (isValidMove) {
      const game_id = connections[socket.id];
      const turn = liveGames[game_id].fen.split(' ')[1];
      liveGames[game_id].sides[turn === 'w' ? 'b' : 'w'].emit('r-move', move);
    }
  });

  socket.on('fen', ({ fen_, game_id }) => {
    liveGames[game_id].fen = fen_;
  });

  socket.on('game_id', (game_id) => {
    if (!liveGames[game_id]) {
      const socketId = socket.id;
      liveGames[game_id] = {
        players: [socketId],
        sides: {},
        fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
      }
      const playerColor = Math.random() > 0.5 ? 'w' : 'b';
      liveGames[game_id].sides[playerColor] = socket;
      socket.emit('side', playerColor);
    } else {
      if (liveGames[game_id].players.length > 2)
        socket.emit('error');
      else {
        const playerColor = Object.keys(liveGames[game_id].sides)[0] === "w" ? "b" : "w";
        liveGames[game_id].players.push(socket.id);
        liveGames[game_id].sides[playerColor] = socket;
        socket.emit('side', playerColor);
      }
    }
    connections[socket.id] = game_id;
    console.log(liveGames)
  });

  socket.on('disconnect', () => {
    console.log(`Socket disconnected ${socket.id}`);
  });
});

httpServer.listen(3000, () => {
  console.log('Server is live on port: 3000');
});
