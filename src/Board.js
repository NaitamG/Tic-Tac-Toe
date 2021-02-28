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
            if (logins["playerX"] == ""){ // only 
                loginsCopy["playerX"] = username;
                setIsLoggedIn(true);
            }
            else if (logins["playerO"] == "" && logins["playerX"] != username){
                loginsCopy["playerO"] = username;
                setIsLoggedIn(true);
            }
            else if (logins["playerX"] != "" && logins["playerO"] != "" && logins["playerX"] != username && logins["playerO"] != username){
                loginsCopy["spects"].push(username);
                setIsLoggedIn(true);
            }
            setLogins(loginsCopy);
            socket.emit('login', { logins: loginsCopy });
            
            // Flip the boolean value of logged in for that user, this will allow the user to see the board
            /*setIsLoggedIn((prevLoggedIn) => { // this will only run if username is entered, so it avoids null names
                return !prevLoggedIn;  
            });*/
        }
    }
    //console.log(logins);
    
    function handleClick(index) {
        const squares = [...board];
        const username = inputRef.current.value; //get the current username
        
        // if a certain square is filled or a winner is found, then this will not allow anyone to click
        if (calculateWinner(squares) || squares[index]) {
           return;
        }
        if (logins["spects"].includes(username)){ // this checks if the username is in the spectator list, so it doesn't allow them to click
            return;
        }
        if (xIsNext && username == logins["playerO"]){
            return;
        }
        if (!xIsNext && username == logins["playerX"]){
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
    
    // apply the change to the square with the correct index
    const renderSquare = (index) => {
        return (
            <Square value={board[index]} onClick={() => handleClick(index)} />
        );
    };

    //Get the client's username
    var username = inputRef.current;
    if(username != null){
        username = inputRef.current.value;
    }
    else{
        username = null;
    }

    let status;
    const winner = calculateWinner(board); // checks if there are any winning combination
    const boardFull = isBoardFull(board); // checks if the board is full
    // see which player won, and print the appropriate message
    status = winner 
        ? `Ayy ${xIsNext ? logins["playerO"] : logins["playerX"]} won!! Sorry ${xIsNext ? logins["playerX"] : logins["playerO"]}, you lost :(`
        : `It's player ${xIsNext ? "X" : "O"}'s turn...`;
    
    // this part sets up the board
    return (
        <div>
            <div className="login">
                <input ref={inputRef} type="text" placeholder="Enter username"/>
                <button onClick={() => login()}>Login</button>
            </div>
            {isLoggedIn === true ? (
                <div>
                    <div className="message">
                        <div>Login successful! Welcome to tic tac toe {username}</div>
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
                    <div className="players">
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
            {winner ? (
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