import Chessboard from 'chessboardjsx';
import { useState, useEffect } from 'react';
import { Chess } from "chess.js"
import { socket } from '../socket';
import Notification from './Notification';
import { useParams } from 'react-router-dom';
import History from './History';

const chess = new Chess();

const Game = () => {
  const [isConnected, setIsConnected] = useState(socket.connected); // Dont know why i need this for but i'll keep this here just in case
  const [side, setSide] = useState('white');
  const [fen, setFen] = useState("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
  const [notifications, setNotifications] = useState([]);
  const game_id = useParams().game_id;

  useEffect(() => {
    const onMove = (move) => {
      chess.move(move);
      setFen(chess.fen());
      socket.emit('fen', { fen_: chess.fen(), game_id });
      handleGameOver();
    };

    const handleConnect = () => {
      setIsConnected(true);
      addNotification("Connected to server");
      socket.emit('game_id', game_id);
    };

    const handleDisconnect = () => {
      setIsConnected(false);
      addNotification("Disconnected from server")
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('r-move', onMove);
    socket.on('side', (side_) => {
      const tempside = side_ === "w" ? "white" : "black";
      setSide(tempside);
      console.log(tempside);
    });
    socket.on('fen', (fen) => setFen(fen));
    socket.on('error', () => alert("some error occured on server"));

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('r-move');
      socket.off('side')
      socket.off('fen');
    };
  }, []);
  
  const addNotification = (message, time = 5) => {
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
        console.log(side[0], chess.fen().split(' ')[1]);
        side[0] !== chess.fen().split(' ')[1] ? addNotification("You won 🥳", 15) : addNotification("Opponant won!", 15);
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
      chess.move({ from: square.sourceSquare, to: square.targetSquare });
      socket.emit('s-move', { move: { from: square.sourceSquare, to: square.targetSquare }, game_id });
      setFen(chess.fen());
      handleGameOver();
    } catch {
      addNotification("illegal move", 2)
    }
  };
  
  console.log(chess.history().length);

  return (
    <div className="App">
      {notifications.length > 0 && <Notification message={notifications[notifications.length - 1]} />}
      <div className="board">
        <Chessboard orientation={side} width={700} position={fen} onDrop={handleDrop} />
      </div>
      <p>{
        side[0] === fen.split(' ')[1] ? "Your move" : "Opponent's move"
      }</p>
      {chess.history().length > 0 ? <History history={chess.history({verbose: true})}/> : <p>empty history</p>}
    </div>
  );
}

export default Game;
