import React from 'react';
import './LeaderBoard.css';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ListUser } from './ListUser.js';
import { ListItem } from './ListItem.js'
import { ListScore } from './ListScore.js';

export function LeaderBoard(props){
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
                    <div className="leadTable">
                        <table className="userTable">
                            <thead>
                                <tr>
                                    <th>Username</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    {props.userTable.map((user, index)  => <ListUser logins={props.logins} key={index} user={user} /> )}
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
                                    {props.scoreTable.map((score, index) => <ListScore key={index} score={score} /> )}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </ul>
            </nav>
        </div>
    );
}
export default LeaderBoard;