export const isValid = (square, fen, player) => {
  const fen_matrix = fen.split(' ')[0].split('/');
  const squareIndices = [8 - parseInt(square[1]), square.charCodeAt(0) - 97];
  const piece = fen_matrix[squareIndices[0]][parseInt(squareIndices[1])];
  if (piece === piece.toLowerCase()) {
    return player === 'b' ? true : false;
  }
  else {
    return player === 'w' ? true : false;
  }
}
