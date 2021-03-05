"""
Made this file to handle the back-end (server side) responses.
"""
import os
from dotenv import load_dotenv, find_dotenv
from flask import Flask, send_from_directory, json
from flask_socketio import SocketIO
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

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
db.create_all()

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
    """This checks the user connection"""
    players = models.Leaderboard.query.all()
    users = []
    for player in players:
        users.append(player.username) # copy the username from the table to the empty list
    print(users)
    print('User connected!')
    SOCKETIO.emit('users-list', {'users': users}) # initially send the client the list from the db table

@SOCKETIO.on('login')
def on_login(data):
    """This gets the login socket data from the client an passes it back to other clients"""
    #print(data)
    SOCKETIO.emit('login', data, broadcast=True, include_self=False)

@SOCKETIO.on('leaderboard')
def on_leaderboard(data):
    print(data)
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

@SOCKETIO.on('move')
def player_move(data):
    """This gets the move socket data from the client an passes it back to other clients"""
    #print(str(data))
    SOCKETIO.emit('move', data, boardcast=True, include_self=False)

if __name__ == "__main__":
    # Note that we don't call app.run anymore. We call socketio.run with app arg
    SOCKETIO.run(
        APP,
        host=os.getenv('IP', '0.0.0.0'),
        port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
    )
