import React from 'react';
import './Board.css';

export function Square(props){
  return (
    <div className="board">
      <button className="square" onClick={props.onClick}>
        {props.value}
      </button>
    </div>
  );
}


export default Square;