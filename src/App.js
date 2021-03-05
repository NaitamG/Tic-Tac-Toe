import './App.css';
import './Board.css';
import React from 'react';
import { Board } from './Board.js';
import { LeaderBoard } from './LeaderBoard.js';
import { useState, useRef, useEffect } from 'react';
import { ListItem } from './ListItem.js';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io();
function App() {
  const inputRef = useRef(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // to check if the user is logged in or not
  const [logins, setLogins] = useState({"playerX": "", "playerO": "", "spects": []});
  const [leaderTable, setLeaderTable] = useState({});
  const [userGlobal, setUserGlobal] = useState("");
  
  function handleLogin(){
    const username = inputRef.current.value; //Get the client's username
    setUserGlobal(username);
    //console.log(userGlobal);
    
    if(username){ // if there's a user input
        var loginsCopy = {...logins};
        //var leaderTableCopy = {...leaderTable};
        
        if (logins["playerX"] == ""){ // only 
            loginsCopy["playerX"] = username;
            //leaderTableCopy["players"].push(username);
            setIsLoggedIn(true);
        }
        else if (logins["playerO"] == "" && logins["playerX"] != username){
            loginsCopy["playerO"] = username;
            //leaderTableCopy["players"].push(username);
            setIsLoggedIn(true);
        }
        else if (logins["playerX"] != "" && logins["playerO"] != "" && logins["playerX"] != username && logins["playerO"] != username){
            loginsCopy["spects"].push(username);
            //leaderTableCopy["players"].push(username);
            setIsLoggedIn(true);
        }
        
        setLogins(loginsCopy);
        //setLeaderTable(leaderTableCopy);
        //console.log(loginsCopy);
        socket.emit('login', { logins: loginsCopy });
        socket.emit('leaderboard', username );
    }
  }
  
  useEffect(() => {
    // for the logged in usernames
    socket.on('login', (data) => {
        var logins_response = {...data.logins};
        setLogins(logins_response);
    });
    
    socket.on('users-list', (data) => {
        console.log("data recieved!");
        console.log(data);
        setLeaderTable(data.users);
    });
    
    // for the leaderboard dictionary
    socket.on('leaderboard', (data) => {
        var username = {...data.username}
        //var leaderTable = {...data.leaderboard}
        //setLeaderTable(leaderTable["players"].push(username));
    });
  }, []);
  //console.log(leaderTable);
  
  return (
    <div>
      {isLoggedIn === true ? (
        <div>
          <Router>
              <LeaderBoard />
                  <Switch>
                    <Route path='/' />
                  </Switch>
          </Router>
          <div className="board">
            <Board logins={logins} setLogins={setLogins} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} userGlobal={userGlobal}/>
          </div>
          <div className="list">
              <h1>Players</h1>
              <div>Player X: {logins["playerX"]}</div>
              <div>Player O: {logins["playerO"]}</div>
              <h1>Spectators</h1>
              {logins["spects"].map((item, index) => <ListItem key={index} name={item} /> )}
          </div>
        </div>
        ) : (
        <div className="login">
          <input ref={inputRef} type="text" placeholder="Enter username"/>
          <button onClick={handleLogin}>Login</button>
        </div>
      )}
    </div>
  );
}

export default App;