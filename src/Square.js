import React from 'react';
import './Board.css';
import PropTypes from 'prop-types';

export function Square({ value, onClick }) {
  return (
    <div className="board">
      <button data-testid="boxClick" type="submit" className="square" onClick={onClick}>
        {value}
      </button>
    </div>
  );
}

Square.propTypes = {
  value: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default Square;
