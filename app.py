"""
Made this file to handle the back-end (server side) responses.
"""
import os
from dotenv import load_dotenv, find_dotenv
from flask import Flask, send_from_directory, json
from flask_socketio import SocketIO
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import desc

load_dotenv(find_dotenv())
APP = Flask(__name__, static_folder='./build/static')

# Point SQLAlchemy to your Heroku database
APP.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
# Gets rid of a warning
APP.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(APP)

# IMPORTANT: This must be AFTER creating db variable to prevent
# circular import issues
import models

CORS = CORS(APP, resources={r"/*": {"origins": "*"}})

SOCKETIO = SocketIO(
    APP,
    cors_allowed_origins="*",
    json=json,
    manage_session=False
)

@APP.route('/', defaults={"filename": "index.html"})
@APP.route('/<path:filename>')

def index(filename):
    """This gets the filename"""
    return send_from_directory('./build', filename)


# When a client connects from this Socket connection, this function is run
@SOCKETIO.on('connect')
def on_connect():
    """This connects the socket"""
    print('User connected!')

@SOCKETIO.on('initial-table')
def on_init(data):
    leaderboard = {"players": [], "score": []}
    #players = models.Leaderboard.query.all()
    #print(data)
    players = db.session.query(models.Leaderboard).order_by(desc(models.Leaderboard.score)).all()
    
    #print(players)
    for player in players:
        leaderboard["players"].append(player.username) # copy the username from the table to the dictionary
        leaderboard["score"].append(player.score)
    
    data["userTable"] = leaderboard["players"]
    data["scoreTable"] = leaderboard["score"]
    #print(data)
    SOCKETIO.emit('initial-table', data, broadcast=True, include_self=True) # initially send the client the list from the db table

@SOCKETIO.on('score')
def on_score(data):
    """ Get the winner and loser from the db table and update their respective scores"""
    
    updateUsers=[]
    updateScores=[]
    
    #print(data)
    winner = db.session.query(models.Leaderboard).filter_by(username=data['userWin']).first()
    loser = db.session.query(models.Leaderboard).filter_by(username=data['userLose']).first()
    winner.score = winner.score + 1
    loser.score = loser.score - 1
    
    players = db.session.query(models.Leaderboard).order_by(desc(models.Leaderboard.score)).all()
    for player in players:
        updateUsers.append(player.username)
        updateScores.append(player.score)
    
    db.session.commit()
    db.session.close()
    
    SOCKETIO.emit('initial-table', {'userTable': updateUsers, 'scoreTable': updateScores}, broadcast=True, include_self=True)

@SOCKETIO.on('login')
def on_login(data):
    """This gets the login socket data from the client an passes it back to other clients"""
    # this will check if the username is already in the db table, if not then it'll add the username into the table
    inTable = models.Leaderboard.query.filter_by(username=data["username"]).first() is not None

    if not inTable:
        addUser = models.Leaderboard(username=data["username"],score=100)
        db.session.add(addUser)
        db.session.commit()
        db.session.close()
    
    SOCKETIO.emit('login', data, broadcast=True, include_self=False)

@SOCKETIO.on('leaderboard')
def on_leaderboard(data):
    SOCKETIO.emit('leaderboard', data, broadcast=True, include_self=False)

# When a client disconnects from this Socket connection, this function is run
@SOCKETIO.on('disconnect')
def on_disconnect():
    """This tests the user connection"""
    print('User disconnected!')

# When a client emits the event 'chat' to the server, this function is run
# 'chat' is a custom event name that we just decided

@SOCKETIO.on('chat')
def on_chat(data): # data is whatever arg you pass in your emit call on client
    """This gets the chat socket data from the client an passes it back to other clients"""
    #print(str(data))
    # This emits the 'chat' event from the server to all clients except for
    # the client that emmitted the event that triggered this function
    SOCKETIO.emit('chat', data, broadcast=True, include_self=False)

@SOCKETIO.on('reset')
def on_reset(data):
    """This resets the board and xisnext values to the starting values for all clients"""
    SOCKETIO.emit('reset', data, broadcast=True, include_self=False)
    
@SOCKETIO.on('move')
def player_move(data):
    """This gets the move socket data from the client an passes it back to other clients"""
    #print(str(data))
    SOCKETIO.emit('move', data, boardcast=True, include_self=False)

if __name__ == "__main__":
    db.create_all()
    # Note that we don't call app.run anymore. We call socketio.run with app arg
    SOCKETIO.run(
        APP,
        host=os.getenv('IP', '0.0.0.0'),
        port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
        debug=True
    )