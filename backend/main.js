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
const sides = {}
let fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

// TODO(for later): validate moves on server too to check if the move by correct side is made
//                  for example white should not emit black's moves.
//
// TODO: write logic for randomly diciding player color/side.
// TODO: keep the state of bord same even after reload.

io.on('connect', (socket) => {
  console.log(`Socket connected ${socket.id}`);
  connections[socket.id] = socket;

  socket.emit('fen', fen);

  if (Object.keys(sides) === 0)
    sides[socket.id] = Math.random() < 0.5 ? 'white' : 'black';
  else
    sides[socket.id] = sides[Object.keys(sides)[0]] === 'white' ? 'black' : 'white';

  for (const socId of Object.keys(sides)) {
    connections[socId].emit('side', sides[socId]);
  }

  socket.on('s-move', (move) => {
    const conn_keys = Object.keys(connections);
    const socketIndex = conn_keys.indexOf(socket.id);
    const opponentSocketId = conn_keys.slice(socketIndex - 1)[0];
    connections[opponentSocketId].emit('r-move', move);
  });
  
  socket.on('fen', (fen_) => fen = fen_);

  socket.on('disconnect', () => {
    console.log(`Socket disconnected ${socket.id}`);
    delete connections[socket.id];
    delete sides[socket.id];
  });
});


httpServer.listen(3000, () => {
  console.log('Server is live on port: 3000');
});
