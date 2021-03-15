import './App.css';
import './Board.css';
import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import io from 'socket.io-client';
import { Board } from './Board';
import { LeaderBoard } from './LeaderBoard';
import { ListItem } from './ListItem';

const socket = io();
function App() {
  const inputRef = useRef(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // to check if the user is logged in or not
  const [logins, setLogins] = useState({
    playerX: '',
    playerO: '',
    spects: [],
  });
  const [userTable, setUserTable] = useState([]);
  const [scoreTable, setScoreTable] = useState([]);
  const [userGlobal, setUserGlobal] = useState('');

  function handleLogin() {
    const username = inputRef.current.value; // Get the client's username
    setUserGlobal(username);
    // console.log(userGlobal);

    if (username) {
      // if there's a user input
      const loginsCopy = { ...logins };
      const userTableCopy = [...userTable];
      const scoreTableCopy = [...scoreTable];

      if (logins.playerX === '') {
        // check logins edge cases and filter it to player X/O/spect
        loginsCopy.playerX = username;
        setIsLoggedIn(true);
      } else if (logins.playerO === '' && logins.playerX !== username) {
        loginsCopy.playerO = username;
        setIsLoggedIn(true);
      } else if (
        logins.playerX !== ''
        && logins.playerO !== ''
        && logins.playerX !== username
        && logins.playerO !== username
      ) {
        loginsCopy.spects.push(username);
        setIsLoggedIn(true);
      }

      setLogins(loginsCopy);
      setUserTable(userTableCopy);
      setScoreTable(scoreTableCopy);

      socket.emit('login', { logins: loginsCopy, username });
      socket.emit('initial-table', {
        userTable: userTableCopy,
        scoreTable: scoreTableCopy,
      });
    }
  }

  useEffect(() => {
    // for the logged in usernames
    socket.on('login', (data) => {
      const loginsResponse = { ...data.logins };
      setLogins(loginsResponse);
    });
    // this gets the previous persisted data from the table for Leaderboard component
    socket.on('initial-table', (data) => {
      const tempUser = [...data.userTable];
      const tempScore = [...data.scoreTable];

      setUserTable(tempUser);
      setScoreTable(tempScore);
    });
  }, []);

  return (
    <div>
      {isLoggedIn === true ? (
        <div>
          <Router>
            <LeaderBoard
              userTable={userTable}
              scoreTable={scoreTable}
              logins={logins}
            />
            <Switch>
              <Route path="/" />
            </Switch>
          </Router>
          <div data-testid="tictactoe" className="board">
            <Board
              userGlobal={userGlobal}
              logins={logins}
            />
          </div>
          <div className="list">
            <h1>Players</h1>
            <div>
              Player X: {logins.playerX}
            </div>
            <div>
              Player O: {logins.playerO}
            </div>
            <h1>Spectators</h1>
            {logins.spects.map((item, index) => (
              <ListItem key={index} name={item} />
            ))}
          </div>
        </div>
      ) : (
        <div className="login">
          <input ref={inputRef} type="text" placeholder="Enter username" />
          <button type="submit" onClick={handleLogin}>Login</button>
        </div>
      )}
    </div>
  );
}

export default App;
