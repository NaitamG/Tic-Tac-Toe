import React, { useState } from 'react';
import './LeaderBoard.css';

// import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { ListUser } from './ListUser';
import { ListScore } from './ListScore';

export function LeaderBoard({ userTable, scoreTable, logins }) {
  const [leaderboard, setLeaderboard] = useState(false); // to show and hide the leaderboard
  const showLeaderboard = () => setLeaderboard(!leaderboard);

  return (
    <div>
      <div className="leaderboard">
        <button className="menu" type="submit" onClick={showLeaderboard} onKeyDown={showLeaderboard}>
          Leaderboard
        </button>
      </div>

      <nav className={leaderboard ? 'nav-menu active' : 'nav-menu'}>
        <ul className="nav-menu-items">
          <li className="menu-toggle">
            <button type="submit" to="#" className="menu" onClick={showLeaderboard} onKeyDown={showLeaderboard}>
              x
            </button>
          </li>
          <div className="leadTable">
            <table className="userTable">
              <thead>
                <tr>
                  <th>Username</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  {userTable.map((user, index) => (
                    <ListUser logins={logins} key={index} user={user} />
                  ))}
                </tr>
              </tbody>
            </table>
            <table className="scoreTable">
              <thead>
                <tr>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  {scoreTable.map((score, index) => (
                    <ListScore key={index} score={score} />
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </ul>
      </nav>
    </div>
  );
}

LeaderBoard.propTypes = {
  userTable: PropTypes.arrayOf(PropTypes.string).isRequired,
  scoreTable: PropTypes.arrayOf(PropTypes.string).isRequired,
  logins: PropTypes.shape({
    playerX: PropTypes.string,
    playerO: PropTypes.string,
    spects: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

export default LeaderBoard;
