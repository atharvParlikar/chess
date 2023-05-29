import './App.css'
import Chessboard from 'chessboardjsx';
import {useState, useEffect} from 'react';
import {Chess} from "chess.js"
import { socket } from './socket';

const chess = new Chess();

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [moves, setMoves] = useState([]);

  useEffect(() => {
    const onConnected = () => setIsConnected(true);
    const onDisconnected = () => setIsConnected(false);
    const onMove = (move) => {
      chess.move(move);
      setFen(chess.fen());
      setMoves([...moves, move]);
    };

    socket.on('connect', onConnected);
    socket.on('disconnect', onDisconnected);
    socket.on('r-move', onMove);

    return () => {
      socket.off('connect', onConnected);
      socket.off('disconnect', onDisconnected);
      socket.off('r-move', onMove);
    };
  }, []);

  const [fen, setFen] = useState("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1")

  const handleDrop = (square) => {
    if (square.sourceSquare === square.targetSquare)
      return;

    try {
      chess.move({from: square.sourceSquare, to: square.targetSquare});
      socket.emit('s-move', {from: square.sourceSquare, to: square.targetSquare});
      setFen(chess.fen());
    } catch {
      return;
    }
};

  return (
    <div className="App">
      <div className="board">
        <Chessboard width={400} position={fen} onDrop={handleDrop} />
      </div>
      <p>Fen: {fen}</p>
    </div>
  );
}

export default App;
