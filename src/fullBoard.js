import './App.css';

export function isBoardFull(squares) {
  for (let i = 0; i < squares.length; i += 1) {
    if (squares[i] == null) {
      return false;
    }
  }
  return true;
}

export default isBoardFull;
