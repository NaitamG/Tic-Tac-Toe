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
  const [userGlobal, setUserGlobal] = useState("");
  
  function handleLogin(){
    const username = inputRef.current.value; //Get the client's username
    setUserGlobal(username);
    //console.log(userGlobal);
    
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
        console.log(loginsCopy);
        socket.emit('login', { logins: loginsCopy });
    }
  }
  
  useEffect(() => {
    // for the logged in usernames
    socket.on('login', (data) => {
        var logins_response = {...data.logins};
        setLogins(logins_response);
    });
  }, []);
  
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
          <button onClick={() => handleLogin()}>Login</button>
        </div>
      )}
    </div>
  );
}

export default App;
/*
import logo from './logo.svg';
import './App.css';
import { ListItem } from './ListItem.js';
import { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io(); // Connects to socket connection

function App() {
  const [messages, setMessages] = useState([]); // State variable, list of messages
  const inputRef = useRef(null); // Reference to <input> element

  function onClickButton() {
    if (inputRef != null) {
      const message = inputRef.current.value;
      // If your own client sends a message, we add it to the list of messages to 
      // render it on the UI.
      setMessages(prevMessages => [...prevMessages, message]);
      socket.emit('chat', { message: message });
    }
  }

  // The function inside useEffect is only run whenever any variable in the array
  // (passed as the second arg to useEffect) changes. Since this array is empty
  // here, then the function will only run once at the very beginning of mounting.
  useEffect(() => {
    // Listening for a chat event emitted by the server. If received, we
    // run the code in the function that is passed in as the second arg
    socket.on('chat', (data) => {
      console.log('Chat event received!');
      console.log(data);
      // If the server sends a message (on behalf of another client), then we
      // add it to the list of messages to render it on the UI.
      setMessages(prevMessages => [...prevMessages, data.message]);
    });
  }, []);

  return (
    <div>
      <h1>Chat Messages</h1>
      Enter message here: <input ref={inputRef} type="text" />
      <button onClick={onClickButton}>Send</button>
      <ul>
        {messages.map((item, index) => <ListItem key={index} name={item} />)}
      </ul>
    </div>
  );
}

export default App;*/