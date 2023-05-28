import './App.css'
import Chessboard from 'chessboardjsx';
import {useState} from 'react';
import {Chess} from "chess.js"

const chess = new Chess();

function App() {
  const [fen, setFen] = useState("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1")

  const handleDrop = (square) => {
    if (square.sourceSquare === square.targetSquare)
      return;

    try {
      chess.move({from: square.sourceSquare, to: square.targetSquare});
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
