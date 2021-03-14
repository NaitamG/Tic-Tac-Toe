import React from 'react';
import './LeaderBoard.css';
import PropTypes from 'prop-types';

export function ListUser({ logins, user }) {
  if (
    logins.spects.includes(user)
    || user === logins.playerO
    || user === logins.playerX
  ) {
    return <div className="loggedIn">{user}</div>;
  }
  return <div>{user}</div>;
}

ListUser.propTypes = {
  user: PropTypes.string.isRequired,
  logins: PropTypes.shape({
    playerX: PropTypes.string,
    playerO: PropTypes.string,
    spects: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

export default ListUser;
