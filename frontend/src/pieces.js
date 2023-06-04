import bKing from './assets/Chess_kdt45.svg';
import wKing from './assets/Chess_klt45.svg';
import bQueen from './assets/Chess_qdt45.svg';
import wQueen from './assets/Chess_qlt45.svg';
import bRook from './assets/Chess_rdt45.svg';
import wRook from './assets/Chess_rlt45.svg';
import bBishop from './assets/Chess_bdt45.svg';
import wBishop from './assets/Chess_blt45.svg';
import bKnight from './assets/Chess_ndt45.svg';
import wKnight from './assets/Chess_nlt45.svg';
import bPawn from './assets/Chess_pdt45.svg';
import wPawn from './assets/Chess_plt45.svg';

const pieces = {
  white: {
    k: wKing,
    q: wQueen,
    r: wRook,
    b: wBishop,
    n: wKnight,
    p: wPawn
  },
  black: {
    k: bKing,
    q: bQueen,
    r: bRook,
    b: bBishop,
    n: bKnight,
    p: bPawn
  }
}

export default pieces;
