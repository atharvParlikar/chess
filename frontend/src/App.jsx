import './App.css'
import Chessboard from 'chessboardjsx';
import {useState, useEffect} from 'react';
import {Chess} from "chess.js"
import { socket } from './socket';
import Notification from './components/Notification';

const chess = new Chess();

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected); // Dont know why i need this for but i'll keep this here just in case
  const [moves, setMoves] = useState([]);
  const [side, setSide] = useState('white');
  const [fen, setFen] = useState("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1")
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState('');

  useEffect(() => {
    const onMove = (move) => {
      chess.move(move);
      setFen(chess.fen());
      socket.emit('fen', chess.fen());
      setMoves([...moves, move]);
    };

    const handleDisconnect = () => {
      setIsConnected(false);
      setShowNotification(true);
      setNotificationMsg('Disconnected from server');
      
      setTimeout(() => setShowNotification(false), 3000);
    }

    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', handleDisconnect);
    socket.on('r-move', onMove);
    socket.on('side', (side_) => setSide(side_));
    socket.on('fen', (fen) => setFen(fen));

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('r-move');
      socket.off('side')
      socket.off('fen');
    };
  }, []);

  const handleDrop = (square) => {
    if (square.sourceSquare === square.targetSquare)
      return;
  
    try {
      // make sure player is moving their own piece [moved piece is same color as player color]
      if (chess.get(square.sourceSquare).color !== side[0])
        return;

      chess.move({from: square.sourceSquare, to: square.targetSquare});
      socket.emit('s-move', {from: square.sourceSquare, to: square.targetSquare});
      setFen(chess.fen());
    } catch {
      return;
    }
  };

  return (
    <div className="App">
      {
        showNotification && <Notification message={notificationMsg}/>
      }
      <div className="board">
        <Chessboard orientation={side} width={400} position={fen} onDrop={handleDrop} />
      </div>
      <p>{
        side[0] === fen.split(' ')[1] ? "Your move" : "Opponent's move"
      }</p>
    </div>
  );
}

export default App;
