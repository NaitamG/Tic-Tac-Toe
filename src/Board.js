import React from 'react';
import './Board.css';
import { useState, useRef, useEffect } from 'react';
import { Square } from './Square.js';
import { calculateWinner } from './calculateWinner.js';
import { isBoardFull } from './fullBoard.js';
import io from 'socket.io-client';

const socket = io();
export function Board(props){
    const [board, setBoard] = useState(Array(9).fill(null));
    const [xIsNext, setXIsNext] = useState(true);
    const [gameOver, setGameOver] = useState(false);
    
    function handleClick(index) {
        //console.log(props.userGlobal);
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
    function reset(){
        setBoard(Array(9).fill(null));
        setXIsNext(true);
        socket.emit('reset', { board: Array(9).fill(null), xIsNext: true });
        console.log("HERERERER");
        // check if x is next, if it's then x is the loser, or else o is the loser
        if(xIsNext){
            console.log("and player O won");
            socket.emit('score', {userWin: props.logins["playerO"], userLose: props.logins["playerX"]});
        }
        else if(!xIsNext){
            console.log("and player X won");
            socket.emit('score', {userWin: props.logins["playerX"], userLose: props.logins["playerO"]});
        }
    }
    
    useEffect(() => {
        // for the player moves
        socket.on('move', (data) => {
            const squares = [...data.board];
            squares[data.index] = data.xIsNext ? "X" : "O";
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
    const renderSquare = (index) => {
        return (
            <Square value={board[index]} onClick={() => handleClick(index)} />
        );
    };
    
    var winner = calculateWinner(board); // checks if there are any winning combination
    var boardFull = isBoardFull(board); // checks if the board is full
    
    let status;
    // see which player won, and print the appropriate message
    status = winner 
        ? `Ayy ${xIsNext ? props.logins["playerO"] : props.logins["playerX"]} won!! Sorry ${xIsNext ? props.logins["playerX"] : props.logins["playerO"]}, you lost :(`
        : `It's player ${xIsNext ? "X" : "O"}'s turn...`;
    
    // this part sets up the board
    return (
        <div>
            <div>
                <div className="message">
                    <div>Welcome to tic tac toe {props.userGlobal}</div>
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
                <div>
                    <div className="playAgain">
                        <a>Click play again to record match results!</a><br></br>
                        <button onClick={() => reset()}>Play again</button>
                    </div>
                    {winner = null, boardFull = false}
                </div>
            ): (
                <div></div>
            )}
        </div>
    );
}
export default Board;