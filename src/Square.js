import React from 'react';
import './Board.css';
import PropTypes from 'prop-types';

export function Square({ value, onClick }) {
  return (
    <div className="board">
      <button type="submit" className="square" onClick={onClick}>
        {value}
      </button>
    </div>
  );
}

Square.propTypes = {
  value: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default Square;
