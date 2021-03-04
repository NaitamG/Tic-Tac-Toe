import React from 'react';
import './Board.css';
import { useState, useRef, useEffect } from 'react';
import { Square } from './Square.js';
import { calculateWinner } from './calculateWinner.js';
import { isBoardFull } from './fullBoard.js';
//import { Login } from './Login.js';
import io from 'socket.io-client';

const socket = io();
export function Board(props){
    const [board, setBoard] = useState(Array(9).fill(null));
    const [xIsNext, setXIsNext] = useState(true);
    console.log(props.userGlobal);
    
    function handleClick(index) {
        console.log(props.userGlobal);
        const squares = [...board];
        
        // if a certain square is filled or a winner is found, then this will not allow anyone to click
        if (calculateWinner(squares) || squares[index]) {
           return;
        }
        if (props.logins["spects"].includes(props.userGlobal)){ // this checks if the username is in the spectator list, so it doesn't allow them to click
            return;
        }
        if (xIsNext && props.userGlobal == props.logins["playerO"]){
            return;
        }
        if (!xIsNext && props.userGlobal == props.logins["playerX"]){
            return;
        }
        squares[index] = xIsNext ? "X" : "O";
        socket.emit('move', {index: index, board: board, xIsNext: xIsNext });
        setBoard(squares);
        setXIsNext(!xIsNext);
    }
    
    useEffect(() => {
        // for the player moves
        socket.on('move', (data) => {
            const squares = [...data.board];
            squares[data.index] = data.xIsNext ? "X" : "O";
            setBoard(squares);
            setXIsNext(!data.xIsNext);
        });
    }, []);
    
    // apply the change to the square with the correct index
    const renderSquare = (index) => {
        return (
            <Square value={board[index]} onClick={() => handleClick(index)} />
        );
    };

    let status;
    const winner = calculateWinner(board); // checks if there are any winning combination
    const boardFull = isBoardFull(board); // checks if the board is full
    // see which player won, and print the appropriate message
    status = winner 
        ? `Ayy ${xIsNext ? props.logins["playerO"] : props.logins["playerX"]} won!! Sorry ${xIsNext ? props.logins["playerX"] : props.logins["playerO"]}, you lost :(`
        : `It's player ${xIsNext ? "X" : "O"}'s turn...`;
    
    // this part sets up the board
    return (
        <div>
            <div>
                <div className="message">
                    <div>Login successful! Welcome to tic tac toe {props.userGlobal}</div>
                    {!winner && boardFull  === true ? (
                        <div>It's a draw!</div>
                        ) : (
                        <div className="status">{status}</div>
                        )
                    }
                </div>
                <div className="board-row"> 
                    {renderSquare(0)}
                    {renderSquare(1)}  
                    {renderSquare(2)}
                </div>
                <div className="board-row"> 
                    {renderSquare(3)}
                    {renderSquare(4)}
                    {renderSquare(5)}
                </div>
                <div className="board-row"> 
                    {renderSquare(6)}
                    {renderSquare(7)}
                    {renderSquare(8)}
                </div>
            </div>
            {winner || boardFull ? (
                <div className="playAgain">
                    <button onClick={() => setBoard(Array(9).fill(null), setXIsNext(true))}>Play again</button>
                </div>
            ): (
                <div></div>
            )}
        </div>
    );
}
export default Board;