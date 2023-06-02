import Chessboard from 'chessboardjsx';
import {useState, useEffect} from 'react';
import {Chess} from "chess.js"
import { socket } from '../socket';
import Notification from './Notification';
import { useParams } from 'react-router-dom';

const chess = new Chess();

const Game = ({game_id}) => {
  const [isConnected, setIsConnected] = useState(socket.connected); // Dont know why i need this for but i'll keep this here just in case
  const [moves, setMoves] = useState([]);
  const [side, setSide] = useState('white');
  const [fen, setFen] = useState("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
  const [notifications, setNotifications] = useState([]);

  console.log(useParams().game_id);

  useEffect(() => {
    const onMove = (move) => {
      chess.move(move);
      setFen(chess.fen());
      socket.emit('fen', chess.fen());
      handleGameOver();
      setMoves([...moves, move]);
    };

    const handleConnect = () => {
      setIsConnected(true);
      addNotification("Connected to server");
    }
    const handleDisconnect = () => {
      setIsConnected(false);
      addNotification("Disconnected from server")
    }

    socket.on('connect', handleConnect);
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

  const addNotification = (message, time=1) => {
    setNotifications([...notifications, message]);
    setTimeout(() => {
      const notificationArr = notifications;
      notificationArr.shift();
      setNotifications(notificationArr);
    }, time * 1000);
  }

  const handleGameOver = () => {
    if (chess.isGameOver()) {
      if (chess.isCheckmate()) {
        console.log(side[0], fen.split(' ')[1]);
        side[0] === fen.split(' ')[1] ? addNotification("You won 🥳", 15) : addNotification("Opponant won!", 15);
      }
      else if (chess.isDraw()) {
        setNotifications("Match Draw");
      }
      return true;
    }
    return false;
  }

  const handleDrop = (square) => {
    if (square.sourceSquare === square.targetSquare)
      return;
    
    // make sure player is moving their own piece [moved piece is same color as player color]
    if (chess.get(square.sourceSquare).color !== side[0])
      return;

  
    try {
      chess.move({from: square.sourceSquare, to: square.targetSquare});
      socket.emit('s-move', {from: square.sourceSquare, to: square.targetSquare});
      setFen(chess.fen());
      handleGameOver();
    } catch {
      return;
    }
  };

  return (
    <div className="App">
      { notifications.length > 0 && <Notification message={notifications[notifications.length - 1]}/> }
      <div className="board">
        <Chessboard orientation={side} width={400} position={fen} onDrop={handleDrop} />
      </div>
      <p>{
        side[0] === fen.split(' ')[1] ? "Your move" : "Opponent's move"
      }</p>
    </div>
  );
}

export default Game;