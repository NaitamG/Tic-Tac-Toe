import React from 'react';
import './LeaderBoard.css';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export function LeaderBoard(){
    const [leaderboard, setLeaderboard] = useState(false); // to show and hide the leaderboard
    const showLeaderboard = () => setLeaderboard(!leaderboard);

    return (
        <div>
            <div className="leaderboard">
                <Link to='#' className='menu' onClick={showLeaderboard}>Leaderboard</Link>
            </div>
            
            <nav className={leaderboard ? "nav-menu active" : "nav-menu"}>
                <ul className="nav-menu-items" onClick={showLeaderboard}>
                    <li className="menu-toggle">
                        <Link to='#' className="menu">X</Link>
                    </li>
                    <table>
                        <thead>
                            <tr>
                                <th colspan="2">Leaderboard</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Username</td>
                                <td>Points</td>
                            </tr>
                        </tbody>
                    </table>
                </ul>
            </nav>
        </div>
    );
}

export default LeaderBoard;