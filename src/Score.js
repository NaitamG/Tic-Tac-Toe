import React from "react";
import "./App.css";
import io from "socket.io-client";

const socket = io();
export function Score(props) {
  if (props.winner || props.boardFull) {
    console.log("here cuz games over");
    // check if x is next, if it's then x is the loser, or else o is the loser
    if (props.xIsNext && props.userGlobal == props.logins["playerX"]) {
      console.log("and player O won");
      socket.emit("score", {
        userWin: props.logins["playerO"],
        userLose: props.logins["playerX"],
      });
    } else if (!props.xIsNext && props.userGlobal == props.logins["playerX"]) {
      console.log("and player X won");
      socket.emit("score", {
        userWin: props.logins["playerX"],
        userLose: props.logins["playerO"],
      });
    }
  }
  return null;
}
export default Score;
