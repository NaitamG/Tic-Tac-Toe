import React from 'react';
import './Board.css';
import { useState, useRef, useEffect } from 'react';
import { Square } from './Square.js';
import { calculateWinner } from './calculateWinner.js';
import { ListItem } from './ListItem.js';
import io from 'socket.io-client';

const socket = io();
export function Board(){
    const inputRef = useRef(null);
    const [users, setUsers] = useState([]); // to store all users
    const [spect, setSpect] = useState([]); // for the spectators that join later
    const [isLoggedIn, setIsLoggedIn] = useState(false); // to check if the user is logged in or not
    const [board, setBoard] = useState(Array(9).fill(null));
    const [xIsNext, setXIsNext] = useState(true);
    
    
    function login(){
        const username = inputRef.current.value;

        // THIS ADDS THE USERNAMES IN A LIST FOR EVERY LOGIN INPUT
        setUsers((prevUsers) => {
            const listCopy = [...prevUsers];
            listCopy.push(username);
            if (listCopy.length > 2) { // get just the spectators and set it into a new array
                setSpect(listCopy.slice(2));
            }
            socket.emit('login', {listCopy: listCopy}); // this sends the array to client
            return listCopy;
        });
        
        // Flip the boolean value of logged in for that user, this will allow the user to see the board
        setIsLoggedIn((prevLoggedIn) => {
          return !prevLoggedIn;  
        });
    }
    
    // this part handles the click event with either X or O depending on the turn
    function handleClick(index) {
        const squares = [...board];
        
        // if a certain square is filled or a winner is found, then this will not allow anyone to click
        if (calculateWinner(squares) || squares[index]) {
           return;
        }
        squares[index] = xIsNext ? "X" : "O";
        socket.emit('move', {index: index, board: board, xIsNext: xIsNext });
        setBoard(squares);
        setXIsNext(!xIsNext);
    }
    
    // for the logged in usernames
    useEffect(() => {
        socket.on('login', (data) => {
            const usernames = [...data.listCopy];
            setUsers(usernames);
        });
    }, []);
    
    // for the player moves
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
                    <div>
                        <h1>Players</h1>
                        <div>Player X: {users[0]}</div>
                        <div>Player O: {users[1]}</div>
                        <h1>Spectators</h1>
                        {spect.map((item, index) => <ListItem key={index} name={item} /> )}
                    </div>
                </div>
            ) : (
                <div></div>
            )}
        </div>
    );
}
