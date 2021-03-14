import React from 'react';
import './LeaderBoard.css';
import PropTypes from 'prop-types';

export function ListScore({ score }) {
  return <div>{score}</div>;
}

ListScore.propTypes = {
  score: PropTypes.number.isRequired,
};
export default ListScore;
