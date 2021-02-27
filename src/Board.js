import React from 'react';
import './Board.css';
import { useState, useRef, useEffect } from 'react';
import { Square } from './Square.js';
import { calculateWinner } from './calculateWinner.js';
import { isBoardFull } from './fullBoard.js';
import { ListItem } from './ListItem.js';
import io from 'socket.io-client';

const socket = io();
export function Board(){
    const inputRef = useRef(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // to check if the user is logged in or not
    const [board, setBoard] = useState(Array(9).fill(null));
    const [xIsNext, setXIsNext] = useState(true);
    const [logins, setLogins] = useState({"playerX": "", "playerO": "", "spects": []});
    
    function login(){
        const username = inputRef.current.value;
        
        if(username){ // if there's a user input
            var loginsCopy = {...logins};
            if (logins["playerX"] == ""){
                loginsCopy["playerX"] = username;
            }
            else if (logins["playerO"] == ""){
                loginsCopy["playerO"] = username;
            }
            else if (logins["playerX"] != "" && logins["playerO"] != ""){
                loginsCopy["spects"].push(username);
            }
            setLogins(loginsCopy);
            socket.emit('login', { logins: loginsCopy });
            
            // Flip the boolean value of logged in for that user, this will allow the user to see the board
            setIsLoggedIn((prevLoggedIn) => { // this will only run if username is entered, so it avoids null names
                return !prevLoggedIn;  
            });
        }
    }
    //console.log(logins);
    
    // this part handles the click event with either X or O depending on the turn
    function handleClick(index) {
        const squares = [...board];
        
        // if a certain square is filled or a winner is found, then this will not allow anyone to click
        if (calculateWinner(squares) || squares[index]) {
           return;
        }
        // if (spect.includes(users[]) || spect.includes(users.current.value)) {
        //     return;
        // }
        squares[index] = xIsNext ? "X" : "O";
        socket.emit('move', {index: index, board: board, xIsNext: xIsNext });
        setBoard(squares);
        setXIsNext(!xIsNext);
    }
    
    useEffect(() => {
        // for the logged in usernames
        socket.on('login', (data) => {
            var logins_response = {...data.logins};
            setLogins(logins_response);
            //console.log(logins_response);
        });
        
        // for the player moves
        socket.on('move', (data) => {
            const squares = [...data.board];
            //console.log("move recieved!");
            //console.log(data);
            squares[data.index] = data.xIsNext ? "X" : "O";
            setBoard(squares);
            setXIsNext(!data.xIsNext);
        });
    }, []);
    console.log(logins);
    // apply the change to the square with the correct index
    const renderSquare = (index) => {
        return (
            <Square value={board[index]} onClick={() => handleClick(index)} />
        );
    };
    
    // find the winner/loser/draw using the calWin. component
    let status;
    const winner = calculateWinner(board); // checks if there are any winning combination
    const boardFull = isBoardFull(board); // checks if the board is full 
    status = winner 
        ? `Player ${winner} is the winner! Congrats!`
        : `Player ${xIsNext ? "X" : "O"}'s turn`;
    
    // this part sets up the board
    return (
        <div>
            <div className="login">
                <input ref={inputRef} type="text" placeholder="Enter username"/>
                <button onClick={() => login()}>Login</button>
            </div>
            {isLoggedIn === true ? (
                <div>
                    <div>Login successful! Welcome to tic tac toe {inputRef.current.value}!</div>
                    {!winner && boardFull  === true ? (
                        <div>It's a draw!</div>
                        ) : (
                        <div className="status">{status}</div>
                        )
                    }
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
                    <div>
                        <h1>Players</h1>
                        <div>Player X: {logins["playerX"]}</div>
                        <div>Player O: {logins["playerO"]}</div>
                        <h1>Spectators</h1>
                        {logins["spects"].map((item, index) => <ListItem key={index} name={item} /> )}
                    </div>
                </div>
            ) : (
                <div></div>
            )}
        </div>
    );
}
