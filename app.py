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

DB = SQLAlchemy(APP)

# IMPORTANT: This must be AFTER creating db variable to prevent
# circular import issues
import models

CORS = CORS(APP, resources={r"/*": {"origins": "*"}})

SOCKETIO = SocketIO(
    APP, cors_allowed_origins="*", json=json, manage_session=False
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
    """This get the values from the table that's already stored in the db"""
    leaderboard = {"players": [], "score": []}

    # get the leaderboard
    get_leaderboard(leaderboard)

    data["userTable"] = leaderboard["players"]
    data["scoreTable"] = leaderboard["score"]

    SOCKETIO.emit(
        'initial-table', data, broadcast=True, include_self=True
    )    # initially send the client the list from the db table

def get_leaderboard(leaderboard):
    """This will copy the columns and store it in the dictionary"""
    players = DB.session.query(models.Leaderboard
                               ).order_by(desc(models.Leaderboard.score)).all()

    for player in players:
        leaderboard["players"].append(
            player.username
        )    # copy the username from the table to the dictionary
        leaderboard["score"].append(player.score)

    return leaderboard

@SOCKETIO.on('score')
def on_score(data):
    """ Get the winner and loser from the db table and update their respective scores"""

    update_users = []
    update_scores = []

    # inc/dec the score in the db
    adjust_score(data['userWin'], data['userLose'])

    # append to the user and score columns
    update_table(update_users, update_scores)

    SOCKETIO.emit(
        'initial-table', {
            'userTable': update_users,
            'scoreTable': update_scores
        },
        broadcast=True,
        include_self=True
    )

def adjust_score(winner, loser):
    """This will inc/dec the score of the winner/loser"""
    winner = DB.session.query(models.Leaderboard
                              ).filter_by(username=winner).first()
    loser = DB.session.query(models.Leaderboard
                             ).filter_by(username=loser).first()
    winner.score = winner.score + 1
    loser.score = loser.score - 1

    DB.session.commit()
    DB.session.close()

def update_table(users, scores):
    """This will get the leaderboard columns and append the user and their score"""
    players = DB.session.query(models.Leaderboard
                               ).order_by(desc(models.Leaderboard.score)).all()
    for player in players:
        users.append(player.username)
        scores.append(player.score)

    DB.session.commit()
    DB.session.close()

    return users, scores

@SOCKETIO.on('login')
def on_login(data):
    """This gets the login socket data from the client an passes it back to other clients"""
    # check if the username is already in the db table, if not then add the username into db table
    in_table = check_table(data["username"])
    if not in_table:
        not_in_table(data["username"]) # add user with default score

    SOCKETIO.emit('login', data, broadcast=True, include_self=False)

def check_table(username):
    """This will check if the username exists or not"""
    in_table = models.Leaderboard.query.filter_by(username=username
                                                 ).first() is not None
    return in_table

def not_in_table(username):
    """This will add the new user with the default score"""
    add_user = models.Leaderboard(username=username, score=100)

    DB.session.add(add_user)
    DB.session.commit()
    DB.session.close()

    all_people = models.Leaderboard.query.all()
    users = []
    for person in all_people:
        users.append(person.username)
    return users


# When a client disconnects from this Socket connection, this function is run
@SOCKETIO.on('disconnect')
def on_disconnect():
    """This tests the user connection"""
    print('User disconnected!')

# When a client emits the event 'chat' to the server, this function is run
# 'chat' is a custom event name that we just decided


@SOCKETIO.on('chat')
def on_chat(data):    # data is whatever arg you pass in your emit call on client
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
    DB.create_all()
    # Note that we don't call app.run anymore. We call socketio.run with app arg
    SOCKETIO.run(
        APP,
        host=os.getenv('IP', '0.0.0.0'),
        port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
        debug=True
    )
