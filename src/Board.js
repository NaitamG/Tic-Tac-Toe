import React, { useState, useEffect } from 'react';
import './Board.css';
import io from 'socket.io-client';
import PropTypes from 'prop-types';
import { Square } from './Square';
import { calculateWinner } from './calculateWinner';
import { isBoardFull } from './fullBoard';

const socket = io();
export function Board({ userGlobal, logins }) {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const winner = calculateWinner(board); // checks if there are any winning combination
  const boardFull = isBoardFull(board); // checks if the board is full

  function handleClick(index) {
    // console.log(props.userGlobal);
    const squares = [...board];

    // if a certain square is filled or a winner is found, then this will not allow anyone to click
    if (calculateWinner(squares) || squares[index]) {
      return;
    }
    if (logins.spects.includes(userGlobal)) {
      // this checks if the username is in the spectator list, so it doesn't allow them to click
      return;
    }
    if (xIsNext && userGlobal === logins.playerO) {
      return;
    }
    if (!xIsNext && userGlobal === logins.playerX) {
      return;
    }

    squares[index] = xIsNext ? 'X' : 'O';
    socket.emit('move', { index, board, xIsNext });
    setBoard(squares);
    setXIsNext(!xIsNext);
  }
  function reset() {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    socket.emit('reset', { board: Array(9).fill(null), xIsNext: true });

    // check if x is next, if it's then x is the loser, or else o is the loser
    if (!winner && boardFull) {
      // to handle draw
      return;
    }
    if (xIsNext) {
      socket.emit('score', {
        userWin: logins.playerO,
        userLose: logins.playerX,
      });
    } else if (!xIsNext) {
      socket.emit('score', {
        userWin: logins.playerX,
        userLose: logins.playerO,
      });
    }
  }

  useEffect(() => {
    // for the player moves
    socket.on('move', (data) => {
      const squares = [...data.board];
      squares[data.index] = data.xIsNext ? 'X' : 'O';
      setBoard(squares);
      setXIsNext(!data.xIsNext);
    });

    // for reset button
    socket.on('reset', (data) => {
      const squares = [...data.board];
      setBoard(squares);
      setXIsNext(xIsNext);
    });
  }, []);

  // apply the change to the square with the correct index
  const renderBox = (index) => <Square value={board[index]} onClick={() => handleClick(index)} />;

  let status = '';
  // see which player won, and print the appropriate message
  status = winner
    ? `Ayy ${
      xIsNext ? logins.playerO : logins.playerX
    } won!! Sorry ${
      xIsNext ? logins.playerX : logins.playerO
    }, you lost :(`
    : `It's player ${xIsNext ? 'X' : 'O'}'s turn...`;

  // this part sets up the board
  return (
    <div>
      <div>
        <div className="message">
          <div>
            Welcome to tic tac toe {userGlobal}
          </div>
          {!winner && boardFull === true ? (
            <div>It&#39;s a draw!</div>
          ) : (
            <div className="status">{status}</div>
          )}
        </div>
        <div className="board-row">
          {renderBox(0)}
          {renderBox(1)}
          {renderBox(2)}
        </div>
        <div className="board-row">
          {renderBox(3)}
          {renderBox(4)}
          {renderBox(5)}
        </div>
        <div className="board-row">
          {renderBox(6)}
          {renderBox(7)}
          {renderBox(8)}
        </div>
      </div>
      {winner || boardFull ? (
        <div>
          <div className="playAgain">
            Click play again to record match results!
            <br />
            <button type="submit" onClick={() => reset()}>Play again</button>
          </div>
        </div>
      ) : (
        <div />
      )}
    </div>
  );
}

Board.propTypes = {
  userGlobal: PropTypes.string.isRequired,
  logins: PropTypes.shape({
    playerX: PropTypes.string,
    playerO: PropTypes.string,
    spects: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

export default Board;
