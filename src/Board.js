import React from 'react';
import './App.css';
import { useState, useRef, useEffect } from 'react';
import { Square } from './Square.js';
import io from 'socket.io-client';

const socket = io();
export function Board(){
    const [board, setBoard] = useState(Array(9).fill(null));
    const [xIsNext, setXIsNext] = useState(true);
    
    // this part handles the click event with either X or O depending on the turn
    const handleClick = index => {
        const squares = [...board];
        
        if(squares[index]) return;
        
        squares[index] = xIsNext ? "X" : "O";
        //console.log(index);
        //console.log(squares[index]);
        socket.emit('move', {move_index: index, move_type: squares[index] });
        
        setBoard(squares);
        
        setXIsNext(!xIsNext);
    }
    useEffect(() => {
        socket.on('move', (data) => {
            console.log("move recieved!");
            console.log(data);
        });
    }, []);
    // apply the change to the square with the correct index
    const renderSquare = (index) => {
        return (
            <Square value={board[index]} onClick={() => handleClick(index)} />
        );
    };
    
    /*let status;
    status = `Next Player: ${xIsNext ? "X" : "O"}`;
    <div class="Status">{status}</div>*/
    
    // this part sets up the board
    return (
        <div>
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
