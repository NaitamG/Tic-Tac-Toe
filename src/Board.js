import React from 'react';
import './Board.css';
import { useState, useRef, useEffect } from 'react';
import { Square } from './Square.js';
import { calculateWinner } from './calculateWinner.js';
import io from 'socket.io-client';

const socket = io();
export function Board(){
    const [board, setBoard] = useState(Array(9).fill(null));
    const [xIsNext, setXIsNext] = useState(true);
    
    // this part handles the click event with either X or O depending on the turn
    function handleClick(index) {
        const squares = [...board];
        if (calculateWinner(squares) || squares[index]) {
           return;
        }
        
        //if(squares[index]) return;
        
        squares[index] = xIsNext ? "X" : "O";
        //console.log(index);
        console.log(squares[index]);
        socket.emit('move', {index: index, board: board, xIsNext: xIsNext });
        
        setBoard(squares);
        
        setXIsNext(!xIsNext);
    }
    useEffect(() => {
        socket.on('move', (data) => {
            const squares = [...data.board];
            //console.log("move recieved!");
            //console.log(data);
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
    
    // find the winner using the calWin. component
    let status;
    const winner = calculateWinner(board);
    status = winner 
        ? `Winner is Player ${winner}`
        : `Player ${xIsNext ? "X" : "O"}'s turn`;
    
    // this part sets up the board
    return (
        <div>
            <div className="status">{status}</div>
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
    );
}
