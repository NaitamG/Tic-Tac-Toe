import React from 'react';
import './LeaderBoard.css';

export function ListUser(props){
    
    if(props.logins["spects"].includes(props.user) || props.user == props.logins["playerO"] || props.user == props.logins["playerX"]){
        return (
            <div className="loggedIn">
                {props.user}
            </div>
        );
    }else{
        return (
            <div>
                {props.user}
            </div>
        );
    }
    
}
export default ListUser;