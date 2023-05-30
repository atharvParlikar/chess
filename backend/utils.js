function fenToBitboard(fen) {
  const fenParts = fen.split(' ');
  const fenRows = fenParts[0].split('/');

  const bitboard = [];
  for (let i = 0; i < 8; i++) {
    const row = [];
    let colIndex = 0;

    for (let j = 0; j < fenRows[i].length; j++) {
      const char = fenRows[i][j];

      if (/[1-8]/.test(char)) {
        const emptySquares = parseInt(char, 10);
        for (let k = 0; k < emptySquares; k++) {
          row.push('x');
          colIndex++;
        }
      } else {
        row.push(char);
        colIndex++;
      }
    }

    while (colIndex < 8) {
      row.push('x');
      colIndex++;
    }

    bitboard.push(row);
  }

  return bitboard;
}



export const isValid = (square, fen, player) => {
  const fen_matrix = fenToBitboard(fen);
  const squareIndices = [8 - parseInt(square[1]), square.charCodeAt(0) - 97];
  const piece = fen_matrix[squareIndices[0]][parseInt(squareIndices[1])];
  if (piece === piece.toLowerCase()) {
    return player === 'b' ? true : false;
  }
  else {
    return player === 'w' ? true : false;
  }
}
